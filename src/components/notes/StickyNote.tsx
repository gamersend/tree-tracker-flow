
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash, Calendar, CornerRightDown, MoveIcon } from "lucide-react";
import { Note, noteColorMap, NoteColor } from "@/types/note";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  isMovable?: boolean;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  onUpdate,
  onDelete,
  isMovable = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isResizing, setIsResizing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const handleSave = () => {
    onUpdate(note.id, { content: editedContent });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditedContent(note.content);
    }
  };

  const handleColorChange = (color: NoteColor) => {
    onUpdate(note.id, { color });
  };

  const handleDateSelect = (date: Date | undefined) => {
    onUpdate(note.id, { 
      date: date ? date.toISOString().split('T')[0] : undefined 
    });
  };
  
  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete(note.id);
  };

  const colors: NoteColor[] = ["yellow", "green", "blue", "pink", "purple"];

  return (
    <motion.div
      ref={noteRef}
      className={`rounded-md shadow-md border-2 p-4 flex flex-col relative 
        transition-shadow duration-200 hover:shadow-lg ${noteColorMap[note.color as NoteColor]}`}
      style={{
        width: note.size?.width || "220px",
        height: note.size?.height || "auto",
        position: isMovable ? "absolute" : "relative",
        left: isMovable && note.position ? `${note.position.x}px` : undefined,
        top: isMovable && note.position ? `${note.position.y}px` : undefined,
        zIndex: isEditing ? 50 : 10,
      }}
      drag={isMovable}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (noteRef.current) {
          const rect = noteRef.current.getBoundingClientRect();
          onUpdate(note.id, { 
            position: { 
              x: rect.left, 
              y: rect.top 
            } 
          });
        }
      }}
      dragConstraints={isMovable ? { left: 0, right: 2000, top: 0, bottom: 1000 } : false}
    >
      {/* Note header */}
      <div className="flex justify-between items-center mb-2 text-gray-700">
        <div className="flex items-center gap-2">
          {isMovable && <MoveIcon size={14} className="cursor-move" />}
          {note.date && (
            <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full">
              {format(new Date(note.date), "MMM d")}
            </span>
          )}
        </div>
        <div className="flex space-x-1">
          {/* Date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Calendar className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="end">
              <CalendarPicker
                mode="single"
                selected={note.date ? new Date(note.date) : undefined}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          
          {/* Edit button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          
          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Note content */}
      {isEditing ? (
        <div className="flex-1 flex flex-col">
          <Textarea
            ref={textareaRef}
            value={editedContent}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            className="flex-1 resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-gray-800 min-h-[100px]"
            placeholder="Write your note..."
          />
          <div className="mt-2 flex flex-wrap items-center justify-between">
            <div className="flex space-x-1 mb-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-4 h-4 rounded-full border ${
                    color === "yellow" ? "bg-yellow-300" :
                    color === "green" ? "bg-green-300" :
                    color === "blue" ? "bg-blue-300" :
                    color === "pink" ? "bg-pink-300" :
                    "bg-purple-300"
                  } ${note.color === color ? "ring-2 ring-offset-1" : ""}`}
                />
              ))}
            </div>
            <div className="flex space-x-1">
              <Button size="sm" variant="ghost" onClick={() => {
                setIsEditing(false);
                setEditedContent(note.content);
              }}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="flex-1 text-gray-800 whitespace-pre-wrap text-sm cursor-pointer"
          style={{ overflowWrap: 'break-word' }}
          onClick={() => setIsEditing(true)}
        >
          {note.content}
        </div>
      )}
      
      {/* Resize handle */}
      {isMovable && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
            
            const onMouseMove = (moveEvent: MouseEvent) => {
              if (noteRef.current) {
                const width = Math.max(150, moveEvent.clientX - noteRef.current.getBoundingClientRect().left);
                const height = Math.max(100, moveEvent.clientY - noteRef.current.getBoundingClientRect().top);
                
                noteRef.current.style.width = `${width}px`;
                noteRef.current.style.height = `${height}px`;
              }
            };
            
            const onMouseUp = () => {
              setIsResizing(false);
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
              
              if (noteRef.current) {
                onUpdate(note.id, {
                  size: {
                    width: parseInt(noteRef.current.style.width),
                    height: parseInt(noteRef.current.style.height)
                  }
                });
              }
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
        >
          <CornerRightDown size={12} className="absolute bottom-0 right-0 text-gray-600" />
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This note will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
