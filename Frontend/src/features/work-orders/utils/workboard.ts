/**
 * Workboard Utilities
 * Pure functions for workboard calculations and filtering
 */

import type { WorkOrder, WorkOrderStatus } from '../types/workOrder.types';
import type { Employee } from '@/features/hrm/types/hrm.types';

/**
 * Calculate total hours for work orders
 * @param workOrders - Array of work orders
 * @returns Total hours spent
 */
export const calculateTotalHours = (workOrders: WorkOrder[]): number => {
  return workOrders.reduce((total, wo) => total + (wo.hoursSpent || 0), 0);
};

/**
 * Get work orders count by status
 * @param workOrders - Array of work orders
 * @param status - Status to count
 * @returns Count of work orders with that status
 */
export const getStatusCount = (
  workOrders: WorkOrder[],
  status: WorkOrderStatus
): number => {
  return workOrders.filter(wo => wo.status === status).length;
};

/**
 * Filter work orders by employee
 * @param workOrders - Array of work orders
 * @param employeeId - Employee ID to filter by (null = all employees, 'mine' = current user)
 * @param currentUserId - Current user's employee ID
 * @returns Filtered work orders
 */
export const filterByEmployee = (
  workOrders: WorkOrder[],
  employeeId: string | null | 'mine',
  currentUserId?: string
): WorkOrder[] => {
  if (employeeId === null) return workOrders;
  if (employeeId === 'mine' && currentUserId) {
    return workOrders.filter(wo => wo.assignedTo === currentUserId);
  }
  if (employeeId === 'mine') return [];
  return workOrders.filter(wo => wo.assignedTo === employeeId);
};

/**
 * Get unique employees from work orders
 * @param workOrders - Array of work orders
 * @param employees - Array of all employees
 * @returns Array of employees that have work orders assigned
 */
export const getEmployeesWithWorkOrders = (
  workOrders: WorkOrder[],
  employees: Employee[]
): Employee[] => {
  const employeeIds = new Set(
    workOrders
      .map(wo => wo.assignedTo)
      .filter((id): id is string => !!id)
  );
  
  return employees.filter(emp => employeeIds.has(emp.id));
};

/**
 * Get status counts for all statuses
 * @param workOrders - Array of work orders
 * @returns Object with counts per status
 */
export const getStatusCounts = (
  workOrders: WorkOrder[]
): Record<WorkOrderStatus, number> => {
  return {
    todo: getStatusCount(workOrders, 'todo'),
    pending: getStatusCount(workOrders, 'pending'),
    in_progress: getStatusCount(workOrders, 'in_progress'),
    completed: getStatusCount(workOrders, 'completed'),
  };
};

