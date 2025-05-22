
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLocalLLM } from "@/hooks/useLocalLLM";
import { AlertCircle, Bot, Loader2, Settings2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface LocalLLMDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPrompt?: string;
  onResultGenerated?: (result: string) => void;
}

const LocalLLMDialog: React.FC<LocalLLMDialogProps> = ({
  open,
  onOpenChange,
  initialPrompt = "",
  onResultGenerated
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [result, setResult] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [isStreaming, setIsStreaming] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  
  const { generateText, isLoading, error, getActiveModel } = useLocalLLM();
  
  useEffect(() => {
    setPrompt(initialPrompt);
    setResult("");
  }, [initialPrompt, open]);
  
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result]);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    const activeModel = getActiveModel();
    if (!activeModel) {
      toast.error("No active LLM model found. Please configure one in Settings.");
      return;
    }
    
    setResult("");
    
    if (isStreaming) {
      await generateText(prompt, {
        temperature,
        stream: true,
        onToken: (token) => {
          setResult(prev => prev + token);
        }
      });
    } else {
      const generatedText = await generateText(prompt, { temperature });
      if (generatedText) {
        setResult(generatedText);
      }
    }
  };
  
  const handleResultAccept = () => {
    if (onResultGenerated && result) {
      onResultGenerated(result);
      onOpenChange(false);
    }
  };
  
  const activeModel = getActiveModel();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Local LLM Assistant
            {activeModel && (
              <span className="ml-2 text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                {activeModel.name}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {!activeModel ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center p-6 bg-slate-800/30 rounded-lg">
            <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active LLM Model</h3>
            <p className="text-muted-foreground mb-4">
              Please go to Settings and configure a local LLM model first.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => {
                  window.location.href = '/settings';
                }, 100);
              }}
              className="flex items-center gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Go to Settings
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col min-h-0 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prompt">Prompt</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="temperature" className="text-xs text-muted-foreground">
                      Temperature: {temperature.toFixed(1)}
                    </Label>
                    <Slider
                      id="temperature"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(values) => setTemperature(values[0])}
                      className="w-24"
                    />
                  </div>
                </div>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here..."
                  className="min-h-[100px]"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex-1 min-h-0 space-y-2">
                <Label>Result</Label>
                <div 
                  ref={resultRef}
                  className="h-full min-h-[200px] p-3 border rounded-md bg-slate-800/30 overflow-y-auto whitespace-pre-wrap"
                >
                  {isLoading && !isStreaming ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    result || (
                      <div className="text-muted-foreground italic">
                        Generated text will appear here...
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="streaming"
                  checked={isStreaming}
                  onChange={(e) => setIsStreaming(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="streaming" className="text-sm">Stream Response</Label>
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading || !prompt.trim()}
                onClick={handleGenerate}
                className="flex items-center gap-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate</span>
                  </>
                )}
              </Button>
              <Button
                disabled={!result}
                onClick={handleResultAccept}
                variant="default"
              >
                Accept Result
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LocalLLMDialog;
