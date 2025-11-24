import { useState, useEffect, useCallback } from 'react';
import type { WorkOrder, WorkOrderStatus } from '../types';
import { workOrderService } from '../services';

interface UseWorkOrdersOptions {
  userId?: string;
  userName?: string;
}

export const useWorkOrders = (options?: UseWorkOrdersOptions) => {
  const { userId = 'system', userName = 'System' } = options || {};
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await workOrderService.getAll();
      setWorkOrders(data);
    } catch (error) {
      console.error('Failed to fetch work orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  const createWorkOrder = async (
    data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'history'>,
    sourceType?: 'quote' | 'invoice' | 'manual'
  ) => {
    const newOrder = await workOrderService.create(data, userId, userName, sourceType);
    setWorkOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateWorkOrder = async (id: string, updates: Partial<WorkOrder>) => {
    const updated = await workOrderService.update(id, updates, userId, userName);
    setWorkOrders(prev => prev.map(wo => wo.id === id ? updated : wo));
    return updated;
  };

  const updateStatus = async (id: string, status: WorkOrderStatus) => {
    const updates: Partial<WorkOrder> = { status };
    if (status === 'completed') {
      updates.completedDate = new Date().toISOString();
    }
    return updateWorkOrder(id, updates);
  };

  const deleteWorkOrder = async (id: string) => {
    await workOrderService.delete(id, userId, userName);
    setWorkOrders(prev => prev.filter(wo => wo.id !== id));
  };

  const reopenWorkOrder = async (id: string, reason: string) => {
    const reopened = await workOrderService.reopen(id, reason, userId, userName);
    setWorkOrders(prev => prev.map(wo => wo.id === id ? reopened : wo));
    return reopened;
  };

  const archiveWorkOrder = async (id: string, archiveReason?: string) => {
    const archived = await workOrderService.archive(id, archiveReason, userId, userName);
    setWorkOrders(prev => prev.map(wo => wo.id === id ? archived : wo));
    return archived;
  };

  const checkAutoArchive = async () => {
    return await workOrderService.checkAutoArchive();
  };

  const getWorkOrdersNeedingAttention = useCallback(() => {
    return workOrderService.getWorkOrdersNeedingAttention();
  }, []);

  const getByStatus = useCallback((status: WorkOrderStatus) => {
    return workOrders.filter(wo => wo.status === status).sort((a, b) => a.sortIndex - b.sortIndex);
  }, [workOrders]);

  return {
    workOrders,
    isLoading,
    createWorkOrder,
    updateWorkOrder,
    updateStatus,
    deleteWorkOrder,
    reopenWorkOrder,
    archiveWorkOrder,
    checkAutoArchive,
    getWorkOrdersNeedingAttention,
    getByStatus,
    refresh: fetchWorkOrders,
  };
};
