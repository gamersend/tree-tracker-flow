
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, FileText, Pencil, Trash2, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useSaleParser } from "@/hooks/useSaleParser";

// Type for parsed sale item
type ParsedSale = {
  id?: string;
  customer: string;
  strain: string;
  date: Date | string;
  quantity: number;
  salePrice: number;
  profit: number;
  isTick: boolean;
  paidSoFar?: number;
  rawInput: string;
};

const NaturalLanguageLogger = () => {
  const navigate = useNavigate();
  const [saleText, setSaleText] = useState("");
  const [parsedSale, setParsedSale] = useState<ParsedSale | null>(null);
  const [recentEntries, setRecentEntries] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { parseSaleText } = useSaleParser();

  // Load recent entries from localStorage
  useEffect(() => {
    const savedEntries = loadFromLocalStorage<string[]>("recentSaleEntries", []);
    setRecentEntries(savedEntries);
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
      setParsedSale({
        ...result,
        rawInput: saleText
      });
      saveRecentEntry(saleText);
      toast.success("Sale parsed successfully!");
    } catch (error) {
      toast.error("Failed to parse sale text. Please check the format.");
      console.error("Parsing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add the sale to the main sales table
  const handleAddToSales = () => {
    if (!parsedSale) return;
    
    try {
      // Get existing sales from localStorage
      const existingSales = loadFromLocalStorage<any[]>("sales", []);
      
      // Format the new sale for storage
      const newSale = {
        id: `sale${Date.now()}`,
        strain: parsedSale.strain,
        date: parsedSale.date,
        quantity: parsedSale.quantity,
        customer: parsedSale.customer,
        salePrice: parsedSale.salePrice,
        costPerGram: parsedSale.salePrice ? (parsedSale.salePrice - parsedSale.profit) / parsedSale.quantity : 0,
        profit: parsedSale.profit
      };
      
      // Add to existing sales
      const updatedSales = [...existingSales, newSale];
      saveToLocalStorage("sales", updatedSales);
      
      // If it's a tick, also add to tick ledger
      if (parsedSale.isTick) {
        const tickLedger = loadFromLocalStorage<any[]>("tickLedger", []);
        const newTick = {
          id: `tick${Date.now()}`,
          customer: parsedSale.customer,
          date: parsedSale.date,
          amount: parsedSale.salePrice,
          description: `${parsedSale.quantity}g of ${parsedSale.strain}`,
          paid: parsedSale.paidSoFar || 0,
          remaining: parsedSale.salePrice - (parsedSale.paidSoFar || 0),
          status: "outstanding"
        };
        
        saveToLocalStorage("tickLedger", [...tickLedger, newTick]);
      }
      
      toast.success("Sale added successfully!");
      
      // Clear form or navigate
      setSaleText("");
      setParsedSale(null);
      
      // Optional: Navigate to sales page
      if (window.confirm("Sale added! View it in Sales tab?")) {
        navigate("/sales");
      }
    } catch (error) {
      toast.error("Failed to add sale. Please try again.");
      console.error("Add sale error:", error);
    }
  };

  // Open editor before import
  const handleEditBeforeImport = () => {
    if (!parsedSale) return;
    
    // For now, we'll just allow editing in the form
    toast.info("You can edit the parsed values before adding");
    // Future enhancement: Open a modal with editable fields
  };

  // Clear all inputs
  const handleClearAll = () => {
    setSaleText("");
    setParsedSale(null);
    toast.info("All inputs cleared");
  };

  // Handle keyboard shortcut (Ctrl+Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleProcessText();
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
        {/* Input Card */}
        <Card className="border-tree-purple/20 bg-gradient-to-br from-slate-950 to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" /> Natural Language Input
            </CardTitle>
            <CardDescription>
              Describe your sale in plain English...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="min-h-[200px] bg-slate-800/50 border-slate-700/50 focus:border-tree-purple/50 placeholder:text-slate-500"
              placeholder="Examples:
- Sold 3.5g of Pineapple Express to Dave for $50 on May 20 with $30 profit
- Ticked 14g of Gelato to Claire on May 10, $100 total, no payment yet
- Sold 7g to Tommy for $80 with $40 profit on 4/20"
              value={saleText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
            />
            
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={handleClearAll}
                className="w-full sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear All
              </Button>
              <Button
                onClick={handleProcessText}
                className="w-full sm:w-auto bg-tree-purple hover:bg-tree-purple/80"
                disabled={isProcessing || !saleText.trim()}
              >
                <Brain className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing..." : "Convert Text"}
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
              <Keyboard className="h-3 w-3" /> Tip: Press Ctrl+Enter to convert
            </div>
            
            {recentEntries.length > 0 && (
              <div className="pt-4 border-t border-slate-800 mt-6">
                <Label className="text-sm text-slate-400 mb-2 block">Recent Entries:</Label>
                <div className="space-y-2">
                  {recentEntries.map((entry, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left text-xs py-1 px-3 h-auto border border-slate-800/50 hover:bg-slate-800/50"
                      onClick={() => setSaleText(entry)}
                    >
                      {entry.length > 60 ? entry.substring(0, 60) + "..." : entry}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card className="border-tree-green/20 bg-gradient-to-br from-slate-950 to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">🔍</span> Parsed Result
            </CardTitle>
            <CardDescription>
              Preview of structured data extracted from your text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {parsedSale ? (
                <motion.div
                  key="parsed-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Strain</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Grams</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Tick?</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{parsedSale.customer || "—"}</TableCell>
                        <TableCell>{parsedSale.strain || "—"}</TableCell>
                        <TableCell>
                          {parsedSale.date instanceof Date 
                            ? parsedSale.date.toLocaleDateString()
                            : parsedSale.date || "—"}
                        </TableCell>
                        <TableCell>{parsedSale.quantity}g</TableCell>
                        <TableCell>${parsedSale.salePrice.toFixed(2)}</TableCell>
                        <TableCell>${parsedSale.profit.toFixed(2)}</TableCell>
                        <TableCell>{parsedSale.isTick ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      onClick={handleEditBeforeImport}
                      className="w-full bg-slate-700 hover:bg-slate-600"
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Edit Before Import
                    </Button>
                    <Button
                      onClick={handleAddToSales}
                      className="w-full bg-tree-green hover:bg-tree-green/80"
                    >
                      <Brain className="mr-2 h-4 w-4" /> Add to Sales Tab
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[300px] text-center"
                >
                  <div className="rounded-full bg-slate-800/50 p-6 mb-4">
                    <Brain className="h-10 w-10 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-300">
                    🌿 Ready to blaze your data into CSV?
                  </h3>
                  <p className="text-slate-500 max-w-sm mt-2">
                    Enter a description of your sale in natural language and 
                    click "Convert Text" to see it transformed into structured data.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default NaturalLanguageLogger;
