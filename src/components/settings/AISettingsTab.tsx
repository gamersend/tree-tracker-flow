
import React, { useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Bot, Cloud, BrainCircuit } from "lucide-react";
import LocalLLMSettings from "./LocalLLMSettings";
import OpenAISettings from "./OpenAISettings";
import LocalLLMDemo from "../integrations/LocalLLMDemo";
import LLMFaq from "../ai/LLMFaq";
import { useLocalLLM } from "@/hooks/useLocalLLM";
import { useOpenAI } from "@/hooks/useOpenAI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AISettingsTab: React.FC = () => {
  const { activateFirstModelIfNeeded: activateFirstLocalModel } = useLocalLLM();
  const { activateFirstModelIfNeeded: activateFirstOpenAIModel } = useOpenAI();

  // When the AI tab is opened, make sure a model is active in both local and OpenAI
  useEffect(() => {
    activateFirstLocalModel();
    activateFirstOpenAIModel();
  }, [activateFirstLocalModel, activateFirstOpenAIModel]);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="local" className="w-full">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="local" className="flex-1">
            <Bot className="h-4 w-4 mr-2" />
            Local LLM
          </TabsTrigger>
          <TabsTrigger value="openai" className="flex-1">
            <Cloud className="h-4 w-4 mr-2" />
            OpenAI API
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="local" className="space-y-6">
          <LocalLLMSettings />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocalLLMDemo />
            <LLMFaq />
          </div>
        </TabsContent>
        
        <TabsContent value="openai" className="space-y-6">
          <OpenAISettings />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-sky-400" />
                  OpenAI Features
                </CardTitle>
                <CardDescription>
                  Available features with OpenAI integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Advanced text completion and summarization</li>
                  <li>Enhanced natural language processing</li>
                  <li>Smart content generation and improvement</li>
                  <li>Sentiment analysis and content classification</li>
                  <li>Structured data extraction from text</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border border-slate-800">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISettingsTab;
