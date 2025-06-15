
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  content?: string;
  color: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export const useSupabaseNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes
  const fetchNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    }
  };

  // Add note
  const addNote = async (noteData: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          ...noteData
        });

      if (error) throw error;

      toast.success('Note added successfully!');
      await fetchNotes();
      return true;
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
      return false;
    }
  };

  // Update note
  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchNotes();
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
      return false;
    }
  };

  // Delete note
  const deleteNote = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Note deleted successfully!');
      await fetchNotes();
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      return false;
    }
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchNotes().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes
  };
};
