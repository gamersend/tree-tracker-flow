
import { useState } from 'react';
import { toast } from 'sonner';
import { ImportDataType, FormatExample } from '@/components/import/types';

export const useImportData = (importType: ImportDataType, inputData: string) => {
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<"input" | "preview" | "complete">("input");
  
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

  // Reset the import process
  const resetImport = () => {
    setParsedData([]);
    setErrors([]);
    setStep("input");
  };

  return {
    parsedData,
    errors,
    step,
    formatExamples,
    parseInputData,
    handleImport,
    resetImport,
  };
};
