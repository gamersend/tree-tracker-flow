
import React from "react";
import { motion } from "framer-motion";
import { useSupabaseInventory } from "@/hooks/useSupabaseInventory";
import { useAddInventoryForm } from "@/hooks/useAddInventoryForm";
import { useAuth } from "@/hooks/useAuth";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import AddInventoryDialog from "@/components/inventory/AddInventoryDialog";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventorySummary from "@/components/inventory/InventorySummary";
import CurrentStockCard from "@/components/inventory/CurrentStockCard";

const Inventory = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    inventory,
    strains,
    loading,
    searchQuery,
    setSearchQuery,
    filteredInventory,
    addInventoryItem
  } = useSupabaseInventory();

  const {
    isDialogOpen,
    setIsDialogOpen,
    newStrain,
    setNewStrain,
    purchaseDate,
    setPurchaseDate,
    quantity,
    setQuantity,
    totalCost,
    setTotalCost,
    notes,
    setNotes,
    selectedImage,
    setSelectedImage,
    handleImageUpload,
    handleAddInventory
  } = useAddInventoryForm(async (strain, purchaseDate, quantity, totalCost, notes, image) => {
    const success = await addInventoryItem(strain, purchaseDate, quantity, parseFloat(totalCost), notes, image);
    return success;
  });

  // Show loading state while checking authentication
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tree-green"></div>
      </div>
    );
  }

  // If not authenticated, the AuthGuard will handle the redirect
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Please sign in to access inventory data.</div>
      </div>
    );
  }

  // Convert Supabase data to component format
  const formattedStrains = strains.map(strain => ({
    name: strain.name,
    costPerGram: strain.cost_per_gram,
    image: strain.image_url
  }));

  const formattedInventory = inventory.map(item => ({
    id: item.id,
    strain: item.strain_name,
    purchaseDate: new Date(item.purchase_date),
    quantity: item.quantity,
    quantityUnit: item.quantity_unit as "112g" | "224g" | "448g",
    totalCost: item.total_cost,
    pricePerGram: item.price_per_gram,
    costPerOunce: item.cost_per_ounce,
    notes: item.notes,
    image: item.image_url
  }));

  const formattedFilteredInventory = filteredInventory.map(item => ({
    id: item.id,
    strain: item.strain_name,
    purchaseDate: new Date(item.purchase_date),
    quantity: item.quantity,
    quantityUnit: item.quantity_unit as "112g" | "224g" | "448g",
    totalCost: item.total_cost,
    pricePerGram: item.price_per_gram,
    costPerOunce: item.cost_per_ounce,
    notes: item.notes,
    image: item.image_url
  }));
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <InventoryHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openAddInventoryDialog={() => setIsDialogOpen(true)}
      />
      
      <AddInventoryDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        strain={newStrain}
        setStrain={setNewStrain}
        purchaseDate={purchaseDate}
        setPurchaseDate={setPurchaseDate}
        quantity={quantity}
        setQuantity={setQuantity}
        totalCost={totalCost}
        setTotalCost={setTotalCost}
        notes={notes}
        setNotes={setNotes}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleImageUpload={handleImageUpload}
        handleAddInventory={handleAddInventory}
        strains={formattedStrains}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrentStockCard strains={strains} inventory={inventory} />
        <InventorySummary inventoryItems={formattedInventory} />
      </div>
      
      <InventoryTable 
        inventoryItems={formattedFilteredInventory}
        searchQuery={searchQuery}
      />
    </motion.div>
  );
};

export default Inventory;
