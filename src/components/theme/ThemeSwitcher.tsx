
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme, Theme } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeIcon = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    psychedelic: <Sparkles className="h-5 w-5" />,
  };

  const themeEmoji = {
    light: "🌞",
    dark: "🌙",
    psychedelic: "🍄",
  };

  const handleSelect = (value: Theme) => {
    setTheme(value);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button 
            variant="ghost" 
            size="icon" 
            className={
              theme === "psychedelic" 
                ? "bg-gradient-to-r from-purple-500 via-pink-500 to-green-400 text-white" 
                : theme === "light" 
                ? "bg-orange-100 text-orange-900" 
                : "bg-slate-800 text-slate-200"
            }
          >
            <span className="sr-only">Toggle theme</span>
            {themeIcon[theme]}
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleSelect("light")}
          className="cursor-pointer"
        >
          <Sun className="h-4 w-4 mr-2" />
          <span>{themeEmoji.light} Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleSelect("dark")}
          className="cursor-pointer"
        >
          <Moon className="h-4 w-4 mr-2" />
          <span>{themeEmoji.dark} Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleSelect("psychedelic")}
          className="cursor-pointer"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          <span>{themeEmoji.psychedelic} Psychedelic</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
