
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface TickEntry {
  id: string;
  customer_id: string;
  customer_name?: string;
  strain_id?: string;
  strain_name?: string;
  sale_id?: string;
  amount: number;
  paid: number;
  remaining: number;
  description: string;
  date: string;
  due_date?: string;
  status: 'outstanding' | 'partial' | 'paid';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseTickLedger = () => {
  const { user } = useAuth();
  const [tickEntries, setTickEntries] = useState<TickEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tick entries with customer and strain names
  const fetchTickEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tick_ledger')
        .select(`
          *,
          customers!tick_ledger_customer_id_fkey(name),
          strains!tick_ledger_strain_id_fkey(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tick entries:', error);
        throw error;
      }

      const formattedEntries = data?.map(entry => ({
        ...entry,
        customer_name: entry.customers?.name || 'Unknown Customer',
        strain_name: entry.strains?.name || undefined
      })) || [];

      setTickEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching tick entries:', error);
      toast.error('Failed to load tick entries');
    } finally {
      setLoading(false);
    }
  };

  // Add new tick entry
  const addTickEntry = async (entryData: Omit<TickEntry, 'id' | 'created_at' | 'updated_at' | 'customer_name' | 'strain_name'>) => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      // Ensure required fields are present
      if (!entryData.customer_id || !entryData.description || entryData.amount <= 0) {
        toast.error('Please fill in all required fields');
        return false;
      }

      const insertData = {
        user_id: user.id,
        customer_id: entryData.customer_id,
        strain_id: entryData.strain_id || null,
        amount: entryData.amount,
        paid: entryData.paid || 0,
        remaining: entryData.remaining,
        description: entryData.description,
        date: entryData.date,
        due_date: entryData.due_date || null,
        status: entryData.status,
        notes: entryData.notes || null,
        sale_id: entryData.sale_id || null
      };

      const { error } = await supabase
        .from('tick_ledger')
        .insert(insertData);

      if (error) {
        console.error('Error adding tick entry:', error);
        throw error;
      }

      toast.success('Tick entry added successfully!');
      await fetchTickEntries();
      return true;
    } catch (error) {
      console.error('Error adding tick entry:', error);
      toast.error('Failed to add tick entry');
      return false;
    }
  };

  // Update tick entry
  const updateTickEntry = async (id: string, updates: Partial<TickEntry>) => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      // Remove non-database fields from updates
      const { customer_name, strain_name, created_at, updated_at, ...dbUpdates } = updates;

      const { error } = await supabase
        .from('tick_ledger')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating tick entry:', error);
        throw error;
      }

      toast.success('Tick entry updated successfully!');
      await fetchTickEntries();
      return true;
    } catch (error) {
      console.error('Error updating tick entry:', error);
      toast.error('Failed to update tick entry');
      return false;
    }
  };

  // Delete tick entry
  const deleteTickEntry = async (id: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase
        .from('tick_ledger')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting tick entry:', error);
        throw error;
      }

      toast.success('Tick entry deleted successfully!');
      await fetchTickEntries();
      return true;
    } catch (error) {
      console.error('Error deleting tick entry:', error);
      toast.error('Failed to delete tick entry');
      return false;
    }
  };

  // Make payment on tick entry
  const makePayment = async (id: string, paymentAmount: number) => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    if (paymentAmount <= 0) {
      toast.error('Payment amount must be greater than 0');
      return false;
    }

    try {
      // Get current entry
      const { data: currentEntry, error: fetchError } = await supabase
        .from('tick_ledger')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current entry:', fetchError);
        throw fetchError;
      }

      if (!currentEntry) {
        toast.error('Tick entry not found');
        return false;
      }

      const newPaidAmount = (currentEntry.paid || 0) + paymentAmount;
      const newRemainingAmount = currentEntry.amount - newPaidAmount;
      
      // Determine new status
      let newStatus: 'outstanding' | 'partial' | 'paid' = 'outstanding';
      if (newRemainingAmount <= 0) {
        newStatus = 'paid';
      } else if (newPaidAmount > 0) {
        newStatus = 'partial';
      }

      const { error } = await supabase
        .from('tick_ledger')
        .update({
          paid: newPaidAmount,
          remaining: Math.max(0, newRemainingAmount),
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error making payment:', error);
        throw error;
      }

      toast.success('Payment recorded successfully!');
      await fetchTickEntries();
      return true;
    } catch (error) {
      console.error('Error making payment:', error);
      toast.error('Failed to record payment');
      return false;
    }
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchTickEntries();
    } else {
      setLoading(false);
      setTickEntries([]);
    }
  }, [user]);

  // Calculate summary stats
  const totalOutstanding = tickEntries
    .filter(entry => entry.status !== 'paid')
    .reduce((sum, entry) => sum + entry.remaining, 0);

  const totalPaid = tickEntries.reduce((sum, entry) => sum + (entry.paid || 0), 0);

  const overdueTicks = tickEntries.filter(entry => 
    entry.status !== 'paid' && 
    entry.due_date && 
    new Date(entry.due_date) < new Date()
  );

  return {
    tickEntries,
    loading,
    addTickEntry,
    updateTickEntry,
    deleteTickEntry,
    makePayment,
    refetch: fetchTickEntries,
    totalOutstanding,
    totalPaid,
    overdueTicks: overdueTicks.length
  };
};
