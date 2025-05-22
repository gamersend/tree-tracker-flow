
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, Plus, ArrowUpDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Type for sales item
type SaleItem = {
  id: string;
  strain: string;
  date: Date;
  quantity: number;
  customer: string;
  salePrice: number;
  costPerGram: number;
  profit: number;
};

// Mock data
const mockSales: SaleItem[] = [
  {
    id: "sale1",
    strain: "OG Kush",
    date: new Date(2023, 5, 15),
    quantity: 14,
    customer: "John Doe",
    salePrice: 140,
    costPerGram: 5,
    profit: 70,
  },
  {
    id: "sale2",
    strain: "Blue Dream",
    date: new Date(2023, 5, 18),
    quantity: 7,
    customer: "Jane Smith",
    salePrice: 70,
    costPerGram: 5,
    profit: 35,
  },
  {
    id: "sale3",
    strain: "Sour Diesel",
    date: new Date(2023, 5, 20),
    quantity: 28,
    customer: "Alex Johnson",
    salePrice: 252,
    costPerGram: 4,
    profit: 140,
  },
  {
    id: "sale4",
    strain: "Purple Haze",
    date: new Date(2023, 5, 22),
    quantity: 3.5,
    customer: "Sam Williams",
    salePrice: 35,
    costPerGram: 6,
    profit: 14,
  },
];

// Mock inventory data for strain selection
const availableStrains = [
  { name: "OG Kush", costPerGram: 5 },
  { name: "Blue Dream", costPerGram: 5 },
  { name: "Sour Diesel", costPerGram: 4 },
  { name: "Purple Haze", costPerGram: 6 },
  { name: "White Widow", costPerGram: 5.5 },
];

// Mock customer data
const existingCustomers = [
  "John Doe",
  "Jane Smith", 
  "Alex Johnson",
  "Sam Williams"
];

const Sales = () => {
  const [sales, setSales] = useState<SaleItem[]>(mockSales);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof SaleItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // New sale form state
  const [selectedStrain, setSelectedStrain] = useState("");
  const [saleDate, setSaleDate] = useState<Date | undefined>(new Date());
  const [quantity, setQuantity] = useState("");
  const [customer, setCustomer] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerInput, setCustomerInput] = useState("");
  
  // Sort function
  const handleSort = (column: keyof SaleItem) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  // Sort and filter sales
  const sortedAndFilteredSales = [...sales]
    .filter(sale => 
      sale.strain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortColumn) return 0;
      
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc" 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  
  // Handle form submission
  const handleAddSale = () => {
    if (!selectedStrain || !saleDate || !quantity || !customer || !salePrice) {
      alert("Please fill in all required fields");
      return;
    }
    
    const selectedStrainInfo = availableStrains.find(strain => strain.name === selectedStrain);
    if (!selectedStrainInfo) {
      alert("Invalid strain selected");
      return;
    }
    
    const quantityValue = parseFloat(quantity);
    const salePriceValue = parseFloat(salePrice);
    const costPerGram = selectedStrainInfo.costPerGram;
    const profit = salePriceValue - (quantityValue * costPerGram);
    
    const newSale: SaleItem = {
      id: `sale${Date.now()}`,
      strain: selectedStrain,
      date: saleDate,
      quantity: quantityValue,
      customer: customer,
      salePrice: salePriceValue,
      costPerGram,
      profit,
    };
    
    setSales([...sales, newSale]);
    
    // Reset form
    setSelectedStrain("");
    setSaleDate(new Date());
    setQuantity("");
    setCustomer("");
    setSalePrice("");
    setIsDialogOpen(false);
  };
  
  // Handle sale deletion
  const handleDeleteSale = (id: string) => {
    setSales(sales.filter(sale => sale.id !== id));
  };
  
  // Handle customer selection or creation
  const handleCustomerSelect = (value: string) => {
    setCustomer(value);
    setCustomerInput(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sales Logging</h1>
          <p className="text-gray-400">Track your cannabis sales and profits</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sales..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" /> Add Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Sale</DialogTitle>
                <DialogDescription>
                  Record a new sale transaction
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="strain">Strain</Label>
                  <Select value={selectedStrain} onValueChange={setSelectedStrain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select strain" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStrains.map(strain => (
                        <SelectItem key={strain.name} value={strain.name}>
                          {strain.name} (${strain.costPerGram}/g)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Sale Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !saleDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {saleDate ? format(saleDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={saleDate}
                        onSelect={setSaleDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity (grams)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g., 3.5"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="customer">Customer</Label>
                  <div className="relative">
                    <Input
                      id="customer"
                      value={customerInput}
                      onChange={(e) => setCustomerInput(e.target.value)}
                      placeholder="Select or create customer"
                      list="customer-options"
                      onBlur={() => setCustomer(customerInput)}
                    />
                    <datalist id="customer-options">
                      {existingCustomers.map(c => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    <Select onValueChange={handleCustomerSelect}>
                      <SelectTrigger className="absolute right-0 top-0 w-10 rounded-l-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {existingCustomers.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="price">Sale Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="e.g., 35"
                  />
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 mt-2">
                  <h3 className="font-medium mb-2">Sale Preview</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-400">Cost:</div>
                    <div>
                      {selectedStrain && quantity
                        ? `$${(parseFloat(quantity) * availableStrains.find(s => s.name === selectedStrain)?.costPerGram || 0).toFixed(2)}`
                        : "$0.00"}
                    </div>
                    <div className="text-gray-400">Sale Price:</div>
                    <div>${salePrice || "0.00"}</div>
                    <div className="text-gray-400">Profit:</div>
                    <div className="font-medium text-tree-green">
                      {selectedStrain && quantity && salePrice
                        ? `$${(parseFloat(salePrice) - (parseFloat(quantity) * (availableStrains.find(s => s.name === selectedStrain)?.costPerGram || 0))).toFixed(2)}`
                        : "$0.00"}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSale}>Add Sale</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
          <CardDescription>
            View and manage all your sales records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto font-medium"
                    onClick={() => handleSort("strain")}
                  >
                    Strain
                    {sortColumn === "strain" && (
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto font-medium"
                    onClick={() => handleSort("date")}
                  >
                    Date
                    {sortColumn === "date" && (
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto font-medium"
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity (g)
                    {sortColumn === "quantity" && (
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto font-medium"
                    onClick={() => handleSort("customer")}
                  >
                    Customer
                    {sortColumn === "customer" && (
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto font-medium"
                    onClick={() => handleSort("salePrice")}
                  >
                    Sale ($)
                    {sortColumn === "salePrice" && (
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Cost ($)</TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto font-medium"
                    onClick={() => handleSort("profit")}
                  >
                    Profit ($)
                    {sortColumn === "profit" && (
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredSales.length > 0 ? (
                sortedAndFilteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.strain}</TableCell>
                    <TableCell>{format(sale.date, "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">{sale.quantity}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell className="text-right">${sale.salePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(sale.quantity * sale.costPerGram).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium text-tree-green">${sale.profit.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSale(sale.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    {searchQuery 
                      ? "No sales match your search"
                      : "No sales recorded yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Total Sales</h3>
              <p className="text-2xl font-bold mt-1">{sales.length}</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Total Quantity</h3>
              <p className="text-2xl font-bold mt-1">
                {sales.reduce((sum, sale) => sum + sale.quantity, 0).toFixed(1)}g
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Total Revenue</h3>
              <p className="text-2xl font-bold mt-1">
                ${sales.reduce((sum, sale) => sum + sale.salePrice, 0).toFixed(2)}
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Total Profit</h3>
              <p className="text-2xl font-bold mt-1 text-tree-green">
                ${sales.reduce((sum, sale) => sum + sale.profit, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
