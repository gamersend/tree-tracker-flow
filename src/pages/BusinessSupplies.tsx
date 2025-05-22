
import React, { useState, useEffect } from "react";
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  DollarSign, 
  Calendar, 
  Trash2, 
  Edit, 
  PlusCircle,
  RefreshCw,
  ArrowUpDown,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Supply item type definition
interface SupplyItem {
  id: string;
  name: string;
  category: string;
  startingStock: number;
  unitType: string;
  currentStock: number;
  restockThreshold: number;
  purchaseFrequency: string;
  costPerUnit: number;
  totalCost: number;
  lastPurchaseDate: string;
  notes: string;
  restockReminderDate?: string;
}

// For form validation
const supplyItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  startingStock: z.coerce.number().min(0, "Starting stock must be 0 or higher"),
  unitType: z.string().min(1, "Unit type is required"),
  currentStock: z.coerce.number().min(0, "Current stock must be 0 or higher"),
  restockThreshold: z.coerce.number().min(0, "Threshold must be 0 or higher"),
  purchaseFrequency: z.string().min(1, "Purchase frequency is required"),
  costPerUnit: z.coerce.number().min(0, "Cost must be 0 or higher"),
  lastPurchaseDate: z.string(),
  notes: z.string().optional(),
  restockReminderDate: z.string().optional()
});

// Category options with icons
const categoryOptions = [
  { value: "Packaging", label: "🛍️ Packaging" },
  { value: "Mailing", label: "📬 Mailing" },
  { value: "Promo", label: "✂️ Promo" },
  { value: "Stickers", label: "🎨 Stickers" },
  { value: "Cleaning", label: "🧼 Cleaning" },
  { value: "Other", label: "📦 Other" },
];

// Unit type options
const unitTypeOptions = [
  { value: "Pieces", label: "Pieces" },
  { value: "Rolls", label: "Rolls" },
  { value: "Packs", label: "Packs" },
  { value: "Boxes", label: "Boxes" },
  { value: "Bags", label: "Bags" },
  { value: "Units", label: "Units" },
];

// Purchase frequency options
const purchaseFrequencyOptions = [
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "On-Demand", label: "On-Demand" },
];

// Utility function to get category icon
const getCategoryEmoji = (category: string) => {
  const found = categoryOptions.find(cat => cat.value === category);
  return found ? found.label.split(' ')[0] : '📦';
};

// Custom add expense function
const addExpense = (supplyItem: SupplyItem) => {
  try {
    // Get existing expenses from localStorage
    const storedExpenses = localStorage.getItem('expenses');
    const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
    
    // Create new expense from supply item
    const newExpense = {
      id: `exp-${Date.now()}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'Business Supplies',
      description: `Restock: ${supplyItem.name}`,
      amount: supplyItem.costPerUnit * supplyItem.currentStock,
      notes: `Restocked ${supplyItem.name} (${supplyItem.category})`,
    };
    
    // Add new expense to the list
    expenses.push(newExpense);
    
    // Save back to localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    return true;
  } catch (error) {
    console.error("Failed to add expense:", error);
    return false;
  }
};

const BusinessSupplies = () => {
  const [supplies, setSupplies] = useState<SupplyItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<SupplyItem | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [restockAmount, setRestockAmount] = useState(0);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    mostExpensiveItem: '',
  });

  const form = useForm<z.infer<typeof supplyItemSchema>>({
    resolver: zodResolver(supplyItemSchema),
    defaultValues: {
      name: "",
      category: "Packaging",
      startingStock: 0,
      unitType: "Pieces",
      currentStock: 0,
      restockThreshold: 0,
      purchaseFrequency: "On-Demand",
      costPerUnit: 0,
      lastPurchaseDate: format(new Date(), 'yyyy-MM-dd'),
      notes: "",
      restockReminderDate: "",
    },
  });

  // Load data on component mount
  useEffect(() => {
    const storedSupplies = localStorage.getItem('businessSupplies');
    if (storedSupplies) {
      setSupplies(JSON.parse(storedSupplies));
    }
  }, []);

  // Calculate statistics when supplies change
  useEffect(() => {
    if (supplies.length === 0) return;

    // Calculate stats
    const totalValue = supplies.reduce((sum, item) => 
      sum + (item.currentStock * item.costPerUnit), 0);
    
    const lowStockItems = supplies.filter(item => 
      item.currentStock <= item.restockThreshold).length;
    
    // Find most expensive item to maintain
    let mostExpensiveItem = supplies[0];
    supplies.forEach(item => {
      if ((item.costPerUnit * item.currentStock) > 
          (mostExpensiveItem.costPerUnit * mostExpensiveItem.currentStock)) {
        mostExpensiveItem = item;
      }
    });

    setStats({
      totalItems: supplies.length,
      totalValue,
      lowStockItems,
      mostExpensiveItem: mostExpensiveItem?.name || 'None',
    });

    // Check for reminder dates
    const today = new Date();
    supplies.forEach(item => {
      if (item.restockReminderDate) {
        const reminderDate = new Date(item.restockReminderDate);
        if (reminderDate <= today) {
          toast.info(
            <div className="flex flex-col">
              <span className="font-bold">🔔 Restock Reminder</span>
              <span>Time to re-up your {item.name}</span>
            </div>,
            {
              duration: 5000,
              action: {
                label: "Snooze 7 days",
                onClick: () => snoozeReminder(item.id),
              },
            }
          );
        }
      }
    });
  }, [supplies]);

  // Save supplies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('businessSupplies', JSON.stringify(supplies));
  }, [supplies]);

  // Function to snooze a reminder for 7 days
  const snoozeReminder = (itemId: string) => {
    setSupplies(prev => prev.map(item => {
      if (item.id === itemId) {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 7);
        return {
          ...item,
          restockReminderDate: format(newDate, 'yyyy-MM-dd')
        };
      }
      return item;
    }));
    toast.success("Reminder snoozed for 7 days");
  };

  // Add new supply item
  const handleAddItem = (data: z.infer<typeof supplyItemSchema>) => {
    const newItem: SupplyItem = {
      id: `sup-${Date.now()}`,
      name: data.name,
      category: data.category,
      startingStock: data.startingStock,
      unitType: data.unitType,
      currentStock: data.currentStock,
      restockThreshold: data.restockThreshold,
      purchaseFrequency: data.purchaseFrequency,
      costPerUnit: data.costPerUnit,
      totalCost: data.startingStock * data.costPerUnit,
      lastPurchaseDate: data.lastPurchaseDate,
      notes: data.notes || "",
      restockReminderDate: data.restockReminderDate
    };

    setSupplies(prev => [...prev, newItem]);
    setIsAddDialogOpen(false);
    toast.success("Supply item added successfully");
    form.reset();
  };

  // Edit existing supply item
  const handleEditItem = (data: z.infer<typeof supplyItemSchema>) => {
    if (!currentItem) return;
    
    setSupplies(prev => prev.map(item => 
      item.id === currentItem.id 
        ? { 
            id: item.id,
            name: data.name,
            category: data.category,
            startingStock: data.startingStock,
            unitType: data.unitType,
            currentStock: data.currentStock,
            restockThreshold: data.restockThreshold,
            purchaseFrequency: data.purchaseFrequency,
            costPerUnit: data.costPerUnit,
            totalCost: data.startingStock * data.costPerUnit,
            lastPurchaseDate: data.lastPurchaseDate,
            notes: data.notes || "",
            restockReminderDate: data.restockReminderDate
          } 
        : item
    ));
    
    setIsEditDialogOpen(false);
    setCurrentItem(null);
    toast.success("Supply item updated");
  };

  // Delete supply item
  const handleDeleteItem = (id: string) => {
    setSupplies(prev => prev.filter(item => item.id !== id));
    toast.success("Supply item deleted");
  };

  // Open edit dialog
  const openEditDialog = (item: SupplyItem) => {
    setCurrentItem(item);
    form.reset({
      name: item.name,
      category: item.category,
      startingStock: item.startingStock,
      unitType: item.unitType,
      currentStock: item.currentStock,
      restockThreshold: item.restockThreshold,
      purchaseFrequency: item.purchaseFrequency,
      costPerUnit: item.costPerUnit,
      lastPurchaseDate: item.lastPurchaseDate,
      notes: item.notes,
      restockReminderDate: item.restockReminderDate || '',
    });
    setIsEditDialogOpen(true);
  };

  // Open restock dialog
  const openRestockDialog = (item: SupplyItem) => {
    setCurrentItem(item);
    setRestockAmount(item.restockThreshold * 2); // Suggest double the threshold
    setIsRestockDialogOpen(true);
  };

  // Handle restock action
  const handleRestock = () => {
    if (!currentItem) return;
    
    // Update item stock
    setSupplies(prev => prev.map(item => {
      if (item.id === currentItem.id) {
        const newItem = {
          ...item,
          currentStock: item.currentStock + restockAmount,
          lastPurchaseDate: format(new Date(), 'yyyy-MM-dd')
        };
        return newItem;
      }
      return item;
    }));
    
    // Add expense entry
    const success = addExpense({
      ...currentItem,
      currentStock: restockAmount, // Only charge for the restocked amount
    });
    
    if (success) {
      toast.success("Stock updated and expense recorded");
    } else {
      toast.error("Stock updated but failed to record expense");
    }
    
    setIsRestockDialogOpen(false);
    setCurrentItem(null);
    setRestockAmount(0);
  };

  // Handle sorting
  const requestSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted items
  const getSortedItems = () => {
    const sortableItems = [...supplies];
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof SupplyItem];
        const bValue = b[sortConfig.key as keyof SupplyItem];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  };

  // Calculate stock level percentage for progress bar
  const calculateStockLevel = (current: number, starting: number) => {
    if (starting === 0) return 0;
    return Math.min(Math.round((current / starting) * 100), 100);
  };

  // Get stock level color based on percentage
  const getStockLevelColor = (percentage: number) => {
    if (percentage >= 60) return "bg-green-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get list of low stock items for alert
  const getLowStockItems = () => {
    return supplies
      .filter(item => item.currentStock <= item.restockThreshold)
      .map(item => item.name);
  };

  // Reset form for adding new item
  const openAddDialog = () => {
    form.reset({
      name: "",
      category: "Packaging",
      startingStock: 0,
      unitType: "Pieces",
      currentStock: 0,
      restockThreshold: 0,
      purchaseFrequency: "On-Demand",
      costPerUnit: 0,
      lastPurchaseDate: format(new Date(), 'yyyy-MM-dd'),
      notes: "",
      restockReminderDate: "",
    });
    setIsAddDialogOpen(true);
  };

  const lowStockItems = getLowStockItems();
  const sortedSupplies = getSortedItems();

  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-tree-purple flex items-center gap-2">
        <Package className="h-8 w-8" />
        Business Supplies Tracker
      </h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-tree-purple/10 to-purple-900/5 border border-tree-purple/20 shadow-md hover:shadow-lg transition-all hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-tree-purple" />
              Total Supply Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalItems}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-900/5 border border-green-500/20 shadow-md hover:shadow-lg transition-all hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-tree-green" />
              Estimated Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${stats.totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-900/5 border border-yellow-500/20 shadow-md hover:shadow-lg transition-all hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.lowStockItems}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-900/5 border border-blue-500/20 shadow-md hover:shadow-lg transition-all hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              Most Expensive
            </CardTitle>
          </CardHeader>
          <CardContent className="truncate">
            <p className="text-xl font-bold truncate">{stats.mostExpensiveItem}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Alert className="bg-red-500/10 border border-red-500 text-red-500 animate-bounce-subtle">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            ⚠️ {lowStockItems.length} {lowStockItems.length === 1 ? 'item' : 'items'} running low: {lowStockItems.join(', ')}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Add New Item Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Supply Inventory</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={openAddDialog}
              className="bg-tree-purple hover:bg-tree-purple/90 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Supply
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Supply Item</DialogTitle>
              <DialogDescription>
                Add a new supply item to track in your inventory.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Small Glass Jars" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {categoryOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="startingStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Stock</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="unitType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Type</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {unitTypeOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Stock</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="restockThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restock Threshold</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="purchaseFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Frequency</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {purchaseFrequencyOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="costPerUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Per Unit ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lastPurchaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Purchase Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="restockReminderDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restock Reminder Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any notes about this item..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" className="w-full md:w-auto">Add Supply Item</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Supply Items Table */}
      <div className="rounded-md border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead onClick={() => requestSort('name')} className="cursor-pointer hover:bg-muted">
                Name <ArrowUpDown className="h-3 w-3 inline ml-1" />
              </TableHead>
              <TableHead onClick={() => requestSort('category')} className="cursor-pointer hover:bg-muted">
                Category <ArrowUpDown className="h-3 w-3 inline ml-1" />
              </TableHead>
              <TableHead className="hidden md:table-cell">Stock Level</TableHead>
              <TableHead onClick={() => requestSort('currentStock')} className="cursor-pointer hover:bg-muted text-right">
                Current <ArrowUpDown className="h-3 w-3 inline ml-1" />
              </TableHead>
              <TableHead className="hidden md:table-cell text-right">Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSupplies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No supply items yet. Add your first item to start tracking.
                </TableCell>
              </TableRow>
            ) : (
              sortedSupplies.map((item) => {
                const stockLevel = calculateStockLevel(item.currentStock, item.startingStock);
                const stockLevelColor = getStockLevelColor(stockLevel);
                const isLowStock = item.currentStock <= item.restockThreshold;
                
                return (
                  <TableRow 
                    key={item.id} 
                    className={`${isLowStock ? 'bg-red-500/5' : ''} hover:bg-muted/50 transition-colors`}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCategoryEmoji(item.category)}</span>
                        <span>{item.name}</span>
                        {isLowStock && (
                          <Badge variant="destructive" className="ml-2 animate-pulse-subtle">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="w-full">
                        <Progress 
                          value={stockLevel} 
                          className={`h-2 ${stockLevelColor}`}
                        />
                        <div className="text-xs mt-1 text-muted-foreground">{stockLevel}%</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.currentStock} {item.unitType}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">
                      ${(item.currentStock * item.costPerUnit).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openRestockDialog(item)}
                          title="Restock"
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {item.name} from your supplies inventory.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Supply Item</DialogTitle>
            <DialogDescription>
              Update the details of your supply item.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditItem)} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Small Glass Jars" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="startingStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Stock</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="unitType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Type</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          {unitTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stock</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="restockThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restock Threshold</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="purchaseFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Frequency</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          {purchaseFrequencyOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="costPerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Per Unit ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastPurchaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Purchase Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="restockReminderDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restock Reminder Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any notes about this item..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restock {currentItem?.name}</DialogTitle>
            <DialogDescription>
              Add more inventory to your supply and record the expense.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <p className="text-sm">Current Stock: {currentItem?.currentStock} {currentItem?.unitType}</p>
              <p className="text-sm">Threshold: {currentItem?.restockThreshold} {currentItem?.unitType}</p>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right col-span-1">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={restockAmount}
                onChange={(e) => setRestockAmount(parseInt(e.target.value))}
                min={1}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">
                Cost
              </Label>
              <div className="col-span-3">
                <p className="text-sm">
                  ${(restockAmount * (currentItem?.costPerUnit || 0)).toFixed(2)}
                  <span className="text-xs text-muted-foreground ml-2">
                    ({currentItem?.costPerUnit?.toFixed(2)} per unit)
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestock}>
              <Truck className="h-4 w-4 mr-2" />
              Complete Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessSupplies;
