
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, Plus, ArrowUpDown, Trash2, HelpCircle, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";

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
  image?: string;
};

// Type for inventory strain
type StrainInfo = {
  name: string;
  costPerGram: number;
  image?: string;
};

// Type for customer with loyalty info
type CustomerInfo = {
  name: string;
  orderCount: number;
  lastOrderDate: Date | null;
  totalSpent: number;
  loyaltyTag: "🆕 New" | "🌀 Regular" | "🔥 VIP" | "👻 Ghosted";
};

// Load from localStorage helper
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Format date safely
const formatDateSafe = (date: Date | string | null | undefined): string => {
  if (!date) return "—";
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (!isValid(dateObj)) return "Invalid Date";
    return format(dateObj, "MMM d, yyyy");
  } catch (error) {
    console.error("Date formatting error:", error, date);
    return "—";
  }
};

const Sales = () => {
  // Load initial data from localStorage or use defaults
  const [sales, setSales] = useState<SaleItem[]>(loadFromStorage('sales', []));
  const [availableStrains, setAvailableStrains] = useState<StrainInfo[]>(loadFromStorage('strains', [
    { name: "OG Kush", costPerGram: 5 },
    { name: "Blue Dream", costPerGram: 5 },
    { name: "Sour Diesel", costPerGram: 4 },
    { name: "Purple Haze", costPerGram: 6 },
    { name: "White Widow", costPerGram: 5.5 },
  ]));
  
  // Customer data with loyalty
  const [customers, setCustomers] = useState<CustomerInfo[]>(loadFromStorage('customers', []));
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof SaleItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // New sale form state
  const [selectedStrain, setSelectedStrain] = useState("");
  const [saleDate, setSaleDate] = useState<Date | undefined>(new Date());
  const [quantity, setQuantity] = useState("");
  const [quantityOption, setQuantityOption] = useState<string>("3.5");
  const [customQuantity, setCustomQuantity] = useState("");
  const [customer, setCustomer] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerInput, setCustomerInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Pricing calculator state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calcCostPerGram, setCalcCostPerGram] = useState("5.00");
  const [calcMargin, setCalcMargin] = useState(70);
  const [targetMargin, setTargetMargin] = useState(70);
  const [showSuggestion, setShowSuggestion] = useState(false);

  // Predefined quantity options
  const quantityOptions = [
    { label: "3.5g (Eighth)", value: "3.5" },
    { label: "7g (Quarter)", value: "7" },
    { label: "14g (Half)", value: "14" },
    { label: "28g (Ounce)", value: "28" },
    { label: "42g (1.5 oz)", value: "42" },
    { label: "56g (2 oz)", value: "56" },
    { label: "Custom", value: "custom" }
  ];

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('strains', JSON.stringify(availableStrains));
  }, [availableStrains]);
  
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);
  
  // Load user preference for target margin
  useEffect(() => {
    const storedMargin = localStorage.getItem('targetMargin');
    if (storedMargin) {
      setTargetMargin(parseInt(storedMargin));
    }
  }, []);
  
  // Update customer loyalty data
  useEffect(() => {
    const updateCustomerLoyalty = () => {
      const customerMap: Record<string, CustomerInfo> = {};
      
      // Initialize customer data
      customers.forEach(c => {
        customerMap[c.name] = {
          ...c,
          orderCount: 0,
          lastOrderDate: null,
          totalSpent: 0
        };
      });
      
      // Update with sales data
      sales.forEach(sale => {
        if (!customerMap[sale.customer]) {
          customerMap[sale.customer] = {
            name: sale.customer,
            orderCount: 0,
            lastOrderDate: null,
            totalSpent: 0,
            loyaltyTag: "🆕 New"
          };
        }
        
        customerMap[sale.customer].orderCount += 1;
        
        if (!customerMap[sale.customer].lastOrderDate || 
            new Date(sale.date) > new Date(customerMap[sale.customer].lastOrderDate!)) {
          customerMap[sale.customer].lastOrderDate = new Date(sale.date);
        }
        
        customerMap[sale.customer].totalSpent += sale.salePrice;
      });
      
      // Calculate loyalty tags
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      const updatedCustomers = Object.values(customerMap).map(customer => {
        // Determine loyalty tag
        if (customer.orderCount === 0) {
          customer.loyaltyTag = "🆕 New";
        } else if (customer.orderCount >= 6) {
          // Check if ghosted
          if (customer.lastOrderDate && customer.lastOrderDate < thirtyDaysAgo) {
            customer.loyaltyTag = "👻 Ghosted";
          } else {
            customer.loyaltyTag = "🔥 VIP";
          }
        } else if (customer.orderCount >= 2) {
          // Check if ghosted
          if (customer.lastOrderDate && customer.lastOrderDate < thirtyDaysAgo) {
            customer.loyaltyTag = "👻 Ghosted";
          } else {
            customer.loyaltyTag = "🌀 Regular";
          }
        } else {
          // Check if ghosted for New (1 order) customers
          if (customer.lastOrderDate && customer.lastOrderDate < thirtyDaysAgo) {
            customer.loyaltyTag = "👻 Ghosted";
          } else {
            customer.loyaltyTag = "🆕 New";
          }
        }
        
        return customer;
      });
      
      setCustomers(updatedCustomers);
    };
    
    updateCustomerLoyalty();
  }, [sales]);

  // Handle quantity option change
  useEffect(() => {
    if (quantityOption === "custom") {
      setQuantity(customQuantity);
    } else {
      setQuantity(quantityOption);
      // Update suggestion if strain is selected
      if (selectedStrain && quantityOption) {
        setShowSuggestion(true);
      }
    }
  }, [quantityOption, customQuantity, selectedStrain]);
  
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
      (sale.strain?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()) ||
      (sale.customer?.toLowerCase() || "").includes((searchQuery || "").toLowerCase())
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
  
  // Calculate suggested price range based on cost and target margin
  const calculateSuggestedPrice = (costPerGram: number, quantity: number) => {
    const totalCost = costPerGram * quantity;
    
    // Calculate minimum price (50% margin)
    const minPrice = totalCost / (1 - 0.5);
    
    // Calculate maximum price (100% margin)
    const maxPrice = totalCost * 2;
    
    // Calculate target price based on user preference
    const targetPrice = totalCost / (1 - targetMargin/100);
    
    return {
      min: minPrice,
      max: maxPrice,
      target: targetPrice
    };
  };
  
  // Get price suggestions for common weights
  const calculatePriceMatrix = (costPerGram: number, margin: number) => {
    const commonWeights = [3.5, 7, 14, 28, 56];
    const costFactor = 1 - margin/100;
    
    return commonWeights.map(weight => {
      const totalCost = costPerGram * weight;
      const suggestedPrice = totalCost / costFactor;
      return {
        weight,
        totalCost,
        price: suggestedPrice,
        pricePerGram: suggestedPrice / weight
      };
    });
  };
  
  // Handle form submission
  const handleAddSale = () => {
    if (!selectedStrain || !saleDate || !quantity || !customer || !salePrice) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const selectedStrainInfo = availableStrains.find(strain => strain.name === selectedStrain);
    if (!selectedStrainInfo) {
      toast.error("Invalid strain selected");
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
      image: selectedImage || selectedStrainInfo.image
    };
    
    setSales([...sales, newSale]);
    toast.success("Sale added successfully!");
    
    // Reset form
    setSelectedStrain("");
    setSaleDate(new Date());
    setQuantity("");
    setQuantityOption("3.5");
    setCustomQuantity("");
    setCustomer("");
    setSalePrice("");
    setSelectedImage(null);
    setIsDialogOpen(false);
  };
  
  // Handle sale deletion
  const handleDeleteSale = (id: string) => {
    setSales(sales.filter(sale => sale.id !== id));
    toast.info("Sale deleted");
  };
  
  // Handle customer selection or creation
  const handleCustomerSelect = (value: string) => {
    setCustomer(value);
    setCustomerInput(value);
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Save target margin preference
  const saveTargetMargin = (value: number) => {
    setTargetMargin(value);
    localStorage.setItem('targetMargin', value.toString());
    toast.success(`Default profit margin set to ${value}%`);
  };
  
  // Helper function to get loyalty tag badge color
  const getLoyaltyTagColor = (tag: string) => {
    if (tag.includes("🆕")) return "bg-blue-500 text-white";
    if (tag.includes("🌀")) return "bg-green-500 text-white";
    if (tag.includes("🔥")) return "bg-orange-500 text-white";
    if (tag.includes("👻")) return "bg-gray-500 text-white";
    return "bg-slate-600 text-white";
  };

  // Find customer loyalty tag
  const getCustomerLoyaltyTag = (customerName: string) => {
    const customerInfo = customers.find(c => c.name === customerName);
    return customerInfo?.loyaltyTag || "🆕 New";
  };
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <motion.h1 
            className="text-3xl font-bold text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="mr-2">💰</span> Sales Logging
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Track your cannabis sales and profits
          </motion.p>
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="whitespace-nowrap bg-tree-green hover:bg-tree-green/80 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Sale
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <span className="mr-2">🛒</span> Add New Sale
                </DialogTitle>
                <DialogDescription>
                  Record a new sale transaction
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="strain">Strain</Label>
                  <Select value={selectedStrain} onValueChange={(value) => {
                    setSelectedStrain(value);
                    // Clear price suggestion when strain changes
                    if (quantity) {
                      setShowSuggestion(true);
                    }
                  }}>
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
                        {saleDate ? formatDateSafe(saleDate) : <span>Pick a date</span>}
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
                  <Label htmlFor="quantity">Quantity</Label>
                  <Select 
                    value={quantityOption} 
                    onValueChange={(value) => {
                      setQuantityOption(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      {quantityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {quantityOption === "custom" && (
                    <div className="mt-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter custom amount (g)"
                        value={customQuantity}
                        onChange={(e) => {
                          setCustomQuantity(e.target.value);
                          if (selectedStrain && e.target.value) {
                            setShowSuggestion(true);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Auto-suggested pricing */}
                <AnimatePresence>
                  {showSuggestion && selectedStrain && quantity && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-tree-green/10 border border-tree-green/20 rounded-md p-3 text-sm"
                    >
                      {(() => {
                        const strain = availableStrains.find(s => s.name === selectedStrain);
                        if (!strain) return null;
                        
                        const quantityNum = parseFloat(quantity);
                        if (isNaN(quantityNum)) return null;
                        
                        const { min, max, target } = calculateSuggestedPrice(strain.costPerGram, quantityNum);
                        
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="mr-2">💡</span> Suggested Price:
                              </div>
                              <div className="flex items-center space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => setSalePrice(min.toFixed(2))}
                                        className="px-2 py-0 h-6"
                                      >
                                        ${min.toFixed(2)}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>50% profit margin</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <span>-</span>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="default" 
                                        onClick={() => setSalePrice(target.toFixed(2))}
                                        className="px-2 py-0 h-6 bg-tree-green hover:bg-tree-green/80"
                                      >
                                        ${target.toFixed(2)}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{targetMargin}% profit margin (default)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <span>-</span>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => setSalePrice(max.toFixed(2))}
                                        className="px-2 py-0 h-6"
                                      >
                                        ${max.toFixed(2)}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>100% profit margin</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Set your preferred margin:</span>
                              <div className="flex items-center space-x-2">
                                <Slider 
                                  value={[targetMargin]} 
                                  min={50} 
                                  max={100} 
                                  step={1}
                                  className="w-[100px]"
                                  onValueChange={(value) => saveTargetMargin(value[0])}
                                />
                                <span className="text-xs w-10">{targetMargin}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
                
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
                      {customers.map(c => (
                        <option key={c.name} value={c.name} />
                      ))}
                    </datalist>
                    <Select onValueChange={handleCustomerSelect}>
                      <SelectTrigger className="absolute right-0 top-0 w-10 rounded-l-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(c => (
                          <SelectItem key={c.name} value={c.name}>
                            <div className="flex items-center">
                              <span>{c.name}</span>
                              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${getLoyaltyTagColor(c.loyaltyTag)}`}>
                                {c.loyaltyTag}
                              </span>
                            </div>
                          </SelectItem>
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
                
                <div className="grid gap-2">
                  <Label htmlFor="image" className="flex items-center">
                    <span>Image</span>
                    <span className="text-xs text-muted-foreground ml-2">(optional)</span>
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  {selectedImage && (
                    <div className="mt-2 relative">
                      <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="h-24 w-24 object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => setSelectedImage(null)}
                      >
                        &times;
                      </Button>
                    </div>
                  )}
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
                <Button onClick={handleAddSale} className="bg-tree-green hover:bg-tree-green/80">Add Sale</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Price Calculator Tool */}
      <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
        <DialogTrigger asChild>
          <motion.div
            className="fixed right-6 bottom-6 z-10"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button size="lg" className="rounded-full h-14 w-14 bg-tree-purple shadow-lg shadow-tree-purple/20">
              <Calculator className="h-6 w-6" />
            </Button>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg">
              <span className="mr-2">🧮</span> Price Calculator
            </DialogTitle>
            <DialogDescription>
              Calculate suggested pricing based on cost and margin
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cost">Cost per Gram ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={calcCostPerGram}
                  onChange={(e) => setCalcCostPerGram(e.target.value)}
                  placeholder="e.g., 5.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="margin">Profit Margin (%)</Label>
                <div className="grid grid-cols-4 gap-2 items-center">
                  <Input
                    id="margin"
                    type="number"
                    min="0"
                    max="100"
                    className="col-span-1"
                    value={calcMargin}
                    onChange={(e) => setCalcMargin(Number(e.target.value))}
                  />
                  <Slider
                    value={[calcMargin]}
                    min={0}
                    max={100}
                    step={1}
                    className="col-span-3"
                    onValueChange={(value) => setCalcMargin(value[0])}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <span className="mr-2">💵</span> Suggested Prices
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs uppercase text-muted-foreground">
                      <th className="text-left pb-2">Weight</th>
                      <th className="text-right pb-2">Cost</th>
                      <th className="text-right pb-2">Price</th>
                      <th className="text-right pb-2">Per Gram</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {calculatePriceMatrix(parseFloat(calcCostPerGram) || 0, calcMargin).map((item) => (
                      <motion.tr 
                        key={item.weight} 
                        className="text-sm"
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      >
                        <td className="py-3">{item.weight}g</td>
                        <td className="text-right py-3">${item.totalCost.toFixed(2)}</td>
                        <td className="text-right py-3 font-medium text-tree-green">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="text-right py-3 text-xs text-muted-foreground">
                          ${item.pricePerGram.toFixed(2)}/g
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground">
                <p className="flex items-center">
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Formula: Price = Cost ÷ (1 - Margin%)
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCalculatorOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                // Save as default target margin
                saveTargetMargin(calcMargin);
                setIsCalculatorOpen(false);
              }}
              className="bg-tree-purple hover:bg-tree-purple/80"
            >
              Set as Default
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-tree-green/20 bg-gradient-to-br from-slate-950 to-slate-900">
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
                <TableHead></TableHead>
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
                  <TableRow 
                    key={sale.id}
                    className="group transition-colors duration-150 hover:bg-slate-800/50"
                  >
                    <TableCell className="w-10">
                      {sale.image ? (
                        <img 
                          src={sale.image} 
                          alt={sale.strain} 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-tree-purple/20 flex items-center justify-center text-xs">
                          {sale.strain?.substring(0, 2) || ""}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{sale.strain}</TableCell>
                    <TableCell>{formatDateSafe(sale.date)}</TableCell>
                    <TableCell className="text-right">{sale.quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span>{sale.customer}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${getLoyaltyTagColor(getCustomerLoyaltyTag(sale.customer))}`}>
                          {getCustomerLoyaltyTag(sale.customer)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${sale.salePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(sale.quantity * sale.costPerGram).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium text-tree-green">${sale.profit.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSale(sale.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
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
      
      <Card className="border-tree-purple/20 bg-gradient-to-br from-slate-950 to-slate-900">
        <CardHeader>
          <CardTitle>Sales Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Total Sales</h3>
              <p className="text-2xl font-bold mt-1">{sales.length}</p>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Total Quantity</h3>
              <p className="text-2xl font-bold mt-1">
                {sales.reduce((sum, sale) => sum + sale.quantity, 0).toFixed(1)}g
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Total Revenue</h3>
              <p className="text-2xl font-bold mt-1">
                ${sales.reduce((sum, sale) => sum + sale.salePrice, 0).toFixed(2)}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Total Profit</h3>
              <p className="text-2xl font-bold mt-1 text-tree-green">
                ${sales.reduce((sum, sale) => sum + sale.profit, 0).toFixed(2)}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Sales;
