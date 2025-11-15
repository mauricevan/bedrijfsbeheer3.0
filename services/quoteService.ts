// Quote Service
import { apiClient, PaginatedResponse } from '../utils/api/apiClient';
import { Quote } from '../types';

export interface CreateQuoteRequest {
  customerId: string;
  items: {
    inventoryItemId?: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
  validUntil?: string;
}

export interface UpdateQuoteRequest {
  status?: 'draft' | 'sent' | 'approved' | 'rejected';
  items?: CreateQuoteRequest['items'];
  notes?: string;
  validUntil?: string;
}

export interface QuoteFilters {
  page?: number;
  limit?: number;
  status?: string;
  customerId?: string;
}

export const quoteService = {
  /**
   * Get all quotes
   */
  async getQuotes(filters?: QuoteFilters): Promise<PaginatedResponse<Quote>> {
    return apiClient.get<PaginatedResponse<Quote>>('/quotes', filters);
  },

  /**
   * Get single quote
   */
  async getQuote(id: string): Promise<Quote> {
    return apiClient.get<Quote>(`/quotes/${id}`);
  },

  /**
   * Create quote
   */
  async createQuote(data: CreateQuoteRequest): Promise<Quote> {
    return apiClient.post<Quote>('/quotes', data);
  },

  /**
   * Update quote
   */
  async updateQuote(id: string, data: UpdateQuoteRequest): Promise<Quote> {
    return apiClient.put<Quote>(`/quotes/${id}`, data);
  },

  /**
   * Delete quote
   */
  async deleteQuote(id: string): Promise<void> {
    return apiClient.delete<void>(`/quotes/${id}`);
  },
};
