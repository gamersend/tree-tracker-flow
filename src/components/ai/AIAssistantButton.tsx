
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot } from "lucide-react";
import LocalLLMDialog from "@/components/integrations/LocalLLMDialog";
import { useLocalLLM } from "@/hooks/useLocalLLM";
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
  const { getActiveModel, activateFirstModelIfNeeded } = useLocalLLM();
  const navigate = useNavigate();
  const activeModel = getActiveModel();

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
    // Try to activate the first model if none are active
    if (!activeModel) {
      const activated = activateFirstModelIfNeeded();
      if (!activated) {
        toast.error("No active LLM model configured. Please set up a model in Settings.");
        handleNavigateToSettings();
        return;
      }
    }
    setDialogOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
        onClick={handleOpenAssistant}
      >
        <Sparkles className="h-4 w-4" />
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
