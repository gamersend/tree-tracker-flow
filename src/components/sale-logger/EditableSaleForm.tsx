
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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

interface EditableSaleFormProps {
  editableSale: any; // Using any type for simplicity, ideally use a more specific type
  parsedSale: any;
  onEditableChange: (field: string, value: any) => void;
  getStrainSuggestions: () => string[];
}

export const EditableSaleForm: React.FC<EditableSaleFormProps> = ({
  editableSale,
  parsedSale,
  onEditableChange,
  getStrainSuggestions,
}) => {
  // Safely get strain suggestions with a fallback to empty array
  const strainSuggestions = getStrainSuggestions ? getStrainSuggestions() : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer Name</Label>
          <Input
            id="customer"
            value={editableSale.customer || ''}
            onChange={(e) => onEditableChange('customer', e.target.value)}
            className={`bg-slate-800/50 border ${
              parsedSale?.confidence && parsedSale.confidence.customer < 0.5 
                ? 'border-red-500/50' 
                : 'border-slate-700/50'
            }`}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="strain">Strain</Label>
          <div className="relative">
            <Select 
              value={editableSale.strain || ''} 
              onValueChange={(value) => onEditableChange('strain', value)}
            >
              <SelectTrigger className={`bg-slate-800/50 border ${
                parsedSale?.confidence && parsedSale.confidence.strain < 0.5 
                  ? 'border-red-500/50' 
                  : 'border-slate-700/50'
              }`}>
                <SelectValue placeholder="Select strain" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {editableSale.strain && (
                  <SelectItem value={editableSale.strain}>{editableSale.strain}</SelectItem>
                )}
                {strainSuggestions.map((strain) => (
                  strain !== editableSale.strain && <SelectItem key={strain} value={strain}>{strain}</SelectItem>
                ))}
                <SelectItem value="Other">Custom (Type Below)</SelectItem>
              </SelectContent>
            </Select>
            {editableSale.strain === "Other" && (
              <Input
                className="mt-2 bg-slate-800/50 border-slate-700/50"
                placeholder="Enter custom strain name"
                onChange={(e) => onEditableChange('strain', e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal bg-slate-800/50 border ${
                    parsedSale?.confidence && parsedSale.confidence.date < 0.5 
                      ? 'border-red-500/50' 
                      : 'border-slate-700/50'
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editableSale.date instanceof Date
                    ? format(editableSale.date, "PPP")
                    : typeof editableSale.date === 'string'
                      ? editableSale.date
                      : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                <Calendar
                  mode="single"
                  selected={editableSale.date instanceof Date ? editableSale.date : new Date()}
                  onSelect={(date) => onEditableChange('date', date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (grams)</Label>
          <Input
            id="quantity"
            type="number"
            value={editableSale.quantity || 0}
            onChange={(e) => onEditableChange('quantity', parseFloat(e.target.value) || 0)}
            className={`bg-slate-800/50 border ${
              parsedSale?.confidence && parsedSale.confidence.quantity < 0.5 
                ? 'border-red-500/50' 
                : 'border-slate-700/50'
            }`}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salePrice">Sale Price ($)</Label>
          <Input
            id="salePrice"
            type="number"
            value={editableSale.salePrice || 0}
            onChange={(e) => onEditableChange('salePrice', parseFloat(e.target.value) || 0)}
            className={`bg-slate-800/50 border ${
              parsedSale?.confidence && parsedSale.confidence.salePrice < 0.5 
                ? 'border-red-500/50' 
                : 'border-slate-700/50'
            }`}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profit">Profit ($)</Label>
          <Input
            id="profit"
            type="number"
            value={editableSale.profit || 0}
            onChange={(e) => onEditableChange('profit', parseFloat(e.target.value) || 0)}
            className={`bg-slate-800/50 border ${
              parsedSale?.confidence && parsedSale.confidence.profit < 0.5 
                ? 'border-red-500/50' 
                : 'border-slate-700/50'
            }`}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isTick"
              checked={editableSale.isTick || false}
              onChange={(e) => onEditableChange('isTick', e.target.checked)}
              className="mr-2"
            />
            <Label htmlFor="isTick">Is this a tick/front?</Label>
          </div>
        </div>
        {editableSale.isTick && (
          <div className="space-y-2">
            <Label htmlFor="paidSoFar">Paid So Far ($)</Label>
            <Input
              id="paidSoFar"
              type="number"
              value={editableSale.paidSoFar || 0}
              onChange={(e) => onEditableChange('paidSoFar', parseFloat(e.target.value) || 0)}
              className="bg-slate-800/50 border-slate-700/50"
            />
          </div>
        )}
      </div>
    </div>
  );
};
