
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CustomerDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

const CustomerDeleteDialog: React.FC<CustomerDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirmDelete,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" /> Delete Customer
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the customer and all associated purchase records.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete this customer?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            className="transition-all duration-200 hover:bg-red-600"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDeleteDialog;
