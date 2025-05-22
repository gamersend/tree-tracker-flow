
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomerList from "@/components/customers/CustomerList";
import CustomerDetails from "@/components/customers/CustomerDetails";
import CustomerHeader from "@/components/customers/CustomerHeader";
import CustomerFormDialog from "@/components/customers/CustomerFormDialog";
import CustomerDeleteDialog from "@/components/customers/CustomerDeleteDialog";
import { useCustomers, customerEmojis, platforms } from "@/hooks/useCustomers";
import { CustomerFormData, CustomerType } from "@/types/customer";

const Customers = () => {
  const {
    filteredCustomers,
    selectedCustomer,
    purchases,
    searchQuery,
    setSearchQuery,
    customerDetailTab,
    setCustomerDetailTab,
    sortOrder,
    setSortOrder,
    sortBy,
    setSortBy,
    filterTrusted,
    setFilterTrusted,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    selectCustomer,
    setSelectedCustomer
  } = useCustomers();

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
  const handleAddCustomer = () => {
    const success = addCustomer(newCustomer);
    if (success) {
      setIsAddDialogOpen(false);
    }
  };

  // Handle selecting a customer for editing
  const handleEditCustomer = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  // Handle customer edit form submission
  const handleUpdateCustomer = () => {
    if (!selectedCustomer) return;
    updateCustomer(selectedCustomer);
    setIsEditDialogOpen(false);
  };

  // Handle deleting a customer
  const handleDeletePrompt = (customerId: string) => {
    setDeleteCustomerId(customerId);
    setShowConfirmDelete(true);
  };

  const confirmDeleteCustomer = () => {
    deleteCustomer(deleteCustomerId);
    setShowConfirmDelete(false);
  };

  // Handle selecting a customer for viewing details
  const handleViewCustomer = (customer: CustomerType) => {
    selectCustomer(customer);
  };

  return (
    <div className="space-y-6">
      {/* Header section with title and controls */}
      <CustomerHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterTrusted={filterTrusted}
        setFilterTrusted={setFilterTrusted}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onAddCustomer={handleOpenAddDialog}
      />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer list card */}
        <Card className="lg:col-span-1 overflow-hidden border-slate-700/50 dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-tree-purple">👥</span> Customers
            </CardTitle>
            <CardDescription>
              {filteredCustomers.length} customers in your list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerList
              customers={filteredCustomers}
              onViewCustomer={handleViewCustomer}
              onEditCustomer={handleEditCustomer}
              onDeleteCustomer={handleDeletePrompt}
            />
          </CardContent>
        </Card>

        {/* Customer details card */}
        <Card className="lg:col-span-2 border-slate-700/50 dashboard-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CustomerDetails
              customer={selectedCustomer}
              purchases={purchases}
              onEditCustomer={handleEditCustomer}
              onDeleteCustomer={handleDeletePrompt}
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
            trustedBuyer: selectedCustomer.trustedBuyer,
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
    </div>
  );
};

export default Customers;
