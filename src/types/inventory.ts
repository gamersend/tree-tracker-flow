
// Type for inventory item
export type InventoryItem = {
  id: string;
  strain: string;
  purchaseDate: Date;
  quantity: number;
  quantityUnit: "112g" | "224g" | "448g";
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
