
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (amount: number) => Promise<boolean>;
  remainingAmount: number;
  customerName: string;
  description: string;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  remainingAmount,
  customerName,
  description,
}) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(remainingAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentAmount <= 0 || paymentAmount > remainingAmount) {
      return;
    }

    const success = await onSubmit(paymentAmount);
    if (success) {
      onOpenChange(false);
      setPaymentAmount(remainingAmount);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Customer</p>
            <p className="font-medium">{customerName}</p>
            <p className="text-sm text-gray-400 mt-2">Description</p>
            <p className="text-sm">{description}</p>
            <p className="text-sm text-gray-400 mt-2">Outstanding Amount</p>
            <p className="text-lg font-bold text-tree-green">£{remainingAmount.toFixed(2)}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Amount (£)</Label>
              <Input
                id="payment"
                type="number"
                step="0.01"
                min="0.01"
                max={remainingAmount}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPaymentAmount(remainingAmount)}
                className="flex-1"
              >
                Full Amount
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPaymentAmount(remainingAmount / 2)}
                className="flex-1"
              >
                Half Amount
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Record Payment
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
