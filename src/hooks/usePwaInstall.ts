
import { useEffect, useState } from 'react';
import { checkPWAInstallable, dismissInstallPrompt } from '@/utils/pwa-helpers';

export const usePwaInstall = () => {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    if (checkPWAInstallable()) {
      setShowPrompt(true);
    }
    
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowPrompt(false);
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        dismissInstallPrompt();
      }
    }
  };
  
  const handleDismiss = () => {
    setShowPrompt(false);
    dismissInstallPrompt();
  };

  return { showPrompt, isIOS, deferredPrompt, handleInstall, handleDismiss };
};
