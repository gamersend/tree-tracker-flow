
import React from "react";
import { motion } from "framer-motion";
import { useSupabaseSales } from "@/hooks/useSupabaseSales";
import { useSupabaseCustomers } from "@/hooks/useSupabaseCustomers";
import { useSupabaseInventory } from "@/hooks/useSupabaseInventory";
import { SalesHeader } from "@/components/sales/SalesHeader";
import { AddSaleDialog } from "@/components/sales/AddSaleDialog";
import { SalesTable } from "@/components/sales/SalesTable";
import { SalesSummary } from "@/components/sales/SalesSummary";
import { useState } from "react";

const Sales = () => {
  const { sales, loading, addSale } = useSupabaseSales();
  const { customers } = useSupabaseCustomers();
  const { strains } = useSupabaseInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete sale:", saleId);
  };

  // Format sales data for components
  const formattedSales = sales.map(sale => ({
    id: sale.id,
    strain: sale.strain_name || "Unknown",
    date: new Date(sale.date),
    quantity: sale.quantity,
    customer: sale.customer_name || "Walk-in",
    salePrice: sale.sale_price,
    costPerGram: sale.cost_per_gram,
    profit: sale.profit,
    image: sale.image_url
  }));

  // Filter sales based on search query
  const filteredSales = formattedSales.filter(sale =>
    sale.strain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format customers for AddSaleDialog
  const formattedCustomers = customers.map(c => ({
    id: c.id,
    name: c.name,
    loyaltyTag: c.trusted_buyer ? "Trusted" : "Regular",
    orderCount: c.total_orders || 0,
    lastOrderDate: c.last_purchase ? new Date(c.last_purchase) : undefined,
    totalSpent: c.total_spent || 0
  }));

  // Format customers for SalesTable
  const customersForTable = customers.reduce((acc, customer) => {
    acc[customer.id] = {
      name: customer.name,
      trusted: customer.trusted_buyer
    };
    return acc;
  }, {} as Record<string, { name: string; trusted: boolean }>);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SalesHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsDialogOpen={setIsDialogOpen}
      />
      
      <AddSaleDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddSale={handleAddSale}
        customers={formattedCustomers}
        strains={strains.map(s => ({
          id: s.id,
          name: s.name,
          costPerGram: s.cost_per_gram,
          image: s.image_url
        }))}
      />
      
      <SalesTable 
        sales={filteredSales}
        customers={customersForTable}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSort={handleSort}
        handleDeleteSale={handleDeleteSale}
      />
      
      <SalesSummary sales={filteredSales} />
    </motion.div>
  );
};

export default Sales;
