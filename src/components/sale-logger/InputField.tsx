
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface InputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onShowExamples: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  onKeyDown,
  textareaRef,
  onShowExamples
}) => {
  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        className="min-h-[200px] bg-slate-800/50 border-slate-700/50 focus:border-tree-purple/50 placeholder:text-slate-500"
        placeholder="Examples:
- Sold 3.5g of Pineapple Express to Dave for $50 on May 20 with $30 profit
- Ticked 14g of Gelato to Claire on May 10, $100 total, no payment yet
- Dropped a half oz to Kyle for 150 on May 17, made 80"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 h-6 px-2 text-xs bg-slate-700/30 hover:bg-slate-700/50"
        onClick={onShowExamples}
      >
        <Sparkles className="h-3 w-3 mr-1" /> Examples
      </Button>
    </div>
  );
};
