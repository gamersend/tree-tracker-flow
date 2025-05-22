
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ImportDataType, FormatExample } from "./types";

interface FormatInstructionsCardProps {
  importType: ImportDataType;
  formatExamples: Record<ImportDataType, FormatExample>;
}

const FormatInstructionsCard: React.FC<FormatInstructionsCardProps> = ({
  importType,
  formatExamples,
}) => {
  return (
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
  );
};

export default FormatInstructionsCard;
