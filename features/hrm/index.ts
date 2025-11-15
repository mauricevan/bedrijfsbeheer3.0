// features/hrm/index.ts
export * from '../../../types';
export const calculateServiceYears = (hireDate: string) => {
  const years = (new Date().getTime() - new Date(hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
  return Math.floor(years);
};
export const noteTypeIcons: Record<string, string> = {
  late: '⏰',
  absence: '❌',
  milestone: '🎯',
  performance: '📊',
  warning: '⚠️',
  compliment: '⭐',
  attendance: '✅',
  general: '📝',
};
