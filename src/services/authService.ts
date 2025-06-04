
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const createUserProfile = async (user: User) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0],
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        avatar_url: user.user_metadata?.avatar_url || null,
      });

    if (error && error.code !== '23505') { // Ignore duplicate key error
      console.error('Error creating user profile:', error);
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

export const signUpUser = async (email: string, password: string, userData?: any) => {
  try {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
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
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
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
  }
};

export const signOutUser = async () => {
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
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

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
};
