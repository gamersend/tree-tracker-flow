
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface AnalyticsMetric {
  id: string;
  user_id: string;
  metric_type: string;
  metric_value: number;
  date: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsSummary {
  totalSales: number;
  totalProfit: number;
  totalCustomers: number;
  totalInventoryValue: number;
  averageOrderValue: number;
  topSellingStrains: Array<{ strain: string; quantity: number; revenue: number }>;
  salesTrend: Array<{ date: string; sales: number; profit: number }>;
  customerGrowth: Array<{ date: string; customers: number }>;
}

export const useSupabaseAnalytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });

  const calculateAnalyticsSummary = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get sales data
      const { data: salesData } = await supabase
        .from('sales')
        .select(`
          *,
          strains(name),
          customers(name)
        `)
        .eq('user_id', user.id)
        .gte('date', dateRange.from.toISOString())
        .lte('date', dateRange.to.toISOString());

      // Get customers data
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id);

      // Get inventory data
      const { data: inventoryData } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id);

      // Calculate summary metrics
      const totalSales = salesData?.reduce((sum, sale) => sum + Number(sale.sale_price), 0) || 0;
      const totalProfit = salesData?.reduce((sum, sale) => sum + Number(sale.profit), 0) || 0;
      const totalCustomers = customersData?.length || 0;
      const totalInventoryValue = inventoryData?.reduce((sum, item) => sum + Number(item.total_cost), 0) || 0;
      const averageOrderValue = salesData?.length ? totalSales / salesData.length : 0;

      // Calculate top selling strains
      const strainSales = salesData?.reduce((acc, sale) => {
        const strainName = sale.strains?.name || 'Unknown';
        if (!acc[strainName]) {
          acc[strainName] = { strain: strainName, quantity: 0, revenue: 0 };
        }
        acc[strainName].quantity += Number(sale.quantity);
        acc[strainName].revenue += Number(sale.sale_price);
        return acc;
      }, {} as Record<string, { strain: string; quantity: number; revenue: number }>) || {};

      const topSellingStrains = Object.values(strainSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate sales trend (daily)
      const salesByDate = salesData?.reduce((acc, sale) => {
        const date = new Date(sale.date).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, sales: 0, profit: 0 };
        }
        acc[date].sales += Number(sale.sale_price);
        acc[date].profit += Number(sale.profit);
        return acc;
      }, {} as Record<string, { date: string; sales: number; profit: number }>) || {};

      const salesTrend = Object.values(salesByDate).sort((a, b) => a.date.localeCompare(b.date));

      // Calculate customer growth (monthly)
      const customersByMonth = customersData?.reduce((acc, customer) => {
        const date = new Date(customer.created_at).toISOString().substring(0, 7); // YYYY-MM
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      let cumulativeCustomers = 0;
      const customerGrowth = Object.keys(customersByMonth)
        .sort()
        .map(date => {
          cumulativeCustomers += customersByMonth[date];
          return { date, customers: cumulativeCustomers };
        });

      setSummary({
        totalSales,
        totalProfit,
        totalCustomers,
        totalInventoryValue,
        averageOrderValue,
        topSellingStrains,
        salesTrend,
        customerGrowth
      });

    } catch (error) {
      console.error('Error calculating analytics:', error);
      toast.error('Failed to calculate analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      calculateAnalyticsSummary();
    }
  }, [user, dateRange]);

  return {
    metrics,
    summary,
    loading,
    dateRange,
    setDateRange,
    calculateAnalyticsSummary
  };
};
