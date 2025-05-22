import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/utils";
import { useSaleParser } from "@/hooks/use-sale-parser";
import { ParsedSale } from "@/components/sale-logger/types";
import { InputCard } from "@/components/sale-logger/InputCard";
import { PreviewCard } from "@/components/sale-logger/PreviewCard";
import { AlertCircle } from "lucide-react";

const NaturalLanguageLogger = () => {
  const [saleText, setSaleText] = useState("");
  const [parsedSale, setParsedSale] = useState<ParsedSale | null>(null);
  const [editableSale, setEditableSale] = useState<ParsedSale | null>(null);
  const [recentEntries, setRecentEntries] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { parseSaleText, getStrainSuggestions } = useSaleParser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load recent entries from localStorage
  useEffect(() => {
    const savedEntries = loadFromLocalStorage<string[]>("recentSaleEntries", []);
    setRecentEntries(savedEntries);
    
    // Focus the textarea on component mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Save recent entries to localStorage
  const saveRecentEntry = (entry: string) => {
    if (!entry.trim()) return;
    
    const updatedEntries = [entry, ...recentEntries.filter(e => e !== entry)].slice(0, 5);
    setRecentEntries(updatedEntries);
    saveToLocalStorage("recentSaleEntries", updatedEntries);
  };

  // Handle text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSaleText(e.target.value);
    if (parsedSale) {
      setParsedSale(null);
      setEditableSale(null);
      setIsEditing(false);
    }
  };

  // Process the sale text
  const handleProcessText = () => {
    if (!saleText.trim()) {
      toast.error("Please enter a sale description");
      return;
    }
    
    setIsProcessing(true);
    try {
      const result = parseSaleText(saleText);
      const newParsedSale = {
        ...result,
        rawInput: saleText
      };
      
      setParsedSale(newParsedSale);
      setEditableSale(newParsedSale);
      saveRecentEntry(saleText);
      
      // Check confidence levels and show appropriate notifications
      const { confidence } = result;
      
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
      
    } catch (error) {
      toast.error("Failed to parse sale text. Please check the format.");
      console.error("Parsing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add the sale to the main sales table
  const handleAddToSales = () => {
    if (!editableSale) return;
    
    try {
      // Get existing sales from localStorage
      const existingSales = loadFromLocalStorage<any[]>("sales", []);
      
      // Format the new sale for storage
      const newSale = {
        id: `sale${Date.now()}`,
        strain: editableSale.strain,
        date: editableSale.date,
        quantity: editableSale.quantity,
        customer: editableSale.customer,
        salePrice: editableSale.salePrice,
        costPerGram: editableSale.salePrice ? (editableSale.salePrice - editableSale.profit) / editableSale.quantity : 0,
        profit: editableSale.profit
      };
      
      // Add to existing sales
      const updatedSales = [...existingSales, newSale];
      saveToLocalStorage("sales", updatedSales);
      
      // If it's a tick, also add to tick ledger
      if (editableSale.isTick) {
        const tickLedger = loadFromLocalStorage<any[]>("tickLedger", []);
        const newTick = {
          id: `tick${Date.now()}`,
          customer: editableSale.customer,
          date: editableSale.date,
          amount: editableSale.salePrice,
          description: `${editableSale.quantity}g of ${editableSale.strain}`,
          paid: editableSale.paidSoFar || 0,
          remaining: editableSale.salePrice - (editableSale.paidSoFar || 0),
          status: "outstanding"
        };
        
        saveToLocalStorage("tickLedger", [...tickLedger, newTick]);
        
        toast.success("Added to both Sales and Tick Ledger", {
          description: `${editableSale.customer} has been added to the tick ledger with $${newTick.remaining.toFixed(2)} remaining.`
        });
      } else {
        toast.success("Sale added successfully!");
      }
      
      // Clear form for next entry
      setSaleText("");
      setParsedSale(null);
      setEditableSale(null);
      setIsEditing(false);
      
      // Focus the textarea for the next entry
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (error) {
      toast.error("Failed to add sale. Please try again.");
      console.error("Add sale error:", error);
    }
  };

  // Open editor before import
  const handleEditBeforeImport = () => {
    if (!parsedSale) return;
    setIsEditing(true);
  };

  // Handle changes to editable fields
  const handleEditableChange = (field: keyof ParsedSale, value: any) => {
    if (!editableSale) return;
    
    setEditableSale({
      ...editableSale,
      [field]: value
    });
  };

  // Clear all inputs
  const handleClearAll = () => {
    setSaleText("");
    setParsedSale(null);
    setEditableSale(null);
    setIsEditing(false);
    toast.info("All inputs cleared");
  };

  // Handle keyboard shortcut (Ctrl+Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleProcessText();
    }
  };

  // Handle using a recent entry
  const useRecentEntry = (entry: string) => {
    setSaleText(entry);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <motion.h1
            className="text-3xl font-bold text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="mr-2">✍️</span> Quick Sale Entry
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Describe your sales in plain English and convert them to structured data
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InputCard 
          saleText={saleText}
          onTextChange={handleTextChange}
          onProcessText={handleProcessText}
          onClearAll={handleClearAll}
          handleKeyDown={handleKeyDown}
          isProcessing={isProcessing}
          recentEntries={recentEntries}
          onUseRecentEntry={useRecentEntry}
          textareaRef={textareaRef}
        />

        <PreviewCard 
          parsedSale={parsedSale}
          editableSale={editableSale}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleEditBeforeImport={handleEditBeforeImport}
          handleAddToSales={handleAddToSales}
          getStrainSuggestions={getStrainSuggestions}
          handleEditableChange={handleEditableChange}
        />
      </div>
    </motion.div>
  );
};

export default NaturalLanguageLogger;
