
import { useState, useEffect } from "react";
import { Notification } from "@/types/notification";
import { loadFromStorage } from "@/components/sales/utils";
import { toast } from "sonner";

const NOTIFICATIONS_KEY = "cannabis-tracker-notifications";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  // Load notifications from localStorage
  useEffect(() => {
    const storedNotifications = loadFromStorage<Notification[]>(NOTIFICATIONS_KEY, []);
    setNotifications(storedNotifications);
    
    // Calculate unread count
    const unread = storedNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  }, []);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    
    // Update unread count
    const unread = notifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  }, [notifications]);
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      createdAt: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show a toast when a new notification is added
    if (notification.priority === 'high') {
      toast.warning(notification.title, {
        description: notification.message,
      });
    }
    
    return newNotification;
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
};
