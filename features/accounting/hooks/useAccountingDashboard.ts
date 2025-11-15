// features/accounting/hooks/useAccountingDashboard.ts - Refactored < 200 lines
import type { Invoice, Quote, Transaction, Customer } from '../../../types';
import { useDashboardStats } from './useDashboardStats';
import { useDashboardCharts } from './useDashboardCharts';
import { useDashboardInsights } from './useDashboardInsights';

/**
 * Main hook for managing accounting dashboard calculations and insights
 * Orchestrates stats, charts, and insights sub-hooks
 * @param invoices - Invoices array
 * @param quotes - Quotes array
 * @param transactions - Transactions array
 * @param customers - Customers array
 * @returns Dashboard statistics, charts data, and insights
 */
export const useAccountingDashboard = (
  invoices: Invoice[],
  quotes: Quote[],
  transactions: Transaction[],
  customers: Customer[]
) => {
  // Calculate basic stats
  const stats = useDashboardStats(invoices, quotes, transactions);

  const { invoiceStats, quoteStats } = stats;
  const { paidInvoices, overdueInvoices, outstandingInvoices } = invoiceStats;
  const { approvedQuotes, sentQuotes, expiredQuotes } = quoteStats;

  // Open quotes
  const openQuotes = quotes.filter((q) => !['approved', 'rejected'].includes(q.status));

  // Calculate chart data
  const charts = useDashboardCharts(invoices, quotes, customers, paidInvoices, outstandingInvoices);

  // Calculate insights
  const insights = useDashboardInsights(invoices, quotes, paidInvoices, outstandingInvoices);

  return {
    // Statistics
    stats: {
      transaction: stats.transactionStats,
      invoice: invoiceStats,
      quote: quoteStats,
      openQuotesCount: stats.openQuotesCount,
      avgPaymentDays: stats.avgPaymentDays,
    },

    // Charts data
    charts,

    // Insights
    insights,

    // Raw data for convenience
    raw: {
      paidInvoices,
      overdueInvoices,
      outstandingInvoices,
      approvedQuotes,
      sentQuotes,
      expiredQuotes,
      openQuotes,
    },
  };
};
