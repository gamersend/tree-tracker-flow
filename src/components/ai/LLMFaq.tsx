
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, ExternalLink } from 'lucide-react';

const LLMFaq: React.FC = () => {
  return (
    <Card className="border border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <HelpCircle className="h-4 w-4 text-blue-400" />
          Local LLM FAQ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="text-sm">
          <AccordionItem value="what-is-llm">
            <AccordionTrigger className="text-sm">What is a Local LLM?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              A Local LLM (Large Language Model) is an AI model that runs on your own computer instead of in the cloud. 
              This gives you more privacy and control over your data, as nothing is sent to external servers.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="how-to-set-up">
            <AccordionTrigger className="text-sm">How do I set up a Local LLM?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="mb-2">
                The easiest way is to install Ollama, which provides a simple interface for running various LLMs locally:
              </p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Download and install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">ollama.ai</a></li>
                <li>Run Ollama and pull a model (e.g., <code>ollama pull llama3</code>)</li>
                <li>Make sure the Ollama server is running</li>
                <li>Configure the connection in the AI Settings tab</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="which-model">
            <AccordionTrigger className="text-sm">Which LLM model should I use?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="mb-2">
                For most users, we recommend starting with:
              </p>
              <ul className="list-disc ml-4 space-y-1">
                <li><strong>llama3</strong> - Good all-around performance with minimal resources</li>
                <li><strong>gemma:7b</strong> - Great for basic tasks, very efficient</li>
                <li><strong>mistral</strong> - Good balance of performance and resource usage</li>
                <li><strong>phi3:mini</strong> - Very lightweight, works on older computers</li>
              </ul>
              <p className="mt-2">
                More powerful models like <code>llama3:70b</code> offer better results but require more RAM and GPU power.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="hardware-req">
            <AccordionTrigger className="text-sm">What are the hardware requirements?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                The requirements depend on the model size:
              </p>
              <ul className="list-disc ml-4 space-y-1 mt-2">
                <li><strong>Smaller models</strong> (7B parameters) - 8GB RAM, integrated graphics</li>
                <li><strong>Medium models</strong> (13B parameters) - 16GB RAM, dedicated GPU recommended</li>
                <li><strong>Large models</strong> (70B parameters) - 32GB+ RAM, modern GPU with 8GB+ VRAM</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-4 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open("https://ollama.ai/library", "_blank")}
          >
            <ExternalLink className="h-3 w-3 mr-2" />
            Browse Ollama Model Library
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMFaq;
