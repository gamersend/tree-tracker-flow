
import React from "react";
import { useTheme, Theme } from "@/components/theme/ThemeProvider";
import { SydneyCard, SydneyCardContent } from "@/components/ui/sydney-card";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { ThemeOption } from "./ThemeOption";
import { themeNames, themeEmojis, themeFunFacts } from "@/config/themes";

const ThemeChooser = () => {
  const { theme, setTheme } = useTheme();

  // Add debug console logs to help with troubleshooting
  console.log("Current theme:", theme);
  const themeOptions: Theme[] = ["sydney-green", "dark", "light", "synthwave", "forest"];
  console.log("Theme options:", themeOptions);

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
          {themeOptions.map((themeOption, index) => (
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
            {themeFunFacts[theme]}
          </p>
        </motion.div>
      </SydneyCardContent>
    </SydneyCard>
  );
};

export default ThemeChooser;

