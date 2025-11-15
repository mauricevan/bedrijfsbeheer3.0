// utils/analytics/metrics.ts - Max 150 regels
export const calculateModuleUsage = (events: any[]) => {
  const byModule: Record<string, number> = {};
  events.forEach((e) => {
    const module = e.metadata?.module || 'unknown';
    byModule[module] = (byModule[module] || 0) + 1;
  });
  return byModule;
};

export const calculateUserActivity = (events: any[], userId: string) => {
  return events.filter((e) => e.metadata?.userId === userId).length;
};
