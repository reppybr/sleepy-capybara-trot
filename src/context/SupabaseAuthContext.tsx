import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { PartnerRoleKey } from '@/types/forms';

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
  const [loading, setLoading] = useState(true); // Initial state is true
  const navigate = useNavigate();

  // Memoize fetchUserProfile to avoid re-creating it on every render
  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser) => {
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

    return data[0] as UserProfile;
  }, []); // No dependencies, as supabase client is stable

  useEffect(() => {
    const handleAuthEvent = async (_event: string, currentSession: Session | null) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession) {
        setLoading(true); // Set loading true while processing any session
        try {
          // Sync user with our backend (creates wallet if new)
          const response = await fetch('https://sleepy-capybara-trot.onrender.com/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: currentSession.user }),
          });
          if (!response.ok) throw new Error('Failed to sync user with backend.');
          
          // After sync, fetch the profile from Supabase
          const userProfile = await fetchUserProfile(currentSession.user);
          setProfile(userProfile); 
          console.log(`User synced and profile fetched successfully on ${_event}.`);
        } catch (error) {
          console.error(`Backend sync or profile fetch error on ${_event}:`, error);
          await supabase.auth.signOut(); // Force logout on sync/fetch error
        } finally {
          setLoading(false); // Always set loading to false after processing session
        }
      } else {
        // No session (e.g., SIGNED_OUT or no initial session)
        setProfile(null);
        if (_event === 'SIGNED_OUT') {
          navigate('/login');
        }
        setLoading(false); // Always set loading to false if no session
      }
    };

    // Initial check and setup listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthEvent);

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, fetchUserProfile]); // Added fetchUserProfile to dependencies

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