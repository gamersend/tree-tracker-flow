
import { useStrings } from "@/components/theme/StringProvider";

/**
 * A hook that provides localized strings based on the current language mode
 * @returns Object with string getter and language mode info
 */
export const useI18n = () => {
  const { getString, isStonerMode, toggleStonerMode, stonerModeWithIcon } = useStrings();
  
  return {
    t: getString,  // shorthand for translate
    getString,     // full function name
    isStonerMode,  // current mode
    toggleStonerMode,  // function to toggle mode
    stonerModeWithIcon // pre-formatted component with icon
  };
};

export default useI18n;
