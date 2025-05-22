
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAI } from "@/hooks/useAI";
import { Sparkles, Loader2, Bot, Settings2, Cloud } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AINoteHelperProps {
  content?: string;
  onImprove: (improvedContent: string) => void;
  disabled?: boolean;
}

const AINoteHelper: React.FC<AINoteHelperProps> = ({
  content = "",
  onImprove,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { generateText, checkAIAvailability, getActiveProvider } = useAI();
  const navigate = useNavigate();
  
  const { available, provider } = checkAIAvailability();
  const activeProvider = getActiveProvider();
  
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
  
  const handleImproveNote = async () => {
    if (!content.trim()) {
      toast.error("The note is empty, nothing to improve.");
      return;
    }
    
    setIsLoading(true);
    
    const prompt = `
    Improve the following note to be more clear and concise, while keeping the original meaning:
    "${content}"
    
    Reply with ONLY the improved note text, no explanations.
    `;
    
    try {
      const result = await generateText(prompt);
      if (result) {
        onImprove(result);
        toast.success("Note improved with AI");
      }
    } catch (error) {
      console.error("Error improving note:", error);
      toast.error(`Failed to improve note. ${activeProvider === "local" ? "Is your LLM server running?" : "Check OpenAI API connection."}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!available) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-1 text-amber-400 border-amber-400/30"
        onClick={handleNavigateToSettings}
      >
        <Settings2 className="h-3 w-3 mr-1" />
        <span>Setup AI</span>
      </Button>
    );
  }
  
  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-tree-purple"
      onClick={handleImproveNote}
      disabled={disabled || isLoading || !content.trim()}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          <span>Improving...</span>
        </>
      ) : (
        <>
          {activeProvider === "openai" ? (
            <Cloud className="h-3 w-3 mr-1" />
          ) : (
            <Bot className="h-3 w-3 mr-1" />
          )}
          <span>Improve with AI</span>
        </>
      )}
    </Button>
  );
};

export default AINoteHelper;
