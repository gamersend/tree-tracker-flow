
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
import { CalendarIcon, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
};

// Mock data
const mockInventory: InventoryItem[] = [
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
];

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New inventory form state
  const [newStrain, setNewStrain] = useState("");
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  const [quantity, setQuantity] = useState<"112g" | "224g" | "448g">("112g");
  const [totalCost, setTotalCost] = useState("");
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
  
  // Handle form submission
  const handleAddInventory = () => {
    if (!newStrain || !purchaseDate || !totalCost) {
      alert("Please fill in all required fields");
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
    };
    
    setInventory([...inventory, newItem]);
    
    // Reset form
    setNewStrain("");
    setPurchaseDate(new Date());
    setQuantity("112g");
    setTotalCost("");
    setNotes("");
    setIsDialogOpen(false);
  };

  // Filter inventory based on search
  const filteredInventory = inventory.filter(item =>
    item.strain.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory Cost Tracker</h1>
          <p className="text-gray-400">Manage your cannabis inventory purchases</p>
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
              <Button className="whitespace-nowrap">
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
                  />
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
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information..."
                  />
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

      <Card>
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
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.strain}</TableCell>
                    <TableCell>{format(item.purchaseDate, "MMM d, yyyy")}</TableCell>
                    <TableCell>{item.quantityUnit}</TableCell>
                    <TableCell className="text-right">${item.totalCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.pricePerGram.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.costPerOunce.toFixed(2)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
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
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Summary</CardTitle>
          <CardDescription>
            Overview of your total inventory investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Total Items</h3>
              <p className="text-2xl font-bold mt-1">{inventory.length}</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Total Quantity</h3>
              <p className="text-2xl font-bold mt-1">
                {inventory.reduce((sum, item) => sum + item.quantity, 0)}g
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Total Investment</h3>
              <p className="text-2xl font-bold mt-1">
                ${inventory.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)}
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Average Cost/g</h3>
              <p className="text-2xl font-bold mt-1">
                ${(inventory.reduce((sum, item) => sum + (item.totalCost / inventory.length), 0) / 
                  (inventory.reduce((sum, item) => sum + item.quantity, 0) / inventory.length)).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
