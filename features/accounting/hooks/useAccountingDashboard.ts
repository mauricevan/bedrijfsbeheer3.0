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
  const stats = useDashboardStats(invoices, quotes, transactions);
  const { invoiceStats, quoteStats } = stats;
  const { paidInvoices, overdueInvoices, outstandingInvoices } = invoiceStats;
  const { approvedQuotes, sentQuotes, expiredQuotes } = quoteStats;
  const openQuotes = quotes.filter((q) => !['approved', 'rejected'].includes(q.status));

  const charts = useDashboardCharts(invoices, quotes, customers, paidInvoices, outstandingInvoices);
  const insightsData = useDashboardInsights(
    invoices,
    quotes,
    paidInvoices,
    outstandingInvoices,
    overdueInvoices,
    customers,
    charts.openByCustomer,
    charts.paymentBehavior
  );

  return {
    stats: {
      transaction: stats.transactionStats,
      invoice: invoiceStats,
      quote: quoteStats,
      openQuotesCount: stats.openQuotesCount,
      avgPaymentDays: stats.avgPaymentDays,
    },
    charts,
    insights: insightsData,
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
