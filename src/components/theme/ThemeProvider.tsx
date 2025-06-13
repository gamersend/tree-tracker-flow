
import React, { createContext, useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { SydneyGreenBackground } from "./SydneyGreenTheme";

export type Theme = "dark" | "light" | "synthwave" | "forest" | "sydney-green";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("sydney-green");
  
  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme && ["dark", "light", "synthwave", "forest", "sydney-green"].includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);
  
  // Save theme to localStorage on change
  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    // Update document class for theme
    document.body.classList.remove("theme-dark", "theme-light", "theme-synthwave", "theme-forest", "theme-sydney-green");
    document.body.classList.add(`theme-${theme}`);
    
    // Update data-theme attribute for shadcn components
    document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {/* Theme-specific background effects */}
      {theme === "sydney-green" && <SydneyGreenBackground />}
      
      {theme === "synthwave" && (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-800/30 to-indigo-900/30 animate-pulse-subtle"></div>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[1px] h-[40vh] bg-gradient-to-b from-transparent via-pink-500/30 to-transparent"
              style={{
                left: `${(i * 12) + Math.random() * 5}%`,
                top: '-20%',
                opacity: 0.4 + (Math.random() * 0.4)
              }}
              animate={{
                y: ["0%", "120%"],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 8 + (Math.random() * 15),
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}
      
      {theme === "forest" && (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/forest-bg.jpg')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/5 to-green-700/5"></div>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: 8 + Math.random() * 10,
                height: 8 + Math.random() * 10,
                borderRadius: '50%',
                background: 'rgba(121, 182, 121, 0.1)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(1px)',
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 20 + (Math.random() * 10),
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
      
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
