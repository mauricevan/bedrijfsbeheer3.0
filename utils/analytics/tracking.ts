// utils/analytics/tracking.ts - Max 150 regels
export const trackAction = (action: string, metadata?: any) => {
  if (typeof window === 'undefined') return;
  const event = {
    timestamp: new Date().toISOString(),
    action,
    metadata,
    module: metadata?.module || 'unknown',
  };
  console.log('[Analytics]', event);
};

export const trackNavigation = (to: string, from: string) => {
  trackAction('navigation', { to, from });
};

export const trackTaskCompletion = (taskType: string, taskId: string, userId: string) => {
  trackAction('task_completed', { taskType, taskId, userId });
};
