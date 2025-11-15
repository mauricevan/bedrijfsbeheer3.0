// features/accounting/utils/filters.ts - Refactored < 150 lines
import type { Quote, Invoice, Transaction } from '../../../types';
import { getCustomerName } from './helpers';

export interface InvoiceFilterOptions {
  type?: 'all' | 'paid' | 'outstanding' | 'overdue';
  customerName?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: string;
  maxAmount?: string;
}

export interface QuoteFilterOptions {
  type?: 'all' | 'approved' | 'sent' | 'expired';
  customerName?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: string;
  maxAmount?: string;
}

export const filterInvoices = (invoices: Invoice[], customers: any[], options: InvoiceFilterOptions): Invoice[] => {
  return invoices.filter((inv) => {
    // Type filter
    if (options.type === 'paid' && inv.status !== 'paid') return false;
    if (options.type === 'outstanding' && !['sent', 'overdue'].includes(inv.status)) return false;
    if (options.type === 'overdue' && inv.status !== 'overdue') return false;
    if (options.type === 'all' && inv.status === 'paid') return false;

    // Customer filter
    if (
      options.customerName &&
      !getCustomerName(inv.customerId, customers).toLowerCase().includes(options.customerName.toLowerCase())
    )
      return false;

    // Date filters
    if (options.dateFrom && inv.issueDate < options.dateFrom) return false;
    if (options.dateTo && inv.issueDate > options.dateTo) return false;

    // Amount filters
    if (options.minAmount && inv.total < parseFloat(options.minAmount)) return false;
    if (options.maxAmount && inv.total > parseFloat(options.maxAmount)) return false;

    return true;
  });
};

export const filterQuotes = (quotes: Quote[], customers: any[], options: QuoteFilterOptions): Quote[] => {
  return quotes.filter((q) => {
    // Type filter
    if (options.type === 'approved' && q.status !== 'approved') return false;
    if (options.type === 'sent' && q.status !== 'sent') return false;
    if (options.type === 'expired' && q.status !== 'expired' && !(q.validUntil && new Date(q.validUntil) < new Date()))
      return false;

    // Customer filter
    if (
      options.customerName &&
      !getCustomerName(q.customerId, customers).toLowerCase().includes(options.customerName.toLowerCase())
    )
      return false;

    // Date filters
    if (options.dateFrom && q.createdDate < options.dateFrom) return false;
    if (options.dateTo && q.createdDate > options.dateTo) return false;

    // Amount filters
    if (options.minAmount && q.total < parseFloat(options.minAmount)) return false;
    if (options.maxAmount && q.total > parseFloat(options.maxAmount)) return false;

    return true;
  });
};

export const filterTransactions = (
  transactions: Transaction[],
  filter: 'all' | 'income' | 'expense'
): Transaction[] => {
  if (filter === 'all') return transactions;
  return transactions.filter((t) => t.type === filter);
};

export const sortInvoices = (invoices: Invoice[], sortBy: 'date' | 'amount' | 'customer'): Invoice[] => {
  const sorted = [...invoices];
  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    case 'amount':
      return sorted.sort((a, b) => b.total - a.total);
    case 'customer':
      return sorted.sort((a, b) => a.customerId.localeCompare(b.customerId));
    default:
      return sorted;
  }
};

export const sortQuotes = (quotes: Quote[], sortBy: 'date' | 'amount' | 'customer'): Quote[] => {
  const sorted = [...quotes];
  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    case 'amount':
      return sorted.sort((a, b) => b.total - a.total);
    case 'customer':
      return sorted.sort((a, b) => a.customerId.localeCompare(b.customerId));
    default:
      return sorted;
  }
};

export const searchInvoices = (invoices: Invoice[], searchTerm: string, customers: any[]): Invoice[] => {
  if (!searchTerm) return invoices;
  const term = searchTerm.toLowerCase();
  return invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(term) ||
      getCustomerName(inv.customerId, customers).toLowerCase().includes(term) ||
      inv.notes?.toLowerCase().includes(term)
  );
};

export const searchQuotes = (quotes: Quote[], searchTerm: string, customers: any[]): Quote[] => {
  if (!searchTerm) return quotes;
  const term = searchTerm.toLowerCase();
  return quotes.filter(
    (q) =>
      q.id.toLowerCase().includes(term) ||
      getCustomerName(q.customerId, customers).toLowerCase().includes(term) ||
      q.notes?.toLowerCase().includes(term)
  );
};
