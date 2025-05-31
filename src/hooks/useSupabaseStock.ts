
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export interface StockTransaction {
  id: string;
  user_id: string;
  strain_id: string;
  strain_name?: string;
  transaction_type: 'purchase' | 'sale' | 'adjustment' | 'waste';
  quantity: number;
  quantity_unit: string;
  price_per_gram?: number;
  total_value?: number;
  notes?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface StockLevel {
  strain_id: string;
  strain_name: string;
  current_stock: number;
  quantity_unit: string;
  last_updated: string;
  low_stock_threshold?: number;
}

export const useSupabaseStock = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('stock_transactions')
        .select(`
          *,
          strains(name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedData: StockTransaction[] = data?.map(transaction => ({
        ...transaction,
        strain_name: transaction.strains?.name || 'Unknown Strain',
        transaction_type: transaction.transaction_type as StockTransaction['transaction_type']
      })) || [];

      setTransactions(formattedData);
    } catch (error) {
      console.error('Error fetching stock transactions:', error);
      toast.error('Failed to load stock transactions');
    }
  };

  const calculateStockLevels = async () => {
    if (!user) return;

    try {
      // Get all strains for the user
      const { data: strains, error: strainsError } = await supabase
        .from('strains')
        .select('id, name')
        .eq('user_id', user.id);

      if (strainsError) throw strainsError;

      const stockLevels: StockLevel[] = [];

      for (const strain of strains || []) {
        // Calculate current stock from inventory
        const { data: inventoryData } = await supabase
          .from('inventory')
          .select('quantity, quantity_unit')
          .eq('user_id', user.id)
          .eq('strain_id', strain.id);

        // Calculate sold quantities from sales
        const { data: salesData } = await supabase
          .from('sales')
          .select('quantity')
          .eq('user_id', user.id)
          .eq('strain_id', strain.id);

        const totalPurchased = inventoryData?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
        const totalSold = salesData?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
        const currentStock = totalPurchased - totalSold;

        stockLevels.push({
          strain_id: strain.id,
          strain_name: strain.name,
          current_stock: currentStock,
          quantity_unit: inventoryData?.[0]?.quantity_unit || 'g',
          last_updated: new Date().toISOString(),
        });
      }

      setStockLevels(stockLevels);
    } catch (error) {
      console.error('Error calculating stock levels:', error);
      toast.error('Failed to calculate stock levels');
    }
  };

  const addStockTransaction = async (
    strainId: string,
    transactionType: StockTransaction['transaction_type'],
    quantity: number,
    quantityUnit: string,
    pricePerGram?: number,
    notes?: string
  ) => {
    if (!user) return false;

    try {
      const totalValue = pricePerGram ? pricePerGram * quantity : undefined;

      const { error } = await supabase
        .from('stock_transactions')
        .insert({
          user_id: user.id,
          strain_id: strainId,
          transaction_type: transactionType,
          quantity,
          quantity_unit: quantityUnit,
          price_per_gram: pricePerGram,
          total_value: totalValue,
          notes,
          date: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Stock transaction added successfully');
      await fetchTransactions();
      await calculateStockLevels();
      return true;
    } catch (error) {
      console.error('Error adding stock transaction:', error);
      toast.error('Failed to add stock transaction');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      calculateStockLevels();
    }
    setLoading(false);
  }, [user]);

  return {
    transactions,
    stockLevels,
    loading,
    fetchTransactions,
    calculateStockLevels,
    addStockTransaction
  };
};
