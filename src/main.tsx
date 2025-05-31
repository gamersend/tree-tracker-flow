
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { 
  registerServiceWorker, 
  checkScheduledNotifications
} from './utils/pwa-helpers.ts'

// Register Service Worker
registerServiceWorker();

// Check for scheduled notifications - only if Notification API is available
if (typeof window !== 'undefined' && 'Notification' in window) {
  setInterval(checkScheduledNotifications, 60000); // Check every minute
  
  // Check for notifications that need to be shown (low stock, overdue payments, etc.)
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      import('./utils/pwa-helpers.ts').then(({ checkAndScheduleNotifications }) => {
        checkAndScheduleNotifications();
        // Recheck periodically
        setInterval(checkAndScheduleNotifications, 3600000); // Check every hour
      });
    }
  }, 5000); // Wait 5 seconds after page load
}

createRoot(document.getElementById("root")!).render(<App />);
