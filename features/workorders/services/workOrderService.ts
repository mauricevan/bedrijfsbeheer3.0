// features/workorders/services/workOrderService.ts
// WorkOrder Business Logic Service
// Compliant met prompt.git: Max 250 regels, pure functions

import type {
  WorkOrder,
  WorkOrderStatus,
  NewOrderForm,
  MaterialSelection,
  WorkOrderHistoryEntry,
} from '../types';
import { getNextSortIndex } from '../utils';

/**
 * Create new work order from form data
 */
export const createWorkOrder = (
  form: NewOrderForm,
  currentUserId: string,
  materials: MaterialSelection[],
  allOrders: WorkOrder[]
): WorkOrder => {
  const now = new Date().toISOString();
  const sortIndex = form.sortIndex ?? getNextSortIndex(allOrders);

  const newOrder: WorkOrder = {
    id: `wo-${Date.now()}`,
    title: form.title.trim(),
    description: form.description.trim(),
    status: 'To Do' as WorkOrderStatus,
    assignedTo: form.assignedTo,
    requiredInventory: materials,
    createdDate: now,
    customerId: form.customerId || undefined,
    location: form.location || undefined,
    scheduledDate: form.scheduledDate || undefined,
    pendingReason: form.pendingReason || undefined,
    sortIndex,
    assignedBy: currentUserId,
    timestamps: {
      created: now,
      assigned: now,
    },
    history: [
      {
        timestamp: now,
        action: 'created',
        performedBy: currentUserId,
        details: `Werkorder aangemaakt en toegewezen aan medewerker`,
      },
    ],
  };

  return newOrder;
};

/**
 * Update work order status
 */
export const updateWorkOrderStatus = (
  workOrder: WorkOrder,
  newStatus: WorkOrderStatus,
  userId: string,
  pendingReason?: string
): WorkOrder => {
  const now = new Date().toISOString();
  const oldStatus = workOrder.status;

  const historyEntry: WorkOrderHistoryEntry = {
    timestamp: now,
    action: 'status_changed',
    performedBy: userId,
    details: `Status gewijzigd van "${oldStatus}" naar "${newStatus}"${
      pendingReason ? ` - Reden: ${pendingReason}` : ''
    }`,
    fromStatus: oldStatus,
    toStatus: newStatus,
  };

  const updatedOrder: WorkOrder = {
    ...workOrder,
    status: newStatus,
    pendingReason: pendingReason || workOrder.pendingReason,
    timestamps: {
      ...workOrder.timestamps,
      ...(newStatus === 'In Progress' && { started: now }),
      ...(newStatus === 'Completed' && { completed: now }),
    },
    completedDate: newStatus === 'Completed' ? now : workOrder.completedDate,
    history: [...(workOrder.history || []), historyEntry],
  };

  return updatedOrder;
};

/**
 * Update work order hours
 */
export const updateWorkOrderHours = (
  workOrder: WorkOrder,
  hours: number,
  userId: string
): WorkOrder => {
  const now = new Date().toISOString();

  const historyEntry: WorkOrderHistoryEntry = {
    timestamp: now,
    action: 'updated',
    performedBy: userId,
    details: `Gewerkte uren bijgewerkt: ${hours} uur`,
  };

  return {
    ...workOrder,
    hoursSpent: hours,
    history: [...(workOrder.history || []), historyEntry],
  };
};

/**
 * Update work order details
 */
export const updateWorkOrderDetails = (
  workOrder: WorkOrder,
  updates: Partial<WorkOrder>,
  userId: string
): WorkOrder => {
  const now = new Date().toISOString();

  const historyEntry: WorkOrderHistoryEntry = {
    timestamp: now,
    action: 'updated',
    performedBy: userId,
    details: 'Werkorder details bijgewerkt',
  };

  return {
    ...workOrder,
    ...updates,
    history: [...(workOrder.history || []), historyEntry],
  };
};

/**
 * Convert work order to invoice
 */
export const canConvertToInvoice = (workOrder: WorkOrder): boolean => {
  return workOrder.status === 'Completed';
};

/**
 * Get work orders by employee
 */
export const getWorkOrdersByEmployee = (
  orders: WorkOrder[],
  employeeId: string
): WorkOrder[] => {
  return orders.filter((order) => order.assignedTo === employeeId);
};

/**
 * Get work orders by status
 */
export const getWorkOrdersByStatus = (
  orders: WorkOrder[],
  status: WorkOrderStatus
): WorkOrder[] => {
  return orders.filter((order) => order.status === status);
};

/**
 * Calculate total hours for employee
 */
export const calculateTotalHours = (orders: WorkOrder[]): number => {
  return orders.reduce((total, order) => total + (order.hoursSpent || 0), 0);
};

/**
 * Get statistics for work orders
 */
export const getWorkOrderStats = (
  orders: WorkOrder[]
): {
  total: number;
  todo: number;
  pending: number;
  inProgress: number;
  completed: number;
  totalHours: number;
} => {
  return {
    total: orders.length,
    todo: orders.filter((o) => o.status === 'To Do').length,
    pending: orders.filter((o) => o.status === 'Pending').length,
    inProgress: orders.filter((o) => o.status === 'In Progress').length,
    completed: orders.filter((o) => o.status === 'Completed').length,
    totalHours: calculateTotalHours(orders),
  };
};
