
import React from "react";
import { motion } from "framer-motion";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationScheduler from "@/components/pwa/NotificationScheduler";
import { requestNotificationPermission, showNotification } from "@/utils/pwa-helpers";

const Notifications: React.FC = () => {
  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      showNotification("Test Notification", {
        body: "This is a test notification from Cannabis Army Tracker",
        icon: "/icons/icon-192x192.png"
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              Manage and schedule app notifications
            </p>
          </div>
          
          <Button onClick={handleTestNotification} variant="secondary">
            <Bell className="mr-2 h-4 w-4" />
            Test Notification
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>About Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="bg-green-500/20 p-2 rounded-full">
                  <Check className="h-4 w-4 text-green-500" />
                </span>
                <div>
                  <h3 className="text-base font-medium">Stock Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when inventory is running low
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="bg-green-500/20 p-2 rounded-full">
                  <Check className="h-4 w-4 text-green-500" />
                </span>
                <div>
                  <h3 className="text-base font-medium">Calendar Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Reminders for upcoming meetings and events
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="bg-green-500/20 p-2 rounded-full">
                  <Check className="h-4 w-4 text-green-500" />
                </span>
                <div>
                  <h3 className="text-base font-medium">Payment Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Get alerted when tick payments are overdue
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-sm text-amber-400">
                  Notifications work even when the app is closed if you've installed it as a PWA.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <NotificationScheduler />
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;
