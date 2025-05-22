
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { 
  Brain, 
  FileText, 
  Pencil, 
  Trash2, 
  Keyboard, 
  CalendarIcon, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Copy,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useSaleParser } from "@/hooks/useSaleParser";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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
  confidence?: {
    customer: number;
    strain: number;
    date: number;
    quantity: number;
    salePrice: number;
    profit: number;
  };
};

// Example templates for the user
const EXAMPLE_TEMPLATES = [
  "Sold 3.5g of Blue Dream to Mike for $50 on May 15 with $30 profit",
  "Ticked 7g Northern Lights to Sarah on 5/20, $80 total with $0 paid",
  "Dropped a half oz to Kyle for 150 on May 17, made 80",
  "Fronted Zkittlez (7g) to Tommy on May 5, owes me 100"
];

const NaturalLanguageLogger = () => {
  const navigate = useNavigate();
  const [saleText, setSaleText] = useState("");
  const [parsedSale, setParsedSale] = useState<ParsedSale | null>(null);
  const [editableSale, setEditableSale] = useState<ParsedSale | null>(null);
  const [recentEntries, setRecentEntries] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { parseSaleText, getStrainSuggestions } = useSaleParser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showExamples, setShowExamples] = useState(false);

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

  // Handle using an example template
  const useTemplate = (template: string) => {
    setSaleText(template);
    setShowExamples(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handle using a recent entry
  const useRecentEntry = (entry: string) => {
    setSaleText(entry);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Generate a confidence indicator based on confidence score
  const ConfidenceIndicator = ({ score }: { score: number }) => {
    if (score >= 0.8) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-green-500 ml-1">
                <CheckCircle2 className="inline h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>High confidence (auto-detected)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (score >= 0.5) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-yellow-500 ml-1">
                <CheckCircle2 className="inline h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Medium confidence (please verify)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-red-500 ml-1">
                <AlertCircle className="inline h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Low confidence (please check this field)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
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
            <div className="relative">
              <Textarea
                ref={textareaRef}
                className="min-h-[200px] bg-slate-800/50 border-slate-700/50 focus:border-tree-purple/50 placeholder:text-slate-500"
                placeholder="Examples:
- Sold 3.5g of Pineapple Express to Dave for $50 on May 20 with $30 profit
- Ticked 14g of Gelato to Claire on May 10, $100 total, no payment yet
- Dropped a half oz to Kyle for 150 on May 17, made 80"
                value={saleText}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-6 px-2 text-xs bg-slate-700/30 hover:bg-slate-700/50"
                onClick={() => setShowExamples(!showExamples)}
              >
                <Sparkles className="h-3 w-3 mr-1" /> Examples
              </Button>
              
              {showExamples && (
                <div className="absolute z-10 top-10 right-2 w-80 bg-slate-800 border border-slate-700 rounded-md shadow-lg p-2">
                  <div className="text-xs text-slate-400 mb-2 font-semibold">Click to use template:</div>
                  <div className="space-y-2">
                    {EXAMPLE_TEMPLATES.map((template, i) => (
                      <Button
                        key={i}
                        variant="ghost" 
                        size="sm"
                        className="w-full justify-start text-xs h-auto py-2 border border-slate-700/50 hover:bg-slate-700/50"
                        onClick={() => useTemplate(template)}
                      >
                        {template}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
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
                      onClick={() => useRecentEntry(entry)}
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
              {parsedSale ? 
                "Preview and edit before adding to your records" :
                "Preview of structured data extracted from your text"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {parsedSale && editableSale ? (
                <motion.div
                  key="parsed-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer">Customer Name</Label>
                          <Input
                            id="customer"
                            value={editableSale.customer}
                            onChange={(e) => handleEditableChange('customer', e.target.value)}
                            className={`bg-slate-800/50 border ${
                              parsedSale.confidence && parsedSale.confidence.customer < 0.5 
                                ? 'border-red-500/50' 
                                : 'border-slate-700/50'
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="strain">Strain</Label>
                          <div className="relative">
                            <Select 
                              value={editableSale.strain} 
                              onValueChange={(value) => handleEditableChange('strain', value)}
                            >
                              <SelectTrigger className={`bg-slate-800/50 border ${
                                parsedSale.confidence && parsedSale.confidence.strain < 0.5 
                                  ? 'border-red-500/50' 
                                  : 'border-slate-700/50'
                              }`}>
                                <SelectValue placeholder="Select strain" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                {editableSale.strain && (
                                  <SelectItem value={editableSale.strain}>{editableSale.strain}</SelectItem>
                                )}
                                {getStrainSuggestions().map((strain) => (
                                  strain !== editableSale.strain && <SelectItem key={strain} value={strain}>{strain}</SelectItem>
                                ))}
                                <SelectItem value="Other">Custom (Type Below)</SelectItem>
                              </SelectContent>
                            </Select>
                            {editableSale.strain === "Other" && (
                              <Input
                                className="mt-2 bg-slate-800/50 border-slate-700/50"
                                placeholder="Enter custom strain name"
                                onChange={(e) => handleEditableChange('strain', e.target.value)}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <div className="relative">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-start text-left font-normal bg-slate-800/50 border ${
                                    parsedSale.confidence && parsedSale.confidence.date < 0.5 
                                      ? 'border-red-500/50' 
                                      : 'border-slate-700/50'
                                  }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {editableSale.date instanceof Date
                                    ? format(editableSale.date, "PPP")
                                    : typeof editableSale.date === 'string'
                                      ? editableSale.date
                                      : "Select date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                                <Calendar
                                  mode="single"
                                  selected={editableSale.date instanceof Date ? editableSale.date : new Date()}
                                  onSelect={(date) => handleEditableChange('date', date || new Date())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity (grams)</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={editableSale.quantity}
                            onChange={(e) => handleEditableChange('quantity', parseFloat(e.target.value) || 0)}
                            className={`bg-slate-800/50 border ${
                              parsedSale.confidence && parsedSale.confidence.quantity < 0.5 
                                ? 'border-red-500/50' 
                                : 'border-slate-700/50'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="salePrice">Sale Price ($)</Label>
                          <Input
                            id="salePrice"
                            type="number"
                            value={editableSale.salePrice}
                            onChange={(e) => handleEditableChange('salePrice', parseFloat(e.target.value) || 0)}
                            className={`bg-slate-800/50 border ${
                              parsedSale.confidence && parsedSale.confidence.salePrice < 0.5 
                                ? 'border-red-500/50' 
                                : 'border-slate-700/50'
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profit">Profit ($)</Label>
                          <Input
                            id="profit"
                            type="number"
                            value={editableSale.profit}
                            onChange={(e) => handleEditableChange('profit', parseFloat(e.target.value) || 0)}
                            className={`bg-slate-800/50 border ${
                              parsedSale.confidence && parsedSale.confidence.profit < 0.5 
                                ? 'border-red-500/50' 
                                : 'border-slate-700/50'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="isTick"
                              checked={editableSale.isTick}
                              onChange={(e) => handleEditableChange('isTick', e.target.checked)}
                              className="mr-2"
                            />
                            <Label htmlFor="isTick">Is this a tick/front?</Label>
                          </div>
                        </div>
                        {editableSale.isTick && (
                          <div className="space-y-2">
                            <Label htmlFor="paidSoFar">Paid So Far ($)</Label>
                            <Input
                              id="paidSoFar"
                              type="number"
                              value={editableSale.paidSoFar || 0}
                              onChange={(e) => handleEditableChange('paidSoFar', parseFloat(e.target.value) || 0)}
                              className="bg-slate-800/50 border-slate-700/50"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
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
                          <TableCell className="font-medium">
                            {parsedSale.customer || "—"} 
                            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.customer} />}
                          </TableCell>
                          <TableCell>
                            {parsedSale.strain || "—"}
                            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.strain} />}
                          </TableCell>
                          <TableCell>
                            {parsedSale.date instanceof Date 
                              ? parsedSale.date.toLocaleDateString()
                              : parsedSale.date || "—"}
                            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.date} />}
                          </TableCell>
                          <TableCell>
                            {parsedSale.quantity}g
                            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.quantity} />}
                          </TableCell>
                          <TableCell>
                            ${parsedSale.salePrice.toFixed(2)}
                            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.salePrice} />}
                          </TableCell>
                          <TableCell>
                            ${parsedSale.profit.toFixed(2)}
                            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.profit} />}
                          </TableCell>
                          <TableCell>{parsedSale.isTick ? 
                            <span className="text-yellow-400">Yes</span> : 
                            <span className="text-green-400">No</span>}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={() => setIsEditing(false)}
                          className="w-full bg-slate-700 hover:bg-slate-600"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" /> Cancel Editing
                        </Button>
                        <Button
                          onClick={handleAddToSales}
                          className="w-full bg-tree-green hover:bg-tree-green/80"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                      </>
                    ) : (
                      <>
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
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Add to Sales Tab
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {parsedSale.isTick && (
                    <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-md p-3 text-sm">
                      <div className="font-medium text-yellow-500 mb-1">📝 Tick Sale Detected</div>
                      <p className="text-yellow-300/70">
                        This will be added to both Sales and Tick Ledger. 
                        {parsedSale.paidSoFar ? 
                          ` Initial payment of $${parsedSale.paidSoFar.toFixed(2)} recorded.` : 
                          ` No payment has been recorded yet.`}
                      </p>
                    </div>
                  )}
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
          <CardFooter className="flex justify-center border-t border-slate-800 pt-4">
            <Button 
              variant="link" 
              className="text-xs text-slate-500"
              onClick={() => navigate("/sales")}
            >
              View all entries in the Sales tab
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default NaturalLanguageLogger;
