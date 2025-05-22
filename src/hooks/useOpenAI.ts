
import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface OpenAIModel {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface OpenAIRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onToken?: (token: string) => void;
}

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize models from localStorage or set default if none exist
  const getModels = useCallback((): OpenAIModel[] => {
    try {
      const savedModels = localStorage.getItem('openai-models');
      if (savedModels) {
        return JSON.parse(savedModels);
      }
      
      // Default models
      const defaultModels: OpenAIModel[] = [
        {
          id: "gpt-4o-mini",
          name: "GPT-4o Mini",
          description: "Fast, cost-effective model with vision capabilities",
          active: true
        },
        {
          id: "gpt-4o",
          name: "GPT-4o",
          description: "Powerful model with vision capabilities",
          active: false
        }
      ];
      
      localStorage.setItem('openai-models', JSON.stringify(defaultModels));
      return defaultModels;
    } catch (err) {
      console.error("Error getting OpenAI models:", err);
      return [];
    }
  }, []);

  // Save models to localStorage
  const saveModels = useCallback((models: OpenAIModel[]): void => {
    try {
      localStorage.setItem('openai-models', JSON.stringify(models));
    } catch (err) {
      console.error("Error saving OpenAI models:", err);
    }
  }, []);

  // Get the active model
  const getActiveModel = useCallback((): OpenAIModel | null => {
    const models = getModels();
    return models.find(model => model.active) || null;
  }, [getModels]);

  // Update a model
  const updateModel = useCallback((updatedModel: OpenAIModel): void => {
    const models = getModels();
    const index = models.findIndex(model => model.id === updatedModel.id);
    
    if (index !== -1) {
      models[index] = updatedModel;
      saveModels(models);
    }
  }, [getModels, saveModels]);

  // Set a model as active (and deactivate others)
  const setActiveModel = useCallback((modelId: string): void => {
    const models = getModels();
    const updatedModels = models.map(model => ({
      ...model,
      active: model.id === modelId
    }));
    
    saveModels(updatedModels);
    toast.success(`Model "${models.find(m => m.id === modelId)?.name}" activated`);
  }, [getModels, saveModels]);

  // Add a new model
  const addModel = useCallback((model: Omit<OpenAIModel, 'active'>): void => {
    const models = getModels();
    const newModel = {
      ...model,
      active: false
    };
    
    saveModels([...models, newModel]);
    toast.success(`Model "${model.name}" added`);
  }, [getModels, saveModels]);

  // Remove a model
  const removeModel = useCallback((modelId: string): void => {
    const models = getModels();
    const filteredModels = models.filter(model => model.id !== modelId);
    
    if (filteredModels.length !== models.length) {
      saveModels(filteredModels);
      toast.success(`Model removed successfully`);
    }
  }, [getModels, saveModels]);

  // Make sure there's always an active model (activates the first one if none are active)
  const activateFirstModelIfNeeded = useCallback((): boolean => {
    const models = getModels();
    const hasActiveModel = models.some(model => model.active);
    
    if (!hasActiveModel && models.length > 0) {
      setActiveModel(models[0].id);
      return true;
    }
    
    return hasActiveModel;
  }, [getModels, setActiveModel]);

  // Get API key from localStorage
  const getApiKey = useCallback((): string | null => {
    return localStorage.getItem('openai-api-key');
  }, []);

  // Save API key to localStorage
  const saveApiKey = useCallback((apiKey: string): void => {
    localStorage.setItem('openai-api-key', apiKey);
    toast.success("API Key saved successfully");
  }, []);

  // Generate text with OpenAI API
  const generateText = useCallback(async (
    prompt: string,
    options: OpenAIRequestOptions = {}
  ): Promise<string | null> => {
    const apiKey = getApiKey();
    if (!apiKey) {
      toast.error("OpenAI API Key not configured. Please set it in Settings.");
      return null;
    }

    const activeModel = getActiveModel();
    if (!activeModel) {
      toast.error("No active OpenAI model configured");
      return null;
    }

    setIsLoading(true);
    setError(null);

    const {
      model = activeModel.id,
      temperature = 0.7,
      maxTokens = 1000,
      stream = false,
      onToken
    } = options;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature,
          max_tokens: maxTokens,
          stream
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Unknown error from OpenAI API');
      }

      if (stream && onToken && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonData = line.slice(6);
              if (jsonData === '[DONE]') break;
              
              try {
                const data = JSON.parse(jsonData);
                if (data.choices?.[0]?.delta?.content) {
                  const content = data.choices[0].delta.content;
                  onToken(content);
                  result += content;
                }
              } catch (e) {
                console.error('Error parsing streaming response:', e);
              }
            }
          }
        }
        
        return result;
      } else {
        const data = await response.json();
        return data.choices[0]?.message?.content || null;
      }
    } catch (err) {
      console.error("OpenAI API error:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to OpenAI API");
      toast.error(`OpenAI API error: ${err instanceof Error ? err.message : "Unknown error"}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getApiKey, getActiveModel]);

  return {
    generateText,
    getModels,
    getActiveModel,
    setActiveModel,
    updateModel,
    addModel,
    removeModel,
    activateFirstModelIfNeeded,
    getApiKey,
    saveApiKey,
    isLoading,
    error
  };
};
