
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { getSecureErrorMessage, validateSaleInput } from '@/utils/security';

interface Sale {
  id: string;
  customer_id?: string;
  strain_id: string;
  date: string;
  quantity: number;
  sale_price: number;
  cost_per_gram: number;
  profit: number;
  payment_method?: string;
  notes?: string;
  image_url?: string;
  customer_name?: string;
  strain_name?: string;
}

export const useSupabaseSales = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sales with customer and strain names
  const fetchSales = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers(name),
          strains!inner(name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(sale => ({
        id: sale.id,
        customer_id: sale.customer_id,
        strain_id: sale.strain_id,
        date: sale.date,
        quantity: sale.quantity,
        sale_price: sale.sale_price,
        cost_per_gram: sale.cost_per_gram,
        profit: sale.profit,
        payment_method: sale.payment_method,
        notes: sale.notes,
        image_url: sale.image_url,
        customer_name: sale.customers?.name,
        strain_name: sale.strains.name,
      })) || [];

      setSales(formattedData);
    } catch (error) {
      console.error('Error fetching sales:', error);
      const secureMessage = getSecureErrorMessage(error, 'Failed to load sales');
      toast.error(secureMessage);
    }
  };

  // Add sale with validation
  const addSale = async (saleData: {
    customer_id?: string;
    strain_id: string;
    date: Date;
    quantity: number;
    sale_price: number;
    cost_per_gram: number;
    profit: number;
    payment_method?: string;
    notes?: string;
    image_url?: string;
  }) => {
    if (!user) return false;

    // Validate sale data before submission
    const validation = validateSaleInput(saleData.quantity, saleData.sale_price);
    if (!validation.isValid) {
      toast.error(validation.errors.join(', '));
      return false;
    }

    try {
      const { error } = await supabase
        .from('sales')
        .insert({
          user_id: user.id,
          customer_id: saleData.customer_id,
          strain_id: saleData.strain_id,
          date: saleData.date.toISOString(),
          quantity: saleData.quantity,
          sale_price: saleData.sale_price,
          cost_per_gram: saleData.cost_per_gram,
          profit: saleData.profit,
          payment_method: saleData.payment_method,
          notes: saleData.notes,
          image_url: saleData.image_url
        });

      if (error) throw error;

      toast.success('Sale added successfully!');
      await fetchSales();
      return true;
    } catch (error) {
      console.error('Error adding sale:', error);
      const secureMessage = getSecureErrorMessage(error, 'Failed to add sale');
      toast.error(secureMessage);
      return false;
    }
  };

  // Update sale
  const updateSale = async (id: string, updates: Partial<Sale>) => {
    if (!user) return false;

    // Validate numeric fields if they're being updated
    if (updates.quantity !== undefined || updates.sale_price !== undefined) {
      const quantity = updates.quantity ?? 0;
      const price = updates.sale_price ?? 0;
      const validation = validateSaleInput(quantity, price);
      if (!validation.isValid) {
        toast.error(validation.errors.join(', '));
        return false;
      }
    }

    try {
      const { error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Sale updated successfully!');
      await fetchSales();
      return true;
    } catch (error) {
      console.error('Error updating sale:', error);
      const secureMessage = getSecureErrorMessage(error, 'Failed to update sale');
      toast.error(secureMessage);
      return false;
    }
  };

  // Delete sale - FIXED IMPLEMENTATION
  const deleteSale = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Sale deleted successfully!');
      await fetchSales();
      return true;
    } catch (error) {
      console.error('Error deleting sale:', error);
      const secureMessage = getSecureErrorMessage(error, 'Failed to delete sale');
      toast.error(secureMessage);
      return false;
    }
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchSales().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    sales,
    loading,
    addSale,
    updateSale,
    deleteSale,
    refetch: fetchSales
  };
};
