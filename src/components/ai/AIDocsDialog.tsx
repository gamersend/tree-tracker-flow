
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bot, Book, Settings2, ExternalLink } from "lucide-react";

interface AIDocsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AIDocsDialog: React.FC<AIDocsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Book className="h-5 w-5" />
            Local AI Assistant Documentation
          </DialogTitle>
          <DialogDescription>
            Learn how to use the AI features in this application
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(80vh-120px)]">
          <div className="space-y-6 p-1">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                The AI assistant in Tree Tracker leverages locally running Large Language Models (LLMs) to provide AI-powered features without sending your data to external services.
              </p>
              
              <div className="mt-4 bg-slate-800/30 p-4 rounded-md">
                <h4 className="font-medium mb-2">Requirements</h4>
                <ul className="list-disc ml-4 space-y-1 text-sm text-muted-foreground">
                  <li>Ollama installed on your computer (<a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">download here</a>)</li>
                  <li>An LLM model pulled into Ollama (e.g., llama3, mistral, gemma)</li>
                  <li>The Ollama server running in the background</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Available AI Features</h3>
              <div className="space-y-4">
                <div className="border border-slate-700 rounded-md p-3">
                  <h4 className="font-medium flex items-center gap-1">
                    <Bot className="h-4 w-4 text-green-400" />
                    AI Assistant
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Access the AI assistant from the header button. Ask questions about cannabis strains, growing tips, business advice, or general queries.
                  </p>
                </div>
                
                <div className="border border-slate-700 rounded-md p-3">
                  <h4 className="font-medium flex items-center gap-1">
                    <Bot className="h-4 w-4 text-purple-400" />
                    Sales Entry Helper
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    In the Natural Language Logger, AI can improve and structure your sale descriptions automatically.
                  </p>
                </div>
                
                <div className="border border-slate-700 rounded-md p-3">
                  <h4 className="font-medium flex items-center gap-1">
                    <Bot className="h-4 w-4 text-blue-400" />
                    CSV Converter
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    In the Import section, convert natural language descriptions into CSV format for bulk importing.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Setting Up Your LLM</h3>
              <ol className="list-decimal ml-4 space-y-2 text-sm text-muted-foreground">
                <li>Go to Settings &gt; AI tab</li>
                <li>Under "Local LLM Integration", you'll see your configured models</li>
                <li>Activate a model by toggling the switch</li>
                <li>Test the connection to ensure your LLM server is running</li>
                <li>Once activated, AI features will be available throughout the app</li>
              </ol>
              
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    onOpenChange(false);
                    setTimeout(() => {
                      window.location.href = '/settings';
                    }, 100);
                  }}
                  className="flex items-center gap-2"
                >
                  <Settings2 className="h-4 w-4" />
                  Go to AI Settings
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open("https://ollama.ai/library", "_blank")}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Browse LLM Models
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AIDocsDialog;
