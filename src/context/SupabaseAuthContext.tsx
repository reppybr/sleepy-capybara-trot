import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { PartnerRoleKey } from '@/types/forms';
import { toast } from 'sonner';

// This is our custom user profile from the public.users table
export interface UserProfile {
  auth_user_id: string;
  name: string;
  email: string;
  public_key: string;
  role?: PartnerRoleKey; // Tornando o papel opcional
  is_profile_complete: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  profile: UserProfile | null; // Add our custom profile
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
      console.log('SupabaseAuthContext: START Fetching user profile for:', supabaseUser.id);
      const { data, error } = await supabase
        .from('users')
        .select('auth_user_id, name, email, public_key, role, is_profile_complete')
        .eq('auth_user_id', supabaseUser.id)
        .single(); // Usando .single() para esperar uma ou zero linhas

      if (error) {
        if (error.code === 'PGRST116') { // Código para 'nenhuma linha encontrada'
          console.warn("SupabaseAuthContext: No user profile found for auth_user_id:", supabaseUser.id);
        } else {
          console.error("SupabaseAuthContext: Error fetching user profile:", error);
        }
        return null;
      }
      
      console.log('SupabaseAuthContext: User profile fetched:', data); // data será o objeto único se bem-sucedido
      return data as UserProfile;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      console.log('SupabaseAuthContext: Auth State Change Event:', _event, 'Session exists:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(true); // Set loading true at the start of any auth state change processing

      let currentProfile: UserProfile | null = null; // Use a local variable for profile

      try {
        if (_event === 'SIGNED_IN' && session) {
          console.log('SupabaseAuthContext: User SIGNED_IN. Attempting backend sync.');
          
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 10000); // 10 segundos de tempo limite

          try {
            const response = await fetch('https://sleepy-capybara-trot.onrender.com/api/auth/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user: session.user }),
              signal: controller.signal,
            });
            clearTimeout(id);

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido do backend' }));
              throw new Error(`Falha ao sincronizar usuário com o backend: ${errorData.message || response.statusText}`);
            }
            console.log('SupabaseAuthContext: Backend sync successful.');
          } catch (fetchError: any) {
            clearTimeout(id);
            if (fetchError.name === 'AbortError') {
              console.error('SupabaseAuthContext: Backend sync timed out.');
              toast.error('Sincronização com o backend falhou: Tempo esgotado. Por favor, tente novamente.');
            } else {
              console.error('SupabaseAuthContext: Backend sync error:', fetchError);
              toast.error(`Sincronização com o backend falhou: ${fetchError.message}.`);
            }
            await supabase.auth.signOut(); // Force sign out on backend sync failure
            // Do NOT return here, let the finally block handle setLoading(false)
          }

          // Fetch profile after potential backend sync (or if sync failed and user was signed out)
          // Check if session.user is still valid after potential signOut
          if (session.user) { 
            currentProfile = await fetchUserProfile(session.user);
          }

        } else if (_event === 'SIGNED_OUT') {
          console.log('SupabaseAuthContext: User SIGNED_OUT.');
          currentProfile = null; // Clear profile on sign out
          navigate('/login');

        } else if (session) { // Handles 'INITIAL_SESSION' and other events where session exists
          console.log('SupabaseAuthContext: Session exists (e.g., INITIAL_SESSION). Fetching profile.');
          currentProfile = await fetchUserProfile(session.user);

        } else { // No session (e.g., after SIGNED_OUT, or initial load without session)
          console.log('SupabaseAuthContext: No session found.');
          currentProfile = null;
        }
      } catch (error) {
        console.error('SupabaseAuthContext: Unhandled error in onAuthStateChange:', error);
        toast.error('Ocorreu um erro inesperado. Por favor, tente novamente.');
        await supabase.auth.signOut();
        currentProfile = null; // Ensure profile is cleared on unhandled error
      } finally {
        if (isMounted) {
          console.log('SupabaseAuthContext: Finalizing auth state. currentProfile:', current currentProfile); // NOVO LOG
          setProfile(currentProfile); // Update profile state once at the end
          setLoading(false); // Always set loading to false at the very end
          console.log('SupabaseAuthContext: setLoading(false) called.');
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};