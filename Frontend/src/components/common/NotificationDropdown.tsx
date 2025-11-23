/**
 * NotificationDropdown Component
 * Dropdown menu showing notifications with dismiss functionality
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  type Notification,
  type NotificationType,
} from '@/utils/notifications';

type NotificationDropdownProps = {
  onNotificationClick?: (notification: Notification) => void;
};

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  info: <Info className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  success: <CheckCircle className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
  stock: <AlertCircle className="h-4 w-4" />,
  quote: <Info className="h-4 w-4" />,
  task: <AlertCircle className="h-4 w-4" />,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-amber-600 dark:text-amber-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-red-600 dark:text-red-400',
  stock: 'text-orange-600 dark:text-orange-400',
  quote: 'text-indigo-600 dark:text-indigo-400',
  task: 'text-purple-600 dark:text-purple-400',
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Zojuist';
  if (diffMins < 60) return `${diffMins} min geleden`;
  if (diffHours < 24) return `${diffHours} uur geleden`;
  if (diffDays < 7) return `${diffDays} dagen geleden`;
  
  return date.toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(() => {
    const notifs = getNotifications();
    setNotifications(notifs);
    setUnreadCount(getUnreadCount());
  }, []);

  useEffect(() => {
    loadNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleDismiss = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(id);
    deleteNotification(id);
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
    loadNotifications();
  }, [loadNotifications]);

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
      loadNotifications();
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    setIsOpen(false);
  }, [onNotificationClick, loadNotifications]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">Meldingen</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full">
                    {unreadCount} nieuw
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Alles lezen
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Geen meldingen</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        'p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors',
                        !notification.read && 'bg-blue-50/50 dark:bg-blue-900/10'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('mt-0.5', TYPE_COLORS[notification.type])}>
                          {TYPE_ICONS[notification.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {notification.title}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDismiss(notification.id, e)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors flex-shrink-0"
                        >
                          <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

