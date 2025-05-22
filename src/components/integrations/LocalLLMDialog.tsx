
import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Cloud, Loader2, Send } from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { toast } from "sonner";

interface LocalLLMDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

const LocalLLMDialog: React.FC<LocalLLMDialogProps> = ({ open, onOpenChange }) => {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    generateText, 
    isLoading, 
    getActiveProvider, 
    setActiveProvider,
    checkAIAvailability
  } = useAI();
  
  const activeProvider = getActiveProvider();
  const { available } = checkAIAvailability();

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // If no AI is available, show error
    if (!available) {
      toast.error("No AI model configured. Please set up a model in Settings.");
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await generateText(input);
      
      if (result) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: result }
        ]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleProviderChange = (value: string) => {
    if (value === "local" || value === "openai") {
      setActiveProvider(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[80vh]">
        <DialogHeader className="p-4 border-b border-gray-800 flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl flex items-center gap-2">
            {activeProvider === "openai" ? (
              <Cloud className="h-5 w-5 text-sky-400" />
            ) : (
              <Bot className="h-5 w-5 text-tree-purple" />
            )}
            AI Assistant
          </DialogTitle>
          
          <Tabs 
            value={activeProvider} 
            onValueChange={handleProviderChange}
            className="h-8"
          >
            <TabsList className="h-8">
              <TabsTrigger value="local" className="h-7 px-2 text-xs">
                <Bot className="h-3 w-3 mr-1" />
                Local
              </TabsTrigger>
              <TabsTrigger value="openai" className="h-7 px-2 text-xs">
                <Cloud className="h-3 w-3 mr-1" />
                OpenAI
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        <div className="flex flex-col h-[50vh] overflow-hidden">
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <p className="mb-2">Ask the AI assistant any question</p>
                  <p className="text-sm">Currently using: {activeProvider === "openai" ? "OpenAI" : "Local LLM"}</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-tree-purple text-white"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-gray-800 text-gray-200">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <DialogFooter className="p-4 border-t border-gray-800">
            <div className="flex w-full gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="resize-none"
                rows={2}
              />
              <Button
                onClick={handleSubmit}
                disabled={!input.trim() || isGenerating || !available}
                className="self-end"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocalLLMDialog;
