
import React, { useState } from "react";
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
import { format } from "date-fns";
import { Search, Plus, Edit, User, Star, Check } from "lucide-react";

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
};

// Mock data
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
  },
];

// Mock purchase history
const mockPurchases: Purchase[] = [
  {
    id: "pur1",
    customerId: "cust1",
    date: new Date(2023, 5, 5),
    strain: "OG Kush",
    quantity: 14,
    amount: 140,
    profit: 70,
  },
  {
    id: "pur2",
    customerId: "cust1",
    date: new Date(2023, 5, 15),
    strain: "Blue Dream",
    quantity: 7,
    amount: 70,
    profit: 35,
  },
  {
    id: "pur3",
    customerId: "cust2",
    date: new Date(2023, 5, 10),
    strain: "Sour Diesel",
    quantity: 28,
    amount: 252,
    profit: 112,
  },
  {
    id: "pur4",
    customerId: "cust3",
    date: new Date(2023, 5, 18),
    strain: "Purple Haze",
    quantity: 3.5,
    amount: 35,
    profit: 14,
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
  
  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    platform: "",
    alias: "",
    notes: "",
    trustedBuyer: false,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.alias.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get purchases for a specific customer
  const getCustomerPurchases = (customerId: string) => {
    return purchases.filter(purchase => purchase.customerId === customerId);
  };
  
  // Handle new customer form submission
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.platform) {
      alert("Customer name and platform are required");
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
    };
    
    setCustomers([...customers, newCustomerEntry]);
    
    // Reset form
    setNewCustomer({
      name: "",
      platform: "",
      alias: "",
      notes: "",
      trustedBuyer: false,
    });
    setIsAddDialogOpen(false);
  };
  
  // Handle customer edit form submission
  const handleEditCustomer = () => {
    if (!selectedCustomer) return;
    
    setCustomers(customers.map(c => 
      c.id === selectedCustomer.id ? selectedCustomer : c
    ));
    
    setIsEditDialogOpen(false);
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Address Book</h1>
          <p className="text-gray-400">Manage your customers and their purchase history</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Add a new customer to your address book
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    placeholder="Customer's name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="platform">Communication Platform</Label>
                  <Select 
                    value={newCustomer.platform} 
                    onValueChange={(value) => setNewCustomer({...newCustomer, platform: value})}
                  >
                    <SelectTrigger>
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
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                    placeholder="Any additional information..."
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
                  <Label htmlFor="trusted">Trusted Buyer</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomer}>Add Customer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>
              Your complete customer list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <div 
                    key={customer.id} 
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800 cursor-pointer group transition-colors"
                    onClick={() => viewCustomerDetails(customer)}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${
                      customer.trustedBuyer ? "from-tree-green to-green-700" : "from-slate-600 to-slate-800"
                    }`}>
                      {customer.trustedBuyer ? (
                        <Star className="h-5 w-5 text-white" />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-white">{customer.name}</h3>
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
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        editCustomer(customer);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  {searchQuery 
                    ? "No customers match your search"
                    : "No customers added yet"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          {selectedCustomer ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {selectedCustomer.name}
                    {selectedCustomer.trustedBuyer && (
                      <span className="bg-tree-green text-white text-xs py-0.5 px-1.5 rounded-full flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Trusted
                      </span>
                    )}
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => editCustomer(selectedCustomer)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
                <CardDescription>
                  {selectedCustomer.platform} • {selectedCustomer.alias}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={customerDetailTab} onValueChange={setCustomerDetailTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="purchases">Purchase History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="text-sm text-muted-foreground">Total Orders</h3>
                        <p className="text-2xl font-bold mt-1">{selectedCustomer.totalOrders}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="text-sm text-muted-foreground">Total Spent</h3>
                        <p className="text-2xl font-bold mt-1">${selectedCustomer.totalSpent}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="text-sm text-muted-foreground">Total Profit</h3>
                        <p className="text-2xl font-bold mt-1 text-tree-green">${selectedCustomer.totalProfit}</p>
                      </div>
                    </div>
                    
                    {selectedCustomer.notes && (
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-1">Notes</h3>
                        <p className="text-gray-300">{selectedCustomer.notes}</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="purchases">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Strain</TableHead>
                          <TableHead className="text-right">Amount (g)</TableHead>
                          <TableHead className="text-right">Price ($)</TableHead>
                          <TableHead className="text-right">Profit ($)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getCustomerPurchases(selectedCustomer.id).length > 0 ? (
                          getCustomerPurchases(selectedCustomer.id).map((purchase) => (
                            <TableRow key={purchase.id}>
                              <TableCell>{format(purchase.date, "MMM d, yyyy")}</TableCell>
                              <TableCell>{purchase.strain}</TableCell>
                              <TableCell className="text-right">{purchase.quantity}</TableCell>
                              <TableCell className="text-right">${purchase.amount.toFixed(2)}</TableCell>
                              <TableCell className="text-right text-tree-green">${purchase.profit.toFixed(2)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                              No purchase history available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-full py-24">
              <div className="text-center">
                <div className="rounded-full bg-slate-800 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">Select a Customer</h3>
                <p className="text-muted-foreground mt-1">
                  Choose a customer from the list to view details
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={selectedCustomer.name}
                  onChange={(e) => setSelectedCustomer({
                    ...selectedCustomer, 
                    name: e.target.value
                  })}
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
                  <SelectTrigger>
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
                <Label htmlFor="edit-trusted">Trusted Buyer</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
