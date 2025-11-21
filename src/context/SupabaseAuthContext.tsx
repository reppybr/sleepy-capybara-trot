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
  role?: PartnerRoleKey;
  is_profile_complete: boolean;
  profile_metadata?: any; // Added profile_metadata
}

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  profile: UserProfile | null;
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
      console.log('SupabaseAuthContext: START Fetching user profile directly from Supabase for:', supabaseUser.id);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('auth_user_id, name, email, public_key, role, is_profile_complete, profile_metadata') // Added profile_metadata
          .eq('auth_user_id', supabaseUser.id)
          .single();
        
        if (error) {
          console.error("SupabaseAuthContext: Error fetching user profile directly:", error);
          return null;
        }
        
        if (data) {
          console.log('SupabaseAuthContext: User profile fetched directly:', data);
          return data as UserProfile;
        } else {
          console.warn("SupabaseAuthContext: No user profile found directly for auth_user_id:", supabaseUser.id);
          return null;
        }
      } catch (fetchProfileError) {
        console.error("SupabaseAuthContext: Unexpected error in fetchUserProfile (direct):", fetchProfileError);
        return null;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      console.log('SupabaseAuthContext: Auth State Change Event:', _event, 'Session exists:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      let currentProfile: UserProfile | null = null;

      try {
        if (_event === 'SIGNED_IN' && session) {
          console.log('SupabaseAuthContext: User SIGNED_IN. Attempting backend sync.');
          
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 10000);

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
            const backendSyncData = await response.json();
            console.log('SupabaseAuthContext: Backend sync successful. Returned user:', backendSyncData.user);
            // Use the profile from the sync response directly instead of re-fetching
            currentProfile = backendSyncData.user as UserProfile;

          } catch (fetchError: any) {
            clearTimeout(id);
            if (fetchError.name === 'AbortError') {
              console.error('SupabaseAuthContext: Backend sync timed out.');
              toast.error('Sincronização com o backend falhou: Tempo esgotado. Por favor, tente novamente.');
            } else {
              console.error('SupabaseAuthContext: Backend sync error:', fetchError);
              toast.error(`Sincronização com o backend falhou: ${fetchError.message}.`);
            }
            await supabase.auth.signOut();
          }

        } else if (_event === 'SIGNED_OUT') {
          console.log('SupabaseAuthContext: User SIGNED_OUT.');
          currentProfile = null;
          navigate('/login');

        } else if (session) {
          console.log('SupabaseAuthContext: Session exists (e.g., INITIAL_SESSION). Fetching profile directly.');
          currentProfile = await fetchUserProfile(session.user);

        } else {
          console.log('SupabaseAuthContext: No session found.');
          currentProfile = null;
        }
      } catch (error) {
        console.error('SupabaseAuthContext: Unhandled error in onAuthStateChange:', error);
        toast.error('Ocorreu um erro inesperado. Por favor, tente novamente.');
        await supabase.auth.signOut();
        currentProfile = null;
      } finally {
        if (isMounted) {
          console.log('SupabaseAuthContext: Finalizing auth state. currentProfile:', currentProfile);
          setProfile(currentProfile);
          if (loading) {
            setLoading(false);
            console.log('SupabaseAuthContext: setLoading(false) called.');
          }
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, loading]);

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