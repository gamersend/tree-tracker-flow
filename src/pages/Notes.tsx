
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NotesContainer } from "@/components/notes/NotesContainer";
import { useSupabaseNotes } from "@/hooks/useSupabaseNotes";
import { motion } from "framer-motion";

const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = useSupabaseNotes();

  const handleAddNote = async () => {
    await addNote({
      title: "New note",
      content: "",
      color: "#fbbf24",
      position_x: 0,
      position_y: 0,
      width: 200,
      height: 150,
      is_pinned: false
    });
  };

  // Convert Supabase notes to component format
  const formattedNotes = notes.map(note => ({
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

  const handleUpdateNote = async (id: string, updates: any) => {
    const supabaseUpdates: any = {};
    if (updates.title !== undefined) supabaseUpdates.title = updates.title;
    if (updates.content !== undefined) supabaseUpdates.content = updates.content;
    if (updates.color !== undefined) supabaseUpdates.color = updates.color;
    if (updates.x !== undefined) supabaseUpdates.position_x = updates.x;
    if (updates.y !== undefined) supabaseUpdates.position_y = updates.y;
    if (updates.width !== undefined) supabaseUpdates.width = updates.width;
    if (updates.height !== undefined) supabaseUpdates.height = updates.height;
    if (updates.isPinned !== undefined) supabaseUpdates.is_pinned = updates.isPinned;
    
    await updateNote(id, supabaseUpdates);
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
            notes={formattedNotes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
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
            notes={formattedNotes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={deleteNote}
            isMovable={true}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Notes;
