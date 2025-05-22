
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkPWAInstallable, dismissInstallPrompt } from '@/utils/pwa-helpers';

const InstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Check if it's iOS device
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    // Only show the banner if not already installed and not recently dismissed
    if (checkPWAInstallable()) {
      setShowBanner(true);
    }
    
    // Handle beforeinstallprompt event (not available on iOS)
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to show install button
      setShowBanner(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstall = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      // Reset the deferred prompt variable
      setDeferredPrompt(null);
      // Hide the banner regardless of outcome
      setShowBanner(false);
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        dismissInstallPrompt();
      }
    }
  };
  
  const handleDismiss = () => {
    setShowBanner(false);
    dismissInstallPrompt();
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-tree-purple to-purple-900 p-4 rounded-lg shadow-lg flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🌿</span>
          <div>
            <h3 className="font-bold text-white">Install Cannabis Army Tracker</h3>
            {isIOS ? (
              <p className="text-xs text-gray-200">
                Tap "Share" then "Add to Home Screen"
              </p>
            ) : (
              <p className="text-xs text-gray-200">
                Install our app for the best experience
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isIOS && (
            <Button 
              onClick={handleInstall}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              Install
            </Button>
          )}
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-purple-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallBanner;
