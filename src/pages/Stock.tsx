
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
import { Label } from "@/components/ui/label";
import { Search, Edit, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

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
};

// Mock data
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

const Stock = () => {
  const [inventoryStock, setInventoryStock] = useState<InventoryStock[]>(mockInventoryStock);
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustmentItem, setAdjustmentItem] = useState<InventoryStock | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState("0");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
    
    setIsDialogOpen(false);
    setAdjustmentItem(null);
    setAdjustmentValue("0");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Current Inventory</h1>
          <p className="text-gray-400">Track your available cannabis stock</p>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" /> Add Strain
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Strain</DialogTitle>
                <DialogDescription>
                  This will be connected to the Inventory module when backend is integrated
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-center text-muted-foreground">
                  To add new strains, please use the Inventory module.
                  <br />
                  All purchases will automatically sync here.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Go to Inventory</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
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
                <TableHead>Strain</TableHead>
                <TableHead className="text-right">Purchased (g)</TableHead>
                <TableHead className="text-right">Sold (g)</TableHead>
                <TableHead className="text-right">Adjustment (g)</TableHead>
                <TableHead className="text-right">Current (g)</TableHead>
                <TableHead className="text-right">Cost/g ($)</TableHead>
                <TableHead className="text-right">Value ($)</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.length > 0 ? (
                filteredStock.map((item) => (
                  <TableRow key={item.id}>
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
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Total Strains</h3>
              <p className="text-2xl font-bold mt-1">{inventoryStock.length}</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Total Stock</h3>
              <p className="text-2xl font-bold mt-1">
                {inventoryStock.reduce((sum, item) => sum + item.currentStock, 0)}g
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground">Total Value</h3>
              <p className="text-2xl font-bold mt-1">
                ${inventoryStock.reduce((sum, item) => sum + item.totalValue, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stock;
