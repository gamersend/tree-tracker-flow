
// Common strain names for auto-suggestion
export const COMMON_STRAINS = [
  "Gelato", "Zkittlez", "Skywalker OG", "Blue Dream", 
  "Girl Scout Cookies", "OG Kush", "Sour Diesel", 
  "Purple Haze", "Northern Lights", "Pineapple Express",
  "White Widow", "AK-47", "Wedding Cake", "Runtz",
  "Gorilla Glue", "Jack Herer", "Green Crack", "Durban Poison"
];

import { StrainMatch } from "./types";

// Function to find the best matching strain from text
export const findBestStrain = (text: string): StrainMatch => {
  // Handle null or undefined text
  if (!text) {
    return { strain: "", confidence: 0 };
  }
  
  // Normalize input text
  const normalizedText = text.toLowerCase();
  
  // Look for exact matches in common strains
  for (const strain of COMMON_STRAINS) {
    if (normalizedText.includes(strain.toLowerCase())) {
      return { strain, confidence: 1 };
    }
  }
  
  // Try to extract strain-like words from the text
  // This is a simplified approach - in production, you'd use a more sophisticated algorithm
  const words = normalizedText.split(/\s+/);
  for (const word of words) {
    // Skip common words like "to", "for", "on", etc.
    if (!word || word.length < 3 || /^(to|for|on|at|the|and|with|from)$/i.test(word)) continue;
    
    // Check if the word might be a strain name (capitalized word not following common patterns)
    // Only test regex on non-null, non-undefined words
    if (word && /^[A-Z][a-z]+$/.test(word) && !/(sold|paid|gave|got|made|profit|tick|front)/i.test(word)) {
      return { strain: word, confidence: 0.5 };
    }
  }
  
  return { strain: "", confidence: 0 };
};
