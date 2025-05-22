
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Bot, Cloud, BrainCircuit } from "lucide-react";
import LocalLLMSettings from "./LocalLLMSettings";
import LocalLLMDemo from "../integrations/LocalLLMDemo";

const AISettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <LocalLLMSettings />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LocalLLMDemo />
        
        <Card className="border border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-sky-400" />
              Cloud AI Options
            </CardTitle>
            <CardDescription>
              Configure cloud-based AI services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cloud AI configuration options coming soon. Connect to OpenAI, Anthropic, and other providers.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-purple-400" />
              AI Configuration
            </CardTitle>
            <CardDescription>
              Global settings for AI functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure global AI settings, including context retention, model preferences, 
              and how AI integrates with different parts of your application.
              Additional options will be available in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AISettingsTab;
