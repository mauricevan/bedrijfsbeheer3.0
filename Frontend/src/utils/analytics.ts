/**
 * Analytics Tracking System
 * User event tracking and analytics with localStorage persistence
 */

export type ModuleKey =
  | 'dashboard'
  | 'inventory'
  | 'pos'
  | 'work-orders'
  | 'accounting'
  | 'bookkeeping'
  | 'crm'
  | 'hrm'
  | 'planning'
  | 'reports'
  | 'webshop'
  | 'settings';

export type ActionType =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'navigate'
  | 'complete'
  | 'error';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  userRole: string;
  module: ModuleKey;
  action: string;
  actionType: ActionType;
  timestamp: string;
  duration?: number; // in milliseconds
  metadata?: Record<string, unknown>;
}

export interface ModuleUsageStats {
  module: ModuleKey;
  totalSessions: number;
  totalTime: number; // in minutes
  averageSessionDuration: number; // in minutes
  uniqueUsers: number;
  actionsCount: number;
  errorCount: number;
  lastUsed: string;
  usageTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface UserActivityStats {
  userId: string;
  userName: string;
  role: string;
  totalSessions: number;
  totalTime: number; // in minutes
  modulesUsed: ModuleKey[];
  mostUsedModule: ModuleKey;
  averageSessionDuration: number; // in minutes
  lastActive: string;
  efficiencyScore: number; // 0-100
}

export interface ProcessMetrics {
  processName: string;
  averageCycleTime: number; // in minutes
  averageSteps: number;
  completionRate: number; // percentage
  errorRate: number; // percentage
  reworkRate: number; // percentage
  bottleneckSteps: Array<{
    step: string;
    averageWaitTime: number; // in minutes
    frequency: number;
  }>;
}

export interface OptimizationRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'process' | 'feature' | 'usability' | 'automation' | 'quality';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  roi: number; // 0-100
  metrics: {
    current: number;
    target: number;
    unit: string;
  };
  actions: string[];
}

export interface AnalyticsDashboard {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  totalEvents: number;
  totalUsers: number;
  totalTime: number; // in minutes
  moduleStats: ModuleUsageStats[];
  userStats: UserActivityStats[];
  processMetrics: ProcessMetrics[];
  recommendations: OptimizationRecommendation[];
  trends: {
    usageGrowth: number; // percentage
    efficiencyChange: number; // percentage
    errorRateChange: number; // percentage
  };
}

// LocalStorage key for analytics data
const ANALYTICS_STORAGE_KEY = 'bedrijfsbeheer_analytics';

/**
 * Get all analytics events from storage
 */
export const getAnalyticsEvents = (): AnalyticsEvent[] => {
  try {
    const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!stored) return [];
    const data = JSON.parse(stored);
    return data.events || [];
  } catch (error) {
    console.error('Error loading analytics:', error);
    return [];
  }
};

/**
 * Save analytics event
 */
export const saveAnalyticsEvent = (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void => {
  try {
    const events = getAnalyticsEvents();
    const newEvent: AnalyticsEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    events.push(newEvent);

    // Keep only last 10,000 events to prevent storage overflow
    const trimmedEvents = events.slice(-10000);

    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify({
      events: trimmedEvents,
      lastUpdated: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error saving analytics:', error);
  }
};

/**
 * Track user action
 */
export const trackAction = (
  userId: string,
  userRole: string,
  module: ModuleKey,
  action: string,
  actionType: ActionType,
  metadata?: Record<string, unknown>
): void => {
  saveAnalyticsEvent({
    userId,
    userRole,
    module,
    action,
    actionType,
    metadata,
  });
};

/**
 * Track navigation
 */
export const trackNavigation = (
  userId: string,
  userRole: string,
  fromModule: ModuleKey | null,
  toModule: ModuleKey,
  duration?: number
): void => {
  saveAnalyticsEvent({
    userId,
    userRole,
    module: toModule,
    action: `navigate_to_${toModule}`,
    actionType: 'navigate',
    duration,
    metadata: {
      fromModule,
    },
  });
};

/**
 * Track task completion
 */
export const trackTaskCompletion = (
  userId: string,
  userRole: string,
  module: ModuleKey,
  taskType: string,
  duration: number,
  success: boolean,
  errors?: string[]
): void => {
  saveAnalyticsEvent({
    userId,
    userRole,
    module,
    action: `complete_${taskType}`,
    actionType: success ? 'complete' : 'error',
    duration,
    metadata: {
      taskType,
      outcome: success ? 'success' : 'failure',
      errors,
    },
  });
};

/**
 * Calculate module usage statistics
 */
export const calculateModuleStats = (
  events: AnalyticsEvent[],
  startDate?: Date,
  endDate?: Date
): ModuleUsageStats[] => {
  const filtered = events.filter((e) => {
    if (!startDate && !endDate) return true;
    const eventDate = new Date(e.timestamp);
    if (startDate && eventDate < startDate) return false;
    if (endDate && eventDate > endDate) return false;
    return true;
  });

  const moduleMap = new Map<ModuleKey, {
    sessions: Set<string>;
    time: number;
    actions: number;
    errors: number;
    lastUsed: Date;
    events: AnalyticsEvent[];
  }>();

  filtered.forEach((event) => {
    const existing = moduleMap.get(event.module) || {
      sessions: new Set(),
      time: 0,
      actions: 0,
      errors: 0,
      lastUsed: new Date(0),
      events: [],
    };

    // Track sessions (group by userId and date)
    const sessionKey = `${event.userId}_${event.timestamp.split('T')[0]}`;
    existing.sessions.add(sessionKey);

    // Accumulate time
    if (event.duration) {
      existing.time += event.duration / 60000; // Convert to minutes
    }

    // Count actions
    existing.actions++;

    // Count errors
    if (event.actionType === 'error') {
      existing.errors++;
    }

    // Track last used
    const eventDate = new Date(event.timestamp);
    if (eventDate > existing.lastUsed) {
      existing.lastUsed = eventDate;
    }

    existing.events.push(event);
    moduleMap.set(event.module, existing);
  });

  // Calculate trends (compare to previous period)
  const stats: ModuleUsageStats[] = [];
  moduleMap.forEach((data, module) => {
    const avgDuration = data.sessions.size > 0 ? data.time / data.sessions.size : 0;

    // Calculate trend (simplified: compare last week to previous week)
    const now = new Date();
    const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const lastWeekEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const lastWeekActions = data.events.filter((e) => {
      const d = new Date(e.timestamp);
      return d >= lastWeekStart && d < lastWeekEnd;
    }).length;

    const thisWeekActions = data.events.filter((e) => {
      const d = new Date(e.timestamp);
      return d >= thisWeekStart;
    }).length;

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (lastWeekActions > 0) {
      const change = ((thisWeekActions - lastWeekActions) / lastWeekActions) * 100;
      if (change > 10) trend = 'increasing';
      else if (change < -10) trend = 'decreasing';
    }

    stats.push({
      module,
      totalSessions: data.sessions.size,
      totalTime: Math.round(data.time),
      averageSessionDuration: Math.round(avgDuration),
      uniqueUsers: new Set(data.events.map((e) => e.userId)).size,
      actionsCount: data.actions,
      errorCount: data.errors,
      lastUsed: data.lastUsed.toISOString(),
      usageTrend: trend,
    });
  });

  return stats.sort((a, b) => b.actionsCount - a.actionsCount);
};

/**
 * Calculate user activity statistics
 */
export const calculateUserStats = (
  events: AnalyticsEvent[],
  startDate?: Date,
  endDate?: Date
): UserActivityStats[] => {
  const filtered = events.filter((e) => {
    if (!startDate && !endDate) return true;
    const eventDate = new Date(e.timestamp);
    if (startDate && eventDate < startDate) return false;
    if (endDate && eventDate > endDate) return false;
    return true;
  });

  const userMap = new Map<string, {
    name: string;
    role: string;
    sessions: Set<string>;
    time: number;
    modules: Set<ModuleKey>;
    actions: number;
    completedTasks: number;
    errors: number;
    lastActive: Date;
    events: AnalyticsEvent[];
  }>();

  filtered.forEach((event) => {
    const existing = userMap.get(event.userId) || {
      name: event.userId,
      role: event.userRole,
      sessions: new Set(),
      time: 0,
      modules: new Set(),
      actions: 0,
      completedTasks: 0,
      errors: 0,
      lastActive: new Date(0),
      events: [],
    };

    const sessionKey = `${event.userId}_${event.timestamp.split('T')[0]}`;
    existing.sessions.add(sessionKey);

    if (event.duration) {
      existing.time += event.duration / 60000;
    }

    existing.modules.add(event.module);
    existing.actions++;

    if (event.actionType === 'complete') {
      existing.completedTasks++;
    }

    if (event.actionType === 'error') {
      existing.errors++;
    }

    const eventDate = new Date(event.timestamp);
    if (eventDate > existing.lastActive) {
      existing.lastActive = eventDate;
    }

    existing.events.push(event);
    userMap.set(event.userId, existing);
  });

  const stats: UserActivityStats[] = [];
  userMap.forEach((data, userId) => {
    const avgDuration = data.sessions.size > 0 ? data.time / data.sessions.size : 0;

    // Calculate efficiency score (0-100)
    const completionRate = data.actions > 0 ? (data.completedTasks / data.actions) * 100 : 0;
    const errorRate = data.actions > 0 ? (data.errors / data.actions) * 100 : 0;
    const efficiencyScore = Math.max(0, Math.min(100,
      (completionRate * 0.6) + ((100 - errorRate) * 0.4)
    ));

    // Find most used module
    const moduleCounts = new Map<ModuleKey, number>();
    data.events.forEach((e) => {
      moduleCounts.set(e.module, (moduleCounts.get(e.module) || 0) + 1);
    });
    const mostUsed = Array.from(moduleCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'dashboard';

    stats.push({
      userId,
      userName: data.name,
      role: data.role,
      totalSessions: data.sessions.size,
      totalTime: Math.round(data.time),
      modulesUsed: Array.from(data.modules),
      mostUsedModule: mostUsed,
      averageSessionDuration: Math.round(avgDuration),
      lastActive: data.lastActive.toISOString(),
      efficiencyScore: Math.round(efficiencyScore),
    });
  });

  return stats.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
};

/**
 * Build complete analytics dashboard
 */
export const buildAnalyticsDashboard = (
  period: AnalyticsDashboard['period'] = 'month'
): AnalyticsDashboard => {
  const events = getAnalyticsEvents();

  if (events.length === 0) {
    return {
      period,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      totalEvents: 0,
      totalUsers: 0,
      totalTime: 0,
      moduleStats: [],
      userStats: [],
      processMetrics: [],
      recommendations: [],
      trends: {
        usageGrowth: 0,
        efficiencyChange: 0,
        errorRateChange: 0,
      },
    };
  }

  const now = new Date();
  let startDate: Date;
  const endDate: Date = now;

  switch (period) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'quarter':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const moduleStats = calculateModuleStats(events, startDate, endDate);
  const userStats = calculateUserStats(events, startDate, endDate);

  // Calculate trends
  const prevStartDate = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()));
  const prevModuleStats = calculateModuleStats(events, prevStartDate, startDate);

  const currentTotalActions = moduleStats.reduce((sum, s) => sum + s.actionsCount, 0);
  const prevTotalActions = prevModuleStats.reduce((sum, s) => sum + s.actionsCount, 0);
  const usageGrowth = prevTotalActions > 0
    ? ((currentTotalActions - prevTotalActions) / prevTotalActions) * 100
    : 0;

  const currentAvgEfficiency = userStats.length > 0
    ? userStats.reduce((sum, u) => sum + u.efficiencyScore, 0) / userStats.length
    : 0;
  const prevUserStats = calculateUserStats(events, prevStartDate, startDate);
  const prevAvgEfficiency = prevUserStats.length > 0
    ? prevUserStats.reduce((sum, u) => sum + u.efficiencyScore, 0) / prevUserStats.length
    : 0;
  const efficiencyChange = prevAvgEfficiency > 0
    ? ((currentAvgEfficiency - prevAvgEfficiency) / prevAvgEfficiency) * 100
    : 0;

  const currentErrorRate = moduleStats.reduce((sum, s) => sum + s.errorCount, 0) /
    (moduleStats.reduce((sum, s) => sum + s.actionsCount, 0) || 1) * 100;
  const prevErrorRate = prevModuleStats.reduce((sum, s) => sum + s.errorCount, 0) /
    (prevModuleStats.reduce((sum, s) => sum + s.actionsCount, 0) || 1) * 100;
  const errorRateChange = prevErrorRate > 0
    ? ((currentErrorRate - prevErrorRate) / prevErrorRate) * 100
    : 0;

  return {
    period,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    totalEvents: events.length,
    totalUsers: new Set(events.map((e) => e.userId)).size,
    totalTime: Math.round(moduleStats.reduce((sum, s) => sum + s.totalTime, 0)),
    moduleStats,
    userStats,
    processMetrics: [], // Simplified for now
    recommendations: [], // Simplified for now
    trends: {
      usageGrowth: Math.round(usageGrowth * 100) / 100,
      efficiencyChange: Math.round(efficiencyChange * 100) / 100,
      errorRateChange: Math.round(errorRateChange * 100) / 100,
    },
  };
};

/**
 * Clear analytics data (for testing/reset)
 */
export const clearAnalytics = (): void => {
  localStorage.removeItem(ANALYTICS_STORAGE_KEY);
};

