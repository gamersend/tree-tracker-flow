
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Bot, AlertCircle, Loader2, BrainCircuit, Cloud } from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const NaturalLanguageCard: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { generateText, checkAIAvailability, getActiveProvider } = useAI();
  const navigate = useNavigate();
  
  const { available } = checkAIAvailability();
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
  
  const handleConvert = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to convert");
      return;
    }
    
    setIsProcessing(true);
    
    const prompt = `
    Convert the following natural language descriptions of cannabis sales into CSV format.
    Each row should have these fields: date,strain,quantity,price,customer,profit,paid
    
    Input:
    ${inputText}
    
    Output ONLY the CSV data starting with a header row. Format dates as YYYY-MM-DD.
    Example:
    date,strain,quantity,price,customer,profit,paid
    2023-05-15,Blue Dream,3.5,40,John,20,true
    `;
    
    try {
      const result = await generateText(prompt);
      if (result) {
        setOutputText(result);
        toast.success("Successfully converted to CSV");
      }
    } catch (error) {
      console.error("Error converting to CSV:", error);
      toast.error(`Failed to convert text. ${activeProvider === "local" ? "Is your LLM server running?" : "Check OpenAI API connection."}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!available) {
    return (
      <Card className="mt-6 border-tree-purple border-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span>✨</span>
            <span className="ml-2">Natural Language to CSV Converter</span>
            <span className="ml-2 text-xs bg-tree-purple text-white px-2 py-0.5 rounded-full">Beta</span>
          </CardTitle>
          <CardDescription>
            Paste natural language descriptions and convert them to importable CSV format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-800 p-4 bg-slate-800/20">
            <div className="flex items-center gap-2 mb-4 text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">
                This feature requires AI configuration. Please set it up in Settings to enable this functionality.
              </p>
            </div>
            <div className="space-y-4 opacity-75 pointer-events-none">
              <Label htmlFor="nlInput">Natural Language Input</Label>
              <Textarea
                id="nlInput"
                placeholder="Enter descriptions like: 'I sold 3.5g of Blue Dream to John for $40 on May 15th with $20 profit'"
                className="min-h-[150px]"
                disabled
              />
              <Button disabled>Convert to CSV</Button>
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={handleNavigateToSettings}
                className="flex items-center gap-2"
              >
                <BrainCircuit className="h-4 w-4" />
                Configure AI Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-6 border-tree-purple border-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          {activeProvider === "openai" ? (
            <Cloud className="mr-2 h-5 w-5 text-sky-400" />
          ) : (
            <Bot className="mr-2 h-5 w-5 text-tree-purple" />
          )}
          <span>Natural Language to CSV Converter</span>
          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Active</span>
        </CardTitle>
        <CardDescription>
          Paste natural language descriptions and convert them to importable CSV format using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nlInput">Natural Language Input</Label>
          <Textarea
            id="nlInput"
            placeholder="Enter descriptions like: 'I sold 3.5g of Blue Dream to John for $40 on May 15th with $20 profit'"
            className="min-h-[150px]"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        
        {outputText && (
          <div>
            <Label htmlFor="csvOutput">CSV Output</Label>
            <Textarea
              id="csvOutput"
              className="min-h-[150px] font-mono text-sm"
              value={outputText}
              readOnly
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          {activeProvider === "openai" ? (
            <Cloud className="h-3 w-3 text-sky-400" />
          ) : (
            <Bot className="h-3 w-3 text-tree-purple" />
          )}
          Using {activeProvider === "openai" ? "OpenAI" : "Local LLM"}
        </div>
        <Button 
          onClick={handleConvert} 
          disabled={isProcessing || !inputText.trim()}
          className="flex items-center gap-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Convert to CSV
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NaturalLanguageCard;
