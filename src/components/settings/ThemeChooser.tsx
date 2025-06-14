
import React from "react";
import { useTheme, Theme } from "@/components/theme/ThemeProvider";
import { SydneyCard, SydneyCardContent } from "@/components/ui/sydney-card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, Moon, Sparkles, Leaf, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/hooks/useI18n";
import { Badge } from "@/components/ui/badge";

const themeIcons = {
  light: <Sun className="h-5 w-5 text-amber-500" />,
  dark: <Moon className="h-5 w-5 text-indigo-400" />,
  synthwave: <Sparkles className="h-5 w-5 text-pink-500" />,
  forest: <Leaf className="h-5 w-5 text-green-500" />,
  "sydney-green": <Zap className="h-5 w-5 text-sydney-green" />
};

const themeNames = {
  light: "Sunny Day",
  dark: "Classic Dark",
  synthwave: "Retro Synthwave",
  forest: "Forest Zen",
  "sydney-green": "Sydney Green"
};

const ThemeChooser = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  // Add debug console logs to help with troubleshooting
  console.log("Current theme:", theme);
  console.log("Theme options:", ["sydney-green", "dark", "light", "synthwave", "forest"]);

  return (
    <SydneyCard>
      <SydneyCardContent className="pt-6">
        <div className="mb-4">
          <Label className="text-lg font-medium text-sydney-green">Choose Theme</Label>
          <p className="text-sm text-sydney-green/70 mt-1">
            Select a theme to personalize your experience
          </p>
        </div>
        
        <RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
          className="space-y-4"
        >
          {(["sydney-green", "dark", "light", "synthwave", "forest"] as Theme[]).map((themeOption) => (
            <ThemeOption 
              key={themeOption} 
              theme={themeOption} 
              isSelected={theme === themeOption} 
            />
          ))}
        </RadioGroup>
      </SydneyCardContent>
    </SydneyCard>
  );
};

interface ThemeOptionProps {
  theme: Theme;
  isSelected: boolean;
}

const ThemeOption = ({ theme, isSelected }: ThemeOptionProps) => {
  const getThemePreviewClasses = () => {
    switch(theme) {
      case "light":
        return "bg-[#f9f5ec] border-amber-200";
      case "dark":
        return "bg-[#121212] border-violet-700";
      case "synthwave":
        return "bg-gradient-to-r from-purple-900 via-pink-800 to-indigo-800 border-pink-500";
      case "forest":
        return "bg-[#d9ead3] border-green-600";
      case "sydney-green":
        return "bg-gradient-to-r from-sydney-dark via-sydney-purple to-sydney-dark border-sydney-green";
      default:
        return "bg-background border-primary";
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={theme} id={`theme-${theme}`} className="border-sydney-green text-sydney-green" />
      <motion.label
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        htmlFor={`theme-${theme}`}
        className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer flex-1 border transition-all duration-200 ${
          isSelected 
            ? 'ring-2 ring-sydney-green ring-offset-2 ring-offset-sydney-dark border-sydney-green bg-sydney-green/10' 
            : 'border-sydney-green/30 hover:border-sydney-green/50 hover:bg-sydney-green/5'
        }`}
      >
        <div className={`h-8 w-8 rounded-md flex items-center justify-center border ${getThemePreviewClasses()}`}>
          {themeIcons[theme]}
        </div>
        <div className="font-medium text-sydney-green">{themeNames[theme]}</div>
        {isSelected && <Badge variant="default" className="ml-auto bg-sydney-green text-sydney-dark">Active</Badge>}
      </motion.label>
    </div>
  );
};

export default ThemeChooser;
