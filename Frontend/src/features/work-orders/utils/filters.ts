/**
 * Work Orders Filters Utilities
 * Pure filtering and search functions
 */

import type { WorkOrder, WorkOrderStatus } from '../types/workOrder.types';

/**
 * Filter work orders by search term
 */
export const filterWorkOrdersBySearch = (
  workOrders: WorkOrder[],
  searchTerm: string
): WorkOrder[] => {
  if (!searchTerm) return workOrders;

  const searchLower = searchTerm.toLowerCase();

  return workOrders.filter((wo) => {
    // Search in title
    if (wo.title.toLowerCase().includes(searchLower)) return true;

    // Search in description
    if (wo.description?.toLowerCase().includes(searchLower)) return true;

    // Search in customer name
    if (wo.customerName?.toLowerCase().includes(searchLower)) return true;

    // Search in location
    if (wo.location?.toLowerCase().includes(searchLower)) return true;

    // Search in assigned employee name
    if (wo.assignedToName?.toLowerCase().includes(searchLower)) return true;

    // Search in work order ID
    if (wo.id.toLowerCase().includes(searchLower)) return true;

    return false;
  });
};

/**
 * Filter work orders by status
 */
export const filterWorkOrdersByStatus = (
  workOrders: WorkOrder[],
  status: WorkOrderStatus | null
): WorkOrder[] => {
  if (!status) return workOrders;
  return workOrders.filter((wo) => wo.status === status);
};

/**
 * Filter work orders by assigned employee
 */
export const filterWorkOrdersByEmployee = (
  workOrders: WorkOrder[],
  employeeId: string | null
): WorkOrder[] => {
  if (!employeeId) return workOrders;
  return workOrders.filter((wo) => wo.assignedTo === employeeId);
};

/**
 * Filter work orders by customer
 */
export const filterWorkOrdersByCustomer = (
  workOrders: WorkOrder[],
  customerId: string | null
): WorkOrder[] => {
  if (!customerId) return workOrders;
  return workOrders.filter((wo) => wo.customerId === customerId);
};

/**
 * Filter work orders by date range
 */
export const filterWorkOrdersByDateRange = (
  workOrders: WorkOrder[],
  startDate: string | null,
  endDate: string | null
): WorkOrder[] => {
  let filtered = workOrders;

  if (startDate) {
    filtered = filtered.filter(
      (wo) => wo.scheduledDate && wo.scheduledDate >= startDate
    );
  }

  if (endDate) {
    filtered = filtered.filter(
      (wo) => wo.scheduledDate && wo.scheduledDate <= endDate
    );
  }

  return filtered;
};

/**
 * Get work orders grouped by status
 * Excludes archived work orders from completed section
 */
export const groupWorkOrdersByStatus = (
  workOrders: WorkOrder[]
): Record<WorkOrderStatus, WorkOrder[]> => {
  return {
    todo: workOrders.filter((wo) => wo.status === 'todo' && !wo.isArchived),
    pending: workOrders.filter((wo) => wo.status === 'pending' && !wo.isArchived),
    in_progress: workOrders.filter((wo) => wo.status === 'in_progress' && !wo.isArchived),
    completed: workOrders.filter((wo) => wo.status === 'completed' && !wo.isArchived),
  };
};

/**
 * Check if work order needs attention (completed >48h without invoice)
 */
export const workOrderNeedsAttention = (workOrder: WorkOrder): boolean => {
  if (workOrder.status !== 'completed' || workOrder.isArchived || !workOrder.completedDate) {
    return false;
  }
  
  const now = Date.now();
  const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000);
  const completedTime = new Date(workOrder.completedDate).getTime();
  
  return completedTime < fortyEightHoursAgo && !workOrder.invoiceId;
};

/**
 * Calculate work order statistics
 */
export const calculateWorkOrderStats = (workOrders: WorkOrder[]) => {
  const grouped = groupWorkOrdersByStatus(workOrders);
  
  return {
    total: workOrders.length,
    todo: grouped.todo.length,
    pending: grouped.pending.length,
    inProgress: grouped.in_progress.length,
    completed: grouped.completed.length,
    totalHoursSpent: workOrders.reduce((sum, wo) => sum + (wo.hoursSpent || 0), 0),
    totalEstimatedHours: workOrders.reduce((sum, wo) => sum + (wo.estimatedHours || 0), 0),
    totalEstimatedCost: workOrders.reduce((sum, wo) => sum + (wo.estimatedCost || 0), 0),
    completionRate: workOrders.length > 0 
      ? (grouped.completed.length / workOrders.length) * 100 
      : 0,
  };
};

