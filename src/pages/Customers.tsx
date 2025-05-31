
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import CustomerList from "@/components/customers/CustomerList";
import CustomerDetails from "@/components/customers/CustomerDetails";
import CustomerHeader from "@/components/customers/CustomerHeader";
import CustomerFormDialog from "@/components/customers/CustomerFormDialog";
import CustomerDeleteDialog from "@/components/customers/CustomerDeleteDialog";
import { useSupabaseCustomers } from "@/hooks/useSupabaseCustomers";
import { customerEmojis, platforms } from "@/hooks/useCustomers";

interface CustomerFormData {
  name: string;
  platform: string;
  alias: string;
  notes: string;
  trustedBuyer: boolean;
  emoji: string;
}

const Customers = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    customers,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterTrusted,
    setFilterTrusted,
    filteredCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  } = useSupabaseCustomers();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetailTab, setCustomerDetailTab] = useState("info");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState("");

  // New customer form state
  const [newCustomer, setNewCustomer] = useState<CustomerFormData>({
    name: "",
    platform: "",
    alias: "",
    notes: "",
    trustedBuyer: false,
    emoji: customerEmojis[Math.floor(Math.random() * customerEmojis.length)],
  });

  console.log('Customers page - filteredCustomers:', filteredCustomers);
  console.log('Customers page - loading:', loading);

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
        <div className="text-gray-400">Please sign in to access customer data.</div>
      </div>
    );
  }

  // Handle opening the add dialog
  const handleOpenAddDialog = () => {
    setNewCustomer({
      name: "",
      platform: "",
      alias: "",
      notes: "",
      trustedBuyer: false,
      emoji: customerEmojis[Math.floor(Math.random() * customerEmojis.length)],
    });
    setIsAddDialogOpen(true);
  };

  // Handle new customer form submission
  const handleAddCustomer = async () => {
    const success = await addCustomer({
      name: newCustomer.name,
      platform: newCustomer.platform,
      alias: newCustomer.alias,
      notes: newCustomer.notes,
      trusted_buyer: newCustomer.trustedBuyer,
      emoji: newCustomer.emoji,
    });
    if (success) {
      setIsAddDialogOpen(false);
    }
  };

  // Handle selecting a customer for editing
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  // Handle customer edit form submission
  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return;
    const success = await updateCustomer(selectedCustomer.id, {
      name: selectedCustomer.name,
      platform: selectedCustomer.platform,
      alias: selectedCustomer.alias,
      notes: selectedCustomer.notes,
      trusted_buyer: selectedCustomer.trusted_buyer,
      emoji: selectedCustomer.emoji,
    });
    if (success) {
      setIsEditDialogOpen(false);
    }
  };

  // Handle deleting a customer
  const handleDeletePrompt = (customerId) => {
    setDeleteCustomerId(customerId);
    setShowConfirmDelete(true);
  };

  const confirmDeleteCustomer = async () => {
    if (deleteCustomerId) {
      await deleteCustomer(deleteCustomerId);
      setShowConfirmDelete(false);
    }
  };

  // Handle selecting a customer for viewing details
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  // Convert Supabase customer format to component format
  const formattedCustomers = filteredCustomers.map(customer => ({
    id: customer.id,
    name: customer.name,
    platform: customer.platform,
    alias: customer.alias || "",
    notes: customer.notes || "",
    trustedBuyer: customer.trusted_buyer,
    totalOrders: customer.total_orders,
    totalSpent: customer.total_spent,
    totalProfit: customer.total_profit,
    lastPurchase: customer.last_purchase ? new Date(customer.last_purchase) : undefined,
    emoji: customer.emoji || "🌿",
  }));

  console.log('Formatted customers for CustomerList:', formattedCustomers);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <CustomerHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterTrusted={filterTrusted}
        setFilterTrusted={setFilterTrusted}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onAddCustomer={() => setIsAddDialogOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 overflow-hidden border-slate-700/50 dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-tree-purple">👥</span> Customers
            </CardTitle>
            <CardDescription>
              {formattedCustomers.length} customers in your list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerList
              customers={formattedCustomers}
              onViewCustomer={setSelectedCustomer}
              onEditCustomer={(customer) => {
                setSelectedCustomer(customer);
                setIsEditDialogOpen(true);
              }}
              onDeleteCustomer={(customerId) => {
                setDeleteCustomerId(customerId);
                setShowConfirmDelete(true);
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-slate-700/50 dashboard-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CustomerDetails
              customer={selectedCustomer}
              purchases={[]} // This would need to be implemented with sales data
              onEditCustomer={(customer) => {
                setSelectedCustomer(customer);
                setIsEditDialogOpen(true);
              }}
              onDeleteCustomer={(customerId) => {
                setDeleteCustomerId(customerId);
                setShowConfirmDelete(true);
              }}
              activeTab={customerDetailTab}
              onTabChange={setCustomerDetailTab}
            />
          </CardHeader>
        </Card>
      </div>

      {/* Add Customer Dialog */}
      <CustomerFormDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Add New Customer"
        description="Add a new customer to your address book"
        formData={newCustomer}
        onFormDataChange={(data) => setNewCustomer({ ...newCustomer, ...data })}
        onSubmit={handleAddCustomer}
        emojis={customerEmojis}
        platforms={platforms}
        submitLabel="Add Customer"
      />

      {/* Edit Customer Dialog */}
      {selectedCustomer && (
        <CustomerFormDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Customer"
          description="Update customer information"
          formData={{
            name: selectedCustomer.name,
            platform: selectedCustomer.platform,
            alias: selectedCustomer.alias,
            notes: selectedCustomer.notes,
            trustedBuyer: selectedCustomer.trusted_buyer,
            emoji: selectedCustomer.emoji || "🌿",
          }}
          onFormDataChange={(data) =>
            setSelectedCustomer({
              ...selectedCustomer,
              ...data,
            })
          }
          onSubmit={handleUpdateCustomer}
          emojis={customerEmojis}
          platforms={platforms}
          submitLabel="Save Changes"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <CustomerDeleteDialog
        isOpen={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
        onConfirmDelete={confirmDeleteCustomer}
      />
    </motion.div>
  );
};

export default Customers;
