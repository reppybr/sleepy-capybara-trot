import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { PartnerRoleKey } from '@/types/forms';
import { toast } from 'sonner'; // Importar toast para mensagens de erro

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
    let isMounted = true; // Flag para prevenir atualizações de estado em componente desmontado

    const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
      console.log('Fetching user profile for:', supabaseUser.id);
      const { data, error } = await supabase
        .from('users')
        .select('auth_user_id, name, email, public_key, role, is_profile_complete') // Seleção explícita de colunas
        .eq('auth_user_id', supabaseUser.id);
      
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      if (!data || data.length === 0) {
        console.warn("No user profile found for auth_user_id:", supabaseUser.id);
        return null;
      }
      console.log('User profile fetched:', data[0]);
      return data[0] as UserProfile;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return; // Prevenir atualizações de estado se o componente for desmontado

      console.log('Auth State Change Event:', _event, 'Session exists:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(true); // Definir loading como true no início do processamento de qualquer mudança de estado de autenticação

      try {
        if (_event === 'SIGNED_IN' && session) {
          console.log('User SIGNED_IN. Attempting backend sync.');
          
          // Adicionar um tempo limite para a chamada fetch do backend
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 10000); // 10 segundos de tempo limite

          try {
            const response = await fetch('https://sleepy-capybara-trot.onrender.com/api/auth/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user: session.user }),
              signal: controller.signal, // Aplicar o sinal do AbortController
            });
            clearTimeout(id); // Limpar o timeout se o fetch for concluído

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido do backend' }));
              throw new Error(`Falha ao sincronizar usuário com o backend: ${errorData.message || response.statusText}`);
            }
            console.log('Backend sync successful.');
          } catch (fetchError: any) {
            clearTimeout(id); // Garantir que o timeout seja limpo mesmo em caso de erro no fetch
            if (fetchError.name === 'AbortError') {
              console.error('Backend sync timed out.');
              toast.error('Sincronização com o backend falhou: Tempo esgotado. Por favor, tente novamente.');
            } else {
              console.error('Backend sync error:', fetchError);
              toast.error(`Sincronização com o backend falhou: ${fetchError.message}.`);
            }
            await supabase.auth.signOut(); // Forçar logout em caso de falha na sincronização do backend
            return; // Sair cedo, setLoading(false) será tratado pelo evento SIGNED_OUT
          }

          const userProfile = await fetchUserProfile(session.user);
          setProfile(userProfile);
          console.log('Profile fetched after SIGNED_IN.');

        } else if (_event === 'SIGNED_OUT') {
          console.log('User SIGNED_OUT.');
          setProfile(null);
          navigate('/login');

        } else if (session) { // Lida com 'INITIAL_SESSION' e outros eventos onde a sessão existe, mas não é um novo login
          console.log('Session exists (e.g., INITIAL_SESSION). Fetching profile.');
          const userProfile = await fetchUserProfile(session.user);
          setProfile(userProfile);

        } else { // Nenhuma sessão (ex: após SIGNED_OUT, ou carregamento inicial sem sessão)
          console.log('No session found.');
          setProfile(null); // Garantir que o perfil seja nulo se não houver sessão
        }
      } catch (error) {
        console.error('Unhandled error in onAuthStateChange:', error);
        toast.error('Ocorreu um erro inesperado. Por favor, tente novamente.');
        await supabase.auth.signOut(); // Garantir que o usuário seja desconectado em erros não tratados
      } finally {
        if (isMounted) {
          setLoading(false); // Sempre definir loading como false no final
          console.log('setLoading(false) called.');
        }
      }
    });

    return () => {
      isMounted = false; // Limpeza: definir a flag como false
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