/**
 * Work Order Drag & Drop Utilities
 *
 * Features:
 * - Kanban drag between columns
 * - Priority sorting within columns
 * - sortIndex persistence
 * - Auto-reindexing after drag
 *
 * Compliant with: WORKORDERS_COMPLETE.md Feature 11-14 (P0/P1)
 */

import type { WorkOrder, WorkOrderStatus } from '../../../types';

/**
 * Get next sort index for new work order
 *
 * @param workOrders - Array of all work orders
 * @param status - Status column (optional, for adding to specific column)
 * @returns Next sort index
 */
export const getNextSortIndex = (
  workOrders: WorkOrder[],
  status?: WorkOrderStatus
): number => {
  if (status) {
    // Get max sortIndex in specific status column
    const ordersInStatus = workOrders.filter((wo) => wo.status === status);
    if (ordersInStatus.length === 0) return 0;

    const maxIndex = Math.max(
      ...ordersInStatus.map((wo) => wo.sortIndex ?? 0)
    );
    return maxIndex + 1;
  }

  // Get max sortIndex overall
  if (workOrders.length === 0) return 0;
  const maxIndex = Math.max(...workOrders.map((wo) => wo.sortIndex ?? 0));
  return maxIndex + 1;
};

/**
 * Reorder work order within same column (drag to change priority)
 *
 * @param workOrders - Array of all work orders
 * @param workOrderId - ID of work order being dragged
 * @param newIndex - New position index within column
 * @returns Updated array of work orders
 */
export const reorderWithinColumn = (
  workOrders: WorkOrder[],
  workOrderId: string,
  newIndex: number
): WorkOrder[] => {
  const draggedOrder = workOrders.find((wo) => wo.id === workOrderId);
  if (!draggedOrder) return workOrders;

  // Get all orders in same status column
  const sameStatusOrders = workOrders
    .filter((wo) => wo.status === draggedOrder.status)
    .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));

  // Remove dragged order from list
  const withoutDragged = sameStatusOrders.filter(
    (wo) => wo.id !== workOrderId
  );

  // Insert at new position
  const reordered = [
    ...withoutDragged.slice(0, newIndex),
    draggedOrder,
    ...withoutDragged.slice(newIndex),
  ];

  // Reassign sortIndex sequentially
  const reindexed = reordered.map((wo, index) => ({
    ...wo,
    sortIndex: index,
  }));

  // Merge back with orders from other columns
  const otherStatusOrders = workOrders.filter(
    (wo) => wo.status !== draggedOrder.status
  );

  return [...otherStatusOrders, ...reindexed];
};

/**
 * Move work order to different column (status change via drag & drop)
 *
 * @param workOrders - Array of all work orders
 * @param workOrderId - ID of work order being dragged
 * @param newStatus - New status column
 * @param newIndex - Position index in new column
 * @param userId - User performing the action
 * @returns Updated array of work orders
 */
export const moveToColumn = (
  workOrders: WorkOrder[],
  workOrderId: string,
  newStatus: WorkOrderStatus,
  newIndex: number,
  userId: string
): WorkOrder[] => {
  const draggedOrder = workOrders.find((wo) => wo.id === workOrderId);
  if (!draggedOrder) return workOrders;

  const now = new Date().toISOString();
  const oldStatus = draggedOrder.status;

  // Update work order with new status and timestamps
  const updatedOrder: WorkOrder = {
    ...draggedOrder,
    status: newStatus,
    timestamps: {
      ...draggedOrder.timestamps,
      ...(newStatus === 'In Progress' && !draggedOrder.timestamps?.started
        ? { started: now }
        : {}),
      ...(newStatus === 'Completed' && !draggedOrder.timestamps?.completed
        ? { completed: now }
        : {}),
    },
    completedDate:
      newStatus === 'Completed' ? now : draggedOrder.completedDate,
    history: [
      ...(draggedOrder.history || []),
      {
        timestamp: now,
        action: 'status_changed',
        performedBy: userId,
        details: `Status gewijzigd van "${oldStatus}" naar "${newStatus}" via drag & drop`,
        fromStatus: oldStatus,
        toStatus: newStatus,
      },
    ],
  };

  // Get all orders in destination column
  const destinationOrders = workOrders
    .filter((wo) => wo.status === newStatus && wo.id !== workOrderId)
    .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));

  // Insert at new position
  const reordered = [
    ...destinationOrders.slice(0, newIndex),
    updatedOrder,
    ...destinationOrders.slice(newIndex),
  ];

  // Reassign sortIndex in destination column
  const reindexedDestination = reordered.map((wo, index) => ({
    ...wo,
    sortIndex: index,
  }));

  // Reindex source column
  const sourceOrders = workOrders
    .filter((wo) => wo.status === oldStatus && wo.id !== workOrderId)
    .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
    .map((wo, index) => ({
      ...wo,
      sortIndex: index,
    }));

  // Get orders from other columns (not source, not destination)
  const otherOrders = workOrders.filter(
    (wo) => wo.status !== oldStatus && wo.status !== newStatus
  );

  return [...otherOrders, ...sourceOrders, ...reindexedDestination];
};

/**
 * Auto-reindex all work orders in a column
 * Ensures sequential sortIndex values without gaps
 *
 * @param workOrders - Array of all work orders
 * @param status - Status column to reindex
 * @returns Updated array of work orders
 */
export const reindexColumn = (
  workOrders: WorkOrder[],
  status: WorkOrderStatus
): WorkOrder[] => {
  const columnOrders = workOrders
    .filter((wo) => wo.status === status)
    .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
    .map((wo, index) => ({
      ...wo,
      sortIndex: index,
    }));

  const otherOrders = workOrders.filter((wo) => wo.status !== status);

  return [...otherOrders, ...columnOrders];
};

/**
 * Auto-reindex all work orders in all columns
 *
 * @param workOrders - Array of all work orders
 * @returns Updated array of work orders
 */
export const reindexAllColumns = (
  workOrders: WorkOrder[]
): WorkOrder[] => {
  const statuses: WorkOrderStatus[] = [
    'To Do',
    'Pending',
    'In Progress',
    'Completed',
  ];

  let reindexed = [...workOrders];

  for (const status of statuses) {
    reindexed = reindexColumn(reindexed, status);
  }

  return reindexed;
};

/**
 * Get work orders grouped by status (for Kanban board)
 *
 * @param workOrders - Array of all work orders
 * @returns Work orders grouped by status, sorted by sortIndex
 */
export const getWorkOrdersByStatus = (
  workOrders: WorkOrder[]
): Record<WorkOrderStatus, WorkOrder[]> => {
  const grouped: Record<WorkOrderStatus, WorkOrder[]> = {
    'To Do': [],
    'Pending': [],
    'In Progress': [],
    'Completed': [],
  };

  for (const workOrder of workOrders) {
    if (grouped[workOrder.status]) {
      grouped[workOrder.status].push(workOrder);
    }
  }

  // Sort each group by sortIndex
  for (const status in grouped) {
    grouped[status as WorkOrderStatus].sort(
      (a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0)
    );
  }

  return grouped;
};

/**
 * Validate drag operation
 *
 * @param workOrder - Work order being dragged
 * @param targetStatus - Target status column
 * @returns Validation result
 */
export const validateDragOperation = (
  workOrder: WorkOrder,
  targetStatus: WorkOrderStatus
): { isValid: boolean; reason?: string } => {
  // Allow all transitions for now
  // Add business logic here if certain transitions should be blocked

  // Example: Prevent moving completed orders back
  if (workOrder.status === 'Completed' && targetStatus !== 'Completed') {
    return {
      isValid: false,
      reason: 'Voltooide werkorders kunnen niet worden teruggeplaatst',
    };
  }

  return { isValid: true };
};

/**
 * Get column statistics
 *
 * @param workOrders - Array of all work orders
 * @returns Statistics per column
 */
export const getColumnStats = (
  workOrders: WorkOrder[]
): Record<
  WorkOrderStatus,
  { count: number; totalHours: number; avgSortIndex: number }
> => {
  const stats: Record<
    WorkOrderStatus,
    { count: number; totalHours: number; avgSortIndex: number }
  > = {
    'To Do': { count: 0, totalHours: 0, avgSortIndex: 0 },
    'Pending': { count: 0, totalHours: 0, avgSortIndex: 0 },
    'In Progress': { count: 0, totalHours: 0, avgSortIndex: 0 },
    'Completed': { count: 0, totalHours: 0, avgSortIndex: 0 },
  };

  for (const workOrder of workOrders) {
    const status = workOrder.status;
    stats[status].count++;
    stats[status].totalHours += workOrder.hoursSpent ?? 0;
    stats[status].avgSortIndex += workOrder.sortIndex ?? 0;
  }

  // Calculate averages
  for (const status in stats) {
    const s = status as WorkOrderStatus;
    if (stats[s].count > 0) {
      stats[s].avgSortIndex = stats[s].avgSortIndex / stats[s].count;
    }
  }

  return stats;
};
