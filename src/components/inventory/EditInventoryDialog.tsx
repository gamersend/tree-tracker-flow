
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface InventoryItem {
  id: string;
  strain: string;
  purchaseDate: Date;
  quantity: number;
  quantityUnit: string;
  totalCost: number;
  pricePerGram: number;
  costPerOunce: number;
  notes: string;
  image?: string;
}

interface Strain {
  name: string;
  costPerGram: number;
  image?: string;
}

interface EditInventoryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: InventoryItem | null;
  strains: Strain[];
  onUpdateInventory: (
    id: string,
    strain: string,
    purchaseDate: Date,
    quantity: number,
    totalCost: string,
    notes: string,
    image?: string | null
  ) => Promise<boolean>;
}

const EditInventoryDialog: React.FC<EditInventoryDialogProps> = ({
  isOpen,
  setIsOpen,
  item,
  strains,
  onUpdateInventory
}) => {
  const [strain, setStrain] = useState("");
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(undefined);
  const [quantity, setQuantity] = useState(0);
  const [quantityInput, setQuantityInput] = useState("");
  const [quickSelect, setQuickSelect] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setStrain(item.strain);
      setPurchaseDate(item.purchaseDate);
      setQuantity(item.quantity);
      setQuantityInput(item.quantity.toString());
      setTotalCost(item.totalCost.toString());
      setNotes(item.notes || "");
      setSelectedImage(item.image || null);
      setQuickSelect(""); // Reset quick select
    }
  }, [item]);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateInventory = async () => {
    if (!item || !strain || !purchaseDate || !totalCost || quantity <= 0) return;

    const success = await onUpdateInventory(
      item.id,
      strain,
      purchaseDate,
      quantity,
      totalCost,
      notes,
      selectedImage
    );

    if (success) {
      setIsOpen(false);
      // Reset form
      setStrain("");
      setPurchaseDate(undefined);
      setQuantity(0);
      setQuantityInput("");
      setQuickSelect("");
      setTotalCost("");
      setNotes("");
      setSelectedImage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-slate-950 to-slate-900 border-tree-purple/30">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="strain">Strain</Label>
            <Select value={strain} onValueChange={setStrain}>
              <SelectTrigger>
                <SelectValue placeholder="Select or type strain name" />
              </SelectTrigger>
              <SelectContent>
                {strains.map((s) => (
                  <SelectItem key={s.name} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or type new strain name"
              value={strain}
              onChange={(e) => setStrain(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Purchase Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !purchaseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {purchaseDate ? format(purchaseDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={purchaseDate}
                  onSelect={setPurchaseDate}
                  initialFocus
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
                  <SelectItem value="112g">112g (4oz)</SelectItem>
                  <SelectItem value="224g">224g (8oz)</SelectItem>
                  <SelectItem value="448g">448g (1lb)</SelectItem>
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
            <Label htmlFor="totalCost">Total Cost ($)</Label>
            <Input
              id="totalCost"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Optional notes about this purchase..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Label
                htmlFor="image"
                className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-accent"
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Label>
              {selectedImage && (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleUpdateInventory} className="flex-1">
            Update Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditInventoryDialog;
