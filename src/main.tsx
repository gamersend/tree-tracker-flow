
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { 
  registerServiceWorker, 
  requestNotificationPermission,
  checkAndScheduleNotifications,
  checkScheduledNotifications
} from './utils/pwa-helpers.ts'

// Register Service Worker
registerServiceWorker();

// Request notification permission when appropriate
// We're not doing this on page load to avoid annoying users
// It will be requested when user first interacts with notification features

// Check for scheduled notifications
setInterval(checkScheduledNotifications, 60000); // Check every minute

// Check for notifications that need to be shown (low stock, overdue payments, etc.)
setTimeout(() => {
  if (Notification.permission === 'granted') {
    checkAndScheduleNotifications();
    // Recheck periodically
    setInterval(checkAndScheduleNotifications, 3600000); // Check every hour
  }
}, 5000); // Wait 5 seconds after page load

createRoot(document.getElementById("root")!).render(<App />);

