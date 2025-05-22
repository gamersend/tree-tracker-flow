
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Percent, DollarSign, Calculator } from "lucide-react";
import { safeFormatNumber } from "@/utils/inventory-utils";

// Define mate levels with their default discounts
type MateLevel = {
  id: string;
  name: string;
  emoji: string;
  defaultDiscount: number;
};

const defaultMateLevels: MateLevel[] = [
  { id: "acquaintance", name: "Acquaintance", emoji: "🤝", defaultDiscount: 5 },
  { id: "goodcunt", name: "Good Cunt", emoji: "😎", defaultDiscount: 10 },
  { id: "dayone", name: "Day One", emoji: "🐶", defaultDiscount: 20 },
  { id: "rideordie", name: "Ride or Die", emoji: "🔥", defaultDiscount: 30 },
  { id: "tookcharge", name: "Took a Charge for Me", emoji: "💀", defaultDiscount: 50 }
];

const MatesRatesWidget = () => {
  // State for inputs
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [costPrice, setCostPrice] = useState<number | undefined>(undefined);
  const [selectedMateLevel, setSelectedMateLevel] = useState<string>("acquaintance");
  
  // State for customizable discounts
  const [discounts, setDiscounts] = useState<Record<string, number>>(() => {
    const initialDiscounts: Record<string, number> = {};
    defaultMateLevels.forEach(level => {
      initialDiscounts[level.id] = level.defaultDiscount;
    });
    return initialDiscounts;
  });
  
  // State for showing edit discounts panel
  const [showEditDiscounts, setShowEditDiscounts] = useState(false);

  // Calculate derived values
  const getSelectedDiscount = () => {
    return discounts[selectedMateLevel] || 0;
  };

  const calculateMatesRate = () => {
    if (!originalPrice) return 0;
    return originalPrice - (originalPrice * getSelectedDiscount() / 100);
  };

  const calculateProfit = () => {
    const matesRate = calculateMatesRate();
    if (!costPrice || !matesRate) return undefined;
    return matesRate - costPrice;
  };

  const getWarningMessage = () => {
    const profit = calculateProfit();
    
    if (profit === undefined) {
      return { message: "Add cost price to see if you're being a legend or a lunatic", emoji: "🤔" };
    }
    
    if (profit < 0) {
      return { message: "Oi, you're paying them to take it!", emoji: "💀" };
    }
    
    if (profit === 0) {
      return { message: "Break-even... you're generous today", emoji: "🤝" };
    }
    
    if (profit < 10) {
      return { message: "Barely worth the effort, but you're not losing", emoji: "😐" };
    }
    
    return { message: "Nice lil hustle", emoji: "😎" };
  };

  // Update a specific discount
  const updateDiscount = (levelId: string, value: number) => {
    setDiscounts(prev => ({
      ...prev,
      [levelId]: value
    }));
  };

  // Format currency
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "$0.00";
    return `$${safeFormatNumber(value)}`;
  };

  return (
    <div className="space-y-6">
      {/* Main Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Original Price</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              id="originalPrice"
              type="number"
              placeholder="69.99"
              className="pl-8"
              value={originalPrice ?? ""}
              onChange={(e) => setOriginalPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="costPrice">Your Cost (Optional)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              id="costPrice"
              type="number"
              placeholder="40.00"
              className="pl-8"
              value={costPrice ?? ""}
              onChange={(e) => setCostPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
        </div>
      </div>
      
      {/* Mate Level Selection */}
      <div className="space-y-2">
        <Label htmlFor="mateLevel">Mate Level</Label>
        <Select value={selectedMateLevel} onValueChange={setSelectedMateLevel}>
          <SelectTrigger id="mateLevel" className="w-full">
            <SelectValue placeholder="Select Mate Level" />
          </SelectTrigger>
          <SelectContent>
            {defaultMateLevels.map((level) => (
              <SelectItem key={level.id} value={level.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <span>{level.emoji}</span>
                  <span>{level.name}</span>
                  <span className="ml-2 text-muted-foreground">({discounts[level.id]}%)</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Edit Discounts Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="edit-discounts"
            checked={showEditDiscounts}
            onCheckedChange={setShowEditDiscounts}
          />
          <Label htmlFor="edit-discounts" className="flex items-center gap-1">
            <Settings size={14} /> Edit Discounts
          </Label>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Percent size={14} />
          Current: {getSelectedDiscount()}%
        </div>
      </div>
      
      {/* Edit Discounts Panel */}
      <AnimatePresence>
        {showEditDiscounts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border border-dashed border-muted">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {defaultMateLevels.map((level) => (
                    <div key={level.id} className="flex items-center gap-2">
                      <div className="w-8 text-center">{level.emoji}</div>
                      <div className="flex-grow">{level.name}</div>
                      <div className="relative w-24">
                        <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={discounts[level.id]}
                          onChange={(e) => updateDiscount(level.id, parseFloat(e.target.value) || 0)}
                          className="text-right pr-8"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-center text-muted-foreground">
                  <em>Adjust your dodgy discounts here... we won't tell anyone 🤫</em>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Results Section */}
      <motion.div 
        className="border-t border-dashed border-border pt-4 mt-4"
        initial={false}
        animate={{ y: [5, 0], opacity: [0.8, 1] }}
        transition={{ duration: 0.3 }}
        key={`${originalPrice}-${costPrice}-${selectedMateLevel}-${getSelectedDiscount()}`}
      >
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-muted-foreground flex items-center gap-2 animate-pulse-subtle"
          >
            <Calculator size={14} />
            Results
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-sm text-muted-foreground mb-1">Mates Rate</div>
            <motion.div 
              className="text-3xl font-bold text-primary"
              key={`${originalPrice}-${getSelectedDiscount()}`}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {formatCurrency(calculateMatesRate())}
            </motion.div>
            <div className="text-xs text-muted-foreground mt-1">
              {originalPrice ? `Original: ${formatCurrency(originalPrice)}` : "Enter a price"}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-sm text-muted-foreground mb-1">Your Profit</div>
            <motion.div 
              className={`text-3xl font-bold ${calculateProfit() !== undefined ? (calculateProfit()! < 0 ? "text-destructive" : "text-tree-green") : "text-muted-foreground"}`}
              key={`${costPrice}-${calculateMatesRate()}`}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {calculateProfit() !== undefined ? formatCurrency(calculateProfit()!) : "?"}
            </motion.div>
            <div className="text-xs text-muted-foreground mt-1">
              {costPrice ? `Your cost: ${formatCurrency(costPrice)}` : "Add cost for profit"}
            </div>
          </div>
        </div>
        
        {/* Warning Message */}
        <motion.div 
          className="mt-6 text-center p-3 bg-slate-800/30 rounded-lg border border-dashed border-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-lg font-semibold flex items-center justify-center gap-2">
            <span>{getWarningMessage().emoji}</span>
            <span>{getWarningMessage().message}</span>
          </div>
          <div className="text-sm mt-1 text-muted-foreground">
            {originalPrice && getSelectedDiscount() > 0 
              ? `You're giving a ${getSelectedDiscount()}% discount... ${getSelectedDiscount() > 30 ? "are they really worth it?" : "fair enough."}`
              : "Enter your prices to see if this is a ripoff or a good deal for your mate"}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MatesRatesWidget;
