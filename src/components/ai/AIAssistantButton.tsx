
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot } from "lucide-react";
import LocalLLMDialog from "@/components/integrations/LocalLLMDialog";
import { useLocalLLM } from "@/hooks/useLocalLLM";
import { toast } from "sonner";

interface AIAssistantButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  buttonText?: string;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({
  variant = "default",
  size = "default",
  className = "",
  buttonText = "AI Assistant"
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getActiveModel } = useLocalLLM();
  const activeModel = getActiveModel();

  const handleOpenAssistant = () => {
    if (!activeModel) {
      toast.error("No active LLM model configured. Please set up a model in Settings.");
      return;
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
