
import { useAI } from "./useAI";
import { toast } from "sonner";

export const useAiPrompts = () => {
  const { generateText, checkAIAvailability, isLoading, getActiveProvider } = useAI();
  const activeProvider = getActiveProvider();
  
  const summarizeText = async (text: string, maxLength: number = 100): Promise<string | null> => {
    if (!text.trim()) return null;
    
    const prompt = `
    Summarize the following text in under ${maxLength} characters:
    "${text}"
    
    Reply with ONLY the summary, no explanations.
    `;
    
    try {
      return await generateText(prompt);
    } catch (error) {
      console.error("Error summarizing text:", error);
      return null;
    }
  };
  
  const generateTitle = async (content: string): Promise<string | null> => {
    if (!content.trim()) return null;
    
    const prompt = `
    Create a short, catchy title for this content (max 5 words):
    "${content.substring(0, 500)}"
    
    Reply with ONLY the title, no quotation marks or explanations.
    `;
    
    try {
      return await generateText(prompt);
    } catch (error) {
      console.error("Error generating title:", error);
      return null;
    }
  };
  
  const enhanceSaleDescription = async (description: string): Promise<string | null> => {
    if (!description.trim()) return null;
    
    const prompt = `
    Enhance this cannabis sale description to include all relevant details. 
    Include quantity, strain, price, profit, customer name, and date if available:
    
    "${description}"
    
    Keep a natural language style but ensure all details are clear. Reply with ONLY the enhanced text.
    `;
    
    try {
      return await generateText(prompt);
    } catch (error) {
      console.error("Error enhancing sale description:", error);
      return null;
    }
  };
  
  const checkAiAvailability = () => {
    const { available } = checkAIAvailability();
    if (!available) {
      toast.error(`No AI model configured. Please configure ${activeProvider === "openai" ? "OpenAI" : "Local LLM"} in Settings.`);
      return false;
    }
    return true;
  };
  
  return {
    summarizeText,
    generateTitle,
    enhanceSaleDescription,
    checkAiAvailability,
    isAiLoading: isLoading,
    hasActiveModel: checkAIAvailability().available,
    activeProvider
  };
};
