import { logActivity } from '@/features/tracking/services/activityService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { ActivityType, EntityType } from '@/features/tracking/types/tracking.types';

/**
 * Helper function to log activity (can be used outside React components)
 * Requires user info to be passed
 */
export const logActivityHelper = (
  activityType: ActivityType,
  entityType: EntityType,
  entityId: string,
  action: string,
  description: string,
  userId: string,
  userName: string,
  userEmail: string,
  entityName?: string,
  changes?: { field: string; oldValue: unknown; newValue: unknown }[],
  metadata?: Record<string, unknown>
): void => {
  logActivity({
    userId,
    userName,
    userEmail,
    activityType,
    entityType,
    entityId,
    entityName,
    action,
    description,
    changes,
    metadata,
    ipAddress: undefined, // Could be added if available
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    sessionId: undefined, // Could be added if session tracking is implemented
  });
};

/**
 * React hook for logging activities (uses current user from auth context)
 * This should be used inside React components
 */
export const useActivityLogger = () => {
  // Note: This is a simplified version. In a real implementation, you'd use useAuth hook
  // For now, we'll get user from localStorage
  const getUserInfo = () => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
        };
      }
    } catch (error) {
      console.error('Error getting user info:', error);
    }
    return {
      userId: 'unknown',
      userName: 'Unknown User',
      userEmail: 'unknown@example.com',
    };
  };

  const log = (
    activityType: ActivityType,
    entityType: EntityType,
    entityId: string,
    action: string,
    description: string,
    entityName?: string,
    changes?: { field: string; oldValue: unknown; newValue: unknown }[],
    metadata?: Record<string, unknown>
  ) => {
    const userInfo = getUserInfo();
    logActivityHelper(
      activityType,
      entityType,
      entityId,
      action,
      description,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      entityName,
      changes,
      metadata
    );
  };

  return { log };
};

