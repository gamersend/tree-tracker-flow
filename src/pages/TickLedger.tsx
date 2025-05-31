
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  DollarSign, 
  AlertCircle, 
  Edit, 
  Trash2, 
  CheckCircle 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseTickLedger } from "@/hooks/useSupabaseTickLedger";
import AddTickDialog from "@/components/tick-ledger/AddTickDialog";
import PaymentDialog from "@/components/tick-ledger/PaymentDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TickLedger = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    tickEntries,
    loading,
    addTickEntry,
    updateTickEntry,
    deleteTickEntry,
    makePayment,
    totalOutstanding,
    totalPaid,
    overdueTicks
  } = useSupabaseTickLedger();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  // Show loading state while checking authentication or loading data
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tree-green"></div>
      </div>
    );
  }

  // If not authenticated, show message
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Please sign in to access tick ledger.</div>
      </div>
    );
  }

  const handleAddEntry = async (data: any) => {
    try {
      const success = await addTickEntry({
        ...data,
        paid: 0,
        remaining: data.amount,
        status: 'outstanding' as const
      });
      return success;
    } catch (error) {
      console.error('Error adding entry:', error);
      return false;
    }
  };

  const handleEditEntry = async (data: any) => {
    if (!editingEntry) return false;
    
    try {
      // Calculate new remaining amount if amount changed
      const newRemaining = data.amount - (editingEntry.paid || 0);
      let newStatus = editingEntry.status;
      
      if (newRemaining <= 0) {
        newStatus = 'paid';
      } else if ((editingEntry.paid || 0) > 0) {
        newStatus = 'partial';
      } else {
        newStatus = 'outstanding';
      }

      const success = await updateTickEntry(editingEntry.id, {
        ...data,
        remaining: Math.max(0, newRemaining),
        status: newStatus
      });
      
      if (success) {
        setEditingEntry(null);
      }
      return success;
    } catch (error) {
      console.error('Error editing entry:', error);
      return false;
    }
  };

  const handleDeleteEntry = async () => {
    if (!selectedEntry) return;
    
    try {
      const success = await deleteTickEntry(selectedEntry.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setSelectedEntry(null);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleMakePayment = async (amount: number) => {
    if (!selectedEntry) return false;
    
    try {
      const success = await makePayment(selectedEntry.id, amount);
      if (success) {
        setSelectedEntry(null);
      }
      return success;
    } catch (error) {
      console.error('Error making payment:', error);
      return false;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-red-500/20 text-red-400';
    }
  };

  const isOverdue = (dueDate?: string) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Filter entries based on search
  const filteredEntries = tickEntries.filter(entry => 
    entry.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (entry.strain_name && entry.strain_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Tick Ledger</h1>
          <p className="text-gray-400">Track outstanding payments and IOUs</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Tick Entry
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-700/50 dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">${totalOutstanding.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-700/50 dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-700/50 dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Entries</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{overdueTicks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tick Entries Table */}
      <Card className="border-slate-700/50 dashboard-card">
        <CardHeader>
          <CardTitle>Tick Entries</CardTitle>
          <CardDescription>
            {filteredEntries.length} entries found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Strain</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.customer_name}</TableCell>
                    <TableCell>{entry.strain_name || '-'}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>${entry.amount.toFixed(2)}</TableCell>
                    <TableCell>${(entry.paid || 0).toFixed(2)}</TableCell>
                    <TableCell>${entry.remaining.toFixed(2)}</TableCell>
                    <TableCell>
                      {entry.due_date ? (
                        <span className={isOverdue(entry.due_date) ? 'text-red-400' : ''}>
                          {formatDate(entry.due_date)}
                          {isOverdue(entry.due_date) && ' (Overdue)'}
                        </span>
                      ) : (
                        'No due date'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {entry.status !== 'paid' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedEntry(entry);
                              setIsPaymentDialogOpen(true);
                            }}
                          >
                            <DollarSign className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingEntry(entry);
                            setIsAddDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedEntry(entry);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No entries match your search.' : 'No tick entries found. Add one to get started!'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddTickDialog
        isOpen={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingEntry(null);
        }}
        onSubmit={editingEntry ? handleEditEntry : handleAddEntry}
        initialData={editingEntry ? {
          customer_id: editingEntry.customer_id,
          strain_id: editingEntry.strain_id,
          amount: editingEntry.amount,
          description: editingEntry.description,
          date: editingEntry.date.split('T')[0],
          due_date: editingEntry.due_date?.split('T')[0] || '',
          notes: editingEntry.notes || ''
        } : null}
        title={editingEntry ? "Edit Tick Entry" : "Add New Tick Entry"}
      />

      {selectedEntry && (
        <PaymentDialog
          isOpen={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          onSubmit={handleMakePayment}
          remainingAmount={selectedEntry.remaining}
          customerName={selectedEntry.customer_name}
          description={selectedEntry.description}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tick Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tick entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TickLedger;
