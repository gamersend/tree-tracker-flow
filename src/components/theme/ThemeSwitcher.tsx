
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sun, Moon, Sparkles, Leaf, Zap } from "lucide-react";
import { useTheme, Theme } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { themeEmojis, themeNamesSimple } from "@/config/themes";

interface ThemeSwitcherProps {
  variant?: "default" | "icon";
}

export function ThemeSwitcher({ variant = "default" }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeIcon = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    synthwave: <Sparkles className="h-5 w-5" />,
    forest: <Leaf className="h-5 w-5" />,
    "sydney-green": <Zap className="h-5 w-5" />
  };

  const themeNames = themeNamesSimple;

  const getThemeButtonClasses = () => {
    switch (theme) {
      case "light":
        return "bg-amber-100 text-amber-900";
      case "dark":
        return "bg-slate-800 text-slate-200";
      case "synthwave":
        return "bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 text-white";
      case "forest":
        return "bg-green-700 text-green-100";
      case "sydney-green":
        return "bg-sydney-green text-primary-foreground shadow-lg shadow-sydney-green/30";
      default:
        return "bg-slate-800 text-slate-200";
    }
  };

  const handleSelect = (value: Theme) => {
    setTheme(value);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            size={variant === "icon" ? "icon" : "default"}
            className={getThemeButtonClasses()}
          >
            <span className="sr-only">Toggle theme</span>
            {themeIcon[theme]}
            {variant === "default" && <span className="ml-2">{themeNames[theme]}</span>}
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px] bg-background border-border">
        <DropdownMenuItem 
          onClick={() => handleSelect("sydney-green")}
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-sydney-green" />
            <span>{themeEmojis["sydney-green"]} {themeNames["sydney-green"]}</span>
          </div>
          {theme === "sydney-green" && <Badge className="ml-2">Active</Badge>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleSelect("light")}
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>{themeEmojis.light} {themeNames.light}</span>
          </div>
          {theme === "light" && <Badge className="ml-2">Active</Badge>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleSelect("dark")}
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-indigo-400" />
            <span>{themeEmojis.dark} {themeNames.dark}</span>
          </div>
          {theme === "dark" && <Badge className="ml-2">Active</Badge>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleSelect("synthwave")}
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span>{themeEmojis.synthwave} {themeNames.synthwave}</span>
          </div>
          {theme === "synthwave" && <Badge className="ml-2">Active</Badge>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleSelect("forest")}
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-500" />
            <span>{themeEmojis.forest} {themeNames.forest}</span>
          </div>
          {theme === "forest" && <Badge className="ml-2">Active</Badge>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
