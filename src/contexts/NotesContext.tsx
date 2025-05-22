
import React, { createContext, useState, useEffect, useContext } from "react";
import { Note, NoteColor } from "@/types/note";
import { loadNotes, saveNotes } from "@/utils/note-helpers";
import { toast } from "sonner";

interface NotesContextProps {
  notes: Note[];
  addNote: (content: string, color?: NoteColor, date?: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNotesByDate: (date: string) => Note[];
}

const NotesContext = createContext<NotesContextProps | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on component mount
  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const addNote = (content: string, color: NoteColor = "yellow", date?: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date,
      position: { x: 20, y: 20 },
      size: { width: 220, height: 200 },
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    toast.success("Note added");
    
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() } 
        : note
    );
    
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    toast.success("Note deleted");
  };

  const getNotesByDate = (date: string) => {
    return notes.filter(note => note.date === date);
  };

  const value = {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesByDate,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
