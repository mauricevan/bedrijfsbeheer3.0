// features/workorders/hooks/useWorkOrders.ts
// Main WorkOrders CRUD Hook
// Compliant met prompt.git: Max 200 regels

import { useMemo } from 'react';
import type { WorkOrder, WorkOrderStatus, User } from '../types';
import {
  createWorkOrder,
  updateWorkOrderStatus,
  updateWorkOrderHours,
  updateWorkOrderDetails,
  getWorkOrdersByEmployee,
  getWorkOrderStats,
} from '../services';
import { groupByStatus, filterByStatus } from '../utils';
import { trackAction, trackTaskCompletion } from '../../../utils/analytics';
import type { NewOrderForm, MaterialSelection } from '../types';

interface UseWorkOrdersProps {
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  currentUser: User;
  statusFilter: WorkOrderStatus | null;
  viewingUserId: string;
}

export const useWorkOrders = ({
  workOrders,
  setWorkOrders,
  currentUser,
  statusFilter,
  viewingUserId,
}: UseWorkOrdersProps) => {
  // Filter orders by viewing user and status
  const filteredOrders = useMemo(() => {
    let filtered = getWorkOrdersByEmployee(workOrders, viewingUserId);
    filtered = filterByStatus(filtered, statusFilter);
    return filtered;
  }, [workOrders, viewingUserId, statusFilter]);

  // Group orders by status for Kanban
  const groupedOrders = useMemo(() => {
    return groupByStatus(filteredOrders);
  }, [filteredOrders]);

  // Statistics
  const stats = useMemo(() => {
    return getWorkOrderStats(filteredOrders);
  }, [filteredOrders]);

  // Add new work order
  const addWorkOrder = (form: NewOrderForm, materials: MaterialSelection[]) => {
    const newOrder = createWorkOrder(
      form,
      currentUser.employeeId,
      materials,
      workOrders
    );

    setWorkOrders((prev) => [...prev, newOrder]);

    trackAction('work_order_created', {
      assignedTo: form.assignedTo,
      materialCount: materials.length,
    });

    return newOrder;
  };

  // Update work order status
  const changeStatus = (
    orderId: string,
    newStatus: WorkOrderStatus,
    pendingReason?: string
  ) => {
    setWorkOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updated = updateWorkOrderStatus(
          order,
          newStatus,
          currentUser.employeeId,
          pendingReason
        );

        if (newStatus === 'Completed') {
          trackTaskCompletion('work_order', orderId, currentUser.employeeId);
        }

        return updated;
      })
    );
  };

  // Update hours
  const updateHours = (orderId: string, hours: number) => {
    setWorkOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? updateWorkOrderHours(order, hours, currentUser.employeeId)
          : order
      )
    );
  };

  // Update work order
  const updateOrder = (orderId: string, updates: Partial<WorkOrder>) => {
    setWorkOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? updateWorkOrderDetails(order, updates, currentUser.employeeId)
          : order
      )
    );
  };

  // Delete work order
  const deleteOrder = (orderId: string) => {
    setWorkOrders((prev) => prev.filter((order) => order.id !== orderId));
    trackAction('work_order_deleted', { orderId });
  };

  return {
    filteredOrders,
    groupedOrders,
    stats,
    addWorkOrder,
    changeStatus,
    updateHours,
    updateOrder,
    deleteOrder,
  };
};
