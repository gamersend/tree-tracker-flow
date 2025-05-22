
import { Note } from "@/types/note";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/utils";

// Note storage key
const NOTES_STORAGE_KEY = "tree-tracker-notes";

// Load notes from local storage
export const loadNotes = (): Note[] => {
  return loadFromLocalStorage<Note[]>(NOTES_STORAGE_KEY, []);
};

// Save notes to local storage
export const saveNotes = (notes: Note[]): void => {
  saveToLocalStorage(NOTES_STORAGE_KEY, notes);
};

// Add a new note
export const addNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Note[] => {
  const currentNotes = loadNotes();
  const newNote: Note = {
    id: `note-${Date.now()}`,
    ...note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedNotes = [...currentNotes, newNote];
  saveNotes(updatedNotes);
  
  return updatedNotes;
};

// Update an existing note
export const updateNote = (id: string, updates: Partial<Note>): Note[] => {
  const currentNotes = loadNotes();
  const updatedNotes = currentNotes.map(note => 
    note.id === id 
      ? { ...note, ...updates, updatedAt: new Date().toISOString() } 
      : note
  );
  
  saveNotes(updatedNotes);
  return updatedNotes;
};

// Delete a note
export const deleteNote = (id: string): Note[] => {
  const currentNotes = loadNotes();
  const updatedNotes = currentNotes.filter(note => note.id !== id);
  
  saveNotes(updatedNotes);
  return updatedNotes;
};

// Get notes for a specific date
export const getNotesByDate = (date: string): Note[] => {
  const allNotes = loadNotes();
  return allNotes.filter(note => note.date === date);
};
