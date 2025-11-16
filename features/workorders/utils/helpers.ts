// features/workorders/utils/helpers.ts
// WorkOrders Helper Functions
// Compliant met prompt.git: Max 150 regels per utility

import type { WorkOrder } from '../types';

/**
 * Get next available sort index for work orders (simple version)
 * @deprecated Use getNextSortIndex from dragDropHelpers for full functionality
 */
export const getSimpleNextSortIndex = (workOrders: WorkOrder[]): number => {
  if (workOrders.length === 0) return 1;
  const maxIndex = Math.max(...workOrders.map((wo) => wo.sortIndex || 0));
  return maxIndex + 1;
};

/**
 * Format hours for display
 */
export const formatHours = (hours?: number): string => {
  if (!hours) return '0 uur';
  return `${hours} uur`;
};

/**
 * Get status color for badges
 */
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'To Do': 'bg-gray-100 text-gray-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Calculate relative time (e.g., "2 dagen geleden")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Vandaag';
  if (diffDays === 1) return 'Gisteren';
  if (diffDays < 7) return `${diffDays} dagen geleden`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weken'} geleden`;
  }
  const months = Math.floor(diffDays / 30);
  return `${months} ${months === 1 ? 'maand' : 'maanden'} geleden`;
};

/**
 * Sort work orders by index
 */
export const sortByIndex = (a: WorkOrder, b: WorkOrder): number => {
  const indexA = a.sortIndex || 999999;
  const indexB = b.sortIndex || 999999;
  return indexA - indexB;
};

/**
 * Filter work orders by status
 */
export const filterByStatus = (
  orders: WorkOrder[],
  status: string | null
): WorkOrder[] => {
  if (!status) return orders;
  return orders.filter((order) => order.status === status);
};

/**
 * Group work orders by status (for Kanban columns)
 */
export const groupByStatus = (
  orders: WorkOrder[]
): Record<string, WorkOrder[]> => {
  const statuses = ['To Do', 'Pending', 'In Progress', 'Completed'];
  const grouped: Record<string, WorkOrder[]> = {};

  statuses.forEach((status) => {
    grouped[status] = orders
      .filter((order) => order.status === status)
      .sort(sortByIndex);
  });

  return grouped;
};
