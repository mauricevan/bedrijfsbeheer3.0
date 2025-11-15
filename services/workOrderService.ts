// WorkOrder Service
import { apiClient, PaginatedResponse } from '../utils/api/apiClient';
import { WorkOrder } from '../types';

export interface CreateWorkOrderRequest {
  title: string;
  description?: string;
  customerId: string;
  assignedTo?: string;
  quoteId?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  estimatedHours?: number;
  materials?: {
    inventoryItemId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface WorkOrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assignedTo?: string;
  customerId?: string;
}

export const workOrderService = {
  /**
   * Get all work orders
   */
  async getWorkOrders(filters?: WorkOrderFilters): Promise<PaginatedResponse<WorkOrder>> {
    return apiClient.get<PaginatedResponse<WorkOrder>>('/work-orders', filters);
  },

  /**
   * Get single work order
   */
  async getWorkOrder(id: string): Promise<WorkOrder> {
    return apiClient.get<WorkOrder>(`/work-orders/${id}`);
  },

  /**
   * Create work order
   */
  async createWorkOrder(data: CreateWorkOrderRequest): Promise<WorkOrder> {
    return apiClient.post<WorkOrder>('/work-orders', data);
  },

  /**
   * Update work order
   */
  async updateWorkOrder(id: string, data: Partial<CreateWorkOrderRequest>): Promise<WorkOrder> {
    return apiClient.put<WorkOrder>(`/work-orders/${id}`, data);
  },

  /**
   * Delete work order
   */
  async deleteWorkOrder(id: string): Promise<void> {
    return apiClient.delete<void>(`/work-orders/${id}`);
  },

  /**
   * Start work order
   */
  async startWorkOrder(id: string): Promise<WorkOrder> {
    return apiClient.post<WorkOrder>(`/work-orders/${id}/start`);
  },

  /**
   * Complete work order
   */
  async completeWorkOrder(id: string, actualHours?: number): Promise<WorkOrder> {
    return apiClient.post<WorkOrder>(`/work-orders/${id}/complete`, { actualHours });
  },
};
