
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { StrainInfo } from "@/types/inventory";
import { safeFormatNumber } from "@/utils/inventory-utils";

interface AddInventoryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  strain: string;
  setStrain: (strain: string) => void;
  purchaseDate: Date | undefined;
  setPurchaseDate: (date: Date | undefined) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  totalCost: string;
  setTotalCost: (cost: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddInventory: () => void;
  strains: StrainInfo[];
}

const AddInventoryDialog: React.FC<AddInventoryDialogProps> = ({
  isOpen,
  setIsOpen,
  strain,
  setStrain,
  purchaseDate,
  setPurchaseDate,
  quantity,
  setQuantity,
  totalCost,
  setTotalCost,
  notes,
  setNotes,
  selectedImage,
  setSelectedImage,
  handleImageUpload,
  handleAddInventory,
  strains
}) => {
  const [quantityInput, setQuantityInput] = useState(quantity.toString());
  const [quickSelect, setQuickSelect] = useState("");

  const handleQuickSelect = (value: string) => {
    setQuickSelect(value);
    const gramAmount = value === "112g" ? 112 : value === "224g" ? 224 : value === "448g" ? 448 : 0;
    if (gramAmount > 0) {
      setQuantity(gramAmount);
      setQuantityInput(gramAmount.toString());
    }
  };

  const handleQuantityInputChange = (value: string) => {
    setQuantityInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setQuantity(numValue);
      setQuickSelect(""); // Clear quick select when typing custom amount
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              value={strain}
              onChange={(e) => setStrain(e.target.value)}
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
            <Label htmlFor="quantity">Quantity (grams)</Label>
            <div className="space-y-2">
              <Select value={quickSelect} onValueChange={handleQuickSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Quick select common amounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="112g">112g (4 oz)</SelectItem>
                  <SelectItem value="224g">224g (8 oz)</SelectItem>
                  <SelectItem value="448g">448g (16 oz)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={quantityInput}
                onChange={(e) => handleQuantityInputChange(e.target.value)}
                placeholder="Enter exact amount in grams"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cost">Total Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
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
              <div>{quantity}g</div>
              <div className="text-gray-400">Total Cost:</div>
              <div>${totalCost || "0.00"}</div>
              <div className="text-gray-400">Cost per Gram:</div>
              <div className="font-medium">
                {totalCost && quantity > 0
                  ? `$${safeFormatNumber(parseFloat(totalCost) / quantity)}`
                  : "$0.00"}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddInventory}>Add Inventory</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryDialog;
