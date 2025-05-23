
import { format, isValid } from "date-fns";

// Format date safely
export const formatDateSafe = (date: Date | string | null | undefined): string => {
  if (!date) return "—";
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (!isValid(dateObj)) return "Invalid Date";
    return format(dateObj, "MMM d, yyyy");
  } catch (error) {
    console.error("Date formatting error:", error, date);
    return "—";
  }
};

// Helper function to get loyalty tag badge color
export const getLoyaltyTagColor = (tag: string) => {
  if (tag.includes("🆕")) return "bg-blue-500 text-white";
  if (tag.includes("🌀")) return "bg-green-500 text-white";
  if (tag.includes("🔥")) return "bg-orange-500 text-white";
  if (tag.includes("👻")) return "bg-gray-500 text-white";
  return "bg-slate-600 text-white";
};

// Load from localStorage helper
export const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};
