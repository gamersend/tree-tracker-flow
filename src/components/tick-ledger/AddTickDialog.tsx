
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSupabaseCustomers } from '@/hooks/useSupabaseCustomers';
import { useSupabaseInventory } from '@/hooks/useSupabaseInventory';

interface AddTickDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TickFormData) => Promise<boolean>;
  initialData?: TickFormData | null;
  title: string;
}

interface TickFormData {
  customer_id: string;
  strain_id?: string;
  amount: number;
  description: string;
  date: string;
  due_date?: string;
  notes?: string;
}

const AddTickDialog: React.FC<AddTickDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}) => {
  const { customers } = useSupabaseCustomers();
  const { strains } = useSupabaseInventory();
  const [formData, setFormData] = useState<TickFormData>({
    customer_id: '',
    strain_id: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        customer_id: '',
        strain_id: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        due_date: '',
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_id || !formData.description || formData.amount <= 0) {
      return;
    }

    const success = await onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select 
              value={formData.customer_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} {customer.alias && `(${customer.alias})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strain">Strain (Optional)</Label>
            <Select 
              value={formData.strain_id || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, strain_id: value || undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a strain (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No strain selected</SelectItem>
                {strains.map((strain) => (
                  <SelectItem key={strain.id} value={strain.id}>
                    {strain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., 14g Blue Dream"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date (Optional)</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Entry' : 'Add Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTickDialog;
