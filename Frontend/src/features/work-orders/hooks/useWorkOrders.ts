import { useState, useEffect, useCallback } from 'react';
import type { WorkOrder, WorkOrderStatus } from '../types';
import { workOrderService } from '../services';

export const useWorkOrders = () => {
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

  const createWorkOrder = async (data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder = await workOrderService.create(data);
    setWorkOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateWorkOrder = async (id: string, updates: Partial<WorkOrder>) => {
    const updated = await workOrderService.update(id, updates);
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
    await workOrderService.delete(id);
    setWorkOrders(prev => prev.filter(wo => wo.id !== id));
  };

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
    getByStatus,
    refresh: fetchWorkOrders,
  };
};
