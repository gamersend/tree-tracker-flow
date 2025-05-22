
import { InventoryItem } from "@/types/inventory";

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

// Calculate derived values
export const calculatePricePerGram = (cost: number, quantityValue: number): number => {
  return cost / quantityValue;
};

export const calculateCostPerOunce = (pricePerGram: number): number => {
  return pricePerGram * 28;
};

export const getQuantityInGrams = (quantityUnit: string): number => {
  switch (quantityUnit) {
    case "112g": return 112;
    case "224g": return 224;
    case "448g": return 448;
    default: return 0;
  }
};

// Calculate inventory statistics
export const calculateAverageCostPerGram = (inventory: InventoryItem[]): number => {
  if (inventory.length === 0) return 0;
  
  const totalCost = inventory.reduce((sum, item) => sum + item.totalCost, 0);
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  
  return totalQuantity > 0 ? totalCost / totalQuantity : 0;
};

// Safe formatter helper for numbers to prevent the toFixed error
export const safeFormatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null) {
    return "0.00";
  }
  return value.toFixed(2);
};
