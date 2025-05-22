
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, Cloud } from "lucide-react";
import LocalLLMDialog from "@/components/integrations/LocalLLMDialog";
import { useAI } from "@/hooks/useAI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AIAssistantButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  buttonText?: React.ReactNode;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({
  variant = "default",
  size = "default",
  className = "",
  buttonText = "AI Assistant"
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { checkAIAvailability, autoSelectProvider } = useAI();
  const navigate = useNavigate();
  
  const { available, provider } = checkAIAvailability();

  const handleNavigateToSettings = () => {
    navigate('/settings');
    // Use setTimeout to ensure the page loads before we try to select the tab
    setTimeout(() => {
      const aiTab = document.querySelector('[data-value="ai"]') as HTMLElement;
      if (aiTab) {
        aiTab.click();
      }
    }, 100);
  };

  const handleOpenAssistant = () => {
    // Try to auto-select an available provider if none is working
    if (!available) {
      const selectedProvider = autoSelectProvider();
      if (!selectedProvider) {
        toast.error("No AI model configured. Please set up a model in Settings.");
        handleNavigateToSettings();
        return;
      }
    }
    setDialogOpen(true);
  };

  const getIcon = () => {
    if (!available) return <Sparkles className="h-4 w-4" />;
    return provider === "openai" ? <Cloud className="h-4 w-4" /> : <Bot className="h-4 w-4" />;
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
        onClick={handleOpenAssistant}
      >
        {getIcon()}
        {buttonText}
      </Button>
      
      <LocalLLMDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default AIAssistantButton;
