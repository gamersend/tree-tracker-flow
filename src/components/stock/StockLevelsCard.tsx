
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import { StockLevel } from "@/hooks/useSupabaseStock";

interface StockLevelsCardProps {
  stockLevels: StockLevel[];
}

const StockLevelsCard: React.FC<StockLevelsCardProps> = ({ stockLevels }) => {
  const lowStockItems = stockLevels.filter(item => 
    item.low_stock_threshold && item.current_stock <= item.low_stock_threshold
  );

  return (
    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-tree-green" />
          Current Stock Levels
        </CardTitle>
        <CardDescription>
          Overview of your current inventory levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stockLevels.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No stock data available</p>
        ) : (
          <div className="space-y-3">
            {lowStockItems.length > 0 && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Low Stock Alert</span>
                </div>
                <div className="space-y-1">
                  {lowStockItems.map((item) => (
                    <div key={item.strain_id} className="text-sm text-red-300">
                      {item.strain_name}: {item.current_stock}{item.quantity_unit}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {stockLevels.map((item) => (
              <div key={item.strain_id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">{item.strain_name}</div>
                  <div className="text-sm text-gray-400">
                    Last updated: {new Date(item.last_updated).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {item.current_stock}{item.quantity_unit}
                  </div>
                  {item.low_stock_threshold && item.current_stock <= item.low_stock_threshold ? (
                    <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">In Stock</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockLevelsCard;
