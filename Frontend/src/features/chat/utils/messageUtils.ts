import { formatDistanceToNow, format } from 'date-fns';
import { nl } from 'date-fns/locale';
import type { Message } from '../types';

/**
 * Format message timestamp for display
 * Shows relative time for recent messages (e.g., "2 min ago")
 * Shows absolute time for older messages
 */
export const formatMessageTimestamp = (timestamp: string): string => {
  const messageDate = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

  // If message is less than 24 hours old, show relative time
  if (diffInHours < 24) {
    return formatDistanceToNow(messageDate, { addSuffix: true, locale: nl });
  }

  // If message is today but older than 1 hour, show time
  if (messageDate.toDateString() === now.toDateString()) {
    return format(messageDate, 'HH:mm', { locale: nl });
  }

  // If message is from this year, show date and time
  if (messageDate.getFullYear() === now.getFullYear()) {
    return format(messageDate, 'd MMM HH:mm', { locale: nl });
  }

  // Otherwise show full date
  return format(messageDate, 'd MMM yyyy HH:mm', { locale: nl });
};

/**
 * Group messages by date for display
 */
export const groupMessagesByDate = (messages: Message[]): Map<string, Message[]> => {
  const groups = new Map<string, Message[]>();

  messages.forEach((message) => {
    const date = new Date(message.timestamp);
    const dateKey = format(date, 'yyyy-MM-dd', { locale: nl });

    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(message);
  });

  return groups;
};

/**
 * Format date header for message groups
 */
export const formatDateHeader = (dateKey: string): string => {
  const date = new Date(dateKey);
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd', { locale: nl });
  const yesterday = format(new Date(now.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd', { locale: nl });

  if (dateKey === today) {
    return 'Vandaag';
  }
  if (dateKey === yesterday) {
    return 'Gisteren';
  }
  if (date.getFullYear() === now.getFullYear()) {
    return format(date, 'EEEE d MMMM', { locale: nl });
  }
  return format(date, 'EEEE d MMMM yyyy', { locale: nl });
};

/**
 * Sanitize message content to prevent XSS
 */
export const sanitizeMessage = (content: string): string => {
  const div = document.createElement('div');
  div.textContent = content;
  return div.innerHTML;
};

/**
 * Check if message should show timestamp (show if previous message is older than 5 minutes)
 */
export const shouldShowTimestamp = (currentMessage: Message, previousMessage?: Message): boolean => {
  if (!previousMessage) return true;

  const currentTime = new Date(currentMessage.timestamp).getTime();
  const previousTime = new Date(previousMessage.timestamp).getTime();
  const diffInMinutes = (currentTime - previousTime) / (1000 * 60);

  return diffInMinutes > 5;
};

/**
 * Check if message should show sender info (show if different sender or time gap)
 */
export const shouldShowSender = (currentMessage: Message, previousMessage?: Message): boolean => {
  if (!previousMessage) return true;
  if (currentMessage.senderId !== previousMessage.senderId) return true;

  const currentTime = new Date(currentMessage.timestamp).getTime();
  const previousTime = new Date(previousMessage.timestamp).getTime();
  const diffInMinutes = (currentTime - previousTime) / (1000 * 60);

  return diffInMinutes > 5;
};

