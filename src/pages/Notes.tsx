
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NotesContainer } from "@/components/notes/NotesContainer";
import { useNotes } from "@/contexts/NotesContext";
import { motion } from "framer-motion";

const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = useNotes();

  const handleAddNote = () => {
    addNote("New note", "yellow");
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <motion.h1
            className="text-3xl font-bold text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="mr-2">📝</span> Notes
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Manage all your notes in one place
          </motion.p>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-tree-purple/30">
        <CardHeader>
          <CardTitle>All Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <NotesContainer
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
            isMovable={false}
          />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-tree-green/30">
        <CardHeader>
          <CardTitle>Note Board</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Freely arrange your notes on this board. Drag to move, use the corner to resize.
          </p>
          <NotesContainer
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
            isMovable={true}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Notes;
