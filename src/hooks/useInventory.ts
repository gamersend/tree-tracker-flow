
import { useState, useEffect } from "react";
import { InventoryItem, StrainInfo } from "@/types/inventory";
import { loadFromStorage, calculatePricePerGram, calculateCostPerOunce, getQuantityInGrams } from "@/utils/inventory-utils";
import { toast } from "sonner";

// Default inventory data
const defaultInventoryItems: InventoryItem[] = [
  {
    id: "inv1",
    strain: "OG Kush",
    purchaseDate: new Date(2023, 4, 15),
    quantity: 112,
    quantityUnit: "112g",
    totalCost: 560,
    pricePerGram: 5,
    costPerOunce: 140,
    notes: "High quality batch.",
  },
  {
    id: "inv2",
    strain: "Blue Dream",
    purchaseDate: new Date(2023, 4, 20),
    quantity: 224,
    quantityUnit: "224g",
    totalCost: 1120,
    pricePerGram: 5,
    costPerOunce: 140,
    notes: "From regular supplier.",
  },
  {
    id: "inv3",
    strain: "Sour Diesel",
    purchaseDate: new Date(2023, 5, 1),
    quantity: 448,
    quantityUnit: "448g",
    totalCost: 1792,
    pricePerGram: 4,
    costPerOunce: 112,
    notes: "Bulk purchase discount applied.",
  },
  {
    id: "inv4",
    strain: "Purple Haze",
    purchaseDate: new Date(2023, 5, 10),
    quantity: 112,
    quantityUnit: "112g",
    totalCost: 672,
    pricePerGram: 6,
    costPerOunce: 168,
    notes: "Premium quality.",
  },
];

const defaultStrains: StrainInfo[] = [
  { name: "OG Kush", costPerGram: 5 },
  { name: "Blue Dream", costPerGram: 5 },
  { name: "Sour Diesel", costPerGram: 4 },
  { name: "Purple Haze", costPerGram: 6 },
  { name: "White Widow", costPerGram: 5.5 },
];

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(
    loadFromStorage('inventory', defaultInventoryItems)
  );
  
  const [strains, setStrains] = useState<StrainInfo[]>(
    loadFromStorage('strains', defaultStrains)
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);
  
  useEffect(() => {
    localStorage.setItem('strains', JSON.stringify(strains));
  }, [strains]);

  // Add new inventory item
  const addInventoryItem = (
    strain: string,
    purchaseDate: Date | undefined,
    quantity: "112g" | "224g" | "448g",
    totalCost: string,
    notes: string,
    image?: string | null
  ) => {
    if (!strain || !purchaseDate || !totalCost) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    const costValue = parseFloat(totalCost);
    const quantityValue = getQuantityInGrams(quantity);
    const pricePerGram = calculatePricePerGram(costValue, quantityValue);
    const costPerOunce = calculateCostPerOunce(pricePerGram);
    
    const newItem: InventoryItem = {
      id: `inv${Date.now()}`,
      strain,
      purchaseDate,
      quantity: quantityValue,
      quantityUnit: quantity,
      totalCost: costValue,
      pricePerGram,
      costPerOunce,
      notes,
      image: image || undefined,
    };
    
    setInventory(prev => [...prev, newItem]);
    
    // Also update or add to strains list
    const existingStrainIndex = strains.findIndex(s => s.name === strain);
    
    if (existingStrainIndex >= 0) {
      // Update existing strain cost
      const updatedStrains = [...strains];
      updatedStrains[existingStrainIndex] = { 
        ...updatedStrains[existingStrainIndex], 
        costPerGram: pricePerGram,
        image: image || updatedStrains[existingStrainIndex].image
      };
      setStrains(updatedStrains);
    } else {
      // Add new strain
      setStrains(prev => [...prev, { 
        name: strain, 
        costPerGram: pricePerGram,
        image: image || undefined
      }]);
    }
    
    toast.success("Inventory added successfully!");
    return true;
  };

  // Filter inventory based on search
  const filteredInventory = inventory.filter(item =>
    item.strain.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return {
    inventory,
    strains,
    searchQuery,
    setSearchQuery,
    filteredInventory,
    addInventoryItem
  };
};
