
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ImportDataType, FormatExample } from "./types";

interface AIInstructionsCardProps {
  formatExamples: Record<ImportDataType, FormatExample>;
}

const AIInstructionsCard: React.FC<AIInstructionsCardProps> = ({ formatExamples }) => {
  return (
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
  );
};

export default AIInstructionsCard;
