
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  priority: NotificationPriority;
  type: 'system' | 'alert' | 'info' | 'reminder';
  link?: string;
}
