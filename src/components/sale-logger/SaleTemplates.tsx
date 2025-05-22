
import React from "react";
import { Button } from "@/components/ui/button";

// Example templates for the user
const EXAMPLE_TEMPLATES = [
  "Sold 3.5g of Blue Dream to Mike for $50 on May 15 with $30 profit",
  "Ticked 7g Northern Lights to Sarah on 5/20, $80 total with $0 paid",
  "Dropped a half oz to Kyle for 150 on May 17, made 80",
  "Fronted Zkittlez (7g) to Tommy on May 5, owes me 100"
];

interface SaleTemplatesProps {
  onUseTemplate: (template: string) => void;
}

export const SaleTemplates = ({ onUseTemplate }: SaleTemplatesProps) => {
  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-400 mb-2 font-semibold">Click to use template:</div>
      {EXAMPLE_TEMPLATES.map((template, i) => (
        <Button
          key={i}
          variant="ghost" 
          size="sm"
          className="w-full justify-start text-xs h-auto py-2 border border-slate-700/50 hover:bg-slate-700/50"
          onClick={() => onUseTemplate(template)}
        >
          {template}
        </Button>
      ))}
    </div>
  );
};
