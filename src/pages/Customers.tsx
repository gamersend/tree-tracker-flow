import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { 
  Search, 
  Plus, 
  Edit, 
  User, 
  Star, 
  Check, 
  Trash2, 
  PhoneCall, 
  Mail, 
  MessageSquare,
  Filter,
  ArrowDownAZ,
  ArrowUpAZ,
  Award,
  PieChart,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Type for customer
type Customer = {
  id: string;
  name: string;
  platform: string;
  alias: string;
  notes: string;
  trustedBuyer: boolean;
  totalOrders: number;
  totalSpent: number;
  totalProfit: number;
  lastPurchase?: Date;
  emoji?: string;
};

// Type for purchase history
type Purchase = {
  id: string;
  customerId: string;
  date: Date;
  strain: string;
  quantity: number;
  amount: number;
  profit: number;
  rating?: number;
};

// Assign random emojis to customers
const customerEmojis = [
  "🌿", "🍁", "🌱", "🌲", "🔥", "💨", "🌴", "🌳", "🌺", "🌻", 
  "🌼", "🌹", "🌸", "🍄", "🍃", "🌵", "🌾", "⭐", "🌟", "✨"
];

// Mock data with added emojis and last purchase dates
const mockCustomers: Customer[] = [
  {
    id: "cust1",
    name: "John Doe",
    platform: "Signal",
    alias: "johnny_green",
    notes: "Prefers indicas, usually buys in bulk.",
    trustedBuyer: true,
    totalOrders: 8,
    totalSpent: 740,
    totalProfit: 320,
    lastPurchase: new Date(2023, 5, 15),
    emoji: "🌿",
  },
  {
    id: "cust2",
    name: "Jane Smith",
    platform: "Telegram",
    alias: "jane420",
    notes: "Always pays with exact change.",
    trustedBuyer: true,
    totalOrders: 12,
    totalSpent: 980,
    totalProfit: 430,
    lastPurchase: new Date(2023, 5, 20),
    emoji: "🔥",
  },
  {
    id: "cust3",
    name: "Alex Johnson",
    platform: "WhatsApp",
    alias: "alex_j",
    notes: "New customer, referred by Jane.",
    trustedBuyer: false,
    totalOrders: 2,
    totalSpent: 180,
    totalProfit: 70,
    lastPurchase: new Date(2023, 5, 18),
    emoji: "🌱",
  },
  {
    id: "cust4",
    name: "Sam Williams",
    platform: "Signal",
    alias: "sammy",
    notes: "",
    trustedBuyer: false,
    totalOrders: 5,
    totalSpent: 390,
    totalProfit: 160,
    lastPurchase: new Date(2023, 5, 10),
    emoji: "🍁",
  },
];

// Mock purchase history with ratings
const mockPurchases: Purchase[] = [
  {
    id: "pur1",
    customerId: "cust1",
    date: new Date(2023, 5, 5),
    strain: "OG Kush",
    quantity: 14,
    amount: 140,
    profit: 70,
    rating: 5,
  },
  {
    id: "pur2",
    customerId: "cust1",
    date: new Date(2023, 5, 15),
    strain: "Blue Dream",
    quantity: 7,
    amount: 70,
    profit: 35,
    rating: 4,
  },
  {
    id: "pur3",
    customerId: "cust2",
    date: new Date(2023, 5, 10),
    strain: "Sour Diesel",
    quantity: 28,
    amount: 252,
    profit: 112,
    rating: 5,
  },
  {
    id: "pur4",
    customerId: "cust3",
    date: new Date(2023, 5, 18),
    strain: "Purple Haze",
    quantity: 3.5,
    amount: 35,
    profit: 14,
    rating: 3,
  },
];

// Available platforms
const platforms = ["Signal", "Telegram", "WhatsApp", "Other"];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDetailTab, setCustomerDetailTab] = useState("info");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"name" | "spent" | "orders">("name");
  const [filterTrusted, setFilterTrusted] = useState<boolean | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    platform: "",
    alias: "",
    notes: "",
    trustedBuyer: false,
    emoji: customerEmojis[Math.floor(Math.random() * customerEmojis.length)],
  });
  
  // Sort and filter customers
  const sortAndFilterCustomers = () => {
    return customers
      .filter(customer => 
        (customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.alias.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterTrusted === null || customer.trustedBuyer === filterTrusted)
      )
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc" 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else if (sortBy === "spent") {
          return sortOrder === "asc" 
            ? a.totalSpent - b.totalSpent 
            : b.totalSpent - a.totalSpent;
        } else {
          return sortOrder === "asc" 
            ? a.totalOrders - b.totalOrders 
            : b.totalOrders - a.totalOrders;
        }
      });
  };
  
  const filteredCustomers = sortAndFilterCustomers();
  
  // Get purchases for a specific customer
  const getCustomerPurchases = (customerId: string) => {
    return purchases.filter(purchase => purchase.customerId === customerId);
  };
  
  // Handle new customer form submission
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.platform) {
      toast({
        title: "Error",
        description: "Customer name and platform are required",
        variant: "destructive",
      });
      return;
    }
    
    const newCustomerEntry: Customer = {
      id: `cust${Date.now()}`,
      name: newCustomer.name,
      platform: newCustomer.platform,
      alias: newCustomer.alias,
      notes: newCustomer.notes,
      trustedBuyer: newCustomer.trustedBuyer,
      totalOrders: 0,
      totalSpent: 0,
      totalProfit: 0,
      emoji: newCustomer.emoji,
      lastPurchase: undefined,
    };
    
    setCustomers([...customers, newCustomerEntry]);
    
    toast({
      title: "Success! 🎉",
      description: `${newCustomer.name} has been added to your customer list`,
    });
    
    // Reset form
    setNewCustomer({
      name: "",
      platform: "",
      alias: "",
      notes: "",
      trustedBuyer: false,
      emoji: customerEmojis[Math.floor(Math.random() * customerEmojis.length)],
    });
    setIsAddDialogOpen(false);
  };
  
  // Handle customer edit form submission
  const handleEditCustomer = () => {
    if (!selectedCustomer) return;
    
    setCustomers(customers.map(c => 
      c.id === selectedCustomer.id ? selectedCustomer : c
    ));
    
    toast({
      title: "Updated! ✅",
      description: `${selectedCustomer.name}'s information has been updated`,
    });
    
    setIsEditDialogOpen(false);
  };
  
  // Handle deleting a customer
  const handleDeleteCustomer = (customerId: string) => {
    setDeleteCustomerId(customerId);
    setShowConfirmDelete(true);
  };
  
  const confirmDeleteCustomer = () => {
    setCustomers(customers.filter(c => c.id !== deleteCustomerId));
    setPurchases(purchases.filter(p => p.customerId !== deleteCustomerId));
    
    if (selectedCustomer && selectedCustomer.id === deleteCustomerId) {
      setSelectedCustomer(null);
    }
    
    toast({
      title: "Deleted",
      description: "Customer has been removed from your list",
      variant: "destructive",
    });
    
    setShowConfirmDelete(false);
  };
  
  // Handle selecting a customer for viewing details
  const viewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerDetailTab("info");
  };
  
  // Handle selecting a customer for editing
  const editCustomer = (customer: Customer) => {
    setSelectedCustomer({...customer});
    setIsEditDialogOpen(true);
  };
  
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Generate random emoji for a customer
  const getRandomEmoji = () => {
    return customerEmojis[Math.floor(Math.random() * customerEmojis.length)];
  };
  
  // Random fade-in animation for list items
  useEffect(() => {
    const listItems = document.querySelectorAll('.customer-item');
    listItems.forEach((item, index) => {
      (item as HTMLElement).style.animationDelay = `${index * 0.05}s`;
    });
  }, [filteredCustomers]);
  
  return (
    <div className="space-y-6">
      {/* Header section with title and controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="bg-tree-purple text-white p-1 rounded">👥</span> Customer Address Book
          </h1>
          <p className="text-gray-400">Manage your customers and their purchase history</p>
        </div>
        
        {/* Search and filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8 w-full transition-all duration-300 focus:ring-2 focus:ring-tree-purple/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {/* Filter dropdown */}
            <div className="relative">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:bg-muted hover:text-primary transition-colors duration-200">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filter Customers</DialogTitle>
                    <DialogDescription>
                      Set criteria to filter your customer list
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Trusted Status</Label>
                      <div className="flex gap-2">
                        <Button 
                          variant={filterTrusted === null ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setFilterTrusted(null)}
                        >
                          All
                        </Button>
                        <Button 
                          variant={filterTrusted === true ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setFilterTrusted(true)}
                        >
                          <Star className="mr-1 h-3 w-3" /> Trusted
                        </Button>
                        <Button 
                          variant={filterTrusted === false ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setFilterTrusted(false)}
                        >
                          <User className="mr-1 h-3 w-3" /> Regular
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Sort By</Label>
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          variant={sortBy === "name" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setSortBy("name")}
                        >
                          Name
                        </Button>
                        <Button 
                          variant={sortBy === "spent" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setSortBy("spent")}
                        >
                          Total Spent
                        </Button>
                        <Button 
                          variant={sortBy === "orders" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setSortBy("orders")}
                        >
                          Order Count
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                          className="ml-auto"
                        >
                          {sortOrder === "asc" ? (
                            <ArrowDownAZ className="h-4 w-4" />
                          ) : (
                            <ArrowUpAZ className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setFilterTrusted(null);
                        setSortBy("name");
                        setSortOrder("asc");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Add customer button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  <Plus className="mr-2 h-4 w-4" /> Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span className="text-2xl">{newCustomer.emoji}</span> Add New Customer
                  </DialogTitle>
                  <DialogDescription>
                    Add a new customer to your address book
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex gap-2 flex-wrap justify-center mb-2">
                    {customerEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        className={`text-2xl h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${
                          newCustomer.emoji === emoji 
                            ? "bg-primary text-primary-foreground scale-110" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setNewCustomer({...newCustomer, emoji: emoji})}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      placeholder="Customer's name"
                      className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="platform">Communication Platform</Label>
                    <Select 
                      value={newCustomer.platform} 
                      onValueChange={(value) => setNewCustomer({...newCustomer, platform: value})}
                    >
                      <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="alias">Alias/Username</Label>
                    <Input
                      id="alias"
                      value={newCustomer.alias}
                      onChange={(e) => setNewCustomer({...newCustomer, alias: e.target.value})}
                      placeholder="Customer's username or alias"
                      className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                      placeholder="Any additional information..."
                      className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      id="trusted"
                      checked={newCustomer.trustedBuyer}
                      onCheckedChange={(checked) => 
                        setNewCustomer({...newCustomer, trustedBuyer: checked})
                      }
                    />
                    <Label htmlFor="trusted" className="flex items-center gap-1">
                      Trusted Buyer <Star className="h-3 w-3 text-tree-gold" />
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddCustomer}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Add Customer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

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
            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
              <div className="space-y-2">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <div 
                      key={customer.id} 
                      className={`customer-item flex items-center gap-3 p-3 rounded-md hover:bg-slate-800/80 cursor-pointer group transition-all duration-300 hover:scale-[1.02] animate-fade-in opacity-0`}
                      onClick={() => viewCustomerDetails(customer)}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${
                        customer.trustedBuyer ? "from-tree-green to-green-700" : "from-slate-600 to-slate-800"
                      } transition-transform duration-300 group-hover:rotate-12`}>
                        <span className="text-lg">{customer.emoji}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-white flex items-center gap-2">
                          {customer.name}
                          {customer.trustedBuyer && (
                            <Star className="h-3 w-3 text-tree-gold fill-tree-gold animate-pulse-subtle" />
                          )}
                        </h3>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span>{customer.platform}</span>
                          {customer.alias && (
                            <>
                              <span>•</span>
                              <span>{customer.alias}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            editCustomer(customer);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomer(customer.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground animate-fade-in">
                    {searchQuery 
                      ? "No customers match your search"
                      : "No customers added yet"}
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Customer details card */}
        <Card className="lg:col-span-2 border-slate-700/50 dashboard-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {selectedCustomer ? (
            <>
              <CardHeader className="relative">
                <div className="absolute top-0 right-0 h-32 w-32 opacity-10 pointer-events-none">
                  <span className="text-[100px] absolute top-0 right-4">{selectedCustomer.emoji}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Avatar className={`h-10 w-10 bg-gradient-to-br ${selectedCustomer.trustedBuyer ? "from-tree-green to-green-700" : "from-slate-600 to-slate-800"}`}>
                      <AvatarFallback className="text-lg">
                        {selectedCustomer.emoji}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedCustomer.name}</span>
                    {selectedCustomer.trustedBuyer && (
                      <Badge className="bg-tree-green text-white text-xs py-0.5 px-1.5 rounded-full flex items-center gap-1 animate-pulse-subtle">
                        <Star className="h-3 w-3 fill-white" />
                        Trusted
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="transition-all duration-200 hover:bg-slate-700 hover:text-white"
                      onClick={() => editCustomer(selectedCustomer)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="transition-all duration-200 hover:bg-red-900/20 hover:text-destructive"
                      onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="bg-slate-800/50 gap-1 flex items-center">
                      {selectedCustomer.platform === "Signal" && <MessageSquare className="h-3 w-3" />}
                      {selectedCustomer.platform === "Telegram" && <MessageSquare className="h-3 w-3" />}
                      {selectedCustomer.platform === "WhatsApp" && <PhoneCall className="h-3 w-3" />}
                      {selectedCustomer.platform}
                    </Badge>
                  </div>
                  {selectedCustomer.alias && (
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="bg-slate-800/50 gap-1 flex items-center">
                        <User className="h-3 w-3" />
                        {selectedCustomer.alias}
                      </Badge>
                    </div>
                  )}
                  {selectedCustomer.lastPurchase && (
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="bg-slate-800/50 gap-1 flex items-center">
                        <Calendar className="h-3 w-3" />
                        Last purchase: {format(selectedCustomer.lastPurchase, "MMM d, yyyy")}
                      </Badge>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={customerDetailTab} onValueChange={setCustomerDetailTab}>
                  <TabsList className="mb-4 w-full justify-start">
                    <TabsTrigger value="info" className="data-[state=active]:bg-tree-purple data-[state=active]:text-white transition-all duration-200">
                      Info
                    </TabsTrigger>
                    <TabsTrigger value="purchases" className="data-[state=active]:bg-tree-purple data-[state=active]:text-white transition-all duration-200">
                      Purchase History
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4 transition-transform duration-300 hover:scale-105 hover:bg-slate-800/70">
                        <h3 className="text-sm text-muted-foreground">Total Orders</h3>
                        <p className="text-2xl font-bold mt-1 flex items-center gap-2">
                          {selectedCustomer.totalOrders}
                          <span className="text-lg">📦</span>
                        </p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4 transition-transform duration-300 hover:scale-105 hover:bg-slate-800/70">
                        <h3 className="text-sm text-muted-foreground">Total Spent</h3>
                        <p className="text-2xl font-bold mt-1 flex items-center gap-2">
                          ${selectedCustomer.totalSpent}
                          <span className="text-lg">💵</span>
                        </p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4 transition-transform duration-300 hover:scale-105 hover:bg-slate-800/70">
                        <h3 className="text-sm text-muted-foreground">Total Profit</h3>
                        <p className="text-2xl font-bold mt-1 text-tree-green flex items-center gap-2">
                          ${selectedCustomer.totalProfit}
                          <span className="text-lg">💰</span>
                        </p>
                      </div>
                    </div>
                    
                    {selectedCustomer.notes && (
                      <div className="bg-slate-800/50 rounded-lg p-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                          <span className="text-lg">📝</span> Notes
                        </h3>
                        <p className="text-gray-300">{selectedCustomer.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                      <Button variant="outline" className="group transition-all duration-300 hover:bg-tree-green/10 hover:text-tree-green hover:border-tree-green">
                        <PhoneCall className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                        Call
                      </Button>
                      <Button variant="outline" className="group transition-all duration-300 hover:bg-tree-purple/10 hover:text-tree-purple hover:border-tree-purple">
                        <MessageSquare className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                        Message
                      </Button>
                      <Button variant="outline" className="group transition-all duration-300 hover:bg-tree-gold/10 hover:text-tree-gold hover:border-tree-gold">
                        <Mail className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                        Email
                      </Button>
                      <Button variant="outline" className="group transition-all duration-300 hover:bg-tree-purple/10 hover:text-tree-purple hover:border-tree-purple ml-auto">
                        <Award className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                        Reward
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="purchases" className="animate-fade-in">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">🛒</span> Purchase History
                      </h3>
                      <Button size="sm" variant="outline" className="transition-all duration-200 hover:bg-tree-purple/10 hover:text-tree-purple hover:border-tree-purple">
                        <Plus className="mr-1 h-3 w-3" /> Add Purchase
                      </Button>
                    </div>
                    
                    <div className="rounded-lg border border-slate-800 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-slate-800/50">
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Strain</TableHead>
                            <TableHead className="text-right">Amount (g)</TableHead>
                            <TableHead className="text-right">Price ($)</TableHead>
                            <TableHead className="text-right">Rating</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="bg-slate-900/30">
                          {getCustomerPurchases(selectedCustomer.id).length > 0 ? (
                            getCustomerPurchases(selectedCustomer.id).map((purchase, index) => (
                              <TableRow key={purchase.id} className="hover:bg-slate-800/50 animate-fade-in border-slate-800" style={{ animationDelay: `${index * 0.05}s` }}>
                                <TableCell>{format(purchase.date, "MMM d, yyyy")}</TableCell>
                                <TableCell className="font-medium">{purchase.strain}</TableCell>
                                <TableCell className="text-right">{purchase.quantity}g</TableCell>
                                <TableCell className="text-right">${purchase.amount.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-3.5 w-3.5 ${i < (purchase.rating || 0) ? "text-tree-gold fill-tree-gold" : "text-slate-600"}`} 
                                      />
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <span className="text-4xl">📈</span>
                                  <span>No purchase history available</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {getCustomerPurchases(selectedCustomer.id).length > 0 && (
                      <div className="mt-4 p-4 bg-slate-800/50 rounded-lg animate-fade-in" style={{ animationDelay: "0.3s" }}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium flex items-center gap-2">
                            <PieChart className="h-4 w-4" /> Purchase Analytics
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div className="p-3 bg-slate-900/50 rounded-lg">
                            <div className="text-xs text-muted-foreground">Average Order</div>
                            <div className="text-xl font-bold mt-1">
                              ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                            </div>
                          </div>
                          <div className="p-3 bg-slate-900/50 rounded-lg">
                            <div className="text-xs text-muted-foreground">Preferred Strain</div>
                            <div className="text-xl font-bold mt-1">
                              {getCustomerPurchases(selectedCustomer.id)[0]?.strain || "N/A"}
                            </div>
                          </div>
                          <div className="p-3 bg-slate-900/50 rounded-lg">
                            <div className="text-xs text-muted-foreground">Average Rating</div>
                            <div className="text-xl font-bold mt-1 flex items-center">
                              {getCustomerPurchases(selectedCustomer.id)
                                .reduce((sum, purchase) => sum + (purchase.rating || 0), 0) / 
                                getCustomerPurchases(selectedCustomer.id).length || 0}
                              <div className="ml-2 flex items-center">
                                <Star className="h-3.5 w-3.5 text-tree-gold fill-tree-gold" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-full py-24">
              <div className="text-center animate-fade-in">
                <div className="rounded-full bg-slate-800 h-24 w-24 flex items-center justify-center mx-auto mb-4 animate-pulse-subtle">
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="text-lg font-medium">Select a Customer</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  Choose a customer from the list to view details and purchase history
                </p>
                <Button 
                  className="mt-4 transition-all duration-200 hover:scale-105"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Customer
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCustomer?.emoji && <span className="text-2xl">{selectedCustomer.emoji}</span>} Edit Customer
            </DialogTitle>
            <DialogDescription>
              Update customer information
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="flex gap-2 flex-wrap justify-center mb-2">
                {customerEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    className={`text-2xl h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      selectedCustomer.emoji === emoji 
                        ? "bg-primary text-primary-foreground scale-110" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedCustomer({...selectedCustomer, emoji: emoji})}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={selectedCustomer.name}
                  onChange={(e) => setSelectedCustomer({
                    ...selectedCustomer, 
                    name: e.target.value
                  })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-platform">Communication Platform</Label>
                <Select 
                  value={selectedCustomer.platform} 
                  onValueChange={(value) => setSelectedCustomer({
                    ...selectedCustomer, 
                    platform: value
                  })}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-alias">Alias/Username</Label>
                <Input
                  id="edit-alias"
                  value={selectedCustomer.alias}
                  onChange={(e) => setSelectedCustomer({
                    ...selectedCustomer, 
                    alias: e.target.value
                  })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={selectedCustomer.notes}
                  onChange={(e) => setSelectedCustomer({
                    ...selectedCustomer, 
                    notes: e.target.value
                  })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-trusted"
                  checked={selectedCustomer.trustedBuyer}
                  onCheckedChange={(checked) => setSelectedCustomer({
                    ...selectedCustomer, 
                    trustedBuyer: checked
                  })}
                />
                <Label htmlFor="edit-trusted" className="flex items-center gap-1">
                  Trusted Buyer <Star className="h-3 w-3 text-tree-gold" />
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditCustomer}
              className="transition-all duration-200 hover:scale-105"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete Customer
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the customer and all associated purchase records.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this customer?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteCustomer}
              className="transition-all duration-200 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
