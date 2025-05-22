
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { CalendarIcon, Plus, Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Type for inventory item
type InventoryItem = {
  id: string;
  strain: string;
  purchaseDate: Date;
  quantity: number;
  quantityUnit: "112g" | "224g" | "448g";
  totalCost: number;
  pricePerGram: number;
  costPerOunce: number;
  notes: string;
  image?: string;
};

// Type for strain info
type StrainInfo = {
  name: string;
  costPerGram: number;
  image?: string;
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

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(
    loadFromStorage('inventory', [
      {
        id: "inv1",
        strain: "OG Kush",
        purchaseDate: new Date(2023, 4, 15),
        quantity: 112,
        quantityUnit: "112g",
        totalCost: 560,
        pricePerGram: 5,
        costPerOunce: 140,
        notes: "High quality batch.",
      },
      {
        id: "inv2",
        strain: "Blue Dream",
        purchaseDate: new Date(2023, 4, 20),
        quantity: 224,
        quantityUnit: "224g",
        totalCost: 1120,
        pricePerGram: 5,
        costPerOunce: 140,
        notes: "From regular supplier.",
      },
      {
        id: "inv3",
        strain: "Sour Diesel",
        purchaseDate: new Date(2023, 5, 1),
        quantity: 448,
        quantityUnit: "448g",
        totalCost: 1792,
        pricePerGram: 4,
        costPerOunce: 112,
        notes: "Bulk purchase discount applied.",
      },
      {
        id: "inv4",
        strain: "Purple Haze",
        purchaseDate: new Date(2023, 5, 10),
        quantity: 112,
        quantityUnit: "112g",
        totalCost: 672,
        pricePerGram: 6,
        costPerOunce: 168,
        notes: "Premium quality.",
      },
    ])
  );
  
  const [strains, setStrains] = useState<StrainInfo[]>(
    loadFromStorage('strains', [
      { name: "OG Kush", costPerGram: 5 },
      { name: "Blue Dream", costPerGram: 5 },
      { name: "Sour Diesel", costPerGram: 4 },
      { name: "Purple Haze", costPerGram: 6 },
      { name: "White Widow", costPerGram: 5.5 },
    ])
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  
  // New inventory form state
  const [newStrain, setNewStrain] = useState("");
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  const [quantity, setQuantity] = useState<"112g" | "224g" | "448g">("112g");
  const [totalCost, setTotalCost] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);
  
  useEffect(() => {
    localStorage.setItem('strains', JSON.stringify(strains));
  }, [strains]);
  
  // Calculate derived values
  const calculatePricePerGram = (cost: number, quantityValue: number) => {
    return cost / quantityValue;
  };
  
  const calculateCostPerOunce = (pricePerGram: number) => {
    return pricePerGram * 28;
  };

  const getQuantityInGrams = (quantityUnit: string) => {
    switch (quantityUnit) {
      case "112g": return 112;
      case "224g": return 224;
      case "448g": return 448;
      default: return 0;
    }
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
  
  // Handle form submission
  const handleAddInventory = () => {
    if (!newStrain || !purchaseDate || !totalCost) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const costValue = parseFloat(totalCost);
    const quantityValue = getQuantityInGrams(quantity);
    const pricePerGram = calculatePricePerGram(costValue, quantityValue);
    const costPerOunce = calculateCostPerOunce(pricePerGram);
    
    const newItem: InventoryItem = {
      id: `inv${Date.now()}`,
      strain: newStrain,
      purchaseDate: purchaseDate,
      quantity: quantityValue,
      quantityUnit: quantity,
      totalCost: costValue,
      pricePerGram,
      costPerOunce,
      notes,
      image: selectedImage || undefined,
    };
    
    setInventory([...inventory, newItem]);
    
    // Also update or add to strains list
    const existingStrainIndex = strains.findIndex(s => s.name === newStrain);
    
    if (existingStrainIndex >= 0) {
      // Update existing strain cost
      const updatedStrains = [...strains];
      updatedStrains[existingStrainIndex] = { 
        ...updatedStrains[existingStrainIndex], 
        costPerGram: pricePerGram,
        image: selectedImage || updatedStrains[existingStrainIndex].image
      };
      setStrains(updatedStrains);
    } else {
      // Add new strain
      setStrains([...strains, { 
        name: newStrain, 
        costPerGram: pricePerGram,
        image: selectedImage || undefined
      }]);
    }
    
    toast.success("Inventory added successfully!");
    
    // Reset form
    setNewStrain("");
    setPurchaseDate(new Date());
    setQuantity("112g");
    setTotalCost("");
    setNotes("");
    setSelectedImage(null);
    setIsDialogOpen(false);
  };

  // Filter inventory based on search
  const filteredInventory = inventory.filter(item =>
    item.strain.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
            <span className="mr-2">📦</span> Inventory Cost Tracker
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Manage your cannabis inventory purchases
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap bg-tree-purple hover:bg-tree-purple/80">
                <Plus className="mr-2 h-4 w-4" /> Add Inventory
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Inventory</DialogTitle>
                <DialogDescription>
                  Enter the details of your new inventory purchase.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="strain">Strain Name</Label>
                  <Input
                    id="strain"
                    value={newStrain}
                    onChange={(e) => setNewStrain(e.target.value)}
                    placeholder="e.g., OG Kush"
                    list="strain-options"
                  />
                  <datalist id="strain-options">
                    {strains.map(strain => (
                      <option key={strain.name} value={strain.name} />
                    ))}
                  </datalist>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Purchase Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !purchaseDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {purchaseDate ? format(purchaseDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={purchaseDate}
                        onSelect={setPurchaseDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Select value={quantity} onValueChange={(value: "112g" | "224g" | "448g") => setQuantity(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="112g">112g (4 oz)</SelectItem>
                      <SelectItem value="224g">224g (8 oz)</SelectItem>
                      <SelectItem value="448g">448g (16 oz)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cost">Total Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                    placeholder="e.g., 560"
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
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information..."
                  />
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 mt-2">
                  <h3 className="font-medium mb-2">Cost Preview</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-400">Quantity:</div>
                    <div>{quantity}</div>
                    <div className="text-gray-400">Total Cost:</div>
                    <div>${totalCost || "0.00"}</div>
                    <div className="text-gray-400">Cost per Gram:</div>
                    <div className="font-medium">
                      {totalCost && quantity
                        ? `$${calculatePricePerGram(parseFloat(totalCost), getQuantityInGrams(quantity)).toFixed(2)}`
                        : "$0.00"}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddInventory}>Add Inventory</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-tree-purple/30 bg-gradient-to-br from-slate-950 to-slate-900">
        <CardHeader>
          <CardTitle>Inventory Purchases</CardTitle>
          <CardDescription>
            View and manage all your inventory purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Strain</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Total Cost ($)</TableHead>
                <TableHead className="text-right">$/g</TableHead>
                <TableHead className="text-right">$/oz</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell className="w-10">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.strain} 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-tree-purple/20 flex items-center justify-center text-xs">
                          {item.strain.substring(0, 2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.strain}</TableCell>
                    <TableCell>{format(new Date(item.purchaseDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{item.quantityUnit}</TableCell>
                    <TableCell className="text-right">${item.totalCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.pricePerGram.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.costPerOunce.toFixed(2)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    {searchQuery 
                      ? "No inventory items match your search"
                      : "No inventory items added yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-slate-800/20 border-t border-slate-700/30 flex justify-center py-2">
          <Button 
            variant="link" 
            className="text-tree-green flex items-center gap-2" 
            asChild
          >
            <Link to="/stock">
              Go to Current Inventory <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="border-tree-green/30 bg-gradient-to-br from-slate-950 to-slate-900">
        <CardHeader>
          <CardTitle>Inventory Summary</CardTitle>
          <CardDescription>
            Overview of your total inventory investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Total Items</h3>
              <p className="text-2xl font-bold mt-1">{inventory.length}</p>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Total Quantity</h3>
              <p className="text-2xl font-bold mt-1">
                {inventory.reduce((sum, item) => sum + item.quantity, 0)}g
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Total Investment</h3>
              <p className="text-2xl font-bold mt-1">
                ${inventory.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm text-muted-foreground">Average Cost/g</h3>
              <p className="text-2xl font-bold mt-1">
                ${inventory.length > 0 
                  ? (inventory.reduce((sum, item) => sum + (item.totalCost / inventory.length), 0) / 
                    (inventory.reduce((sum, item) => sum + item.quantity, 0) / inventory.length)).toFixed(2)
                  : "0.00"}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Inventory;
