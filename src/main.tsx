
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(<App />);

// Register service worker after React app is mounted
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Set up everything after the app is loaded
window.addEventListener('load', () => {
  // Register service worker
  registerServiceWorker();
  
  // Only import and use notification helpers after everything is loaded
  if (typeof window !== 'undefined' && 'Notification' in window) {
    import('./utils/pwa-helpers.ts').then(({ checkScheduledNotifications, checkAndScheduleNotifications }) => {
      // Check every minute for scheduled notifications
      setInterval(checkScheduledNotifications, 60000);
      
      // Check for business notifications if permission is granted
      if (Notification.permission === 'granted') {
        // Initial check after 5 seconds
        setTimeout(() => {
          checkAndScheduleNotifications();
          // Then check every hour
          setInterval(checkAndScheduleNotifications, 3600000);
        }, 5000);
      }
    }).catch(error => {
      console.error('Error loading PWA helpers:', error);
    });
  }
});
