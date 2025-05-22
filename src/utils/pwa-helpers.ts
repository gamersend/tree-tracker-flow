
import { toast } from "sonner";

export const registerServiceWorker = async () => {
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

export const checkPWAInstallable = () => {
  // Check if the app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return false;
  }

  // Check if the user has recently dismissed the install prompt
  const lastDismissed = localStorage.getItem('pwaInstallPromptDismissed');
  if (lastDismissed) {
    const dismissedTime = parseInt(lastDismissed, 10);
    // Don't show again for 7 days
    if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
      return false;
    }
  }

  return true;
};

export const dismissInstallPrompt = () => {
  localStorage.setItem('pwaInstallPromptDismissed', Date.now().toString());
};

// Notifications helpers
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const scheduleNotification = (title: string, options: NotificationOptions, delayMinutes: number = 0) => {
  if (Notification.permission !== 'granted') {
    toast.error("Notification permission not granted");
    return;
  }

  const delayMs = delayMinutes * 60 * 1000;
  
  if (delayMs > 0) {
    setTimeout(() => {
      showNotification(title, options);
    }, delayMs);
    
    // Save to localStorage for persistence across page reloads
    const scheduledTime = Date.now() + delayMs;
    const savedNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
    savedNotifications.push({ title, options, scheduledTime });
    localStorage.setItem('scheduledNotifications', JSON.stringify(savedNotifications));
    
    toast.success(`Notification scheduled for ${delayMinutes} minutes from now`);
  } else {
    showNotification(title, options);
  }
};

export const showNotification = (title: string, options: NotificationOptions = {}) => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      ...options
    });

    // Add vibration if supported
    if ('vibrate' in navigator) {
      // Vibration pattern: 100ms vibration, 50ms pause, 100ms vibration
      navigator.vibrate([100, 50, 100]);
    }

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

export const checkAndScheduleNotifications = () => {
  // Check for low stock items
  const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
  const lowStockItems = inventory.filter((item: any) => item.quantity && item.quantity < 10);
  
  if (lowStockItems.length > 0) {
    showNotification('Low Stock Alert', { 
      body: `${lowStockItems.length} items are running low on stock`,
      tag: 'low-stock'
    });
  }

  // Check for overdue tick payments
  const tickLedger = JSON.parse(localStorage.getItem('tickLedger') || '[]');
  const overduePayments = tickLedger.filter((entry: any) => {
    if (!entry.dueDate) return false;
    const dueDate = new Date(entry.dueDate);
    return dueDate < new Date() && entry.remainingAmount > 0;
  });

  if (overduePayments.length > 0) {
    showNotification('Overdue Payments', { 
      body: `${overduePayments.length} tick payments are overdue`,
      tag: 'overdue-payments'
    });
  }

  // Check for upcoming events (next 24 hours)
  const events = JSON.parse(localStorage.getItem('events') || '[]');
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const upcomingEvents = events.filter((event: any) => {
    if (!event.start) return false;
    const eventDate = new Date(event.start);
    return eventDate > now && eventDate < tomorrow;
  });

  if (upcomingEvents.length > 0) {
    showNotification('Upcoming Events', { 
      body: `You have ${upcomingEvents.length} events in the next 24 hours`,
      tag: 'upcoming-events'
    });
  }
};

// Check for scheduled notifications and trigger them if their time has come
export const checkScheduledNotifications = () => {
  const savedNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
  const now = Date.now();
  const updatedNotifications = [];
  
  savedNotifications.forEach((notification: any) => {
    if (notification.scheduledTime <= now) {
      showNotification(notification.title, notification.options);
    } else {
      updatedNotifications.push(notification);
    }
  });
  
  localStorage.setItem('scheduledNotifications', JSON.stringify(updatedNotifications));
};
