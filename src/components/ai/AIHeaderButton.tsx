
import React from "react";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Bot, Cloud } from "lucide-react";
import { useAI } from "@/hooks/useAI";
import AIAssistantButton from "./AIAssistantButton";

const AIHeaderButton: React.FC = () => {
  const { checkAIAvailability, getActiveProvider } = useAI();
  const { available } = checkAIAvailability();
  const activeProvider = getActiveProvider();

  if (!available) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          window.location.href = '/settings';
        }}
        className="flex items-center gap-1 opacity-60"
      >
        <BrainCircuit className="h-4 w-4" />
        <span className="hidden md:inline">Set up AI</span>
      </Button>
    );
  }

  return (
    <AIAssistantButton 
      variant="ghost" 
      size="sm" 
      buttonText={
        <span className="flex items-center gap-1">
          {activeProvider === "openai" ? (
            <Cloud className="h-4 w-4 text-sky-400" />
          ) : (
            <Bot className="h-4 w-4 text-tree-purple" />
          )}
          <span className="hidden md:inline">AI Assistant</span>
        </span>
      }
      className="relative"
    />
  );
};

export default AIHeaderButton;
