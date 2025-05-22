
import React from "react";
import { Button } from "@/components/ui/button";
import { Brain, Trash2, Keyboard } from "lucide-react";

interface ActionButtonsProps {
  onClearAll: () => void;
  onProcessText: () => void;
  isProcessing: boolean;
  isInputEmpty: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onClearAll,
  onProcessText,
  isProcessing,
  isInputEmpty
}) => {
  return (
    <>
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
          disabled={isProcessing || isInputEmpty}
        >
          <Brain className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing..." : "Convert Text"}
        </Button>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
        <Keyboard className="h-3 w-3" /> Tip: Press Ctrl+Enter to convert
      </div>
    </>
  );
};
