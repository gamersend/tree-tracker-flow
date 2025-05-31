
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";

interface Strain {
  id: string;
  name: string;
  cost_per_gram: number;
  image_url?: string;
}

interface InventoryItem {
  id: string;
  strain_id: string;
  strain_name: string;
  quantity: number;
  quantity_unit: string;
}

interface CurrentStockCardProps {
  strains: Strain[];
  inventory: InventoryItem[];
}

const CurrentStockCard: React.FC<CurrentStockCardProps> = ({ strains, inventory }) => {
  // Calculate current stock levels by strain
  const stockLevels = strains.map(strain => {
    const strainInventory = inventory.filter(item => item.strain_id === strain.id);
    const totalStock = strainInventory.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      id: strain.id,
      name: strain.name,
      currentStock: totalStock,
      image: strain.image_url,
      lowStockThreshold: 56 // 2oz threshold
    };
  });

  const lowStockItems = stockLevels.filter(item => 
    item.currentStock > 0 && item.currentStock <= item.lowStockThreshold
  );

  const outOfStockItems = stockLevels.filter(item => item.currentStock === 0);

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
          <p className="text-gray-400 text-center py-4">No strains available</p>
        ) : (
          <div className="space-y-3">
            {lowStockItems.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Low Stock Alert</span>
                </div>
                <div className="space-y-1">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="text-sm text-yellow-300">
                      {item.name}: {item.currentStock}g
                    </div>
                  ))}
                </div>
              </div>
            )}

            {outOfStockItems.length > 0 && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Out of Stock</span>
                </div>
                <div className="space-y-1">
                  {outOfStockItems.map((item) => (
                    <div key={item.id} className="text-sm text-red-300">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {stockLevels.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-tree-purple/20 flex items-center justify-center text-xs">
                      {item.name.substring(0, 2)}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-white">{item.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {item.currentStock}g
                  </div>
                  {item.currentStock === 0 ? (
                    <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                  ) : item.currentStock <= item.lowStockThreshold ? (
                    <Badge className="text-xs bg-yellow-600 hover:bg-yellow-700">Low Stock</Badge>
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

export default CurrentStockCard;
