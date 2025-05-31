
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with default values
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        console.log('Initial session:', initialSession);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        // Set up auth state listener
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        );

        subscription = authSubscription;
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
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user && !data.session) {
        toast.success('Account created! Please check your email to verify your account.');
      } else {
        toast.success('Account created successfully!');
      }
      
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred during signup');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Signin error:', error);
        toast.error(error.message);
        return false;
      }

      toast.success('Successfully signed in!');
      return true;
    } catch (error: any) {
      console.error('Signin error:', error);
      toast.error('An unexpected error occurred during signin');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
        toast.error(error.message);
      } else {
        toast.success('Successfully signed out!');
      }
    } catch (error: any) {
      console.error('Signout error:', error);
      toast.error('An unexpected error occurred during signout');
    }
  }, []);

  const updateProfile = useCallback(async (updates: any) => {
    try {
      if (!user) {
        toast.error('No user found');
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        toast.error(error.message);
        return false;
      }

      toast.success('Profile updated successfully!');
      return true;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [user]);

  const contextValue = {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
