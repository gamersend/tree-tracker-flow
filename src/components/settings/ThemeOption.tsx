import React from "react";
import { motion } from "framer-motion";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Theme } from "@/components/theme/ThemeProvider";
import { themeIcons, themeNames, themeDescriptions } from "@/config/themes";

interface ThemeOptionProps {
  theme: Theme;
  isSelected: boolean;
}

const getThemePreviewClasses = (theme: Theme) => {
    switch(theme) {
      case "light":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300";
      case "dark":
        return "bg-gradient-to-r from-gray-800 to-gray-900 border-violet-700";
      case "synthwave":
        return "bg-gradient-to-r from-purple-900 via-pink-800 to-indigo-800 border-pink-500";
      case "forest":
        return "bg-gradient-to-r from-green-200 to-green-300 border-green-600";
      case "sydney-green":
        return "bg-gradient-to-r from-sydney-dark via-sydney-green/20 to-sydney-dark border-sydney-green";
      default:
        return "bg-background border-primary";
    }
};

export const ThemeOption = ({ theme, isSelected }: ThemeOptionProps) => {
  return (
    <div className="flex items-center space-x-3">
      <RadioGroupItem 
        value={theme} 
        id={`theme-${theme}`} 
        className="border-sydney-green text-sydney-green data-[state=checked]:bg-sydney-green data-[state=checked]:border-sydney-green" 
      />
      <motion.label
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        htmlFor={`theme-${theme}`}
        className={`flex items-center gap-4 px-4 py-4 rounded-lg cursor-pointer flex-1 border transition-all duration-300 ${
          isSelected 
            ? 'ring-2 ring-sydney-green ring-offset-2 ring-offset-sydney-dark border-sydney-green bg-sydney-green/15 shadow-lg shadow-sydney-green/20' 
            : 'border-sydney-green/30 hover:border-sydney-green/60 hover:bg-sydney-green/5 hover:shadow-md'
        }`}
      >
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center border-2 ${getThemePreviewClasses(theme)}`}>
          {themeIcons[theme]}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sydney-green">{themeNames[theme]}</div>
          <div className="text-xs text-sydney-green/60 mt-1">
            {themeDescriptions[theme]}
          </div>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Badge variant="default" className="bg-sydney-green text-primary-foreground font-semibold">
              Active ✨
            </Badge>
          </motion.div>
        )}
      </motion.label>
    </div>
  );
};

export default ThemeOption;
