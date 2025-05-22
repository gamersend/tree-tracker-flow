
import { useState } from "react";

export const useAddInventoryForm = (addInventoryCallback: (
  strain: string,
  purchaseDate: Date | undefined,
  quantity: "112g" | "224g" | "448g",
  totalCost: string,
  notes: string,
  image?: string | null
) => boolean) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStrain, setNewStrain] = useState("");
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  const [quantity, setQuantity] = useState<"112g" | "224g" | "448g">("112g");
  const [totalCost, setTotalCost] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
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

  // Handle form submission
  const handleAddInventory = () => {
    const success = addInventoryCallback(
      newStrain,
      purchaseDate,
      quantity,
      totalCost,
      notes,
      selectedImage
    );

    if (success) {
      resetForm();
      setIsDialogOpen(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setNewStrain("");
    setPurchaseDate(new Date());
    setQuantity("112g");
    setTotalCost("");
    setNotes("");
    setSelectedImage(null);
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
    handleAddInventory,
    resetForm
  };
};
