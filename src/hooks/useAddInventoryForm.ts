
import { useState } from 'react';

export const useAddInventoryForm = (
  addInventoryFunction: (
    strain: string,
    purchaseDate: Date,
    quantity: '112g' | '224g' | '448g',
    totalCost: string,
    notes: string,
    image?: string
  ) => Promise<boolean>
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStrain, setNewStrain] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  const [quantity, setQuantity] = useState<'112g' | '224g' | '448g'>('112g');
  const [totalCost, setTotalCost] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddInventory = async () => {
    if (!newStrain || !purchaseDate || !totalCost) {
      return false;
    }

    const success = await addInventoryFunction(
      newStrain,
      purchaseDate,
      quantity,
      totalCost,
      notes,
      selectedImage || undefined
    );

    if (success) {
      // Reset form
      setNewStrain('');
      setPurchaseDate(new Date());
      setQuantity('112g');
      setTotalCost('');
      setNotes('');
      setSelectedImage(null);
      setIsDialogOpen(false);
    }

    return success;
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
