
import React from "react";
import { motion } from "framer-motion";
import { useSupabaseSales } from "@/hooks/useSupabaseSales";
import { useSupabaseCustomers } from "@/hooks/useSupabaseCustomers";
import { useSupabaseInventory } from "@/hooks/useSupabaseInventory";
import SalesHeader from "@/components/sales/SalesHeader";
import AddSaleDialog from "@/components/sales/AddSaleDialog";
import SalesTable from "@/components/sales/SalesTable";
import SalesSummary from "@/components/sales/SalesSummary";
import { useState } from "react";

const Sales = () => {
  const { sales, loading, addSale } = useSupabaseSales();
  const { customers } = useSupabaseCustomers();
  const { strains } = useSupabaseInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tree-green"></div>
      </div>
    );
  }

  const handleAddSale = async (saleData: any) => {
    const success = await addSale(saleData);
    if (success) {
      setIsDialogOpen(false);
    }
    return success;
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SalesHeader onAddSale={() => setIsDialogOpen(true)} />
      
      <AddSaleDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddSale={handleAddSale}
        customers={customers}
        strains={strains}
      />
      
      <SalesTable sales={sales} />
      
      <SalesSummary sales={sales} />
    </motion.div>
  );
};

export default Sales;
