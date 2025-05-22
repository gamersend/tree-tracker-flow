
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocalLLM } from "@/hooks/useLocalLLM";
import { Sparkles, Loader2, Bot } from "lucide-react";
import { toast } from "sonner";

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
  const { generateText, getActiveModel } = useLocalLLM();
  
  const activeModel = getActiveModel();
  
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
      toast.error("Failed to improve note. Is your LLM server running?");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!activeModel) {
    return null;
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
          <Bot className="h-3 w-3 mr-1" />
          <span>Improve with AI</span>
        </>
      )}
    </Button>
  );
};

export default AINoteHelper;
