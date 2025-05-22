
export interface Note {
  id: string;
  content: string;
  color: string;
  position?: { x: number; y: number; };
  size?: { width: number; height: number; };
  createdAt: string;
  updatedAt: string;
  date?: string; // Optional calendar date association
}

export type NoteColor = 
  | "yellow" 
  | "green" 
  | "blue" 
  | "pink" 
  | "purple";

export const noteColorMap: Record<NoteColor, string> = {
  yellow: "bg-yellow-200 border-yellow-400 hover:shadow-yellow-300/40",
  green: "bg-green-200 border-green-400 hover:shadow-green-300/40",
  blue: "bg-blue-200 border-blue-400 hover:shadow-blue-300/40",
  pink: "bg-pink-200 border-pink-400 hover:shadow-pink-300/40",
  purple: "bg-purple-200 border-purple-400 hover:shadow-purple-300/40",
};
