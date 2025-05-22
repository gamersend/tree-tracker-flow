
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import { SaleTemplates } from "./SaleTemplates";
import { RecentEntries } from "./RecentEntries";
import { InputField } from "./InputField";
import { ActionButtons } from "./ActionButtons";

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
  const [showExamples, setShowExamples] = useState(false);

  const useTemplate = (template: string) => {
    const event = {
      target: { value: template },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onTextChange(event);
    setShowExamples(false);
    if (textareaRef?.current) {
      textareaRef.current.focus();
    }
  };

  // Ensure recent entries is an array
  const safeRecentEntries = Array.isArray(recentEntries) ? recentEntries : [];

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
        <InputField
          value={saleText || ''}
          onChange={onTextChange}
          onKeyDown={handleKeyDown}
          textareaRef={textareaRef}
          onShowExamples={() => setShowExamples(!showExamples)}
        />
        
        {showExamples && (
          <div className="absolute z-10 top-[150px] right-6 w-80 bg-slate-800 border border-slate-700 rounded-md shadow-lg p-2">
            <SaleTemplates onUseTemplate={useTemplate} />
          </div>
        )}
        
        <ActionButtons
          onClearAll={onClearAll}
          onProcessText={onProcessText}
          isProcessing={isProcessing}
          isInputEmpty={!(saleText && saleText.trim())}
        />
        
        <RecentEntries entries={safeRecentEntries} onUseEntry={onUseRecentEntry} />
      </CardContent>
    </Card>
  );
};
