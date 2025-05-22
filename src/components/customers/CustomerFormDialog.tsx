
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import { CustomerFormData } from "@/types/customer";

interface CustomerFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formData: CustomerFormData;
  onFormDataChange: (data: Partial<CustomerFormData>) => void;
  onSubmit: () => void;
  emojis: string[];
  platforms: string[];
  submitLabel: string;
}

const CustomerFormDialog: React.FC<CustomerFormDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  formData,
  onFormDataChange,
  onSubmit,
  emojis,
  platforms,
  submitLabel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{formData.emoji}</span> {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-2 flex-wrap justify-center mb-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                className={`text-2xl h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${
                  formData.emoji === emoji
                    ? "bg-primary text-primary-foreground scale-110"
                    : "hover:bg-muted"
                }`}
                onClick={() => onFormDataChange({ emoji: emoji })}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              placeholder="Customer's name"
              className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="platform">Communication Platform</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) => onFormDataChange({ platform: value })}
            >
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="alias">Alias/Username</Label>
            <Input
              id="alias"
              value={formData.alias}
              onChange={(e) => onFormDataChange({ alias: e.target.value })}
              placeholder="Customer's username or alias"
              className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onFormDataChange({ notes: e.target.value })}
              placeholder="Any additional information..."
              className="transition-all duration-200 focus:ring-2 focus:ring-tree-purple/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="trusted"
              checked={formData.trustedBuyer}
              onCheckedChange={(checked) =>
                onFormDataChange({ trustedBuyer: checked })
              }
            />
            <Label htmlFor="trusted" className="flex items-center gap-1">
              Trusted Buyer <Star className="h-3 w-3 text-tree-gold" />
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="transition-all duration-200 hover:scale-105"
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerFormDialog;
