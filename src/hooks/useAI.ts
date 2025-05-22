
import { useState, useCallback } from "react";
import { useLocalLLM } from "./useLocalLLM";
import { useOpenAI } from "./useOpenAI";
import { toast } from "sonner";

// Combined AI provider options
export type AIProvider = "local" | "openai";

export interface AIRequestOptions {
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onToken?: (token: string) => void;
}

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUsedProvider, setLastUsedProvider] = useState<AIProvider | null>(null);

  const localLLM = useLocalLLM();
  const openai = useOpenAI();

  // Get active provider preference from localStorage or set default
  const getActiveProvider = useCallback((): AIProvider => {
    try {
      const savedProvider = localStorage.getItem('active-ai-provider');
      if (savedProvider === "local" || savedProvider === "openai") {
        return savedProvider;
      }
      
      // Default to OpenAI if API key is set, otherwise local
      const hasOpenAIKey = !!openai.getApiKey();
      const defaultProvider = hasOpenAIKey ? "openai" : "local";
      localStorage.setItem('active-ai-provider', defaultProvider);
      return defaultProvider;
    } catch (err) {
      console.error("Error getting active AI provider:", err);
      return "local"; // Fallback to local
    }
  }, [openai]);

  // Set active provider
  const setActiveProvider = useCallback((provider: AIProvider): void => {
    localStorage.setItem('active-ai-provider', provider);
    toast.success(`Switched to ${provider === "openai" ? "OpenAI" : "Local LLM"} provider`);
  }, []);

  // Generate text using the preferred or specified provider
  const generateText = useCallback(async (
    prompt: string,
    options: AIRequestOptions = {}
  ): Promise<string | null> => {
    const activeProvider = options.provider || getActiveProvider();
    setLastUsedProvider(activeProvider);

    setIsLoading(true);
    setError(null);

    try {
      let result: string | null = null;
      
      if (activeProvider === "openai") {
        // Check if OpenAI API key is configured
        const apiKey = openai.getApiKey();
        if (!apiKey) {
          throw new Error("OpenAI API Key not configured. Please set it in Settings.");
        }
        
        result = await openai.generateText(prompt, {
          model: options.model,
          temperature: options.temperature,
          maxTokens: options.maxTokens,
          stream: options.stream,
          onToken: options.onToken
        });
      } else {
        // Default to local LLM
        result = await localLLM.generateText(prompt, {
          model: options.model,
          temperature: options.temperature,
          maxTokens: options.maxTokens,
          stream: options.stream,
          onToken: options.onToken
        });
      }
      
      return result;
    } catch (error) {
      console.error(`${activeProvider} AI error:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to generate text with ${activeProvider}`;
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getActiveProvider, localLLM, openai]);

  // Check if any AI provider is configured and available
  const checkAIAvailability = useCallback((): { available: boolean, provider: AIProvider | null } => {
    const activeProvider = getActiveProvider();
    
    if (activeProvider === "openai") {
      const apiKey = openai.getApiKey();
      const activeModel = openai.getActiveModel();
      
      if (apiKey && activeModel) {
        return { available: true, provider: "openai" };
      }
    }
    
    // Check local LLM as fallback
    const localModel = localLLM.getActiveModel();
    if (localModel) {
      return { available: true, provider: "local" };
    }
    
    return { available: false, provider: null };
  }, [getActiveProvider, openai, localLLM]);

  // Auto-select best available provider
  const autoSelectProvider = useCallback((): AIProvider | null => {
    const { available, provider } = checkAIAvailability();
    
    if (available && provider) {
      setActiveProvider(provider);
      return provider;
    }
    
    return null;
  }, [checkAIAvailability, setActiveProvider]);

  return {
    generateText,
    getActiveProvider,
    setActiveProvider,
    autoSelectProvider,
    checkAIAvailability,
    isLoading,
    error,
    lastUsedProvider,
    openai,
    localLLM
  };
};
