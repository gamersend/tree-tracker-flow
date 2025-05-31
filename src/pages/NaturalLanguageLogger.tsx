
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/utils";
import { useSaleParser } from "@/hooks/use-sale-parser";
import { ParsedSale } from "@/hooks/sale-parser/types";
import { InputCard } from "@/components/sale-logger/InputCard";
import { PreviewCard } from "@/components/sale-logger/PreviewCard";
import { useSupabaseSales } from "@/hooks/useSupabaseSales";
import { useSupabaseCustomers } from "@/hooks/useSupabaseCustomers";
import { useSupabaseInventory } from "@/hooks/useSupabaseInventory";
import { useSupabaseTickLedger } from "@/hooks/useSupabaseTickLedger";
import { useAuth } from "@/hooks/useAuth";
import { showParsingResultToast, showSaleAddedToast, showErrorToast } from "@/utils/toast-helpers";

const NaturalLanguageLogger = () => {
  const { user } = useAuth();
  const [saleText, setSaleText] = useState("");
  const [parsedSale, setParsedSale] = useState<ParsedSale | null>(null);
  const [editableSale, setEditableSale] = useState<ParsedSale | null>(null);
  const [recentEntries, setRecentEntries] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSale, setIsAddingSale] = useState(false);
  
  const { parseSaleText, getStrainSuggestions } = useSaleParser();
  const { addSale } = useSupabaseSales();
  const { customers, addCustomer, refetch: refetchCustomers } = useSupabaseCustomers();
  const { strains, addInventoryItem } = useSupabaseInventory();
  const { addTickEntry } = useSupabaseTickLedger();
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
      
      showParsingResultToast(newParsedSale);
      
    } catch (error) {
      showErrorToast(error, "Failed to parse sale text. Please check the format.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Find or create customer
  const findOrCreateCustomer = async (customerName: string) => {
    if (!customerName || customerName.toLowerCase() === 'walk-in') {
      return null; // No customer for walk-in sales
    }

    // Look for existing customer
    const existingCustomer = customers.find(c => 
      c.name.toLowerCase() === customerName.toLowerCase()
    );

    if (existingCustomer) {
      return existingCustomer.id;
    }

    // Create new customer with required fields
    const success = await addCustomer({
      name: customerName,
      platform: 'Direct',
      trusted_buyer: false,
      emoji: '🌿',
      alias: '',
      notes: ''
    });

    if (!success) {
      return null;
    }

    // Refresh customers list and find the newly created customer
    await refetchCustomers();
    
    // Wait a bit for the refresh to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Re-fetch to get the updated customer list
    const updatedCustomers = await refetchCustomers();
    
    // Find the newly created customer
    const newCustomer = customers.find(c => 
      c.name.toLowerCase() === customerName.toLowerCase()
    );

    return newCustomer?.id || null;
  };

  // Find or create strain
  const findOrCreateStrain = async (strainName: string, costPerGram: number) => {
    if (!strainName) {
      throw new Error("Strain name is required");
    }

    // Look for existing strain
    const existingStrain = strains.find(s => 
      s.name.toLowerCase() === strainName.toLowerCase()
    );

    if (existingStrain) {
      return existingStrain.id;
    }

    // Create new strain by adding an inventory item
    const success = await addInventoryItem(
      strainName,
      new Date(),
      '112g',
      costPerGram * 112, // total cost for 112g
      'Auto-created from sale entry'
    );

    if (!success) {
      throw new Error("Failed to create strain");
    }

    // Find the newly created strain
    const newStrain = strains.find(s => 
      s.name.toLowerCase() === strainName.toLowerCase()
    );

    if (!newStrain) {
      throw new Error("Failed to find newly created strain");
    }

    return newStrain.id;
  };

  // Add the sale to Supabase
  const handleAddToSales = async () => {
    if (!editableSale || !user) {
      toast.error("Please ensure you're logged in and have a valid sale to add");
      return;
    }
    
    setIsAddingSale(true);
    
    try {
      // Calculate cost per gram from profit and sale price
      const costPerGram = editableSale.salePrice > 0 && editableSale.quantity > 0 
        ? (editableSale.salePrice - editableSale.profit) / editableSale.quantity 
        : 5; // Default fallback cost

      // Find or create customer
      const customerId = await findOrCreateCustomer(editableSale.customer);
      
      // Find or create strain
      const strainId = await findOrCreateStrain(editableSale.strain, costPerGram);

      // Prepare sale data - ensure we have a proper Date object
      const saleDate = editableSale.date instanceof Date ? editableSale.date : new Date(editableSale.date);
      
      const saleData = {
        customer_id: customerId,
        strain_id: strainId,
        date: saleDate, // Pass as Date object
        quantity: editableSale.quantity,
        sale_price: editableSale.salePrice,
        cost_per_gram: costPerGram,
        profit: editableSale.profit,
        payment_method: editableSale.isTick ? 'Tick' : 'Cash',
        notes: editableSale.rawInput || saleText
      };

      // Add the sale
      const success = await addSale(saleData);
      
      if (!success) {
        throw new Error("Failed to add sale to database");
      }

      // If it's a tick sale, add to tick ledger
      if (editableSale.isTick && customerId) {
        const remainingAmount = editableSale.salePrice - (editableSale.paidSoFar || 0);
        
        await addTickEntry({
          customer_id: customerId,
          amount: editableSale.salePrice,
          paid: editableSale.paidSoFar || 0,
          remaining: remainingAmount,
          description: `${editableSale.quantity}g of ${editableSale.strain}`,
          date: saleDate.toISOString(),
          status: 'outstanding' as const
        });
      }

      // IMPORTANT: Refresh customers list after successful sale
      await refetchCustomers();

      showSaleAddedToast(editableSale);
      
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
      console.error('Error adding sale:', error);
      showErrorToast(error, "Failed to add sale. Please try again.");
    } finally {
      setIsAddingSale(false);
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

  // Show login message if not authenticated
  if (!user) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
            <p className="text-gray-400">Please sign in to use the Quick Sale feature.</p>
          </div>
        </div>
      </motion.div>
    );
  }

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
            Describe your sales in plain English and save them directly to your database
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
          isAddingSale={isAddingSale}
        />
      </div>
    </motion.div>
  );
};

export default NaturalLanguageLogger;
