
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface PriceCalculatorProps {
  isCalculatorOpen: boolean;
  setIsCalculatorOpen: (isOpen: boolean) => void;
  targetMargin: number;
  setTargetMargin: (margin: number) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  isCalculatorOpen,
  setIsCalculatorOpen,
  targetMargin,
  setTargetMargin
}) => {
  const [calcCostPerGram, setCalcCostPerGram] = useState("5.00");
  const [calcMargin, setCalcMargin] = useState(targetMargin);
  
  // Calculate price suggestions for common weights
  const calculatePriceMatrix = (costPerGram: number, margin: number) => {
    const commonWeights = [3.5, 7, 14, 28, 56];
    const costFactor = 1 - margin/100;
    
    return commonWeights.map(weight => {
      const totalCost = costPerGram * weight;
      const suggestedPrice = totalCost / costFactor;
      return {
        weight,
        totalCost,
        price: suggestedPrice,
        pricePerGram: suggestedPrice / weight
      };
    });
  };
  
  // Save target margin preference
  const saveTargetMargin = (value: number) => {
    setTargetMargin(value);
    localStorage.setItem('targetMargin', value.toString());
    toast.success(`Default profit margin set to ${value}%`);
  };
  
  return (
    <>
      <DialogTrigger asChild>
        <motion.div
          className="fixed right-6 bottom-6 z-10"
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button size="lg" className="rounded-full h-14 w-14 bg-tree-purple shadow-lg shadow-tree-purple/20">
            <Calculator className="h-6 w-6" />
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <span className="mr-2">🧮</span> Price Calculator
          </DialogTitle>
          <DialogDescription>
            Calculate suggested pricing based on cost and margin
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cost">Cost per Gram ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={calcCostPerGram}
                onChange={(e) => setCalcCostPerGram(e.target.value)}
                placeholder="e.g., 5.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="margin">Profit Margin (%)</Label>
              <div className="grid grid-cols-4 gap-2 items-center">
                <Input
                  id="margin"
                  type="number"
                  min="0"
                  max="100"
                  className="col-span-1"
                  value={calcMargin}
                  onChange={(e) => setCalcMargin(Number(e.target.value))}
                />
                <Slider
                  value={[calcMargin]}
                  min={0}
                  max={100}
                  step={1}
                  className="col-span-3"
                  onValueChange={(value) => setCalcMargin(value[0])}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <span className="mr-2">💵</span> Suggested Prices
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs uppercase text-muted-foreground">
                    <th className="text-left pb-2">Weight</th>
                    <th className="text-right pb-2">Cost</th>
                    <th className="text-right pb-2">Price</th>
                    <th className="text-right pb-2">Per Gram</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {calculatePriceMatrix(parseFloat(calcCostPerGram) || 0, calcMargin).map((item) => (
                    <motion.tr 
                      key={item.weight} 
                      className="text-sm"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    >
                      <td className="py-3">{item.weight}g</td>
                      <td className="text-right py-3">${item.totalCost.toFixed(2)}</td>
                      <td className="text-right py-3 font-medium text-tree-green">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="text-right py-3 text-xs text-muted-foreground">
                        ${item.pricePerGram.toFixed(2)}/g
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p className="flex items-center">
                <HelpCircle className="h-3 w-3 mr-1" />
                Formula: Price = Cost ÷ (1 - Margin%)
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCalculatorOpen(false)}>
            Close
          </Button>
          <Button 
            onClick={() => {
              // Save as default target margin
              saveTargetMargin(calcMargin);
              setIsCalculatorOpen(false);
            }}
            className="bg-tree-purple hover:bg-tree-purple/80"
          >
            Set as Default
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};
