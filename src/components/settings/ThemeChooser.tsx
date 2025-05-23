
import React from "react";
import { useTheme, Theme } from "@/components/theme/ThemeProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, Moon, Sparkles, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const themeIcons = {
  light: <Sun className="h-5 w-5 text-amber-500" />,
  dark: <Moon className="h-5 w-5 text-indigo-400" />,
  synthwave: <Sparkles className="h-5 w-5 text-pink-500" />,
  forest: <Leaf className="h-5 w-5 text-green-500" />
};

const themeNames = {
  light: "Sunny Day",
  dark: "Classic Dark",
  synthwave: "Retro Synthwave",
  forest: "Forest Zen"
};

const ThemeChooser = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <Label className="text-lg font-medium">Choose Theme</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select a theme to personalize your experience
          </p>
        </div>
        
        <RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
          className="space-y-4"
        >
          {(["dark", "light", "synthwave", "forest"] as Theme[]).map((themeOption) => (
            <ThemeOption 
              key={themeOption} 
              theme={themeOption} 
              isSelected={theme === themeOption} 
            />
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
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
      default:
        return "bg-background border-primary";
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={theme} id={`theme-${theme}`} />
      <motion.label
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        htmlFor={`theme-${theme}`}
        className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer flex-1 border ${
          isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-muted'
        }`}
      >
        <div className={`h-8 w-8 rounded-md flex items-center justify-center border ${getThemePreviewClasses()}`}>
          {themeIcons[theme]}
        </div>
        <div className="font-medium">{themeNames[theme]}</div>
      </motion.label>
    </div>
  );
};

export default ThemeChooser;
