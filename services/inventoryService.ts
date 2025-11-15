// Inventory Service
import { apiClient, PaginatedResponse } from '../utils/api/apiClient';
import { InventoryItem } from '../types';

export interface CreateInventoryRequest {
  productId: string;
  name: string;
  description?: string;
  category: string;
  unit?: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity?: number;
  minStock?: number;
  location?: string;
  supplier?: string;
  notes?: string;
}

export interface InventoryFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  lowStock?: boolean;
}

export const inventoryService = {
  /**
   * Get all inventory items
   */
  async getInventory(filters?: InventoryFilters): Promise<PaginatedResponse<InventoryItem>> {
    return apiClient.get<PaginatedResponse<InventoryItem>>('/inventory', filters);
  },

  /**
   * Get single inventory item
   */
  async getInventoryItem(id: string): Promise<InventoryItem> {
    return apiClient.get<InventoryItem>(`/inventory/${id}`);
  },

  /**
   * Create inventory item
   */
  async createInventoryItem(data: CreateInventoryRequest): Promise<InventoryItem> {
    return apiClient.post<InventoryItem>('/inventory', data);
  },

  /**
   * Update inventory item
   */
  async updateInventoryItem(id: string, data: Partial<CreateInventoryRequest>): Promise<InventoryItem> {
    return apiClient.put<InventoryItem>(`/inventory/${id}`, data);
  },

  /**
   * Delete inventory item
   */
  async deleteInventoryItem(id: string): Promise<void> {
    return apiClient.delete<void>(`/inventory/${id}`);
  },
};
