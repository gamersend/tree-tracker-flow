
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { XCircle, Upload, Info, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ImportDataType, FormatExample } from "./types";
import { useImportData } from "@/hooks/useImportData";
import FormatInstructionsCard from "./FormatInstructionsCard";

const ImportDataTab: React.FC = () => {
  const [importType, setImportType] = useState<ImportDataType>("sales");
  const [inputData, setInputData] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const { 
    errors, 
    parsedData, 
    step, 
    resetImport, 
    parseInputData, 
    handleImport, 
    formatExamples
  } = useImportData(importType, inputData);

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

  return (
    <>
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
                <Button onClick={() => parseInputData()} className="flex items-center gap-2">
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
                <Button onClick={() => handleImport()}>
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

      <FormatInstructionsCard importType={importType} formatExamples={formatExamples} />
    </>
  );
};

export default ImportDataTab;
