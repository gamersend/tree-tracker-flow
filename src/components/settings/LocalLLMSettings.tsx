
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Server, Rocket } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface LocalLLMModel {
  name: string;
  description: string;
  endpoint: string;
  active: boolean;
}

const LocalLLMSettings: React.FC = () => {
  const [localModels, setLocalModels] = useState<LocalLLMModel[]>(() => {
    const savedModels = localStorage.getItem('local-llm-models');
    return savedModels ? JSON.parse(savedModels) : [
      {
        name: "Default LLM",
        description: "Default localhost Ollama model",
        endpoint: "http://localhost:11434/api/generate",
        active: false
      }
    ];
  });
  
  const [newModelName, setNewModelName] = useState("");
  const [newModelEndpoint, setNewModelEndpoint] = useState("");
  const [testingModel, setTestingModel] = useState<string | null>(null);

  const saveModels = (models: LocalLLMModel[]) => {
    localStorage.setItem('local-llm-models', JSON.stringify(models));
    setLocalModels(models);
  };

  const handleAddModel = () => {
    if (!newModelName.trim() || !newModelEndpoint.trim()) {
      toast.error("Please provide both name and endpoint for the new model");
      return;
    }
    
    const newModel: LocalLLMModel = {
      name: newModelName.trim(),
      description: "Custom local LLM model",
      endpoint: newModelEndpoint.trim(),
      active: false
    };
    
    const updatedModels = [...localModels, newModel];
    saveModels(updatedModels);
    
    setNewModelName("");
    setNewModelEndpoint("");
    toast.success("New model added successfully!");
  };

  const handleToggleActive = (index: number) => {
    const updatedModels = localModels.map((model, i) => {
      if (i === index) {
        return { ...model, active: !model.active };
      }
      return model;
    });
    
    saveModels(updatedModels);
    
    if (updatedModels[index].active) {
      toast.success(`${updatedModels[index].name} activated`);
    } else {
      toast.info(`${updatedModels[index].name} deactivated`);
    }
  };

  const handleRemoveModel = (index: number) => {
    const updatedModels = localModels.filter((_, i) => i !== index);
    saveModels(updatedModels);
    toast.info("Model removed");
  };

  const testModelConnection = async (endpoint: string, index: number) => {
    setTestingModel(endpoint);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3",
          prompt: "Say hello in one short sentence.",
          stream: false
        }),
      });
      
      if (response.ok) {
        toast.success("Successfully connected to local LLM!");
      } else {
        toast.error("Failed to connect to local LLM");
      }
    } catch (error) {
      toast.error("Connection error: Make sure your local LLM service is running");
      console.error("LLM connection error:", error);
    } finally {
      setTestingModel(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-purple-400" />
            Local LLM Integration
          </CardTitle>
          <CardDescription>
            Configure locally hosted large language models for on-device AI capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-slate-800/50 border-amber-500/20 text-amber-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Local LLM requires Ollama or a compatible server running on your device. 
              Make sure to have Ollama installed and running with your preferred models.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-6">
            {localModels.map((model, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${model.active ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700 bg-slate-800/20'} transition-all`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-medium flex items-center gap-2">
                      {model.name}
                      {model.active && <Check className="h-4 w-4 text-green-500" />}
                    </h3>
                    <p className="text-sm text-gray-400">{model.endpoint}</p>
                    <p className="text-xs text-gray-500">{model.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testModelConnection(model.endpoint, index)}
                      disabled={testingModel === model.endpoint}
                    >
                      {testingModel === model.endpoint ? "Testing..." : "Test Connection"}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={model.active} 
                        onCheckedChange={() => handleToggleActive(index)}
                      />
                      <span className="text-sm font-medium">
                        {model.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {index !== 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => handleRemoveModel(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-t border-slate-700 pt-6">
              <h3 className="font-medium mb-4">Add New LLM Model</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model-name">Model Name</Label>
                  <Input 
                    id="model-name" 
                    placeholder="My Local LLM" 
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endpoint-url">Endpoint URL</Label>
                  <Input 
                    id="endpoint-url" 
                    placeholder="http://localhost:11434/api/generate" 
                    value={newModelEndpoint}
                    onChange={(e) => setNewModelEndpoint(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="mt-4" 
                onClick={handleAddModel}
              >
                Add Model
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalLLMSettings;
