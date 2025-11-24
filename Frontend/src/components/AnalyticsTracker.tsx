/**
 * Analytics Tracker Component
 * Automatically tracks user navigation and actions
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackNavigation, type ModuleKey } from '@/utils/analytics';
import { initPerformanceMonitoring } from '@/utils/performance';

interface AnalyticsTrackerProps {
  userId: string;
  userRole: string;
}

// Helper to convert route path to ModuleKey
const pathToModuleKey = (path: string): ModuleKey | null => {
  const cleanPath = path.replace('/', '').trim();
  if (!cleanPath) return 'dashboard';

  // Map paths to module keys
  const pathMap: Record<string, ModuleKey> = {
    '': 'dashboard',
    'inventory': 'inventory',
    'pos': 'pos',
    'work-orders': 'work-orders',
    'accounting': 'accounting',
    'bookkeeping': 'bookkeeping',
    'crm': 'crm',
    'hrm': 'hrm',
    'planning': 'planning',
    'reports': 'reports',
    'webshop': 'webshop',
    'settings': 'settings',
  };

  return pathMap[cleanPath] || null;
};

export const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ userId, userRole }) => {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);
  const sessionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const currentPath = location.pathname;
    const currentModule = pathToModuleKey(currentPath);

    if (!currentModule) return;

    const prevPath = prevPathRef.current;
    const prevModule = prevPath ? pathToModuleKey(prevPath) : null;

    if (prevModule !== currentModule) {
      // Calculate duration in current module (if we were in a module before)
      const duration = prevModule ? Date.now() - sessionStartTime.current : undefined;

      // Track navigation
      trackNavigation(
        userId,
        userRole,
        prevModule,
        currentModule,
        duration
      );

      // Update session start time
      sessionStartTime.current = Date.now();
      prevPathRef.current = currentPath;
    }
  }, [location.pathname, userId, userRole]);

  // Track initial navigation
  useEffect(() => {
    const currentModule = pathToModuleKey(location.pathname);
    if (currentModule && !prevPathRef.current) {
      trackNavigation(userId, userRole, null, currentModule);
      prevPathRef.current = location.pathname;
      sessionStartTime.current = Date.now();
    }
  }, [location.pathname, userId, userRole]);

  // Initialize performance monitoring
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  return null; // This component doesn't render anything
};

