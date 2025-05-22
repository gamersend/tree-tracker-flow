
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  requestNotificationPermission, 
  scheduleNotification 
} from '@/utils/pwa-helpers';
import { toast } from 'sonner';

const NotificationScheduler: React.FC = () => {
  const [title, setTitle] = useState('Reminder');
  const [message, setMessage] = useState('');
  const [delay, setDelay] = useState(30);
  const [permissionGranted, setPermissionGranted] = useState(Notification.permission === 'granted');

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
    
    if (granted) {
      toast.success('Notification permission granted!');
    } else {
      toast.error('Permission denied. Please enable notifications in your browser settings.');
    }
  };

  const handleScheduleNotification = () => {
    if (!title || !message) {
      toast.error('Please enter both title and message');
      return;
    }

    scheduleNotification(
      title, 
      { 
        body: message,
        icon: '/icons/icon-192x192.png',
      }, 
      delay
    );
  };

  return (
    <Card className="border-tree-purple">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-400" />
          Schedule Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!permissionGranted ? (
          <div className="flex flex-col items-center space-y-4 p-6">
            <p className="text-center">
              Enable notifications to get alerts for low stock, upcoming events, and overdue payments.
            </p>
            <Button 
              onClick={handleRequestPermission}
              size="lg"
              className="bg-gradient-to-r from-tree-purple to-purple-700 hover:opacity-90"
            >
              <Bell className="mr-2 h-4 w-4" />
              Enable Notifications
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Notification Message</Label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter notification message"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delay">Delay (minutes)</Label>
              <Input
                id="delay"
                type="number"
                min="0"
                max="10080" // 7 days in minutes
                value={delay}
                onChange={(e) => setDelay(parseInt(e.target.value) || 0)}
                placeholder="Enter delay in minutes"
              />
            </div>
          </div>
        )}
      </CardContent>
      {permissionGranted && (
        <CardFooter>
          <Button 
            onClick={handleScheduleNotification}
            className="w-full bg-tree-green hover:bg-green-600"
          >
            <Bell className="mr-2 h-4 w-4" />
            Schedule Notification
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationScheduler;
