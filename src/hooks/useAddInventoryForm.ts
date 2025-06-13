
import { useState } from "react";
import { toast } from "sonner";

export const useAddInventoryForm = (
  onAddInventory: (
    strain: string,
    purchaseDate: Date,
    quantity: number,
    totalCost: number,
    notes: string,
    image?: string
  ) => Promise<boolean>
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStrain, setNewStrain] = useState("");
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  const [quantity, setQuantity] = useState(112); // Default to 112g
  const [totalCost, setTotalCost] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const handleAddInventory = async () => {
    if (!newStrain.trim()) {
      toast.error("Please enter a strain name");
      return;
    }

    if (!purchaseDate) {
      toast.error("Please select a purchase date");
      return;
    }

    if (quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (!totalCost || parseFloat(totalCost) <= 0) {
      toast.error("Please enter a valid total cost");
      return;
    }

    const success = await onAddInventory(
      newStrain,
      purchaseDate,
      quantity,
      parseFloat(totalCost),
      notes,
      selectedImage || undefined
    );

    if (success) {
      // Reset form
      setNewStrain("");
      setPurchaseDate(new Date());
      setQuantity(112);
      setTotalCost("");
      setNotes("");
      setSelectedImage(null);
      setIsDialogOpen(false);
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    newStrain,
    setNewStrain,
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
    handleAddInventory
  };
};
