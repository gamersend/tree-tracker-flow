
import React from "react";
import { motion } from "framer-motion";
import { useSupabaseInventory } from "@/hooks/useSupabaseInventory";
import { useAddInventoryForm } from "@/hooks/useAddInventoryForm";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import AddInventoryDialog from "@/components/inventory/AddInventoryDialog";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventorySummary from "@/components/inventory/InventorySummary";

const Inventory = () => {
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
  } = useAddInventoryForm((strain, purchaseDate, quantity, totalCost, notes, image) => 
    addInventoryItem(strain, purchaseDate, quantity, parseFloat(totalCost), notes, image)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tree-green"></div>
      </div>
    );
  }
  
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
        strains={strains}
      />
      
      <InventoryTable 
        inventoryItems={filteredInventory}
        searchQuery={searchQuery}
      />
      
      <InventorySummary inventoryItems={inventory} />
    </motion.div>
  );
};

export default Inventory;
