
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface LocalLLMModel {
  name: string;
  description: string;
  endpoint: string;
  active: boolean;
}

interface LLMRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onToken?: (token: string) => void;
}

export const useLocalLLM = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getActiveModel = useCallback((): LocalLLMModel | null => {
    try {
      const savedModels = localStorage.getItem('local-llm-models');
      if (!savedModels) return null;
      
      const models: LocalLLMModel[] = JSON.parse(savedModels);
      return models.find(model => model.active) || null;
    } catch (err) {
      console.error("Error getting active LLM model:", err);
      return null;
    }
  }, []);

  const checkLLMAvailability = useCallback(async (): Promise<boolean> => {
    const activeModel = getActiveModel();
    if (!activeModel) {
      toast.error("No active LLM model configured. Please activate a model in Settings.");
      return false;
    }

    try {
      const response = await fetch(activeModel.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3",
          prompt: "test",
          stream: false,
          max_tokens: 1
        }),
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      return response.ok;
    } catch (err) {
      console.error("LLM availability check failed:", err);
      return false;
    }
  }, [getActiveModel]);

  const generateText = useCallback(async (
    prompt: string, 
    options: LLMRequestOptions = {}
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    const activeModel = getActiveModel();
    if (!activeModel) {
      setError("No active LLM model configured");
      setIsLoading(false);
      toast.error("No active LLM model configured. Please activate a model in Settings.");
      return null;
    }
    
    const {
      model = "llama3",
      temperature = 0.7,
      maxTokens = 500,
      stream = false,
      onToken
    } = options;
    
    try {
      if (stream && onToken) {
        const response = await fetch(activeModel.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            prompt,
            stream: true,
            temperature,
            max_tokens: maxTokens
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body?.getReader();
        if (!reader) throw new Error("Response body is null");
        
        let result = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Process the chunk (this depends on the exact format of your LLM API)
          const chunk = new TextDecoder().decode(value);
          try {
            // For Ollama API format
            const jsonLines = chunk.split('\n').filter(Boolean);
            
            for (const line of jsonLines) {
              const jsonData = JSON.parse(line);
              if (jsonData.response) {
                result += jsonData.response;
                onToken(jsonData.response);
              }
            }
          } catch (e) {
            console.error("Error parsing streaming response:", e);
          }
        }
        
        return result;
      } else {
        // Non-streaming request
        const response = await fetch(activeModel.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            prompt,
            stream: false,
            temperature,
            max_tokens: maxTokens
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Handle different API response formats (this is for Ollama)
        return data.response || null;
      }
    } catch (error) {
      console.error("Local LLM error:", error);
      setError(error instanceof Error ? error.message : "Failed to connect to local LLM");
      toast.error("Failed to connect to local LLM. Is your server running?");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getActiveModel]);

  return {
    generateText,
    checkLLMAvailability,
    getActiveModel,
    isLoading,
    error
  };
};
