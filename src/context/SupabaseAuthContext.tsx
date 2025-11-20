import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  role: PartnerRoleKey;
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
    const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', supabaseUser.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user profile:", error);
        return null;
      }
      return data;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (_event === 'SIGNED_IN' && session) {
        setLoading(true);
        try {
          // Sync user with our backend (creates wallet if new)
          const response = await fetch('https://sleepy-capybara-trot.onrender.com/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: session.user }),
          });
          if (!response.ok) throw new Error('Failed to sync user with backend.');
          
          // After sync, fetch the profile from Supabase
          const userProfile = await fetchUserProfile(session.user);
          setProfile(userProfile);

          console.log('User synced and profile fetched successfully.');
          navigate('/dashboard'); // Or based on role
        } catch (error) {
          console.error('Backend sync or profile fetch error:', error);
          await supabase.auth.signOut();
        } finally {
          setLoading(false);
        }
      } else if (_event === 'SIGNED_OUT') {
        setProfile(null);
        navigate('/login');
        setLoading(false);
      } else if (session) {
        // Handle initial session load
        const userProfile = await fetchUserProfile(session.user);
        setProfile(userProfile);
        setLoading(false);
      } else {
        // No session
        setLoading(false);
      }
    });

    return () => {
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