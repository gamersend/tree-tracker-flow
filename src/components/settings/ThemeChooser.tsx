
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
  light: "Sunny Day ☀️",
  dark: "Classic Dark 🌙",
  synthwave: "Retro Synthwave 🌌",
  forest: "Forest Zen 🌲",
  "sydney-green": "Sydney Green 🦘"
};

const themeEmojis = {
  light: "☀️",
  dark: "🌙",
  synthwave: "🌌",
  forest: "🌲",
  "sydney-green": "🦘"
};

const ThemeChooser = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  // Add debug console logs to help with troubleshooting
  console.log("Current theme:", theme);
  console.log("Theme options:", ["sydney-green", "dark", "light", "synthwave", "forest"]);

  return (
    <SydneyCard className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full bg-repeat opacity-30"
          style={{
            backgroundImage: `url('/lovable-uploads/7b98a9dc-a37f-4d99-86b9-61124cd8c537.png')`,
            backgroundSize: '200px 200px'
          }}
        />
      </div>
      
      <SydneyCardContent className="pt-6 relative z-10">
        <div className="mb-6">
          <Label className="text-lg font-medium text-sydney-green flex items-center gap-2">
            🎨 Choose Your Vibe
          </Label>
          <p className="text-sm text-sydney-green/70 mt-1">
            Select a theme to personalize your Sydney Green experience
          </p>
        </div>
        
        <RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
          className="space-y-4"
        >
          {(["sydney-green", "dark", "light", "synthwave", "forest"] as Theme[]).map((themeOption, index) => (
            <motion.div
              key={themeOption}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ThemeOption 
                theme={themeOption} 
                isSelected={theme === themeOption} 
              />
            </motion.div>
          ))}
        </RadioGroup>
        
        {/* Fun fact about selected theme */}
        <motion.div 
          className="mt-6 p-4 bg-sydney-green/10 rounded-lg border border-sydney-green/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-sydney-green/80">
            {themeEmojis[theme]} Currently vibing with <strong>{themeNames[theme]}</strong>
            {theme === "sydney-green" && " - The original Sydney Green experience! 🇦🇺"}
            {theme === "synthwave" && " - Retro-futuristic vibes from the 80s! ✨"}
            {theme === "forest" && " - Natural and peaceful like the Australian bush! 🌿"}
            {theme === "dark" && " - Classic and professional! 💼"}
            {theme === "light" && " - Bright and cheerful like a sunny Sydney day! ☀️"}
          </p>
        </motion.div>
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
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center border-2 ${getThemePreviewClasses()}`}>
          {themeIcons[theme]}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sydney-green">{themeNames[theme]}</div>
          <div className="text-xs text-sydney-green/60 mt-1">
            {theme === "sydney-green" && "The authentic Aussie experience"}
            {theme === "dark" && "Professional and sleek"}
            {theme === "light" && "Bright and airy"}
            {theme === "synthwave" && "Neon and retro"}
            {theme === "forest" && "Natural and calm"}
          </div>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Badge variant="default" className="bg-sydney-green text-sydney-dark font-semibold">
              Active ✨
            </Badge>
          </motion.div>
        )}
      </motion.label>
    </div>
  );
};

export default ThemeChooser;
