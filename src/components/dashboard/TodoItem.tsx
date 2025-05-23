
import React, { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoItemProps {
  id: string;
  label: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string, newLabel: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  id, 
  label, 
  completed, 
  onToggle, 
  onEdit, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(id, editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(label);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input 
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-1 h-8"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={handleSave}
          >
            <Check className="h-4 w-4 text-green-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={handleCancel}
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 group">
      <input 
        type="checkbox" 
        id={id} 
        checked={completed}
        onChange={() => onToggle(id)}
        className="h-4 w-4"
      />
      <label
        htmlFor={id}
        className={`text-sm flex-1 ${
          completed ? "line-through text-gray-500" : "text-white"
        }`}
      >
        {label}
      </label>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={() => onDelete(id)}
        >
          <Trash2 className="h-3 w-3 text-red-400" />
        </Button>
      </div>
    </div>
  );
};

export default TodoItem;
