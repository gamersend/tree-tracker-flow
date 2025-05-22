
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParsedSale } from "@/components/sale-logger/types";

interface TickPaymentDetailsProps {
  sale: ParsedSale;
  onChange: (value: number) => void;
}

export const TickPaymentDetails: React.FC<TickPaymentDetailsProps> = ({
  sale,
  onChange
}) => {
  const handlePaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onChange(isNaN(value) ? 0 : value);
  };
  
  const remainingAmount = sale.salePrice - (sale.paidSoFar || 0);
  
  return (
    <div className="space-y-3 p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-md">
      <div className="text-yellow-400 font-medium flex items-center">
        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.78 14.55a6 6 0 119.18-7.34L10 10.92l-4.22 3.63z" clipRule="evenodd" />
        </svg>
        Tick Transaction
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-xs text-slate-400">Total Amount</Label>
          <div className="font-medium">${sale.salePrice.toFixed(2)}</div>
        </div>
        
        <div>
          <Label className="text-xs text-slate-400">Paid So Far</Label>
          <Input
            type="number"
            min="0"
            max={sale.salePrice}
            step="0.01"
            value={sale.paidSoFar || 0}
            onChange={handlePaidChange}
            className="h-8 mt-1"
          />
        </div>
        
        <div>
          <Label className="text-xs text-slate-400">Remaining</Label>
          <div className="font-medium text-yellow-400">
            ${remainingAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
