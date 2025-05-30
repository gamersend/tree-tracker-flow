
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Customer {
  id: string;
  name: string;
  platform: string;
  alias?: string;
  notes?: string;
  trusted_buyer: boolean;
  total_orders: number;
  total_spent: number;
  total_profit: number;
  last_purchase?: string;
  emoji: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseCustomers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'spent' | 'orders'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterTrusted, setFilterTrusted] = useState<boolean | null>(null);

  // Fetch customers
  const fetchCustomers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    }
  };

  // Add customer
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'total_orders' | 'total_spent' | 'total_profit' | 'created_at' | 'updated_at'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('customers')
        .insert({
          user_id: user.id,
          ...customerData
        });

      if (error) throw error;

      toast.success('Customer added successfully!');
      await fetchCustomers();
      return true;
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
      return false;
    }
  };

  // Update customer
  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Customer updated successfully!');
      await fetchCustomers();
      return true;
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
      return false;
    }
  };

  // Delete customer
  const deleteCustomer = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Customer deleted successfully!');
      await fetchCustomers();
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
      return false;
    }
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchCustomers().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => 
      (customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.alias && customer.alias.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (filterTrusted === null || customer.trusted_buyer === filterTrusted)
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'spent') {
        return sortOrder === 'asc' 
          ? a.total_spent - b.total_spent 
          : b.total_spent - a.total_spent;
      } else {
        return sortOrder === 'asc' 
          ? a.total_orders - b.total_orders 
          : b.total_orders - a.total_orders;
      }
    });

  return {
    customers,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterTrusted,
    setFilterTrusted,
    filteredCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers
  };
};
