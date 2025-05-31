
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit } from "lucide-react";
import { BusinessSupply } from "@/hooks/useSupabaseBusinessSupplies";

interface AddBusinessSupplyDialogProps {
  onSubmit: (supply: Omit<BusinessSupply, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  editSupply?: BusinessSupply | null;
  onEditComplete?: () => void;
  trigger?: React.ReactNode;
}

const defaultCategories = [
  "Packaging",
  "Equipment",
  "Marketing",
  "Office Supplies",
  "Safety",
  "Storage",
  "Processing",
  "Other"
];

const AddBusinessSupplyDialog: React.FC<AddBusinessSupplyDialogProps> = ({
  onSubmit,
  editSupply,
  onEditComplete,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    cost_per_unit: 0,
    supplier: "",
    notes: "",
    low_stock_threshold: 5,
    image_url: ""
  });

  useEffect(() => {
    if (editSupply) {
      setFormData({
        name: editSupply.name,
        category: editSupply.category,
        quantity: editSupply.quantity,
        cost_per_unit: Number(editSupply.cost_per_unit),
        supplier: editSupply.supplier || "",
        notes: editSupply.notes || "",
        low_stock_threshold: editSupply.low_stock_threshold || 5,
        image_url: editSupply.image_url || ""
      });
      setOpen(true);
    }
  }, [editSupply]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim()) {
      return;
    }

    setLoading(true);
    
    const success = await onSubmit({
      ...formData,
      name: formData.name.trim(),
      category: formData.category.trim(),
      supplier: formData.supplier.trim() || null,
      notes: formData.notes.trim() || null,
      image_url: formData.image_url.trim() || null
    });

    if (success) {
      setOpen(false);
      setFormData({
        name: "",
        category: "",
        quantity: 0,
        cost_per_unit: 0,
        supplier: "",
        notes: "",
        low_stock_threshold: 5,
        image_url: ""
      });
      if (editSupply && onEditComplete) {
        onEditComplete();
      }
    }
    
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (editSupply && onEditComplete) {
      onEditComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-tree-green hover:bg-tree-green/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Supply
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editSupply ? "Edit Business Supply" : "Add New Business Supply"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Supply Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Vacuum Sealer Bags"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {defaultCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Current Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_per_unit">Cost Per Unit ($)</Label>
              <Input
                id="cost_per_unit"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost_per_unit}
                onChange={(e) => setFormData({ ...formData, cost_per_unit: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g., Amazon, Local Store"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
              <Input
                id="low_stock_threshold"
                type="number"
                min="0"
                value={formData.low_stock_threshold}
                onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 5 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional information about this supply..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-tree-green hover:bg-tree-green/90">
              {loading ? "Saving..." : editSupply ? "Update Supply" : "Add Supply"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBusinessSupplyDialog;
