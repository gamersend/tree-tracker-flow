
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { useLocalLLM } from "@/hooks/useLocalLLM";
import LocalLLMDialog from "./LocalLLMDialog";
import { toast } from "sonner";

const LocalLLMDemo: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { checkLLMAvailability, getActiveModel } = useLocalLLM();
  
  const activeModel = getActiveModel();

  const handleCheckAvailability = async () => {
    setIsChecking(true);
    try {
      const isAvailable = await checkLLMAvailability();
      if (isAvailable) {
        toast.success("LLM is available and responding!");
      } else {
        toast.error("LLM is not available. Please check your settings and make sure the LLM server is running.");
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <Card className="border border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-400" />
            Local LLM Integration
          </CardTitle>
          <CardDescription>
            Use locally hosted large language models for AI-powered features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-slate-800/50">
              {activeModel ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-green-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Active Model: {activeModel.name}
                      </h3>
                      <p className="text-sm text-gray-400">{activeModel.endpoint}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleCheckAvailability}
                      disabled={isChecking}
                    >
                      {isChecking ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</>
                      ) : (
                        <>Check Connection</>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your local LLM is configured and ready to use. You can now use it for various AI-powered features.
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <h3 className="font-medium text-amber-400 mb-2">No Active LLM Model</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    You need to activate a local LLM model in settings before using this feature.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      window.location.href = '/settings';
                    }}
                  >
                    Configure LLM
                  </Button>
                </div>
              )}
            </div>
            
            <div className="border-t border-slate-700 pt-4">
              <Button
                onClick={() => setDialogOpen(true)}
                disabled={!activeModel}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Open LLM Assistant
              </Button>
              <p className="text-sm text-gray-400 mt-2">
                Try out your local LLM with the assistant dialog.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <LocalLLMDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </>
  );
};

export default LocalLLMDemo;
