
import { toast } from "sonner";
import { AlertCircle, Check, X } from "lucide-react";
import { ParsedSale } from "@/components/sale-logger/types";

export const showParsingResultToast = (parsedSale: ParsedSale) => {
  // Check confidence levels and show appropriate notifications
  const { confidence } = parsedSale;
  
  if (confidence && 
     (confidence.strain < 0.5 || 
      confidence.customer < 0.5 || 
      confidence.quantity < 0.5 || 
      confidence.salePrice < 0.5)) {
    toast("Some fields may need review", {
      description: "I wasn't 100% confident about some details. Please check before saving.",
      icon: <AlertCircle className="h-4 w-4" />
    });
  } else {
    toast.success("Sale parsed successfully!");
  }
};

export const showSaleAddedToast = (sale: ParsedSale) => {
  if (sale.isTick) {
    const remainingAmount = sale.salePrice - (sale.paidSoFar || 0);
    
    toast.success("Added to both Sales and Tick Ledger", {
      description: `${sale.customer} has been added to the tick ledger with $${remainingAmount.toFixed(2)} remaining.`
    });
  } else {
    toast.success("Sale added successfully!");
  }
};

export const showErrorToast = (error: any, message = "An error occurred") => {
  console.error(error);
  toast.error(message, {
    description: error.message || "Please try again.",
    icon: <X className="h-4 w-4" />
  });
};
