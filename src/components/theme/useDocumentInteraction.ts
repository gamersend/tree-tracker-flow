
import { useEffect } from 'react';

/**
 * Hook to mark when user has interacted with the page
 * Used to determine if audio can be played
 */
export const useDocumentInteraction = () => {
  useEffect(() => {
    const markInteraction = () => {
      document.documentElement.setAttribute('data-user-interacted', 'true');
    };
    
    document.addEventListener('click', markInteraction, { once: true });
    document.addEventListener('keydown', markInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', markInteraction);
      document.removeEventListener('keydown', markInteraction);
    };
  }, []);
};
