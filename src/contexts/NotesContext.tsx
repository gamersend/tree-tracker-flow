
import React, { createContext, useContext } from "react";
import { useSupabaseNotes } from "@/hooks/useSupabaseNotes";
import { Note } from "@/types/note";

interface NotesContextType {
  notes: Note[];
  addNote: (title: string, color: string) => Promise<void>;
  updateNote: (id: string, updates: any) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  loading: boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notes, addNote: supabaseAddNote, updateNote: supabaseUpdateNote, deleteNote: supabaseDeleteNote, loading } = useSupabaseNotes();

  const addNote = async (title: string, color: string) => {
    await supabaseAddNote({
      title,
      content: "",
      color,
      position_x: Math.floor(Math.random() * 300),
      position_y: Math.floor(Math.random() * 200),
      width: 200,
      height: 150,
      is_pinned: false
    });
  };

  const updateNote = async (id: string, updates: any) => {
    const supabaseUpdates: any = {};
    if (updates.title !== undefined) supabaseUpdates.title = updates.title;
    if (updates.content !== undefined) supabaseUpdates.content = updates.content;
    if (updates.color !== undefined) supabaseUpdates.color = updates.color;
    if (updates.x !== undefined) supabaseUpdates.position_x = updates.x;
    if (updates.y !== undefined) supabaseUpdates.position_y = updates.y;
    if (updates.width !== undefined) supabaseUpdates.width = updates.width;
    if (updates.height !== undefined) supabaseUpdates.height = updates.height;
    if (updates.isPinned !== undefined) supabaseUpdates.is_pinned = updates.isPinned;
    
    await supabaseUpdateNote(id, supabaseUpdates);
  };

  const deleteNote = async (id: string) => {
    await supabaseDeleteNote(id);
  };

  // Convert Supabase notes to component format
  const formattedNotes: Note[] = notes.map(note => ({
    id: note.id,
    title: note.title,
    content: note.content || "",
    color: note.color,
    x: note.position_x,
    y: note.position_y,
    width: note.width,
    height: note.height,
    isPinned: note.is_pinned,
    date: note.created_at,
    createdAt: note.created_at,
    updatedAt: note.updated_at
  }));

  return (
    <NotesContext.Provider value={{
      notes: formattedNotes,
      addNote,
      updateNote,
      deleteNote,
      loading
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
