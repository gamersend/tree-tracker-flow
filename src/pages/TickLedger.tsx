
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, Clock, DollarSign, Edit, Search, Trash2, AlertTriangle, CheckCircle, Clock4, Ghost, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define our tick item schema
const tickItemSchema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required" }),
  product: z.string().min(1, { message: "Product name is required" }),
  dateGiven: z.date(),
  amountOwed: z.number().min(0, { message: "Amount owed must be a positive number" }),
  amountPaid: z.number().min(0, { message: "Amount paid must be a positive number" }).default(0),
  gramsFronted: z.number().min(0, { message: "Grams must be a positive number" }).optional(),
  paymentDueDate: z.date().optional(),
  notes: z.string().optional(),
  status: z.enum(["unpaid", "partial", "paid"]),
  recurring: z.boolean().default(false),
});

// Define our tick item type
type TickItem = {
  id: string;
  customerName: string;
  product: string;
  dateGiven: Date;
  amountOwed: number;
  amountPaid: number;
  gramsFronted?: number;
  paymentDueDate?: Date;
  notes?: string;
  status: "unpaid" | "partial" | "paid";
  recurring: boolean;
  linkedSaleId?: string;
};

// Define our payment schema
const paymentSchema = z.object({
  amount: z.number().min(0.01, { message: "Payment amount must be greater than 0" }),
  date: z.date(),
  notes: z.string().optional(),
});

// Helper function to get mock customers for initial testing
const getMockCustomers = () => {
  return [
    { id: "cust-1", name: "Greg the Ghost", reliability: "low" },
    { id: "cust-2", name: "Jane Smith", reliability: "high" },
    { id: "cust-3", name: "Bob Jones", reliability: "medium" },
    { id: "cust-4", name: "Lisa Green", reliability: "high" },
  ];
};

// Helper function to get mock products for initial testing
const getMockProducts = () => {
  return [
    "Purple Haze",
    "OG Kush",
    "Blue Dream",
    "Sour Diesel",
    "Girl Scout Cookies",
  ];
};

// Helper function to get mock tick items for initial testing
const getMockTickItems = (): TickItem[] => {
  return [
    {
      id: "tick-1",
      customerName: "Greg the Ghost",
      product: "Purple Haze",
      dateGiven: new Date(2023, 4, 15),
      amountOwed: 150,
      amountPaid: 50,
      gramsFronted: 7,
      paymentDueDate: new Date(2023, 4, 22),
      notes: "Says he'll pay next week",
      status: "partial",
      recurring: true,
    },
    {
      id: "tick-2",
      customerName: "Jane Smith",
      product: "OG Kush",
      dateGiven: new Date(2023, 4, 18),
      amountOwed: 60,
      amountPaid: 60,
      gramsFronted: 3.5,
      status: "paid",
      recurring: false,
    },
    {
      id: "tick-3",
      customerName: "Bob Jones",
      product: "Blue Dream",
      dateGiven: new Date(2023, 4, 10),
      amountOwed: 120,
      amountPaid: 0,
      gramsFronted: 7,
      paymentDueDate: new Date(2023, 4, 17),
      notes: "First time tick",
      status: "unpaid",
      recurring: false,
    },
  ];
};

const TickLedger = () => {
  // State
  const [tickItems, setTickItems] = useState<TickItem[]>([]);
  const [customers, setCustomers] = useState<{ id: string; name: string; reliability: string }[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [currentTickItem, setCurrentTickItem] = useState<TickItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dateGiven");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Initialize add tick form
  const addTickForm = useForm<z.infer<typeof tickItemSchema>>({
    resolver: zodResolver(tickItemSchema),
    defaultValues: {
      customerName: "",
      product: "",
      dateGiven: new Date(),
      amountOwed: 0,
      amountPaid: 0,
      status: "unpaid",
      recurring: false,
    },
  });

  // Initialize edit tick form
  const editTickForm = useForm<z.infer<typeof tickItemSchema>>({
    resolver: zodResolver(tickItemSchema),
    defaultValues: {
      customerName: "",
      product: "",
      dateGiven: new Date(),
      amountOwed: 0,
      amountPaid: 0,
      status: "unpaid",
      recurring: false,
    },
  });

  // Initialize payment form
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      notes: "",
    },
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load tick items
    const savedTickItems = localStorage.getItem("tickItems");
    if (savedTickItems) {
      try {
        const parsedItems = JSON.parse(savedTickItems);
        // Convert string dates back to Date objects
        const items = parsedItems.map((item: any) => ({
          ...item,
          dateGiven: new Date(item.dateGiven),
          paymentDueDate: item.paymentDueDate ? new Date(item.paymentDueDate) : undefined,
        }));
        setTickItems(items);
      } catch (error) {
        console.error("Error parsing tick items from localStorage:", error);
        setTickItems(getMockTickItems());
      }
    } else {
      // Use mock data for initial testing
      setTickItems(getMockTickItems());
    }

    // Load customers (in a real app, this would be from your customer database)
    const savedCustomers = localStorage.getItem("customers");
    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch (error) {
        console.error("Error parsing customers from localStorage:", error);
        setCustomers(getMockCustomers());
      }
    } else {
      setCustomers(getMockCustomers());
    }

    // Load products (in a real app, this would be from your inventory)
    const savedProducts = localStorage.getItem("inventory");
    if (savedProducts) {
      try {
        const inventory = JSON.parse(savedProducts);
        const productNames = inventory.map((item: any) => item.strain);
        setProducts(productNames);
      } catch (error) {
        console.error("Error parsing products from localStorage:", error);
        setProducts(getMockProducts());
      }
    } else {
      setProducts(getMockProducts());
    }
  }, []);

  // Save tick items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tickItems", JSON.stringify(tickItems));
  }, [tickItems]);

  // Handle adding a new tick item
  const handleAddTickItem = (data: z.infer<typeof tickItemSchema>) => {
    const newTickItem: TickItem = {
      id: `tick-${Date.now()}`,
      customerName: data.customerName,
      product: data.product,
      dateGiven: data.dateGiven,
      amountOwed: data.amountOwed,
      amountPaid: data.amountPaid,
      gramsFronted: data.gramsFronted,
      paymentDueDate: data.paymentDueDate,
      notes: data.notes,
      status: data.amountPaid >= data.amountOwed ? "paid" : data.amountPaid > 0 ? "partial" : "unpaid",
      recurring: data.recurring,
    };

    setTickItems((prev) => [...prev, newTickItem]);
    setIsAddDialogOpen(false);
    addTickForm.reset();
    toast.success("Tick entry added successfully");
  };

  // Handle editing a tick item
  const handleEditTickItem = (data: z.infer<typeof tickItemSchema>) => {
    if (!currentTickItem) return;

    setTickItems((prev) =>
      prev.map((item) =>
        item.id === currentTickItem.id
          ? {
              ...item,
              customerName: data.customerName,
              product: data.product,
              dateGiven: data.dateGiven,
              amountOwed: data.amountOwed,
              amountPaid: data.amountPaid,
              gramsFronted: data.gramsFronted,
              paymentDueDate: data.paymentDueDate,
              notes: data.notes,
              status: data.amountPaid >= data.amountOwed ? "paid" : data.amountPaid > 0 ? "partial" : "unpaid",
              recurring: data.recurring,
            }
          : item
      )
    );

    setIsEditDialogOpen(false);
    setCurrentTickItem(null);
    editTickForm.reset();
    toast.success("Tick entry updated successfully");
  };

  // Handle deleting a tick item
  const handleDeleteTickItem = (id: string) => {
    setTickItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Tick entry deleted successfully");
  };

  // Handle recording a payment
  const handleRecordPayment = (data: z.infer<typeof paymentSchema>) => {
    if (!currentTickItem) return;

    const newAmountPaid = currentTickItem.amountPaid + data.amount;
    const newStatus = newAmountPaid >= currentTickItem.amountOwed ? "paid" : "partial";

    setTickItems((prev) =>
      prev.map((item) =>
        item.id === currentTickItem.id
          ? {
              ...item,
              amountPaid: newAmountPaid,
              status: newStatus,
              notes: data.notes 
                ? `${item.notes ? item.notes + ' | ' : ''}Payment of $${data.amount} on ${format(data.date, 'MM/dd/yyyy')}: ${data.notes}`
                : `${item.notes ? item.notes + ' | ' : ''}Payment of $${data.amount} on ${format(data.date, 'MM/dd/yyyy')}`
            }
          : item
      )
    );

    setIsPaymentDialogOpen(false);
    setCurrentTickItem(null);
    paymentForm.reset();
    toast.success(`Payment of $${data.amount.toFixed(2)} recorded successfully`);
  };

  // Handle marking a tick item as fully paid
  const handleMarkAsPaid = (id: string) => {
    setTickItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              amountPaid: item.amountOwed,
              status: "paid",
              notes: `${item.notes ? item.notes + ' | ' : ''}Marked as fully paid on ${format(new Date(), 'MM/dd/yyyy')}`
            }
          : item
      )
    );
    toast.success("Tick entry marked as fully paid");
  };

  // Handle forgiving a debt
  const handleForgiveDebt = (id: string) => {
    setTickItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "paid",
              notes: `${item.notes ? item.notes + ' | ' : ''}Debt forgiven on ${format(new Date(), 'MM/dd/yyyy')}`
            }
          : item
      )
    );
    toast.success("Debt forgiven and marked as paid");
  };

  // Function to calculate total unpaid debt
  const calculateTotalUnpaidDebt = () => {
    return tickItems.reduce((total, item) => {
      if (item.status !== "paid") {
        return total + (item.amountOwed - item.amountPaid);
      }
      return total;
    }, 0);
  };

  // Function to count overdue debts
  const countOverdueDebts = () => {
    const today = new Date();
    return tickItems.filter((item) => {
      return (
        item.status !== "paid" &&
        item.paymentDueDate &&
        new Date(item.paymentDueDate) < today
      );
    }).length;
  };

  // Function to prepare tick item for editing
  const prepareForEdit = (item: TickItem) => {
    setCurrentTickItem(item);
    editTickForm.reset({
      customerName: item.customerName,
      product: item.product,
      dateGiven: item.dateGiven,
      amountOwed: item.amountOwed,
      amountPaid: item.amountPaid,
      gramsFronted: item.gramsFronted,
      paymentDueDate: item.paymentDueDate,
      notes: item.notes,
      status: item.status,
      recurring: item.recurring,
    });
    setIsEditDialogOpen(true);
  };

  // Function to prepare for payment
  const prepareForPayment = (item: TickItem) => {
    setCurrentTickItem(item);
    const remainingAmount = item.amountOwed - item.amountPaid;
    paymentForm.reset({
      amount: remainingAmount > 0 ? remainingAmount : 0,
      date: new Date(),
      notes: "",
    });
    setIsPaymentDialogOpen(true);
  };

  // Function to get status icon and color
  const getStatusInfo = (status: string, dueDate?: Date) => {
    const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== "paid";

    if (isOverdue) {
      return {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        badge: <Badge variant="destructive" className="animate-pulse">Overdue</Badge>,
        color: "text-red-500",
        bgColor: "bg-red-100 dark:bg-red-900/20",
      };
    }

    switch (status) {
      case "paid":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          badge: <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Paid</Badge>,
          color: "text-green-500",
          bgColor: "bg-green-100 dark:bg-green-900/20",
        };
      case "partial":
        return {
          icon: <Clock4 className="h-5 w-5 text-yellow-500" />,
          badge: <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">Partial</Badge>,
          color: "text-yellow-500",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
        };
      case "unpaid":
        return {
          icon: <DollarSign className="h-5 w-5 text-blue-500" />,
          badge: <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">Unpaid</Badge>,
          color: "text-blue-500",
          bgColor: "bg-blue-100 dark:bg-blue-900/20",
        };
      default:
        return {
          icon: <DollarSign className="h-5 w-5 text-gray-500" />,
          badge: <Badge variant="outline">Unknown</Badge>,
          color: "text-gray-500",
          bgColor: "bg-gray-100 dark:bg-gray-800",
        };
    }
  };

  // Function to get customer reliability badge
  const getReliabilityBadge = (customerName: string) => {
    const customer = customers.find((c) => c.name === customerName);
    
    if (!customer) return null;
    
    switch (customer.reliability) {
      case "high":
        return <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Reliable</Badge>;
      case "medium":
        return <Badge className="ml-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">Sometimes Late</Badge>;
      case "low":
        return <Badge className="ml-2 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">Unreliable</Badge>;
      default:
        return null;
    }
  };

  // Filter and sort tick items
  const filteredAndSortedTickItems = tickItems
    .filter((item) => {
      // Apply search filter
      const matchesSearch = 
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply status filter
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "overdue" && item.paymentDueDate && new Date(item.paymentDueDate) < new Date() && item.status !== "paid") ||
        item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      let comparison = 0;
      
      switch (sortBy) {
        case "customerName":
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        case "product":
          comparison = a.product.localeCompare(b.product);
          break;
        case "dateGiven":
          comparison = new Date(a.dateGiven).getTime() - new Date(b.dateGiven).getTime();
          break;
        case "amountOwed":
          comparison = a.amountOwed - b.amountOwed;
          break;
        case "amountPaid":
          comparison = a.amountPaid - b.amountPaid;
          break;
        case "paymentDueDate":
          if (a.paymentDueDate && b.paymentDueDate) {
            comparison = new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime();
          } else if (a.paymentDueDate) {
            comparison = -1;
          } else if (b.paymentDueDate) {
            comparison = 1;
          }
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Helper function to handle sort toggle
  const handleSortToggle = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Tick & Debt Ledger</h1>
          <p className="text-gray-400">Track fronted sales, debts, and payments</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={() => {
              addTickForm.reset({
                customerName: "",
                product: "",
                dateGiven: new Date(),
                amountOwed: 0,
                amountPaid: 0,
                status: "unpaid",
                recurring: false,
              });
              setIsAddDialogOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Add New Tick
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      {(calculateTotalUnpaidDebt() > 0 || countOverdueDebts() > 0) && (
        <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-orange-600/10">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                <div>
                  {calculateTotalUnpaidDebt() > 0 && (
                    <p className="text-orange-500 font-semibold">
                      You have ${calculateTotalUnpaidDebt().toFixed(2)} in unpaid ticks
                    </p>
                  )}
                  {countOverdueDebts() > 0 && (
                    <p className="text-orange-500">
                      <Ghost className="h-4 w-4 inline mr-1" />
                      {countOverdueDebts()} overdue {countOverdueDebts() === 1 ? "debt" : "debts"} past due date
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-500">
                Send Reminders
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold">${calculateTotalUnpaidDebt().toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {tickItems.filter(item => item.status !== "paid").length} active ticks
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Overdue Ticks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold">{countOverdueDebts()}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {countOverdueDebts() > 0 ? "Attention needed" : "All ticks are current"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Paid This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">
                ${tickItems
                  .filter(item => item.status === "paid" && 
                    new Date(item.dateGiven).getMonth() === new Date().getMonth() &&
                    new Date(item.dateGiven).getFullYear() === new Date().getFullYear())
                  .reduce((sum, item) => sum + item.amountOwed, 0)
                  .toFixed(2)
                }
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {tickItems.filter(item => 
                item.status === "paid" && 
                new Date(item.dateGiven).getMonth() === new Date().getMonth() &&
                new Date(item.dateGiven).getFullYear() === new Date().getFullYear()
              ).length} settled ticks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search customer, product, or notes..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tick Ledger Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tick Ledger</CardTitle>
          <CardDescription>
            Track all customer debts and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSortToggle("customerName")}
                  >
                    Customer 
                    {sortBy === "customerName" && (
                      sortDirection === "asc" ? " ↑" : " ↓"
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSortToggle("product")}
                  >
                    Product/Strain
                    {sortBy === "product" && (
                      sortDirection === "asc" ? " ↑" : " ↓"
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSortToggle("dateGiven")}
                  >
                    Date Given
                    {sortBy === "dateGiven" && (
                      sortDirection === "asc" ? " ↑" : " ↓"
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary text-right"
                    onClick={() => handleSortToggle("amountOwed")}
                  >
                    Amount Owed
                    {sortBy === "amountOwed" && (
                      sortDirection === "asc" ? " ↑" : " ↓"
                    )}
                  </TableHead>
                  <TableHead className="text-right">Payment Progress</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSortToggle("paymentDueDate")}
                  >
                    Due Date
                    {sortBy === "paymentDueDate" && (
                      sortDirection === "asc" ? " ↑" : " ↓"
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSortToggle("status")}
                  >
                    Status
                    {sortBy === "status" && (
                      sortDirection === "asc" ? " ↑" : " ↓"
                    )}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTickItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No tick records found.
                      {searchQuery || statusFilter !== "all" ? (
                        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                      ) : (
                        <p className="text-sm mt-1">Add your first tick entry to get started.</p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedTickItems.map((item) => {
                    const statusInfo = getStatusInfo(item.status, item.paymentDueDate);
                    const isOverdue = item.paymentDueDate && new Date(item.paymentDueDate) < new Date() && item.status !== "paid";
                    const paymentPercentage = item.amountOwed > 0 ? Math.min(Math.round((item.amountPaid / item.amountOwed) * 100), 100) : 0;
                    
                    return (
                      <TableRow 
                        key={item.id}
                        className={`
                          ${isOverdue ? 'animate-pulse' : ''} 
                          ${statusInfo.bgColor}
                        `}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {item.customerName}
                            {getReliabilityBadge(item.customerName)}
                            {item.recurring && (
                              <Badge variant="outline" className="ml-2">
                                <Zap className="h-3 w-3 mr-1" />
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.product}</TableCell>
                        <TableCell>{format(new Date(item.dateGiven), "MMM dd, yyyy")}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.amountOwed.toFixed(2)}
                          {item.gramsFronted && (
                            <div className="text-xs text-gray-500">
                              {item.gramsFronted}g
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-end">
                            <div className="w-full max-w-[100px]">
                              <Progress
                                value={paymentPercentage}
                                className={`h-2 ${
                                  paymentPercentage >= 100
                                    ? "bg-green-200 dark:bg-green-950"
                                    : paymentPercentage >= 50
                                    ? "bg-yellow-200 dark:bg-yellow-950"
                                    : "bg-red-200 dark:bg-red-950"
                                }`}
                              />
                            </div>
                            <div className="text-xs mt-1">
                              ${item.amountPaid.toFixed(2)} of ${item.amountOwed.toFixed(2)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.paymentDueDate
                            ? format(new Date(item.paymentDueDate), "MMM dd, yyyy")
                            : "Not set"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {statusInfo.icon}
                            <span className="ml-2">{statusInfo.badge}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {item.status !== "paid" && (
                                <>
                                  <DropdownMenuItem onClick={() => prepareForPayment(item)}>
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Log Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleMarkAsPaid(item.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as Paid
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleForgiveDebt(item.id)}>
                                    <Ghost className="h-4 w-4 mr-2" />
                                    Forgive Debt
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem onClick={() => prepareForEdit(item)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTickItem(item.id)}
                                className="text-red-500 focus:text-red-500"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Tick Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Tick</DialogTitle>
            <DialogDescription>
              Record a new debt or fronted sale
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addTickForm}>
            <form onSubmit={addTickForm.handleSubmit(handleAddTickItem)} className="space-y-4">
              <FormField
                control={addTickForm.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.name}>
                            {customer.name}
                            {customer.reliability === "low" && <Ghost className="h-3 w-3 ml-2 inline" />}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addTickForm.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Strain</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product} value={product}>
                            {product}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={addTickForm.control}
                  name="dateGiven"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Given</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addTickForm.control}
                  name="paymentDueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Payment Due Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={addTickForm.control}
                  name="amountOwed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Owed ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addTickForm.control}
                  name="amountPaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Paid So Far ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={addTickForm.control}
                name="gramsFronted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grams Fronted (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="e.g. 3.5"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addTickForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addTickForm.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Recurring Tick</FormLabel>
                      <FormDescription>
                        This customer ticks regularly
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Tick</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Tick Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Tick</DialogTitle>
            <DialogDescription>
              Update tick details
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editTickForm}>
            <form onSubmit={editTickForm.handleSubmit(handleEditTickItem)} className="space-y-4">
              <FormField
                control={editTickForm.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.name}>
                            {customer.name}
                            {customer.reliability === "low" && <Ghost className="h-3 w-3 ml-2 inline" />}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editTickForm.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Strain</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product} value={product}>
                            {product}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editTickForm.control}
                  name="dateGiven"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Given</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editTickForm.control}
                  name="paymentDueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Payment Due Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editTickForm.control}
                  name="amountOwed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Owed ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editTickForm.control}
                  name="amountPaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Paid So Far ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editTickForm.control}
                name="gramsFronted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grams Fronted (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="e.g. 3.5"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editTickForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editTickForm.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Recurring Tick</FormLabel>
                      <FormDescription>
                        This customer ticks regularly
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Tick</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              {currentTickItem && (
                <>
                  For {currentTickItem.customerName} - {currentTickItem.product}
                  <p className="mt-1">
                    ${currentTickItem.amountPaid.toFixed(2)} paid of ${currentTickItem.amountOwed.toFixed(2)} owed
                  </p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handleRecordPayment)} className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={paymentForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Payment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={paymentForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any payment details"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Payment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TickLedger;
