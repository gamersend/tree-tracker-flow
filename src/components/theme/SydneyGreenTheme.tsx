
import React from "react";
import { motion } from "framer-motion";

export const SydneyGreenBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900"></div>
      
      {/* Sydney skyline silhouette effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent"></div>
      
      {/* Floating cannabis leaves */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-sydney-green opacity-20"
          style={{
            left: `${10 + (i * 15)}%`,
            fontSize: '2rem',
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15 + (i * 2),
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut"
          }}
        >
          🌿
        </motion.div>
      ))}
      
      {/* Neon glow particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute w-2 h-2 rounded-full bg-sydney-green opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(1px)',
            boxShadow: '0 0 10px rgba(0, 255, 102, 0.6)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 8 + (Math.random() * 4),
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export const SydneyGreenLogo = () => {
  return (
    <motion.div 
      className="flex items-center gap-3"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sydney-green to-green-400 p-2 shadow-lg shadow-sydney-green/30">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-white text-lg"
          >
            🌿
          </motion.div>
        </div>
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-sydney-green rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ boxShadow: '0 0 8px rgba(0, 255, 102, 0.8)' }}
        />
      </div>
      <span className="font-bold text-xl text-sydney-green sydney-glow">
        Sydney Green CAT
      </span>
    </motion.div>
  );
};
