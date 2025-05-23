
import React, { createContext, useContext, useState, useEffect } from 'react';
import { stringDictionary, StringDictionary } from './stringDictionary';
import { useDocumentInteraction } from './useDocumentInteraction';

// Context type
interface StringContextType {
  getString: (key: string) => string;
  isStonerMode: boolean;
  toggleStonerMode: () => void;
  stonerModeWithIcon: JSX.Element;
}

// Create context with default values
const StringContext = createContext<StringContextType>({
  getString: () => "",
  isStonerMode: false,
  toggleStonerMode: () => {},
  stonerModeWithIcon: <></>,
});

/**
 * Provider component for localization and stoner mode
 */
export const StringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStonerMode, setIsStonerMode] = useState<boolean>(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const storedPreference = localStorage.getItem("stonerMode");
    if (storedPreference === "true") {
      setIsStonerMode(true);
    }
  }, []);

  // Toggle stoner mode
  const toggleStonerMode = () => {
    const newMode = !isStonerMode;
    setIsStonerMode(newMode);
    localStorage.setItem("stonerMode", String(newMode));
    
    // Add a bit of flair when enabling
    if (newMode) {
      // Play a sound effect if allowed
      const audio = new Audio("/sounds/toggle.mp3");
      audio.volume = 0.3;
      // Only try to play if audio is supported and user has interacted with page
      if (typeof document !== "undefined" && document.documentElement.hasAttribute("data-user-interacted")) {
        audio.play().catch(() => {
          // Silently fail if audio can't play
        });
      }
    }
  };

  // Get the appropriate string based on current mode with safety checks
  const getString = (key: string): string => {
    if (!key) {
      console.warn('Trying to get string with undefined or empty key');
      return '';
    }
    
    // Safely check if the key exists in our dictionary
    if (!stringDictionary[key]) {
      console.warn(`String key not found: ${key}`);
      return key;
    }
    
    try {
      return isStonerMode 
        ? (stringDictionary[key].stoner || stringDictionary[key].default || key) 
        : (stringDictionary[key].default || key);
    } catch (error) {
      console.error(`Error accessing string for key: ${key}`, error);
      return key;
    }
  };

  // Special element with icon for stoner mode label
  const stonerModeWithIcon = (
    <span className="flex items-center gap-1">
      Enable Stoner Vibes Mode
      {isStonerMode && (
        <span className="inline-flex animate-pulse">🍃</span>
      )}
    </span>
  );

  const contextValue: StringContextType = {
    getString,
    isStonerMode,
    toggleStonerMode,
    stonerModeWithIcon
  };

  return (
    <StringContext.Provider value={contextValue}>
      {children}
    </StringContext.Provider>
  );
};

/**
 * Hook for easy access to string context
 * Provides localized strings and stoner mode functionality
 */
export const useStrings = () => {
  const context = useContext(StringContext);
  if (!context) {
    throw new Error("useStrings must be used within a StringProvider");
  }
  return context;
};

// Re-export the document interaction hook
export { useDocumentInteraction };
