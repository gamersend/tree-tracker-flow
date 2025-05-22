
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Cloud, 
  Plus, 
  Trash2, 
  Edit,
  Save, 
  CheckCircle, 
  AlertCircle,
  EyeOff,
  Eye,
  Sparkles
} from "lucide-react";
import { useOpenAI, OpenAIModel } from "@/hooks/useOpenAI";
import { toast } from "sonner";

const OpenAISettings: React.FC = () => {
  const { 
    getModels, 
    getActiveModel, 
    setActiveModel,
    updateModel,
    addModel,
    removeModel,
    getApiKey,
    saveApiKey
  } = useOpenAI();
  
  const [models, setModels] = useState<OpenAIModel[]>([]);
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [newModelId, setNewModelId] = useState("");
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  
  // Load models and API key on mount
  useEffect(() => {
    setModels(getModels());
    const savedApiKey = getApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, [getModels, getApiKey]);
  
  // Handle API key save
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("API Key cannot be empty");
      return;
    }
    
    saveApiKey(apiKey);
  };
  
  // Test API connection
  const testApiConnection = async () => {
    if (!apiKey) {
      toast.error("Please enter an API key first");
      return;
    }
    
    setIsTestingApi(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success("Successfully connected to OpenAI API");
      } else {
        const error = await response.json();
        toast.error(`API connection failed: ${error.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error(`API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTestingApi(false);
    }
  };
  
  // Handle model activation
  const handleModelActivation = (modelId: string) => {
    setActiveModel(modelId);
    setModels(getModels());
  };
  
  // Handle model edit
  const handleEditModel = (model: OpenAIModel) => {
    setNewModelName(model.name);
    setNewModelId(model.id);
    setEditingModelId(model.id);
  };
  
  // Save edited model
  const saveEditedModel = () => {
    if (editingModelId) {
      const model = models.find(m => m.id === editingModelId);
      if (model) {
        const updatedModel = {
          ...model,
          name: newModelName,
          id: newModelId
        };
        
        updateModel(updatedModel);
        setModels(getModels());
        setEditingModelId(null);
        setNewModelName("");
        setNewModelId("");
      }
    }
  };
  
  // Add new model
  const handleAddModel = () => {
    if (!newModelName.trim() || !newModelId.trim()) {
      toast.error("Model name and ID are required");
      return;
    }
    
    addModel({
      id: newModelId,
      name: newModelName,
      description: "Custom OpenAI model"
    });
    
    setModels(getModels());
    setNewModelName("");
    setNewModelId("");
  };
  
  // Remove model
  const handleRemoveModel = (modelId: string) => {
    if (models.length <= 1) {
      toast.error("Cannot remove the only model");
      return;
    }
    
    const activeModel = getActiveModel();
    if (activeModel?.id === modelId) {
      toast.error("Cannot remove the active model");
      return;
    }
    
    removeModel(modelId);
    setModels(getModels());
  };
  
  return (
    <Card className="border border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-sky-400" />
          OpenAI API Configuration
        </CardTitle>
        <CardDescription>
          Configure OpenAI API for enhanced AI capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Authentication</h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="openai-api-key">OpenAI API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Input
                  id="openai-api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button 
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim()}
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Your API key is stored locally and never shared.
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-500 ml-1"
              >
                Get API key
              </a>
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={testApiConnection}
              disabled={isTestingApi || !apiKey}
              className="text-sm"
            >
              {isTestingApi ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </div>
        
        <Separator className="bg-slate-800" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">OpenAI Models</h3>
          <div className="space-y-2">
            {models.map((model) => (
              <div 
                key={model.id}
                className={`flex items-center justify-between p-3 rounded-md ${
                  model.active 
                    ? "bg-tree-purple/10 border border-tree-purple/30" 
                    : "bg-slate-800/20 border border-slate-700/30"
                }`}
              >
                <div className="flex items-start flex-col">
                  {editingModelId === model.id ? (
                    <div className="space-y-2 w-full">
                      <Input
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                        placeholder="Model name"
                        size={30}
                      />
                      <Input
                        value={newModelId}
                        onChange={(e) => setNewModelId(e.target.value)}
                        placeholder="Model ID"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={saveEditedModel}
                          disabled={!newModelName || !newModelId}
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditingModelId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium flex items-center">
                        {model.active && <Sparkles className="h-3 w-3 text-tree-purple mr-1" />}
                        {model.name}
                      </div>
                      <div className="text-xs text-gray-400">ID: {model.id}</div>
                      <div className="text-xs text-gray-400">{model.description}</div>
                    </>
                  )}
                </div>
                
                {editingModelId !== model.id && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Switch
                        id={`model-${model.id}`}
                        checked={model.active}
                        onCheckedChange={() => handleModelActivation(model.id)}
                      />
                      <Label htmlFor={`model-${model.id}`} className="ml-2">
                        {model.active ? "Active" : "Inactive"}
                      </Label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditModel(model)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveModel(model.id)}
                      disabled={model.active || models.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {editingModelId === null && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Add New Model</h4>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Model display name"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                />
                <Input
                  placeholder="Model ID (e.g., gpt-4o)"
                  value={newModelId}
                  onChange={(e) => setNewModelId(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddModel}
                  disabled={!newModelName || !newModelId}
                  className="self-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Model
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-slate-800 pt-4">
        <div className="text-sm text-gray-400">
          <a 
            href="https://platform.openai.com/docs/models" 
            target="_blank" 
            rel="noreferrer"
            className="text-blue-400 hover:underline"
          >
            View available models
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OpenAISettings;
