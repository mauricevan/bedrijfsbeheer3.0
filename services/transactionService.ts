// Transaction Service
import { apiClient, PaginatedResponse } from '../utils/api/apiClient';
import { Transaction } from '../types';

export interface CreateTransactionRequest {
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  invoiceId?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface TransactionSummary {
  totals: {
    income: number;
    expense: number;
    balance: number;
  };
  byType: Array<{
    type: string;
    _sum: { amount: number };
    _count: number;
  }>;
  byCategory: Array<{
    type: string;
    category: string;
    _sum: { amount: number };
    _count: number;
  }>;
}

export const transactionService = {
  /**
   * Get all transactions
   */
  async getTransactions(filters?: TransactionFilters): Promise<PaginatedResponse<Transaction> & { summary?: any }> {
    return apiClient.get('/transactions', filters);
  },

  /**
   * Get transaction summary
   */
  async getSummary(filters?: { startDate?: string; endDate?: string; groupBy?: string }): Promise<TransactionSummary> {
    return apiClient.get<TransactionSummary>('/transactions/summary', filters);
  },

  /**
   * Get single transaction
   */
  async getTransaction(id: string): Promise<Transaction> {
    return apiClient.get<Transaction>(`/transactions/${id}`);
  },

  /**
   * Create transaction
   */
  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    return apiClient.post<Transaction>('/transactions', data);
  },

  /**
   * Update transaction
   */
  async updateTransaction(id: string, data: Partial<CreateTransactionRequest>): Promise<Transaction> {
    return apiClient.put<Transaction>(`/transactions/${id}`, data);
  },

  /**
   * Delete transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    return apiClient.delete<void>(`/transactions/${id}`);
  },
};
