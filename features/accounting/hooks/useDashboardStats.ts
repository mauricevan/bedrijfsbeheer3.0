// features/accounting/hooks/useDashboardStats.ts - Refactored < 200 lines
import { useMemo } from 'react';
import type { Invoice, Quote, Transaction } from '../../../types';
import {
  calculateTransactionStats,
  calculateInvoiceStats,
  calculateQuoteStats,
  calculateAveragePaymentDays,
} from '../utils/calculations';

/**
 * Hook for calculating basic dashboard statistics
 * Aggregates transaction, invoice, and quote stats
 */
export const useDashboardStats = (invoices: Invoice[], quotes: Quote[], transactions: Transaction[]) => {
  // Transaction statistics
  const transactionStats = calculateTransactionStats(transactions);

  // Invoice statistics
  const invoiceStats = calculateInvoiceStats(invoices);

  // Quote statistics
  const quoteStats = calculateQuoteStats(quotes);

  // Open quotes count
  const openQuotesCount = useMemo(() => {
    return quotes.filter((q) => !['approved', 'rejected'].includes(q.status)).length;
  }, [quotes]);

  // Average payment days
  const avgPaymentDays = calculateAveragePaymentDays(invoices);

  return {
    transactionStats,
    invoiceStats,
    quoteStats,
    openQuotesCount,
    avgPaymentDays,
  };
};
