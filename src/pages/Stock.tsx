
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseStock } from "@/hooks/useSupabaseStock";
import StockHeader from "@/components/stock/StockHeader";
import StockLevelsCard from "@/components/stock/StockLevelsCard";
import StockTransactionsTable from "@/components/stock/StockTransactionsTable";

const Stock = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    transactions,
    stockLevels,
    loading,
    addStockTransaction
  } = useSupabaseStock();
  
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="text-gray-400">Please sign in to access stock data.</div>
      </div>
    );
  }

  const handleAddTransaction = () => {
    // This would open a dialog to add a new stock transaction
    // For now, we'll just log it
    console.log("Add transaction clicked");
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.strain_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.transaction_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <StockHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddTransaction={handleAddTransaction}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockLevelsCard stockLevels={stockLevels} />
        <StockTransactionsTable transactions={filteredTransactions} />
      </div>
    </motion.div>
  );
};

export default Stock;
