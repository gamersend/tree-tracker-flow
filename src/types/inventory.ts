
// Type for inventory item
export type InventoryItem = {
  id: string;
  strain: string;
  purchaseDate: Date;
  quantity: number;
  quantityUnit: string; // Now flexible - can be any string like "112g", "custom", etc.
  totalCost: number;
  pricePerGram: number;
  costPerOunce: number;
  notes: string;
  image?: string;
};

// Type for strain info
export type StrainInfo = {
  name: string;
  costPerGram: number;
  image?: string;
};
