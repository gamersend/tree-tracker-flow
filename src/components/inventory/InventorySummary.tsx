
import React from "react";
import { motion } from "framer-motion";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { InventoryItem } from "@/types/inventory";
import { calculateAverageCostPerGram, safeFormatNumber } from "@/utils/inventory-utils";

interface InventorySummaryProps {
  inventoryItems: InventoryItem[];
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ inventoryItems }) => {
  return (
    <Card className="border-tree-green/30 bg-gradient-to-br from-slate-950 to-slate-900">
      <CardHeader>
        <CardTitle>Inventory Summary</CardTitle>
        <CardDescription>
          Overview of your total inventory investments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-sm text-muted-foreground">Total Items</h3>
            <p className="text-2xl font-bold mt-1">{inventoryItems.length}</p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-sm text-muted-foreground">Total Quantity</h3>
            <p className="text-2xl font-bold mt-1">
              {inventoryItems.reduce((sum, item) => sum + item.quantity, 0)}g
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-sm text-muted-foreground">Total Investment</h3>
            <p className="text-2xl font-bold mt-1">
              ${safeFormatNumber(inventoryItems.reduce((sum, item) => sum + item.totalCost, 0))}
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-sm text-muted-foreground">Average Cost/g</h3>
            <p className="text-2xl font-bold mt-1">
              ${safeFormatNumber(calculateAverageCostPerGram(inventoryItems))}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventorySummary;
