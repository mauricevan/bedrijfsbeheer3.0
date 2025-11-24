import { storage } from '@/utils/storage';
import type { ActivityLog, ActivityFilter, EntityType, ActivityType } from '../types/tracking.types';

const ACTIVITY_LOGS_KEY = 'activity_logs';

/**
 * Get all activity logs
 */
export const getActivityLogs = (): ActivityLog[] => {
  return storage.get<ActivityLog[]>(ACTIVITY_LOGS_KEY, []);
};

/**
 * Save activity log
 */
export const logActivity = (activity: Omit<ActivityLog, 'id' | 'timestamp'>): void => {
  const logs = getActivityLogs();
  const newActivity: ActivityLog = {
    ...activity,
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  logs.push(newActivity);
  
  // Keep only last 10000 activities to prevent storage bloat
  if (logs.length > 10000) {
    logs.splice(0, logs.length - 10000);
  }
  
  storage.set(ACTIVITY_LOGS_KEY, logs);
};

/**
 * Filter activity logs
 */
export const filterActivityLogs = (filter: ActivityFilter): ActivityLog[] => {
  let logs = getActivityLogs();
  
  if (filter.userId) {
    logs = logs.filter(log => log.userId === filter.userId);
  }
  
  if (filter.entityType) {
    logs = logs.filter(log => log.entityType === filter.entityType);
  }
  
  if (filter.activityType) {
    logs = logs.filter(log => log.activityType === filter.activityType);
  }
  
  if (filter.dateFrom) {
    logs = logs.filter(log => log.timestamp >= filter.dateFrom!);
  }
  
  if (filter.dateTo) {
    logs = logs.filter(log => log.timestamp <= filter.dateTo!);
  }
  
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    logs = logs.filter(log =>
      log.description.toLowerCase().includes(searchLower) ||
      log.entityName?.toLowerCase().includes(searchLower) ||
      log.userName.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by timestamp descending (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/**
 * Get activities for a specific entity
 */
export const getEntityActivities = (entityType: EntityType, entityId: string): ActivityLog[] => {
  return getActivityLogs().filter(
    log => log.entityType === entityType && log.entityId === entityId
  );
};

/**
 * Clear all activity logs (admin only)
 */
export const clearActivityLogs = (): void => {
  storage.set(ACTIVITY_LOGS_KEY, []);
};

/**
 * Export activity logs to CSV format
 */
export const exportActivityLogsToCSV = (logs: ActivityLog[]): string => {
  const headers = ['Timestamp', 'User', 'Activity Type', 'Entity Type', 'Entity Name', 'Action', 'Description'];
  const rows = logs.map(log => [
    log.timestamp,
    log.userName,
    log.activityType,
    log.entityType,
    log.entityName || '',
    log.action,
    log.description,
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  return csv;
};

