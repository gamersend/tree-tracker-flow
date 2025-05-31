
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { SaleItem, StrainInfo, CustomerInfo } from "./types";
import { formatDateSafe, getLoyaltyTagColor } from "./utils";

interface AddSaleDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  availableStrains: StrainInfo[];
  customers: CustomerInfo[];
  addSale: (sale: any) => Promise<boolean>;
  targetMargin: number;
  setTargetMargin: (margin: number) => void;
}

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

export const AddSaleDialog: React.FC<AddSaleDialogProps> = ({
  isOpen,
  setIsOpen,
  availableStrains,
  customers,
  addSale,
  targetMargin,
  setTargetMargin
}) => {
  // Form state
  const [selectedStrain, setSelectedStrain] = useState("");
  const [saleDate, setSaleDate] = useState<Date | undefined>(new Date());
  const [quantity, setQuantity] = useState("");
  const [quantityOption, setQuantityOption] = useState<string>("3.5");
  const [customQuantity, setCustomQuantity] = useState("");
  const [customer, setCustomer] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [customerInput, setCustomerInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

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

  // Save target margin preference
  const saveTargetMargin = (value: number) => {
    setTargetMargin(value);
    localStorage.setItem('targetMargin', value.toString());
    toast.success(`Default profit margin set to ${value}%`);
  };

  // Handle form submission
  const handleAddSale = async () => {
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
    
    // Find customer ID if exists
    const selectedCustomer = customers.find(c => c.name === customer);
    
    const newSaleData = {
      strain_id: selectedStrainInfo.id,
      date: saleDate,
      quantity: quantityValue,
      sale_price: salePriceValue,
      cost_per_gram: costPerGram,
      profit,
      customer_id: selectedCustomer ? selectedCustomer.id : undefined,
      image_url: selectedImage,
      notes: `Customer: ${customer}`
    };
    
    const success = await addSale(newSaleData);
    if (success) {
      resetForm();
      setIsOpen(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setSelectedStrain("");
    setSaleDate(new Date());
    setQuantity("");
    setQuantityOption("3.5");
    setCustomQuantity("");
    setCustomer("");
    setSalePrice("");
    setSelectedImage(null);
    setCustomerInput("");
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddSale} className="bg-tree-green hover:bg-tree-green/80">Add Sale</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
