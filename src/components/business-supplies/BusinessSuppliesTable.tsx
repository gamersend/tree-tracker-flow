
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Edit, Trash2, AlertTriangle } from "lucide-react";
import { BusinessSupply } from "@/hooks/useSupabaseBusinessSupplies";

interface BusinessSuppliesTableProps {
  supplies: BusinessSupply[];
  onEdit: (supply: BusinessSupply) => void;
  onDelete: (id: string) => void;
}

const BusinessSuppliesTable: React.FC<BusinessSuppliesTableProps> = ({
  supplies,
  onEdit,
  onDelete
}) => {
  const isLowStock = (supply: BusinessSupply) => {
    return supply.low_stock_threshold && supply.quantity <= supply.low_stock_threshold;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-tree-green" />
          Business Supplies Inventory
        </CardTitle>
        <CardDescription>
          {supplies.length} supplies in your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        {supplies.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No business supplies found</p>
        ) : (
          <div className="space-y-3">
            {supplies.map((supply) => (
              <div key={supply.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-white">{supply.name}</h3>
                    <Badge variant="outline">{supply.category}</Badge>
                    {isLowStock(supply) && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Quantity:</span>
                      <div className="text-white font-medium">{supply.quantity}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Cost per unit:</span>
                      <div className="text-white font-medium">${Number(supply.cost_per_unit).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Value:</span>
                      <div className="text-white font-medium">
                        ${(supply.quantity * Number(supply.cost_per_unit)).toFixed(2)}
                      </div>
                    </div>
                    {supply.supplier && (
                      <div>
                        <span className="text-gray-400">Supplier:</span>
                        <div className="text-white font-medium">{supply.supplier}</div>
                      </div>
                    )}
                  </div>
                  
                  {supply.notes && (
                    <div className="mt-2 text-sm text-gray-400">{supply.notes}</div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(supply)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(supply.id)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessSuppliesTable;
