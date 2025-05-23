
import { useStrings } from "@/components/theme/StringProvider";

/**
 * A hook that provides localized strings based on the current language mode
 * @returns Object with string getter and language mode info
 */
export const useI18n = () => {
  const { getString, isStonerMode, toggleStonerMode, stonerModeWithIcon } = useStrings();
  
  // Create a safe getString function that handles undefined keys
  const safeGetString = (key: string): string => {
    if (!key) {
      console.warn('useI18n called with empty key');
      return '';
    }
    
    try {
      return getString(key) || key;
    } catch (error) {
      console.warn(`Error getting string for key: ${key}`, error);
      return key;
    }
  };
  
  return {
    t: safeGetString,  // shorthand for translate
    getString: safeGetString,  // full function name
    isStonerMode,  // current mode
    toggleStonerMode,  // function to toggle mode
    stonerModeWithIcon // pre-formatted component with icon
  };
};

export default useI18n;
