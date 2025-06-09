
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  strain_id: string;
  strain_name: string;
  purchase_date: string;
  quantity: number;
  quantity_unit: string;
  total_cost: number;
  price_per_gram: number;
  cost_per_ounce: number;
  notes?: string;
  image_url?: string;
}

interface Strain {
  id: string;
  name: string;
  cost_per_gram: number;
  image_url?: string;
  description?: string;
}

export const useSupabaseInventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [strains, setStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch inventory with strain names
  const fetchInventory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          strains!inner(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        id: item.id,
        strain_id: item.strain_id,
        strain_name: item.strains.name,
        purchase_date: item.purchase_date,
        quantity: item.quantity,
        quantity_unit: item.quantity_unit,
        total_cost: item.total_cost,
        price_per_gram: item.price_per_gram,
        cost_per_ounce: item.cost_per_ounce,
        notes: item.notes,
        image_url: item.image_url,
      })) || [];

      setInventory(formattedData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
    }
  };

  // Fetch strains
  const fetchStrains = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('strains')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setStrains(data || []);
    } catch (error) {
      console.error('Error fetching strains:', error);
      toast.error('Failed to load strains');
    }
  };

  // Add inventory item
  const addInventoryItem = async (
    strainName: string,
    purchaseDate: Date,
    quantity: '112g' | '224g' | '448g',
    totalCost: number,
    notes?: string,
    imageUrl?: string
  ) => {
    if (!user) return false;

    try {
      // First, ensure strain exists or create it
      let strain = strains.find(s => s.name === strainName);
      
      if (!strain) {
        const quantityValue = quantity === '112g' ? 112 : quantity === '224g' ? 224 : 448;
        const pricePerGram = totalCost / quantityValue;
        
        const { data: newStrain, error: strainError } = await supabase
          .from('strains')
          .insert({
            user_id: user.id,
            name: strainName,
            cost_per_gram: pricePerGram,
            image_url: imageUrl
          })
          .select()
          .single();

        if (strainError) throw strainError;
        strain = newStrain;
        setStrains(prev => [...prev, newStrain]);
      }

      // Calculate values
      const quantityValue = quantity === '112g' ? 112 : quantity === '224g' ? 224 : 448;
      const pricePerGram = totalCost / quantityValue;
      const costPerOunce = pricePerGram * 28;

      // Add inventory item
      const { error } = await supabase
        .from('inventory')
        .insert({
          user_id: user.id,
          strain_id: strain.id,
          purchase_date: purchaseDate.toISOString().split('T')[0],
          quantity: quantityValue,
          quantity_unit: quantity,
          total_cost: totalCost,
          price_per_gram: pricePerGram,
          cost_per_ounce: costPerOunce,
          notes,
          image_url: imageUrl
        });

      if (error) throw error;

      toast.success('Inventory item added successfully!');
      await fetchInventory();
      return true;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast.error('Failed to add inventory item');
      return false;
    }
  };

  // Update inventory item
  const updateInventoryItem = async (
    id: string,
    strainName: string,
    purchaseDate: Date,
    quantity: '112g' | '224g' | '448g',
    totalCost: number,
    notes?: string,
    imageUrl?: string
  ) => {
    if (!user) return false;

    try {
      // First, ensure strain exists or create it
      let strain = strains.find(s => s.name === strainName);
      
      if (!strain) {
        const quantityValue = quantity === '112g' ? 112 : quantity === '224g' ? 224 : 448;
        const pricePerGram = totalCost / quantityValue;
        
        const { data: newStrain, error: strainError } = await supabase
          .from('strains')
          .insert({
            user_id: user.id,
            name: strainName,
            cost_per_gram: pricePerGram,
            image_url: imageUrl
          })
          .select()
          .single();

        if (strainError) throw strainError;
        strain = newStrain;
        setStrains(prev => [...prev, newStrain]);
      }

      // Calculate values
      const quantityValue = quantity === '112g' ? 112 : quantity === '224g' ? 224 : 448;
      const pricePerGram = totalCost / quantityValue;
      const costPerOunce = pricePerGram * 28;

      // Update inventory item
      const { error } = await supabase
        .from('inventory')
        .update({
          strain_id: strain.id,
          purchase_date: purchaseDate.toISOString().split('T')[0],
          quantity: quantityValue,
          quantity_unit: quantity,
          total_cost: totalCost,
          price_per_gram: pricePerGram,
          cost_per_ounce: costPerOunce,
          notes,
          image_url: imageUrl
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Inventory item updated successfully!');
      await fetchInventory();
      return true;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast.error('Failed to update inventory item');
      return false;
    }
  };

  // Delete inventory item
  const deleteInventoryItem = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Inventory item deleted successfully!');
      await fetchInventory();
      return true;
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast.error('Failed to delete inventory item');
      return false;
    }
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      Promise.all([fetchInventory(), fetchStrains()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  // Filter inventory based on search
  const filteredInventory = inventory.filter(item =>
    item.strain_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    inventory,
    strains,
    loading,
    searchQuery,
    setSearchQuery,
    filteredInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    refetch: () => Promise.all([fetchInventory(), fetchStrains()])
  };
};
