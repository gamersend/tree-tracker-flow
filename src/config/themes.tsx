import React from "react";
import { Theme } from "@/components/theme/ThemeProvider";
import { Sun, Moon, Sparkles, Leaf, Zap } from "lucide-react";

export const themeIcons: Record<Theme, React.ReactNode> = {
  light: React.createElement(Sun, { className: "h-5 w-5 text-amber-500" }),
  dark: React.createElement(Moon, { className: "h-5 w-5 text-indigo-400" }),
  synthwave: React.createElement(Sparkles, { className: "h-5 w-5 text-pink-500" }),
  forest: React.createElement(Leaf, { className: "h-5 w-5 text-green-500" }),
  "sydney-green": React.createElement(Zap, { className: "h-5 w-5 text-sydney-green" })
};

export const themeNames: Record<Theme, string> = {
  light: "Sunny Day ☀️",
  dark: "Classic Dark 🌙",
  synthwave: "Retro Synthwave 🌌",
  forest: "Forest Zen 🌲",
  "sydney-green": "Sydney Green 🦘"
};

export const themeNamesSimple: Record<Theme, string> = {
  light: "Sunny Day",
  dark: "Classic Dark",
  synthwave: "Retro Synthwave",
  forest: "Forest Zen",
  "sydney-green": "Sydney Green"
};

export const themeEmojis: Record<Theme, string> = {
  light: "☀️",
  dark: "🌙",
  synthwave: "🌌",
  forest: "🌲",
  "sydney-green": "🦘"
};

export const themeDescriptions: Record<Theme, string> = {
  "sydney-green": "The authentic Aussie experience",
  dark: "Professional and sleek",
  light: "Bright and airy",
  synthwave: "Neon and retro",
  forest: "Natural and calm",
};

export const themeFunFacts: Record<Theme, string> = {
    "sydney-green": " - The original Sydney Green experience! 🇦🇺",
    "synthwave": " - Retro-futuristic vibes from the 80s! ✨",
    "forest": " - Natural and peaceful like the Australian bush! 🌿",
    "dark": " - Classic and professional! 💼",
    "light": " - Bright and cheerful like a sunny Sydney day! ☀️"
};
