
import React from "react";
import { motion } from "framer-motion";
import { useSupabaseSales } from "@/hooks/useSupabaseSales";
import { useSupabaseCustomers } from "@/hooks/useSupabaseCustomers";
import { useSupabaseInventory } from "@/hooks/useSupabaseInventory";
import { useAuth } from "@/contexts/AuthContext";
import { SalesHeader } from "@/components/sales/SalesHeader";
import { AddSaleDialog } from "@/components/sales/AddSaleDialog";
import { SalesTable } from "@/components/sales/SalesTable";
import { SalesSummary } from "@/components/sales/SalesSummary";
import { useState } from "react";
import { getLoyaltyTagColor } from "@/components/sales/utils";

const Sales = () => {
  const { user, loading: authLoading } = useAuth();
  const { sales, loading, addSale, deleteSale } = useSupabaseSales();
  const { customers, refetch: refetchCustomers } = useSupabaseCustomers();
  const { strains } = useSupabaseInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [targetMargin, setTargetMargin] = useState(70);

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
        <div className="text-gray-400">Please sign in to access sales data.</div>
      </div>
    );
  }

  const handleAddSale = async (saleData: any) => {
    const success = await addSale(saleData);
    if (success) {
      setIsDialogOpen(false);
      // Refetch customers to ensure new customers appear in the list
      await refetchCustomers();
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

  // FIXED: Properly implement delete functionality
  const handleDeleteSale = async (saleId: string) => {
    const success = await deleteSale(saleId);
    if (success) {
      // Also refetch customers to update their totals
      await refetchCustomers();
    }
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

  // Map loyalty tags according to CustomerInfo type - ensure it always returns a valid loyalty tag
  const mapLoyaltyTag = (trusted: boolean, totalOrders: number): "🆕 New" | "🌀 Regular" | "🔥 VIP" | "👻 Ghosted" => {
    if (totalOrders === 0) return "🆕 New";
    if (trusted && totalOrders > 10) return "🔥 VIP";
    if (totalOrders > 5) return "🌀 Regular";
    return "👻 Ghosted";
  };

  // Format customers for AddSaleDialog - with correct CustomerInfo type including id
  const formattedCustomers = customers.map(c => ({
    id: c.id,
    name: c.name,
    loyaltyTag: mapLoyaltyTag(c.trusted_buyer, c.total_orders || 0),
    orderCount: c.total_orders || 0,
    lastOrderDate: c.last_purchase ? new Date(c.last_purchase) : null,
    totalSpent: c.total_spent || 0
  }));

  // Format customers for SalesTable - as array not Record
  const customersForTable = customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    loyaltyTag: mapLoyaltyTag(customer.trusted_buyer, customer.total_orders || 0),
    orderCount: customer.total_orders || 0,
    lastOrderDate: customer.last_purchase ? new Date(customer.last_purchase) : null,
    totalSpent: customer.total_spent || 0
  }));

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
        setIsOpen={setIsDialogOpen}
        availableStrains={strains.map(s => ({
          id: s.id,
          name: s.name,
          costPerGram: s.cost_per_gram,
          image: s.image_url
        }))}
        customers={formattedCustomers}
        addSale={handleAddSale}
        targetMargin={targetMargin}
        setTargetMargin={setTargetMargin}
      />
      
      <SalesTable 
        sales={filteredSales}
        customers={customersForTable}
        sortColumn={sortColumn as keyof typeof formattedSales[0]}
        sortDirection={sortDirection}
        handleSort={(column) => handleSort(column as string)}
        handleDeleteSale={handleDeleteSale}
      />
      
      <SalesSummary sales={filteredSales} />
    </motion.div>
  );
};

export default Sales;
