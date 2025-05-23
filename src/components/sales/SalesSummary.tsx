
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { SaleItem } from "./types";

interface SalesSummaryProps {
  sales: SaleItem[];
}

export const SalesSummary: React.FC<SalesSummaryProps> = ({ sales }) => {
  return (
    <Card className="border-tree-purple/20 bg-gradient-to-br from-slate-950 to-slate-900">
      <CardHeader>
        <CardTitle>Sales Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-sm text-muted-foreground">Total Sales</h3>
            <p className="text-2xl font-bold mt-1">{sales.length}</p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-sm text-muted-foreground">Total Quantity</h3>
            <p className="text-2xl font-bold mt-1">
              {sales.reduce((sum, sale) => sum + sale.quantity, 0).toFixed(1)}g
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-sm text-muted-foreground">Total Revenue</h3>
            <p className="text-2xl font-bold mt-1">
              ${sales.reduce((sum, sale) => sum + sale.salePrice, 0).toFixed(2)}
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-sm text-muted-foreground">Total Profit</h3>
            <p className="text-2xl font-bold mt-1 text-tree-green">
              ${sales.reduce((sum, sale) => sum + sale.profit, 0).toFixed(2)}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
