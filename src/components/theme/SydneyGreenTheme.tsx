import React from "react";
import { motion } from "framer-motion";

export const SydneyGreenBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Rotating background images with faded effects */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('/lovable-uploads/3bbd2c6b-6c2b-4ce4-ba58-54b98e3e9889.png')`,
          filter: 'blur(1px)',
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Overlay gradient to ensure readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-800/70 to-purple-900/80"></div>
      
      {/* Sydney skyline silhouette effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent"></div>
      
      {/* Floating cannabis leaves */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-sydney-green opacity-30"
          style={{
            left: `${10 + (i * 12)}%`,
            fontSize: '2rem',
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 18 + (i * 3),
            repeat: Infinity,
            delay: i * 1.2,
            ease: "easeInOut"
          }}
        >
          🌿
        </motion.div>
      ))}
      
      {/* Enhanced neon glow particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute w-3 h-3 rounded-full bg-sydney-green opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(2px)',
            boxShadow: '0 0 15px rgba(0, 255, 102, 0.8)',
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [0, Math.random() * 20 - 10],
            y: [0, Math.random() * 20 - 10],
          }}
          transition={{
            duration: 10 + (Math.random() * 8),
            repeat: Infinity,
            delay: i * 0.8,
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
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sydney-green to-green-400 p-2 shadow-lg shadow-sydney-green/40">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="text-white text-xl flex items-center justify-center h-full"
          >
            🦘
          </motion.div>
        </div>
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-sydney-green rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ boxShadow: '0 0 12px rgba(0, 255, 102, 0.9)' }}
        />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl text-sydney-green sydney-glow">
          Sydney Green
        </span>
        <span className="text-sm text-sydney-green/80 font-medium">
          CAT
        </span>
      </div>
    </motion.div>
  );
};

// New component for page-specific backgrounds
export const PageBackground = ({ imageIndex = 0 }: { imageIndex?: number }) => {
  const images = [
    '/lovable-uploads/3bbd2c6b-6c2b-4ce4-ba58-54b98e3e9889.png', // Sydney harbor sunset
    '/lovable-uploads/fd9c4432-ccd6-4f91-920e-b27882a4965c.png', // Cabin lakeside
    '/lovable-uploads/ef8dcd95-41ac-4133-b454-7076725a4346.png', // Neon Sydney night
    '/lovable-uploads/b067b4fb-928a-477a-b7bf-0bf38b2ef441.png', // Education lab
    '/lovable-uploads/7b98a9dc-a37f-4d99-86b9-61124cd8c537.png', // Sydney Green logo
    '/lovable-uploads/4405786f-b1a5-47ca-881d-a11bb69c8872.png', // Farm/greenhouse
    '/lovable-uploads/fe11a099-4861-4d83-a5bc-115c2b8dbb11.png', // Space bong
    '/lovable-uploads/0a1f7943-cb7e-4166-a611-53fd80e62776.png', // Alien smoking
    '/lovable-uploads/87b2bd7a-a0b8-487a-bfea-b81e157a9495.png', // Stoner sloth
    '/lovable-uploads/426a97e2-0a39-459b-a908-88e851038eeb.png'  // Rick bong
  ];

  const selectedImage = images[imageIndex % images.length];

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[-2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{
          backgroundImage: `url('${selectedImage}')`,
          filter: 'blur(2px) brightness(0.8)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-sydney-dark/90 via-sydney-purple/60 to-sydney-dark/90" />
    </motion.div>
  );
};

// Ensure the export table is explicit at the end of the file.
export {
  SydneyGreenBackground,
  SydneyGreenLogo,
  PageBackground,
};
