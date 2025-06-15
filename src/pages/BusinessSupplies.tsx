
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseBusinessSupplies } from "@/hooks/useSupabaseBusinessSupplies";
import BusinessSuppliesHeader from "@/components/business-supplies/BusinessSuppliesHeader";
import BusinessSuppliesTable from "@/components/business-supplies/BusinessSuppliesTable";
import AddBusinessSupplyDialog from "@/components/business-supplies/AddBusinessSupplyDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { BusinessSupply } from "@/hooks/useSupabaseBusinessSupplies";

const BusinessSupplies = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    filteredSupplies,
    categories,
    lowStockSupplies,
    loading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    addSupply,
    updateSupply,
    deleteSupply
  } = useSupabaseBusinessSupplies();

  const [editingSupply, setEditingSupply] = useState<BusinessSupply | null>(null);

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
        <div className="text-gray-400">Please sign in to access business supplies data.</div>
      </div>
    );
  }

  const handleAddSupply = async (supplyData: Omit<BusinessSupply, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    return await addSupply(supplyData);
  };

  const handleEditSupply = (supply: BusinessSupply) => {
    setEditingSupply(supply);
  };

  const handleUpdateSupply = async (supplyData: Omit<BusinessSupply, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!editingSupply) return false;
    return await updateSupply(editingSupply.id, supplyData);
  };

  const handleEditComplete = () => {
    setEditingSupply(null);
  };

  const handleDeleteSupply = async (id: string) => {
    if (confirm("Are you sure you want to delete this supply?")) {
      await deleteSupply(id);
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <BusinessSuppliesHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        onAddSupply={() => {}} // We'll use the dialog directly now
        addSupplyDialog={
          <AddBusinessSupplyDialog onSubmit={handleAddSupply} />
        }
      />

      {lowStockSupplies.length > 0 && (
        <Card className="bg-gradient-to-br from-red-950 to-red-900 border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-200">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-red-300">
              {lowStockSupplies.length} supplies are running low
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockSupplies.map((supply) => (
                <div key={supply.id} className="bg-red-800/30 p-3 rounded-lg">
                  <div className="font-medium text-red-100">{supply.name}</div>
                  <div className="text-sm text-red-200">
                    {supply.quantity} remaining (threshold: {supply.low_stock_threshold})
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <BusinessSuppliesTable
        supplies={filteredSupplies}
        onEdit={handleEditSupply}
        onDelete={handleDeleteSupply}
      />

      {editingSupply && (
        <AddBusinessSupplyDialog
          onSubmit={handleUpdateSupply}
          editSupply={editingSupply}
          onEditComplete={handleEditComplete}
        />
      )}
    </motion.div>
  );
};

export default BusinessSupplies;
