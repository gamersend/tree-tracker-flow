
import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  CheckCircle, 
  XCircle, 
  Upload, 
  Info, 
  FileText, 
  Download,
  Database,
  DatabaseBackup, 
  Import as ImportIcon
} from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Define the types of data that can be imported
type ImportDataType = "sales" | "customers" | "inventory" | "ticks" | "business-supplies";

// Interface for sample data format examples
interface FormatExample {
  header: string;
  data: string[];
  description: string;
}

const Import = () => {
  const [importType, setImportType] = useState<ImportDataType>("sales");
  const [activeTab, setActiveTab] = useState<"import" | "export" | "backup">("import");
  const [inputData, setInputData] = useState("");
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<"input" | "preview" | "complete">("input");
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  // Format examples for each import type
  const formatExamples: Record<ImportDataType, FormatExample> = {
    "sales": {
      header: "Customer,Profit,Date,Strain,Quantity,SalePrice",
      data: [
        "John Doe,70,2023-06-15,OG Kush,3.5,35",
        "Jane Smith,35,2023-06-18,Blue Dream,7,70"
      ],
      description: "Import sales with customer name, profit amount, date (YYYY-MM-DD), strain, quantity in grams, and sale price"
    },
    "customers": {
      header: "Name,Platform,Alias,Trusted",
      data: [
        "John Doe,Signal,johnny_green,Yes",
        "Jane Smith,Telegram,jane420,Yes"
      ],
      description: "Import customers with their name, communication platform, alias/username, and trusted status (Yes/No)"
    },
    "inventory": {
      header: "Strain,Quantity,CostPerGram,THCLevel,CBDLevel,Type,Effects,Notes",
      data: [
        "OG Kush,28,5,22,0.1,Indica,Relaxed;Sleepy,Good for nighttime",
        "Blue Dream,14,6,18,0.5,Hybrid,Creative;Uplifted,Daytime strain"
      ],
      description: "Import inventory with strain name, quantity in grams, cost per gram, THC/CBD levels, type, effects (semicolon-separated), and notes"
    },
    "ticks": {
      header: "Customer,Product,DateGiven,AmountOwed,AmountPaidSoFar,GramsFronted,PaymentDueDate,Notes,Status,RecurringTick",
      data: [
        "John Doe,OG Kush,2023-06-15,50,10,3.5,2023-06-22,First timer,Partial,No",
        "Jane Smith,Blue Dream,2023-06-18,70,0,7,2023-06-25,Regular customer,Unpaid,Yes"
      ],
      description: "Import tick records with customer, product, date given, amounts, due date, notes, status (Unpaid/Partial/Paid), and recurring status"
    },
    "business-supplies": {
      header: "Name,Category,UnitType,CurrentStock,StartingStock,RestockThreshold,CostPerUnit,TotalCost,PurchaseFrequency,LastPurchaseDate,RestockReminderDate,Notes",
      data: [
        "Baggies,Packaging,Pack,50,100,20,0.05,5,Weekly,2023-05-15,2023-06-01,8oz size",
        "Scale,Equipment,Unit,1,1,1,25,25,Never,2022-12-01,,Digital 0.01g precision"
      ],
      description: "Import business supplies with name, category, units, stock levels, costs, purchase info, and notes"
    }
  };

  // Format validation patterns for each type
  const validationPatterns: Record<ImportDataType, RegExp[]> = {
    "sales": [
      /^[^,]+,\d+(\.\d+)?,\d{4}-\d{2}-\d{2},[^,]+,\d+(\.\d+)?,\d+(\.\d+)?$/
    ],
    "customers": [
      /^[^,]+,[^,]+,[^,]+,(Yes|No)$/i
    ],
    "inventory": [
      /^[^,]+,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?,(Indica|Sativa|Hybrid),[^,]*,[^,]*$/i
    ],
    "ticks": [
      /^[^,]+,[^,]+,\d{4}-\d{2}-\d{2},\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?,\d{4}-\d{2}-\d{2}?,[^,]*,(Unpaid|Partial|Paid),(Yes|No)$/i
    ],
    "business-supplies": [
      /^[^,]+,[^,]+,[^,]+,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?,[^,]*,\d{4}-\d{2}-\d{2}?,\d{4}-\d{2}-\d{2}?,[^,]*$/i
    ]
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== 'text/csv' && !uploadedFile.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const content = event.target.result.toString();
        setInputData(content);
      }
    };
    reader.readAsText(uploadedFile);
  };

  // Handle parsing input data
  const parseInputData = () => {
    if (!inputData.trim()) {
      setErrors(["Please enter some data to import or upload a CSV file"]);
      return;
    }

    const lines = inputData
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      setErrors(["No valid data to import"]);
      return;
    }

    // Skip header row if present
    const dataLines = lines[0].toLowerCase() === formatExamples[importType].header.toLowerCase() 
      ? lines.slice(1) 
      : lines;

    const newErrors: string[] = [];
    const newData: any[] = [];

    dataLines.forEach((line, index) => {
      const lineNumber = lines[0].toLowerCase() === formatExamples[importType].header.toLowerCase() 
        ? index + 2 // +2 because of 1-indexed and header row
        : index + 1; // +1 because of 1-indexed

      // Validate line format against pattern
      const isFormatValid = validationPatterns[importType].some(pattern => pattern.test(line));
      
      if (!isFormatValid) {
        newErrors.push(`Line ${lineNumber}: Invalid format. Please check documentation below.`);
        return;
      }

      const parts = line.split(",").map((part) => part.trim());
      
      try {
        switch (importType) {
          case "sales": {
            const [customer, profitStr, dateStr, strain, quantityStr, salePriceStr] = parts;
            const profit = parseFloat(profitStr);
            const quantity = parseFloat(quantityStr);
            const salePrice = parseFloat(salePriceStr);
            
            // Simple date validation
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(dateStr)) {
              newErrors.push(`Line ${lineNumber}: Invalid date format "${dateStr}" (expected: YYYY-MM-DD)`);
              return;
            }
            
            if (isNaN(profit) || isNaN(quantity) || isNaN(salePrice)) {
              newErrors.push(`Line ${lineNumber}: Invalid numeric value`);
              return;
            }
            
            newData.push({
              customer,
              profit,
              date: dateStr,
              strain,
              quantity,
              salePrice
            });
            break;
          }
          case "customers": {
            const [name, platform, alias, trustedStr] = parts;
            const trusted = trustedStr.toLowerCase() === "yes";
            
            newData.push({
              name,
              platform,
              alias,
              trusted,
            });
            break;
          }
          case "inventory": {
            const [strain, quantityStr, costPerGramStr, thcLevelStr, cbdLevelStr, type, effects, notes] = parts;
            const quantity = parseFloat(quantityStr);
            const costPerGram = parseFloat(costPerGramStr);
            const thcLevel = parseFloat(thcLevelStr);
            const cbdLevel = parseFloat(cbdLevelStr);
            
            if (isNaN(quantity) || isNaN(costPerGram) || isNaN(thcLevel) || isNaN(cbdLevel)) {
              newErrors.push(`Line ${lineNumber}: Invalid numeric value`);
              return;
            }
            
            newData.push({
              strain,
              quantity,
              costPerGram,
              thcLevel,
              cbdLevel,
              type,
              effects: effects.split(';'),
              notes
            });
            break;
          }
          case "ticks": {
            const [customer, product, dateGivenStr, amountOwedStr, amountPaidStr, gramsFrontedStr, dueDateStr, notes, status, recurringStr] = parts;
            const amountOwed = parseFloat(amountOwedStr);
            const amountPaid = parseFloat(amountPaidStr);
            const gramsFronted = parseFloat(gramsFrontedStr);
            const recurring = recurringStr.toLowerCase() === "yes";
            
            // Date validation
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(dateGivenStr)) {
              newErrors.push(`Line ${lineNumber}: Invalid date format "${dateGivenStr}" (expected: YYYY-MM-DD)`);
              return;
            }
            
            if (dueDateStr && !dateRegex.test(dueDateStr)) {
              newErrors.push(`Line ${lineNumber}: Invalid date format "${dueDateStr}" (expected: YYYY-MM-DD)`);
              return;
            }
            
            if (isNaN(amountOwed) || isNaN(amountPaid) || isNaN(gramsFronted)) {
              newErrors.push(`Line ${lineNumber}: Invalid numeric value`);
              return;
            }
            
            // Status validation
            if (!["unpaid", "partial", "paid"].includes(status.toLowerCase())) {
              newErrors.push(`Line ${lineNumber}: Invalid status "${status}" (expected: Unpaid, Partial, Paid)`);
              return;
            }
            
            newData.push({
              id: `tick-${Date.now()}-${index}`,
              customer,
              product,
              dateGiven: dateGivenStr,
              amountOwed,
              amountPaid,
              gramsFronted,
              paymentDueDate: dueDateStr || null,
              notes,
              status: status.toLowerCase(),
              recurring,
            });
            break;
          }
          case "business-supplies": {
            const [name, category, unitType, currentStockStr, startingStockStr, restockThresholdStr, costPerUnitStr, totalCostStr, purchaseFrequency, lastPurchaseDateStr, restockReminderDateStr, notes] = parts;
            
            const currentStock = parseInt(currentStockStr);
            const startingStock = parseInt(startingStockStr);
            const restockThreshold = parseInt(restockThresholdStr);
            const costPerUnit = parseFloat(costPerUnitStr);
            const totalCost = parseFloat(totalCostStr);
            
            if (isNaN(currentStock) || isNaN(startingStock) || isNaN(restockThreshold) || isNaN(costPerUnit) || isNaN(totalCost)) {
              newErrors.push(`Line ${lineNumber}: Invalid numeric value`);
              return;
            }
            
            // Date validation
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (lastPurchaseDateStr && !dateRegex.test(lastPurchaseDateStr)) {
              newErrors.push(`Line ${lineNumber}: Invalid date format "${lastPurchaseDateStr}" (expected: YYYY-MM-DD)`);
              return;
            }
            
            if (restockReminderDateStr && !dateRegex.test(restockReminderDateStr)) {
              newErrors.push(`Line ${lineNumber}: Invalid date format "${restockReminderDateStr}" (expected: YYYY-MM-DD)`);
              return;
            }
            
            newData.push({
              id: `supply-${Date.now()}-${index}`,
              name,
              category,
              unitType,
              currentStock,
              startingStock,
              restockThreshold,
              costPerUnit,
              totalCost,
              purchaseFrequency,
              lastPurchaseDate: lastPurchaseDateStr || null,
              restockReminderDate: restockReminderDateStr || null,
              notes
            });
            break;
          }
        }
      } catch (error) {
        newErrors.push(`Line ${lineNumber}: Failed to parse data - ${error}`);
      }
    });

    setErrors(newErrors);
    setParsedData(newData);
    
    if (newErrors.length === 0 && newData.length > 0) {
      setStep("preview");
    }
  };

  // Handle final import
  const handleImport = () => {
    try {
      switch (importType) {
        case "sales": {
          // Get existing sales data
          const existingSalesData = localStorage.getItem('sales');
          const salesData = existingSalesData ? JSON.parse(existingSalesData) : [];
          
          // Add new sales while ensuring proper date format
          const newSalesData = parsedData.map(item => ({
            ...item,
            id: `sale${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date(item.date)
          }));
          
          localStorage.setItem('sales', JSON.stringify([...salesData, ...newSalesData]));
          break;
        }
        case "customers": {
          // Get existing customers data
          const existingCustomersData = localStorage.getItem('customers');
          const customersData = existingCustomersData ? JSON.parse(existingCustomersData) : [];
          
          // Check for duplicates by name
          const existingNames = new Set(customersData.map((c: any) => c.name.toLowerCase()));
          
          const newCustomersData = parsedData.filter(item => {
            if (existingNames.has(item.name.toLowerCase())) {
              return false; // Skip duplicates
            }
            existingNames.add(item.name.toLowerCase());
            return true;
          });
          
          localStorage.setItem('customers', JSON.stringify([...customersData, ...newCustomersData]));
          break;
        }
        case "inventory": {
          // Get existing inventory data
          const existingInventoryData = localStorage.getItem('strains');
          const inventoryData = existingInventoryData ? JSON.parse(existingInventoryData) : [];
          
          // Check for duplicates by strain name
          const existingStrains = new Set(inventoryData.map((i: any) => i.name.toLowerCase()));
          
          const newInventoryData = parsedData.filter(item => {
            if (existingStrains.has(item.strain.toLowerCase())) {
              return false; // Skip duplicates
            }
            existingStrains.add(item.strain.toLowerCase());
            return true;
          }).map(item => ({
            name: item.strain,
            quantity: item.quantity,
            costPerGram: item.costPerGram,
            thcLevel: item.thcLevel,
            cbdLevel: item.cbdLevel,
            type: item.type,
            effects: item.effects,
            notes: item.notes
          }));
          
          localStorage.setItem('strains', JSON.stringify([...inventoryData, ...newInventoryData]));
          break;
        }
        case "ticks": {
          // Get existing ticks data
          const existingTicksData = localStorage.getItem('ticks');
          const ticksData = existingTicksData ? JSON.parse(existingTicksData) : [];
          
          // Convert date strings to Date objects
          const newTicksData = parsedData.map(item => ({
            ...item,
            dateGiven: new Date(item.dateGiven),
            paymentDueDate: item.paymentDueDate ? new Date(item.paymentDueDate) : null
          }));
          
          localStorage.setItem('ticks', JSON.stringify([...ticksData, ...newTicksData]));
          break;
        }
        case "business-supplies": {
          // Get existing supplies data
          const existingSuppliesData = localStorage.getItem('businessSupplies');
          const suppliesData = existingSuppliesData ? JSON.parse(existingSuppliesData) : [];
          
          // Convert date strings to Date objects or null
          const newSuppliesData = parsedData.map(item => ({
            ...item,
            lastPurchaseDate: item.lastPurchaseDate ? new Date(item.lastPurchaseDate) : null,
            restockReminderDate: item.restockReminderDate ? new Date(item.restockReminderDate) : null
          }));
          
          localStorage.setItem('businessSupplies', JSON.stringify([...suppliesData, ...newSuppliesData]));
          break;
        }
      }
      
      toast.success(`${parsedData.length} ${importType} records have been imported successfully`);
      setStep("complete");
    } catch (error) {
      console.error("Import error:", error);
      toast.error(`Failed to import data: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Export all data as JSON
  const handleExportData = () => {
    try {
      const exportData: Record<string, any> = {};
      
      // Collect all data from localStorage
      const dataKeys = ['sales', 'customers', 'strains', 'ticks', 'businessSupplies'];
      
      dataKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          exportData[key] = JSON.parse(data);
        }
      });
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `cannabis-army-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error(`Failed to export data: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Create backup of all data
  const handleCreateBackup = () => {
    try {
      const allData: Record<string, any> = {};
      
      // Collect all data from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              allData[key] = JSON.parse(value);
            }
          } catch (e) {
            // Skip non-JSON values
            console.warn(`Skipped non-JSON value for key: ${key}`);
          }
        }
      }
      
      // Create timestamp for backup
      const timestamp = new Date().toISOString();
      const backupKey = `cannabisArmyBackup_${timestamp}`;
      
      // Store backup in localStorage
      localStorage.setItem(backupKey, JSON.stringify({
        timestamp,
        data: allData
      }));
      
      toast.success("Backup created successfully!");
      
      // Also download a copy
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `cannabis-army-backup-${timestamp.split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Backup error:", error);
      toast.error(`Failed to create backup: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Reset the import process
  const resetImport = () => {
    setInputData("");
    setParsedData([]);
    setErrors([]);
    setFile(null);
    setStep("input");
  };

  // Convert data to CSV format
  const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return "";
    
    // Extract headers from first object
    const headers = Object.keys(data[0]);
    
    // Create header row
    const csvRows = [headers.join(",")];
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle different data types
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return `"${value.join(';')}"`;
        if (typeof value === 'object' && value instanceof Date) return value.toISOString().split('T')[0];
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
        return value;
      });
      csvRows.push(values.join(","));
    }
    
    return csvRows.join("\n");
  };
  
  // Export specific data type to CSV
  const handleExportCSV = (type: ImportDataType) => {
    try {
      let data: any[] = [];
      let filename = "";
      
      switch (type) {
        case "sales":
          data = JSON.parse(localStorage.getItem('sales') || '[]');
          filename = `sales-export-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case "customers":
          data = JSON.parse(localStorage.getItem('customers') || '[]');
          filename = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case "inventory":
          data = JSON.parse(localStorage.getItem('strains') || '[]').map((item: any) => ({
            strain: item.name,
            quantity: item.quantity,
            costPerGram: item.costPerGram,
            thcLevel: item.thcLevel || 0,
            cbdLevel: item.cbdLevel || 0,
            type: item.type || 'Unknown',
            effects: Array.isArray(item.effects) ? item.effects.join(';') : '',
            notes: item.notes || ''
          }));
          filename = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case "ticks":
          data = JSON.parse(localStorage.getItem('ticks') || '[]');
          filename = `ticks-export-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case "business-supplies":
          data = JSON.parse(localStorage.getItem('businessSupplies') || '[]');
          filename = `supplies-export-${new Date().toISOString().split('T')[0]}.csv`;
          break;
      }
      
      if (data.length === 0) {
        toast.info(`No ${type} data to export`);
        return;
      }
      
      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`${type} data exported to CSV successfully!`);
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error(`Failed to export ${type} data: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Import from backup file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          toast.error("Failed to read backup file");
          return;
        }
        
        const backupData = JSON.parse(event.target.result.toString());
        
        // Verify backup data structure
        if (!backupData || typeof backupData !== 'object') {
          toast.error("Invalid backup file format");
          return;
        }
        
        // Show confirmation before overwriting
        if (window.confirm("This will replace your current data with the backup. Continue?")) {
          // Store each data type from backup
          Object.keys(backupData).forEach(key => {
            localStorage.setItem(key, JSON.stringify(backupData[key]));
          });
          
          toast.success("Backup restored successfully!");
          
          // Force page reload to reflect changes
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (error) {
        console.error("Backup import error:", error);
        toast.error(`Failed to import backup: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    reader.readAsText(file);
  };

  // Main render
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Data Management</h1>
          <p className="text-gray-400">Import, export, and backup your cannabis business data</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <ImportIcon className="h-4 w-4" />
            <span>Import</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <DatabaseBackup className="h-4 w-4" />
            <span>Backup & Restore</span>
          </TabsTrigger>
        </TabsList>
      
        {/* IMPORT TAB */}
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import {importType.charAt(0).toUpperCase() + importType.slice(1)} Data</CardTitle>
              <CardDescription>
                Import {importType} data in CSV format. See format instructions below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === "input" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="importType">Data Type</Label>
                      <Select 
                        value={importType} 
                        onValueChange={(value: ImportDataType) => {
                          setImportType(value);
                          setInputData("");
                          setErrors([]);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select import type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="customers">Customers</SelectItem>
                          <SelectItem value="inventory">Inventory</SelectItem>
                          <SelectItem value="ticks">Tick Ledger</SelectItem>
                          <SelectItem value="business-supplies">Business Supplies</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-2">
                      <Label htmlFor="csvFile">Upload CSV File</Label>
                      <div className="flex gap-2 items-center mt-1">
                        <Input
                          id="csvFile"
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="flex-grow"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            const el = document.getElementById('csvFile') as HTMLInputElement;
                            if (el) el.value = '';
                            setFile(null);
                            setInputData("");
                          }}
                          disabled={!file}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="csvData">
                      CSV Data
                      <span className="text-xs text-muted-foreground ml-2">
                        (paste data or upload a file above)
                      </span>
                    </Label>
                    <Textarea
                      id="csvData"
                      placeholder={`${formatExamples[importType].header}\n${formatExamples[importType].data.join('\n')}`}
                      className="min-h-[200px] font-mono text-sm"
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      First line should be header row (can be skipped if data matches format)
                    </p>
                  </div>
                  
                  {errors.length > 0 && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Import Errors</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex justify-end">
                    <Button onClick={parseInputData} className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span>Parse Data</span>
                    </Button>
                  </div>
                </div>
              )}
              
              {step === "preview" && (
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Preview</AlertTitle>
                    <AlertDescription>
                      Review the parsed data before importing. {parsedData.length} records found.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {parsedData.length > 0 && 
                            Object.keys(parsedData[0]).slice(0, 8).map((header) => (
                              <TableHead key={header}>
                                {header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </TableHead>
                            ))
                          }
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedData.slice(0, 10).map((item, index) => (
                          <TableRow key={index}>
                            {Object.keys(item).slice(0, 8).map((key) => (
                              <TableCell key={key}>
                                {Array.isArray(item[key]) 
                                  ? item[key].join('; ')
                                  : item[key] === true 
                                    ? 'Yes'
                                    : item[key] === false
                                      ? 'No'
                                      : String(item[key] || '-')
                                }
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                        {parsedData.length > 10 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground">
                              ...and {parsedData.length - 10} more records
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={resetImport}>Cancel</Button>
                    <Button onClick={handleImport}>
                      Import {parsedData.length} Records
                    </Button>
                  </div>
                </div>
              )}
              
              {step === "complete" && (
                <div className="py-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tree-green/20 text-tree-green mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-medium">Import Successful</h3>
                  <p className="text-gray-400 mt-2">
                    {parsedData.length} {importType} records have been imported successfully
                  </p>
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={resetImport}
                    >
                      Import More Data
                    </Button>
                    <Button
                      onClick={() => window.location.href = `/${importType === "inventory" ? "inventory" : importType === "business-supplies" ? "business-supplies" : importType}`}
                    >
                      View {importType.charAt(0).toUpperCase() + importType.slice(1)}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-slate-800 flex-col items-start">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  {importType === "sales"
                    ? "This will add sales records to your existing sales data."
                    : importType === "customers"
                      ? "This will add new customers to your customer address book."
                      : importType === "inventory"
                        ? "This will add new strains to your inventory."
                        : importType === "ticks"
                          ? "This will add new tick/debt records to your ledger."
                          : "This will add new business supplies to your inventory."}
                </p>
              </div>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Import Format Instructions</CardTitle>
              <CardDescription>
                Follow these formats for successful data imports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sales">
                  <AccordionTrigger>Sales Import Format</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">CSV Header:</h3>
                        <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
                          {formatExamples.sales.header}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Example Data:</h3>
                        <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
                          {formatExamples.sales.data.join('\n')}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Field Descriptions:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                          <li>Customer: Customer's name</li>
                          <li>Profit: Profit amount (numeric)</li>
                          <li>Date: Sale date in YYYY-MM-DD format</li>
                          <li>Strain: Product/strain name</li>
                          <li>Quantity: Amount sold in grams (numeric)</li>
                          <li>SalePrice: Total sale price (numeric)</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="customers">
                  <AccordionTrigger>Customers Import Format</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">CSV Header:</h3>
                        <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
                          {formatExamples.customers.header}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Example Data:</h3>
                        <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
                          {formatExamples.customers.data.join('\n')}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Field Descriptions:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                          <li>Name: Customer's full name</li>
                          <li>Platform: Communication platform (Signal, Telegram, etc.)</li>
                          <li>Alias: Username or nickname</li>
                          <li>Trusted: Yes/No value</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="inventory">
                  <AccordionTrigger>Inventory Import Format</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">CSV Header:</h3>
                        <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
                          {formatExamples.inventory.header}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Example Data:</h3>
                        <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
                          {formatExamples.inventory.data.join('\n')}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Field Descriptions:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                          <li>Strain: Strain/product name</li>
                          <li>Quantity: Amount in grams (numeric)</li>
                          <li>CostPerGram: Cost per gram (numeric)</li>
                          <li>THCLevel: THC percentage (numeric)</li>
                          <li>CBDLevel: CBD percentage (numeric)</li>
                          <li>Type: Indica/Sativa/Hybrid</li>
                          <li>Effects: Semicolon-separated list of effects</li>
                          <li>Notes: Additional information</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="ticks">
                  <AccordionTrigger>Tick Ledger Import Format</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">CSV Header:</h3>
                        <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
                          {formatExamples.ticks.header}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Example Data:</h3>
                        <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
                          {formatExamples.ticks.data.join('\n')}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Field Descriptions:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                          <li>Customer: Customer's name</li>
                          <li>Product: Product/strain name</li>
                          <li>DateGiven: Date in YYYY-MM-DD format</li>
                          <li>AmountOwed: Total debt amount (numeric)</li>
                          <li>AmountPaidSoFar: Amount already paid (numeric)</li>
                          <li>GramsFronted: Quantity in grams (numeric)</li>
                          <li>PaymentDueDate: Due date in YYYY-MM-DD format (can be empty)</li>
                          <li>Notes: Additional information</li>
                          <li>Status: Unpaid/Partial/Paid</li>
                          <li>RecurringTick: Yes/No value</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="supplies">
                  <AccordionTrigger>Business Supplies Import Format</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">CSV Header:</h3>
                        <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
                          {formatExamples["business-supplies"].header}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Example Data:</h3>
                        <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
                          {formatExamples["business-supplies"].data.join('\n')}
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Field Descriptions:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                          <li>Name: Supply item name</li>
                          <li>Category: Category name</li>
                          <li>UnitType: Unit of measurement</li>
                          <li>CurrentStock: Current quantity (numeric)</li>
                          <li>StartingStock: Initial quantity (numeric)</li>
                          <li>RestockThreshold: Reorder point (numeric)</li>
                          <li>CostPerUnit: Cost per unit (numeric)</li>
                          <li>TotalCost: Total cost (numeric)</li>
                          <li>PurchaseFrequency: How often purchased</li>
                          <li>LastPurchaseDate: Date in YYYY-MM-DD format (can be empty)</li>
                          <li>RestockReminderDate: Date in YYYY-MM-DD format (can be empty)</li>
                          <li>Notes: Additional information</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-6 pt-2 border-t border-slate-800">
                <h3 className="font-medium mb-2">Tips for Successful Imports:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>Each record should be on a new line</li>
                  <li>Fields must be separated by commas</li>
                  <li>Make sure dates are in YYYY-MM-DD format</li>
                  <li>Enclose text with commas in quotes (" ")</li>
                  <li>Follow the field order exactly as shown in examples</li>
                  <li>You can copy and paste data from spreadsheets</li>
                  <li>Bulk imports will be merged with existing data</li>
                  <li>Import headers are optional but recommended</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* EXPORT TAB */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export your data to CSV files for backup or analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="rounded-lg border border-slate-800 p-4 hover:border-tree-green transition-colors"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-tree-green/10 p-2">
                      <FileText className="h-5 w-5 text-tree-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Sales Data</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Export all sales records to CSV format
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => handleExportCSV("sales")}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" /> Export Sales
                      </Button>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="rounded-lg border border-slate-800 p-4 hover:border-tree-green transition-colors"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-tree-green/10 p-2">
                      <FileText className="h-5 w-5 text-tree-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Customer Data</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Export all customer records to CSV format
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => handleExportCSV("customers")}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" /> Export Customers
                      </Button>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="rounded-lg border border-slate-800 p-4 hover:border-tree-green transition-colors"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-tree-green/10 p-2">
                      <FileText className="h-5 w-5 text-tree-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Inventory Data</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Export all inventory/strains to CSV format
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => handleExportCSV("inventory")}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" /> Export Inventory
                      </Button>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="rounded-lg border border-slate-800 p-4 hover:border-tree-green transition-colors"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-tree-green/10 p-2">
                      <FileText className="h-5 w-5 text-tree-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Tick Ledger Data</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Export all tick/debt records to CSV format
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => handleExportCSV("ticks")}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" /> Export Ticks
                      </Button>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="rounded-lg border border-slate-800 p-4 hover:border-tree-green transition-colors"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-tree-green/10 p-2">
                      <FileText className="h-5 w-5 text-tree-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Business Supplies Data</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Export all business supplies to CSV format
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => handleExportCSV("business-supplies")}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" /> Export Supplies
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Export Complete Dataset</h3>
                <p className="text-muted-foreground mb-4">
                  Export all your data as a single JSON file that contains all information from your app.
                  This is useful for backups or transferring data to another device.
                </p>
                <Button onClick={handleExportData} className="w-full sm:w-auto">
                  <Database className="mr-2 h-4 w-4" /> Export All Data to JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* BACKUP TAB */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>
                Create backups of your data or restore from previous backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="rounded-lg border border-slate-800 p-6">
                <h3 className="text-lg font-medium">Create Backup</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  This will create a backup of all your current data and save it as a file on your device.
                  You can use this file to restore your data later if needed.
                </p>
                <Button onClick={handleCreateBackup}>
                  <DatabaseBackup className="mr-2 h-4 w-4" /> Create & Download Backup
                </Button>
              </div>
              
              <div className="rounded-lg border border-slate-800 p-6">
                <h3 className="text-lg font-medium">Restore From Backup</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  <strong className="text-tree-red">Warning:</strong> This will replace your current data with the selected backup.
                  Make sure to create a backup of your current data first if needed.
                </p>
                <div className="grid gap-4">
                  <Label htmlFor="backupFile">Select Backup File</Label>
                  <Input
                    id="backupFile"
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Select a Cannabis Army Tracker backup file (.json) to restore
                  </p>
                </div>
              </div>
              
              <Alert className="bg-yellow-900/20 border-yellow-800 text-yellow-300">
                <Info className="h-4 w-4" />
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription className="text-yellow-200/80">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your data is stored in your browser's localStorage</li>
                    <li>Data may be lost if you clear your browser cache/data</li>
                    <li>Create regular backups and store them safely</li>
                    <li>There is no cloud backup - you are responsible for your data</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* AI Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span>🤖</span>
            <span className="ml-2">AI Import Instructions</span>
          </CardTitle>
          <CardDescription>
            Format instructions for AI assistants to help with data imports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Collapsible>
              <CollapsibleTrigger className="w-full text-left flex justify-between items-center bg-slate-800/50 p-3 rounded-md hover:bg-slate-800 transition-colors">
                <span>For AI: Sales Data Import Format</span>
                <span>+</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 p-3 border border-slate-800 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {`# Sales Data Import Format for Cannabis Army Tracker

Please format sales data in CSV format with these columns:
${formatExamples.sales.header}

Example:
${formatExamples.sales.data.join('\n')}

Details:
- Customer: Customer's full name
- Profit: Numerical profit amount 
- Date: YYYY-MM-DD format
- Strain: Product name/strain
- Quantity: Amount in grams
- SalePrice: Total sale price

You can copy this data and paste it into the Import page on the Cannabis Army Tracker.`}
                </pre>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible>
              <CollapsibleTrigger className="w-full text-left flex justify-between items-center bg-slate-800/50 p-3 rounded-md hover:bg-slate-800 transition-colors">
                <span>For AI: Customer Data Import Format</span>
                <span>+</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 p-3 border border-slate-800 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {`# Customer Data Import Format for Cannabis Army Tracker

Please format customer data in CSV format with these columns:
${formatExamples.customers.header}

Example:
${formatExamples.customers.data.join('\n')}

Details:
- Name: Customer's full name
- Platform: Communication platform (Signal, Telegram, etc.)
- Alias: Username or alias
- Trusted: Yes/No value

You can copy this data and paste it into the Import page on the Cannabis Army Tracker.`}
                </pre>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible>
              <CollapsibleTrigger className="w-full text-left flex justify-between items-center bg-slate-800/50 p-3 rounded-md hover:bg-slate-800 transition-colors">
                <span>For AI: Tick Ledger Data Import Format</span>
                <span>+</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 p-3 border border-slate-800 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {`# Tick Ledger Data Import Format for Cannabis Army Tracker

Please format tick ledger data in CSV format with these columns:
${formatExamples.ticks.header}

Example:
${formatExamples.ticks.data.join('\n')}

Details:
- Customer: Customer's name
- Product: Product/strain name
- DateGiven: YYYY-MM-DD format
- AmountOwed: Total debt amount
- AmountPaidSoFar: Amount already paid
- GramsFronted: Quantity in grams
- PaymentDueDate: YYYY-MM-DD format (can be empty)
- Notes: Additional information
- Status: Must be one of: Unpaid, Partial, Paid
- RecurringTick: Yes/No value

You can copy this data and paste it into the Import page on the Cannabis Army Tracker.`}
                </pre>
              </CollapsibleContent>
            </Collapsible>
            
            <div className="rounded-lg border border-slate-800 p-4 bg-slate-800/20">
              <h3 className="font-medium mb-2">AI Request Template</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Ask an AI assistant to format data for you using this template:
              </p>
              <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm overflow-auto">
{`Please convert the following information into a CSV format compatible with the Cannabis Army Tracker's import function for [IMPORT_TYPE]:

[YOUR_RAW_DATA_HERE]

Please ensure it follows the correct format with the proper headers and field order.`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Auto-convert Natural Language Card */}
      <Card className="mt-6 border-tree-purple border-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span>✨</span>
            <span className="ml-2">Natural Language to CSV Converter</span>
            <span className="ml-2 text-xs bg-tree-purple text-white px-2 py-0.5 rounded-full">Beta</span>
          </CardTitle>
          <CardDescription>
            Paste natural language descriptions and convert them to importable CSV format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-800 p-4 bg-slate-800/20">
            <p className="text-sm text-muted-foreground mb-4">
              Future feature: Enter natural language descriptions and our AI will convert them to proper CSV format for import.
            </p>
            <div className="space-y-4 opacity-75 pointer-events-none">
              <Label htmlFor="nlInput">Natural Language Input</Label>
              <Textarea
                id="nlInput"
                placeholder="Enter descriptions like: 'I sold 3.5g of Blue Dream to John for $40 on May 15th with $20 profit'"
                className="min-h-[150px]"
                disabled
              />
              <Button disabled>Convert to CSV</Button>
            </div>
            <p className="text-xs text-tree-purple mt-4">Coming soon in a future update!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Import;

