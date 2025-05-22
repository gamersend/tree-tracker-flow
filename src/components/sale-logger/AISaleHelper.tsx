
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalLLM } from "@/hooks/useLocalLLM";
import { Sparkles, Bot, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AISaleHelperProps {
  saleText: string;
  onProcessedResult: (result: string) => void;
}

const AISaleHelper: React.FC<AISaleHelperProps> = ({ saleText, onProcessedResult }) => {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { generateText, getActiveModel } = useLocalLLM();
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
  
  const handleImproveText = async () => {
    if (!saleText.trim()) {
      toast.error("Please enter some text to improve");
      return;
    }
    
    if (!activeModel) {
      toast.error("No active LLM model configured. Please set up in Settings.");
      return;
    }
    
    setLoading(true);
    
    const prompt = `
    Improve the following natural language sale description to be more structured. 
    Include quantity, strain, price, profit, customer name, and date if available:
    
    "${saleText}"
    
    Reply with ONLY the improved version, no explanations.
    `;
    
    try {
      const result = await generateText(prompt);
      if (result) {
        onProcessedResult(result);
        toast.success("Text improved with AI");
      }
    } catch (error) {
      console.error("Error improving text:", error);
      toast.error("Failed to improve text. Is your LLM server running?");
    } finally {
      setLoading(false);
    }
  };
  
  if (!activeModel) {
    return (
      <Card className="mt-2 border border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-4">
          <div className="flex gap-2 items-center text-amber-400">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">AI features are available when you set up a Local LLM in Settings.</p>
          </div>
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleNavigateToSettings}
              className="flex items-center gap-1"
            >
              <Bot className="h-3 w-3" />
              Configure LLM
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-2 border border-tree-purple/30 bg-tree-purple/5">
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bot className="h-4 w-4 text-tree-purple" />
          <span>AI Sale Entry Helper</span>
          <span className="text-xs bg-tree-purple text-white px-1.5 py-0.5 rounded-full ml-auto">
            {activeModel.name}
          </span>
        </CardTitle>
      </CardHeader>
      <CardFooter className="py-3">
        <Button 
          size="sm" 
          variant="outline" 
          className="mr-2 border-tree-purple/50 text-tree-purple hover:bg-tree-purple/10"
          onClick={handleImproveText}
          disabled={loading || !saleText.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 mr-1" />
              Improve Entry
            </>
          )}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => {
            const prompt = `
            Extract a structured sale from this text: "${saleText}".
            Structure as quantity (g), strain, price ($), profit ($), customer, date (YYYY-MM-DD).
            Return in this exact format: "QUANTITY g of STRAIN to CUSTOMER for $PRICE on DATE with $PROFIT profit"
            `;
            
            setLoading(true);
            generateText(prompt)
              .then(result => {
                if (result) {
                  onProcessedResult(result);
                  toast.success("Sale structured with AI");
                }
              })
              .catch(error => {
                console.error("Error:", error);
                toast.error("Failed to structure sale");
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <Bot className="h-3 w-3 mr-1" />
          Structure Sale
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AISaleHelper;
