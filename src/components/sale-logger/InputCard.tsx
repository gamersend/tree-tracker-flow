
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, AlertTriangle } from "lucide-react";
import { SaleTemplates } from "./SaleTemplates";
import { RecentEntries } from "./RecentEntries";
import { InputField } from "./InputField";
import { ActionButtons } from "./ActionButtons";
import AISaleHelper from "./AISaleHelper";
import { useSecureInput } from "@/hooks/useSecureInput";
import { useSecurity } from "@/contexts/SecurityContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { validateAndSanitizeText, validationErrors } = useSecureInput({ maxLength: 5000 });
  const { isRateLimited } = useSecurity();

  const handleSecureTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = validateAndSanitizeText(e.target.value);
    
    // Create a new event with sanitized value
    const secureEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue
      }
    };
    
    onTextChange(secureEvent);
  };

  const handleSecureProcessText = () => {
    if (isRateLimited('salesEntry')) {
      return; // Rate limit will show via toast in security context
    }
    
    onProcessText();
  };

  const useTemplate = (template: string) => {
    const sanitizedTemplate = validateAndSanitizeText(template);
    const event = {
      target: { value: sanitizedTemplate },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onTextChange(event);
    setShowExamples(false);
    if (textareaRef?.current) {
      textareaRef.current.focus();
    }
  };

  // Ensure recent entries is an array and sanitize entries
  const safeRecentEntries = Array.isArray(recentEntries) 
    ? recentEntries.map(entry => validateAndSanitizeText(entry))
    : [];

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
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {validationErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}
        
        <InputField
          value={saleText || ''}
          onChange={handleSecureTextChange}
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
          onProcessText={handleSecureProcessText}
          isProcessing={isProcessing}
          isInputEmpty={!saleText || !saleText.trim()}
        />
        
        {saleText && saleText.trim() && (
          <AISaleHelper 
            saleText={saleText} 
            onProcessedResult={(result) => {
              const sanitizedResult = validateAndSanitizeText(result);
              const event = {
                target: { value: sanitizedResult },
              } as React.ChangeEvent<HTMLTextAreaElement>;
              onTextChange(event);
            }} 
          />
        )}
        
        <RecentEntries entries={safeRecentEntries} onUseEntry={onUseRecentEntry} />
      </CardContent>
    </Card>
  );
};
