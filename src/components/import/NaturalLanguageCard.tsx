
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const NaturalLanguageCard: React.FC = () => {
  return (
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
  );
};

export default NaturalLanguageCard;
