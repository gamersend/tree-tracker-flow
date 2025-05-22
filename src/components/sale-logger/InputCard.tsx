
import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Trash2, Keyboard, Sparkles } from "lucide-react";
import { SaleTemplates } from "./SaleTemplates";
import { RecentEntries } from "./RecentEntries";

interface InputCardProps {
  saleText: string;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onProcessText: () => void;
  onClearAll: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
  recentEntries: string[];
  onUseRecentEntry: (entry: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export const InputCard: React.FC<InputCardProps> = ({
  saleText,
  onTextChange,
  onProcessText,
  onClearAll,
  handleKeyDown,
  isProcessing,
  recentEntries,
  onUseRecentEntry,
  textareaRef,
}) => {
  const [showExamples, setShowExamples] = React.useState(false);

  const useTemplate = (template: string) => {
    const event = {
      target: { value: template },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onTextChange(event);
    setShowExamples(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
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
            onChange={onTextChange}
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
              <SaleTemplates onUseTemplate={useTemplate} />
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={onClearAll}
            className="w-full sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
          <Button
            onClick={onProcessText}
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
        
        <RecentEntries entries={recentEntries} onUseEntry={onUseRecentEntry} />
      </CardContent>
    </Card>
  );
};

// Fix missing import
import { FileText } from "lucide-react";
