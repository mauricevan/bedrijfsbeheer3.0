/**
 * Notification Utilities
 * Pure functions for notification management
 */

export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'stock' | 'quote' | 'task';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, unknown>;
}

const NOTIFICATIONS_KEY = 'bedrijfsbeheer_notifications';

/**
 * Get all notifications from storage
 */
export const getNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Save notifications to storage
 */
export const saveNotifications = (notifications: Notification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
};

/**
 * Create a new notification
 */
export const createNotification = (
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  metadata?: Record<string, unknown>
): Notification => {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    link,
    metadata,
  };
};

/**
 * Add a notification
 */
export const addNotification = (notification: Notification): void => {
  const notifications = getNotifications();
  notifications.unshift(notification); // Add to beginning
  // Keep only last 100 notifications
  if (notifications.length > 100) {
    notifications.splice(100);
  }
  saveNotifications(notifications);
};

/**
 * Mark notification as read
 */
export const markAsRead = (id: string): void => {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    saveNotifications(notifications);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = (): void => {
  const notifications = getNotifications();
  notifications.forEach(n => { n.read = true; });
  saveNotifications(notifications);
};

/**
 * Delete a notification
 */
export const deleteNotification = (id: string): void => {
  const notifications = getNotifications();
  const filtered = notifications.filter(n => n.id !== id);
  saveNotifications(filtered);
};

/**
 * Get unread count
 */
export const getUnreadCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter(n => !n.read).length;
};

/**
 * Get notifications by type
 */
export const getNotificationsByType = (type: NotificationType): Notification[] => {
  const notifications = getNotifications();
  return notifications.filter(n => n.type === type);
};

