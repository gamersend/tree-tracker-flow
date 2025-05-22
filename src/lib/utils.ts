
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export const formatDate = (date: Date | string): string => {
  if (!date) return "";
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
};

// CSV handling utilities
export const parseCSV = (csvString: string): string[][] => {
  const lines = csvString.trim().split('\n');
  
  return lines.map(line => {
    // Handle quoted fields with commas inside
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    
    // Clean up quotes if present
    return matches.map(field => field.replace(/(^"|"$)/g, '').trim());
  });
};

// Convert any data structure to CSV
export const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) return "";
  
  // Extract headers from first object
  const headers = Object.keys(data[0]);
  
  // Create header row
  const csvRows = [headers.join(",")];
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle different data types
      if (value === null || value === undefined) return '';
      if (Array.isArray(value)) return `"${value.join(';')}"`;
      if (typeof value === 'object' && value instanceof Date) return value.toISOString().split('T')[0];
      if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
      return value;
    });
    csvRows.push(values.join(","));
  }
  
  return csvRows.join("\n");
};

// Validate date format YYYY-MM-DD
export const isValidDateFormat = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  // Check if it's actually a valid date
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Local storage helpers
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Function to create a downloadable blob and trigger download
export const downloadAsFile = (data: string, fileName: string, mimeType: string): void => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
