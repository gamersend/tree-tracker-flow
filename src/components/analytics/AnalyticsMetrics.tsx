
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Package, TrendingUp } from "lucide-react";
import { AnalyticsSummary } from "@/hooks/useSupabaseAnalytics";

interface AnalyticsMetricsProps {
  summary: AnalyticsSummary;
}

const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ summary }) => {
  const metrics = [
    {
      title: "Total Sales",
      value: `$${summary.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500"
    },
    {
      title: "Total Profit",
      value: `$${summary.totalProfit.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-blue-500"
    },
    {
      title: "Total Customers",
      value: summary.totalCustomers.toString(),
      icon: Users,
      color: "text-purple-500"
    },
    {
      title: "Inventory Value",
      value: `$${summary.totalInventoryValue.toFixed(2)}`,
      icon: Package,
      color: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metric.value}</div>
            {metric.title === "Total Sales" && (
              <p className="text-xs text-gray-400 mt-1">
                Avg: ${summary.averageOrderValue.toFixed(2)} per order
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsMetrics;
