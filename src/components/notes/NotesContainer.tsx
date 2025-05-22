
import React, { useState, useEffect } from "react";
import { StickyNote } from "./StickyNote";
import { Note, NoteColor } from "@/types/note";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface NotesContainerProps {
  notes: Note[];
  onAddNote: () => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  isMovable?: boolean;
  dateFilter?: string;
  className?: string;
}

export const NotesContainer: React.FC<NotesContainerProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  isMovable = false,
  dateFilter,
  className = "",
}) => {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  
  useEffect(() => {
    // Filter notes if dateFilter is provided
    if (dateFilter) {
      setFilteredNotes(notes.filter(note => note.date === dateFilter));
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, dateFilter]);
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {dateFilter ? "Notes for this date" : "Quick Notes"}
        </h3>
        <Button onClick={onAddNote} size="sm" variant="outline" className="flex items-center gap-1">
          <Plus size={16} />
          Add Note
        </Button>
      </div>
      
      {isMovable ? (
        <div className="relative h-[400px] border border-dashed border-gray-300 rounded-lg bg-slate-800/20 overflow-hidden">
          {filteredNotes.map(note => (
            <StickyNote
              key={note.id}
              note={note}
              onUpdate={onUpdateNote}
              onDelete={onDeleteNote}
              isMovable={true}
            />
          ))}
          {filteredNotes.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              No notes yet. Click "Add Note" to create one.
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StickyNote
                note={note}
                onUpdate={onUpdateNote}
                onDelete={onDeleteNote}
                isMovable={false}
              />
            </motion.div>
          ))}
          {filteredNotes.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-gray-400 border border-dashed border-gray-600 rounded-lg bg-slate-800/20">
              <p>No notes found.</p>
              <Button onClick={onAddNote} size="sm" variant="outline" className="mt-2">
                Create one now
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
