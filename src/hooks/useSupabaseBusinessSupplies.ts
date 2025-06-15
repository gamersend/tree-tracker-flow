
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface BusinessSupply {
  id: string;
  user_id: string;
  name: string;
  category: string;
  quantity: number;
  cost_per_unit: number;
  supplier?: string;
  notes?: string;
  low_stock_threshold?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseBusinessSupplies = () => {
  const { user } = useAuth();
  const [supplies, setSupplies] = useState<BusinessSupply[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchSupplies = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('business_supplies')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setSupplies(data || []);
    } catch (error) {
      console.error('Error fetching business supplies:', error);
      toast.error('Failed to load business supplies');
    } finally {
      setLoading(false);
    }
  };

  const addSupply = async (supply: Omit<BusinessSupply, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('business_supplies')
        .insert({
          ...supply,
          user_id: user.id
        });

      if (error) throw error;

      toast.success('Business supply added successfully');
      await fetchSupplies();
      return true;
    } catch (error) {
      console.error('Error adding business supply:', error);
      toast.error('Failed to add business supply');
      return false;
    }
  };

  const updateSupply = async (id: string, updates: Partial<BusinessSupply>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('business_supplies')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Business supply updated successfully');
      await fetchSupplies();
      return true;
    } catch (error) {
      console.error('Error updating business supply:', error);
      toast.error('Failed to update business supply');
      return false;
    }
  };

  const deleteSupply = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('business_supplies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Business supply deleted successfully');
      await fetchSupplies();
      return true;
    } catch (error) {
      console.error('Error deleting business supply:', error);
      toast.error('Failed to delete business supply');
      return false;
    }
  };

  const filteredSupplies = supplies.filter(supply => {
    const matchesSearch = supply.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supply.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || supply.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(supplies.map(supply => supply.category))];
  const lowStockSupplies = supplies.filter(supply => 
    supply.low_stock_threshold && supply.quantity <= supply.low_stock_threshold
  );

  useEffect(() => {
    fetchSupplies();
  }, [user]);

  return {
    supplies,
    filteredSupplies,
    categories,
    lowStockSupplies,
    loading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    addSupply,
    updateSupply,
    deleteSupply,
    fetchSupplies
  };
};
