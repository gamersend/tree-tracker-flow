import React, { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import AuthContext from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';
import { 
  createUserProfile, 
  signUpUser, 
  signInUser, 
  signOutUser, 
  updateUserProfile 
} from '@/services/authService';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set up auth state listener FIRST
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session);
            setSession(session);
            setUser(session?.user ?? null);
            
            // Create profile if user signs up - using correct event comparison
            if (event === 'SIGNED_UP' && session?.user) {
              setTimeout(async () => {
                await createUserProfile(session.user);
              }, 0);
            }
            
            setLoading(false);
          }
        );

        subscription = authSubscription;

        // THEN check for existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session:', initialSession);
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, userData?: any) => {
    setLoading(true);
    const result = await signUpUser(email, password, userData);
    setLoading(false);
    return result;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const result = await signInUser(email, password);
    setLoading(false);
    return result;
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
  }, []);

  const updateProfile = useCallback(async (updates: any) => {
    if (!user) {
      return false;
    }
    return await updateUserProfile(user.id, updates);
  }, [user]);

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
