// Invoice Service
import { apiClient, PaginatedResponse } from '../utils/api/apiClient';
import { Invoice } from '../types';

export interface CreateInvoiceRequest {
  customerId: string;
  workOrderId?: string;
  items: {
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
  dueDate?: string;
}

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  status?: string;
  customerId?: string;
}

export const invoiceService = {
  /**
   * Get all invoices
   */
  async getInvoices(filters?: InvoiceFilters): Promise<PaginatedResponse<Invoice>> {
    return apiClient.get<PaginatedResponse<Invoice>>('/invoices', filters);
  },

  /**
   * Get single invoice
   */
  async getInvoice(id: string): Promise<Invoice> {
    return apiClient.get<Invoice>(`/invoices/${id}`);
  },

  /**
   * Create invoice
   */
  async createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
    return apiClient.post<Invoice>('/invoices', data);
  },

  /**
   * Update invoice
   */
  async updateInvoice(id: string, data: Partial<CreateInvoiceRequest>): Promise<Invoice> {
    return apiClient.put<Invoice>(`/invoices/${id}`, data);
  },

  /**
   * Delete invoice
   */
  async deleteInvoice(id: string): Promise<void> {
    return apiClient.delete<void>(`/invoices/${id}`);
  },

  /**
   * Mark invoice as paid
   */
  async markAsPaid(id: string, data: { amountPaid?: number; paymentMethod?: string; paidDate?: string }): Promise<Invoice> {
    return apiClient.post<Invoice>(`/invoices/${id}/pay`, data);
  },
};
