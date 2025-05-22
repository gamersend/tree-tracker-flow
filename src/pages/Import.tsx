
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
import { CheckCircle, XCircle, Upload, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Import = () => {
  const [importType, setImportType] = useState<"sales" | "customers">("sales");
  const [inputData, setInputData] = useState("");
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<"input" | "preview" | "complete">("input");
  const { toast } = useToast();

  // Handle parsing input data
  const parseInputData = () => {
    if (!inputData.trim()) {
      setErrors(["Please enter some data to import"]);
      return;
    }

    const lines = inputData
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length ===0) {
      setErrors(["No valid data to import"]);
      return;
    }

    const newErrors: string[] = [];
    const newData: any[] = [];

    lines.forEach((line, index) => {
      const parts = line.split(",").map((part) => part.trim());
      
      if (importType === "sales") {
        if (parts.length < 3) {
          newErrors.push(`Line ${index + 1}: Not enough values (expected: Customer, Profit, Date)`);
          return;
        }
        
        const [customer, profitStr, dateStr] = parts;
        const profit = parseFloat(profitStr);
        
        if (isNaN(profit)) {
          newErrors.push(`Line ${index + 1}: Invalid profit amount "${profitStr}"`);
          return;
        }
        
        // Simple date validation
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
          newErrors.push(`Line ${index + 1}: Invalid date format "${dateStr}" (expected: YYYY-MM-DD)`);
          return;
        }
        
        newData.push({
          customer,
          profit,
          date: dateStr,
        });
      } else {
        // Customer import
        if (parts.length < 3) {
          newErrors.push(`Line ${index + 1}: Not enough values (expected: Name, Platform, Alias, Trusted)`);
          return;
        }
        
        const [name, platform, alias, trustedStr = "No"] = parts;
        const trusted = trustedStr.toLowerCase() === "yes";
        
        newData.push({
          name,
          platform,
          alias,
          trusted,
        });
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
    // This is where the data would be sent to the backend
    toast({
      title: "Data imported successfully",
      description: `${parsedData.length} ${importType} records have been imported`,
    });
    
    setStep("complete");
  };
  
  // Reset the import process
  const resetImport = () => {
    setInputData("");
    setParsedData([]);
    setErrors([]);
    setStep("input");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Data Import</h1>
          <p className="text-gray-400">Import sales or customer data in bulk</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import {importType === "sales" ? "Sales" : "Customer"} Data</CardTitle>
          <CardDescription>
            {importType === "sales"
              ? "Import sales data using the format: Customer Name, Profit Amount, Date (YYYY-MM-DD)"
              : "Import customer data using the format: Customer Name, Platform, Alias, Trusted (Yes/No)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "input" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <Select value={importType} onValueChange={(value: "sales" | "customers") => setImportType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select import type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="customers">Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-3 flex justify-end">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Info className="h-4 w-4" />
                    <span>
                      {importType === "sales" 
                        ? "Format: Customer Name, Profit Amount, Date (YYYY-MM-DD)" 
                        : "Format: Customer Name, Platform, Alias, Trusted (Yes/No)"}
                    </span>
                  </div>
                </div>
              </div>
              
              <Textarea
                placeholder={
                  importType === "sales"
                    ? "John Doe, 70, 2023-06-15\nJane Smith, 35, 2023-06-18"
                    : "John Doe, Signal, johnny_green, Yes\nJane Smith, Telegram, jane420, Yes"
                }
                className="min-h-[200px]"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
              
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
                <Button onClick={parseInputData}>
                  <Upload className="mr-2 h-4 w-4" />
                  Parse Data
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
                  Review the parsed data before importing
                </AlertDescription>
              </Alert>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    {importType === "sales" ? (
                      <>
                        <TableHead>Customer</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Date</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead>Name</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Alias</TableHead>
                        <TableHead>Trusted</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((item, index) => (
                    <TableRow key={index}>
                      {importType === "sales" ? (
                        <>
                          <TableCell>{item.customer}</TableCell>
                          <TableCell>${item.profit}</TableCell>
                          <TableCell>{item.date}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.platform}</TableCell>
                          <TableCell>{item.alias}</TableCell>
                          <TableCell>{item.trusted ? "Yes" : "No"}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
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
              <Button
                className="mt-6"
                onClick={resetImport}
              >
                Import More Data
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-slate-800">
          <div className="text-sm text-muted-foreground">
            <p>
              {importType === "sales"
                ? "Note: This will add sales records to your existing sales data."
                : "Note: This will add new customers to your customer address book."}
            </p>
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Import Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Sales Import Format:</h3>
            <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm">
              Customer Name, Profit Amount, Date (YYYY-MM-DD)
              <br />
              Example:
              <br />
              John Doe, 70, 2023-06-15
              <br />
              Jane Smith, 35, 2023-06-18
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Customer Import Format:</h3>
            <pre className="bg-slate-800 p-3 rounded-md whitespace-pre-wrap text-sm">
              Customer Name, Platform, Alias, Trusted (Yes/No)
              <br />
              Example:
              <br />
              John Doe, Signal, johnny_green, Yes
              <br />
              Jane Smith, Telegram, jane420, Yes
            </pre>
          </div>
          
          <div className="pt-2">
            <h3 className="font-medium mb-2">Tips:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Each record should be on a new line</li>
              <li>Fields should be separated by commas</li>
              <li>Make sure dates are in YYYY-MM-DD format</li>
              <li>You can copy and paste data from spreadsheets</li>
              <li>Bulk imports will be merged with existing data</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Import;
