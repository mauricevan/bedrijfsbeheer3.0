// Customer Service
import { apiClient, PaginatedResponse } from '../utils/api/apiClient';
import { Customer } from '../types';

export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  kvkNumber?: string;
  vatNumber?: string;
  status?: 'active' | 'inactive' | 'lead';
  source?: string;
  notes?: string;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const customerService = {
  /**
   * Get all customers
   */
  async getCustomers(filters?: CustomerFilters): Promise<PaginatedResponse<Customer>> {
    return apiClient.get<PaginatedResponse<Customer>>('/customers', filters);
  },

  /**
   * Get single customer
   */
  async getCustomer(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`/customers/${id}`);
  },

  /**
   * Create customer
   */
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return apiClient.post<Customer>('/customers', data);
  },

  /**
   * Update customer
   */
  async updateCustomer(id: string, data: Partial<CreateCustomerRequest>): Promise<Customer> {
    return apiClient.put<Customer>(`/customers/${id}`, data);
  },

  /**
   * Delete customer
   */
  async deleteCustomer(id: string): Promise<void> {
    return apiClient.delete<void>(`/customers/${id}`);
  },
};
