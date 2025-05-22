
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Search, Edit, Plus, AlertTriangle, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Type for inventory item
type InventoryStock = {
  id: string;
  strain: string;
  totalPurchased: number;
  totalSold: number;
  manualAdjustment: number;
  currentStock: number;
  avgCostPerGram: number;
  totalValue: number;
  image?: string;
  alertThreshold?: number;
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

// Default mock data
const mockInventoryStock: InventoryStock[] = [
  {
    id: "stock1",
    strain: "OG Kush",
    totalPurchased: 112,
    totalSold: 42,
    manualAdjustment: 0,
    currentStock: 70,
    avgCostPerGram: 5,
    totalValue: 350,
  },
  {
    id: "stock2",
    strain: "Blue Dream",
    totalPurchased: 224,
    totalSold: 85,
    manualAdjustment: -4,
    currentStock: 135,
    avgCostPerGram: 5,
    totalValue: 675,
  },
  {
    id: "stock3",
    strain: "Sour Diesel",
    totalPurchased: 448,
    totalSold: 127,
    manualAdjustment: 0,
    currentStock: 321,
    avgCostPerGram: 4,
    totalValue: 1284,
  },
  {
    id: "stock4",
    strain: "Purple Haze",
    totalPurchased: 112,
    totalSold: 28,
    manualAdjustment: -2,
    currentStock: 82,
    avgCostPerGram: 6,
    totalValue: 492,
  },
];

const DEFAULT_ALERT_THRESHOLD = 28;

const Stock = () => {
  const [inventoryStock, setInventoryStock] = useState<InventoryStock[]>(loadFromStorage('inventory', mockInventoryStock));
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustmentItem, setAdjustmentItem] = useState<InventoryStock | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState("0");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isThresholdDialogOpen, setIsThresholdDialogOpen] = useState(false);
  const [selectedStrain, setSelectedStrain] = useState<InventoryStock | null>(null);
  const [thresholdValue, setThresholdValue] = useState("");
  const [defaultAlertThreshold, setDefaultAlertThreshold] = useState(
    loadFromStorage('defaultAlertThreshold', DEFAULT_ALERT_THRESHOLD)
  );
  
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventoryStock));
  }, [inventoryStock]);
  
  useEffect(() => {
    localStorage.setItem('defaultAlertThreshold', JSON.stringify(defaultAlertThreshold));
  }, [defaultAlertThreshold]);
  
  // Filter inventory based on search
  const filteredStock = inventoryStock.filter(item =>
    item.strain.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAdjustment = () => {
    if (!adjustmentItem) return;
    
    const adjustment = parseInt(adjustmentValue);
    
    setInventoryStock(prevStock => 
      prevStock.map(item => {
        if (item.id === adjustmentItem.id) {
          const newAdjustment = adjustment;
          const newCurrentStock = item.totalPurchased - item.totalSold + newAdjustment;
          const newTotalValue = newCurrentStock * item.avgCostPerGram;
          
          return {
            ...item,
            manualAdjustment: newAdjustment,
            currentStock: newCurrentStock,
            totalValue: newTotalValue
          };
        }
        return item;
      })
    );
    
    toast.success(`Adjusted ${adjustmentItem.strain} inventory`);
    setIsDialogOpen(false);
    setAdjustmentItem(null);
    setAdjustmentValue("0");
  };
  
  // Handle updating alert threshold
  const handleUpdateThreshold = () => {
    if (!selectedStrain) return;
    
    const threshold = parseInt(thresholdValue);
    
    setInventoryStock(prevStock => 
      prevStock.map(item => {
        if (item.id === selectedStrain.id) {
          return {
            ...item,
            alertThreshold: threshold
          };
        }
        return item;
      })
    );
    
    toast.success(`Updated alert threshold for ${selectedStrain.strain}`);
    setIsThresholdDialogOpen(false);
    setSelectedStrain(null);
    setThresholdValue("");
  };
  
  // Check if stock is below threshold
  const isLowStock = (item: InventoryStock) => {
    const threshold = item.alertThreshold !== undefined ? item.alertThreshold : defaultAlertThreshold;
    return item.currentStock < threshold;
  };
  
  // Get low stock items
  const getLowStockItems = () => {
    return inventoryStock.filter(item => isLowStock(item));
  };
  
  // Add new strain with image upload
  const [isAddStrainOpen, setIsAddStrainOpen] = useState(false);
  const [newStrainName, setNewStrainName] = useState("");
  const [newStrainCost, setNewStrainCost] = useState("");
  const [newStrainImage, setNewStrainImage] = useState<string | null>(null);
  
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
        setNewStrainImage(event.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Handle adding new strain
  const handleAddStrain = () => {
    if (!newStrainName || !newStrainCost) {
      toast.error("Please enter a strain name and cost");
      return;
    }
    
    const cost = parseFloat(newStrainCost);
    
    const newStrain: InventoryStock = {
      id: `stock${Date.now()}`,
      strain: newStrainName,
      totalPurchased: 0,
      totalSold: 0,
      manualAdjustment: 0,
      currentStock: 0,
      avgCostPerGram: cost,
      totalValue: 0,
      image: newStrainImage || undefined
    };
    
    setInventoryStock([...inventoryStock, newStrain]);
    toast.success(`Added new strain: ${newStrainName}`);
    
    setNewStrainName("");
    setNewStrainCost("");
    setNewStrainImage(null);
    setIsAddStrainOpen(false);
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
            <span className="mr-2">🌿</span> Current Inventory
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Track your available cannabis stock
          </motion.p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search strains..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddStrainOpen} onOpenChange={setIsAddStrainOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="whitespace-nowrap bg-tree-green hover:bg-tree-green/80 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Strain
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <span className="mr-2">🌱</span> Add New Strain
                </DialogTitle>
                <DialogDescription>
                  Create a new strain in your inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="strain-name">Strain Name</Label>
                  <Input
                    id="strain-name"
                    value={newStrainName}
                    onChange={(e) => setNewStrainName(e.target.value)}
                    placeholder="e.g., Wedding Cake"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cost-per-gram">Cost per Gram ($)</Label>
                  <Input
                    id="cost-per-gram"
                    type="number"
                    step="0.01"
                    value={newStrainCost}
                    onChange={(e) => setNewStrainCost(e.target.value)}
                    placeholder="e.g., 5.50"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="strain-image" className="flex items-center">
                    <span>Image</span>
                    <span className="text-xs text-muted-foreground ml-2">(optional)</span>
                  </Label>
                  <Input
                    id="strain-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  {newStrainImage && (
                    <div className="mt-2 relative">
                      <img 
                        src={newStrainImage} 
                        alt="Selected" 
                        className="h-24 w-24 object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => setNewStrainImage(null)}
                      >
                        &times;
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddStrainOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStrain} className="bg-tree-green hover:bg-tree-green/80">Add Strain</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Inventory Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure your inventory preferences
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="default-threshold" className="text-right">
                      Default Alert Threshold
                    </Label>
                    <Input
                      id="default-threshold"
                      type="number"
                      value={defaultAlertThreshold}
                      className="col-span-1"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) {
                          setDefaultAlertThreshold(value);
                          localStorage.setItem('defaultAlertThreshold', JSON.stringify(value));
                          toast.success(`Default alert threshold set to ${value}g`);
                        }
                      }}
                    />
                    <span className="text-sm">grams</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <AnimatePresence>
        {getLowStockItems().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Alert className="border-amber-500/30 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-500 flex items-center">
                <span className="mr-2">⚠️</span> Low Stock Alert
              </AlertTitle>
              <AlertDescription className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {getLowStockItems().map((item) => (
                    <div 
                      key={item.id}
                      className="bg-amber-500/5 border border-amber-500/20 rounded-md p-2 text-sm flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <AlertTriangle className="h-3 w-3 text-amber-500 mr-2" />
                        <span className="text-amber-200">
                          {item.strain}: <strong>{item.currentStock}g</strong> left
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setSelectedStrain(item);
                          setThresholdValue(
                            item.alertThreshold?.toString() || defaultAlertThreshold.toString()
                          );
                          setIsThresholdDialogOpen(true);
                        }}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="border-tree-green/20 bg-gradient-to-br from-slate-950 to-slate-900">
        <CardHeader>
          <CardTitle>Current Stock</CardTitle>
          <CardDescription>
            View and manage your available cannabis inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Strain</TableHead>
                <TableHead className="text-right">Purchased (g)</TableHead>
                <TableHead className="text-right">Sold (g)</TableHead>
                <TableHead className="text-right">Adjustment (g)</TableHead>
                <TableHead className="text-right">Current (g)</TableHead>
                <TableHead className="text-right">Cost/g ($)</TableHead>
                <TableHead className="text-right">Value ($)</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.length > 0 ? (
                filteredStock.map((item) => (
                  <TableRow 
                    key={item.id}
                    className={cn(
                      "group transition-colors duration-200",
                      isLowStock(item) ? "bg-amber-500/5 hover:bg-amber-500/10" : "hover:bg-slate-800/50"
                    )}
                  >
                    <TableCell className="w-10">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.strain} 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-tree-green/20 flex items-center justify-center text-xs">
                          {item.strain.substring(0, 2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.strain}</TableCell>
                    <TableCell className="text-right">{item.totalPurchased}</TableCell>
                    <TableCell className="text-right">{item.totalSold}</TableCell>
                    <TableCell 
                      className={cn(
                        "text-right",
                        item.manualAdjustment > 0 ? "text-green-400" : 
                        item.manualAdjustment < 0 ? "text-red-400" : ""
                      )}
                    >
                      {item.manualAdjustment > 0 ? `+${item.manualAdjustment}` : 
                       item.manualAdjustment < 0 ? item.manualAdjustment : 0}
                    </TableCell>
                    <TableCell className="text-right font-medium">{item.currentStock}</TableCell>
                    <TableCell className="text-right">${item.avgCostPerGram.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.totalValue.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      {isLowStock(item) ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Badge 
                              variant="outline" 
                              className="border-amber-500 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                              onClick={() => {
                                setSelectedStrain(item);
                                setThresholdValue(
                                  item.alertThreshold?.toString() || defaultAlertThreshold.toString()
                                );
                                setIsThresholdDialogOpen(true);
                              }}
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" /> Low Stock
                            </Badge>
                          </motion.div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-200">
                          In Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog open={isDialogOpen && adjustmentItem?.id === item.id} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                          setAdjustmentItem(null);
                          setAdjustmentValue("0");
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setAdjustmentItem(item);
                              setAdjustmentValue(item.manualAdjustment.toString());
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Adjust Inventory</DialogTitle>
                            <DialogDescription>
                              Make manual adjustments to your inventory for {item.strain}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right col-span-2">
                                Purchased:
                              </Label>
                              <div className="col-span-2">{item.totalPurchased}g</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right col-span-2">
                                Sold:
                              </Label>
                              <div className="col-span-2">{item.totalSold}g</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="adjustment" className="text-right col-span-2">
                                Adjustment:
                              </Label>
                              <Input
                                id="adjustment"
                                type="number"
                                value={adjustmentValue}
                                onChange={(e) => setAdjustmentValue(e.target.value)}
                                className="col-span-2"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right col-span-2">
                                New Stock:
                              </Label>
                              <div className="col-span-2 font-bold">
                                {item.totalPurchased - item.totalSold + parseInt(adjustmentValue || "0")}g
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {
                              setIsDialogOpen(false);
                              setAdjustmentItem(null);
                            }}>
                              Cancel
                            </Button>
                            <Button onClick={handleAdjustment}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                    {searchQuery 
                      ? "No inventory items match your search"
                      : "No inventory items added yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Threshold Setting Dialog */}
      <Dialog open={isThresholdDialogOpen} onOpenChange={setIsThresholdDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <span className="mr-2">⚠️</span> Set Alert Threshold
            </DialogTitle>
            <DialogDescription>
              Customize when you'll receive low stock alerts for {selectedStrain?.strain}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threshold" className="text-right col-span-2">
                Alert when below:
              </Label>
              <Input
                id="threshold"
                type="number"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(e.target.value)}
                className="col-span-1"
              />
              <span className="text-sm">grams</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>The system will alert you when this strain's inventory falls below this threshold.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsThresholdDialogOpen(false);
              setSelectedStrain(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateThreshold}>Save Threshold</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card className="border-tree-purple/20 bg-gradient-to-br from-slate-950 to-slate-900">
        <CardHeader>
          <CardTitle>Inventory Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Total Strains</h3>
              <p className="text-2xl font-bold mt-1">{inventoryStock.length}</p>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Total Stock</h3>
              <p className="text-2xl font-bold mt-1">
                {inventoryStock.reduce((sum, item) => sum + item.currentStock, 0)}g
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Total Value</h3>
              <p className="text-2xl font-bold mt-1">
                ${inventoryStock.reduce((sum, item) => sum + item.totalValue, 0).toFixed(2)}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Stock;
