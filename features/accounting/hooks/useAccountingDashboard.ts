import type {
  Invoice,
  Quote,
  Transaction,
  Customer,
} from '../../types';
import { useDashboardStats } from "./useDashboardStats";
import { useDashboardCharts } from "./useDashboardCharts";
import { useDashboardInsights } from "./useDashboardInsights";

/**
 * Main hook for managing accounting dashboard - Refactored to be < 200 lines
 * Orchestrates smaller, focused hooks for better separation of concerns
 *
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
  // ========================================
  // 1. BASIC STATISTICS (via useDashboardStats)
  // ========================================
  const stats = useDashboardStats(invoices, quotes, transactions);

  const {
    invoiceStats,
    quoteStats,
    transactionStats,
    openQuotesCount,
    avgPaymentDays,
  } = stats;

  const {
    paidInvoices,
    overdueInvoices,
    outstandingInvoices,
  } = invoiceStats;

  const {
    approvedQuotes,
    sentQuotes,
    expiredQuotes,
  } = quoteStats;

  // Open quotes
  const openQuotes = quotes.filter(
    (q) => !["approved", "rejected"].includes(q.status)
  );

  // ========================================
  // 2. CHART DATA (via useDashboardCharts)
  // ========================================
  const charts = useDashboardCharts(
    invoices,
    quotes,
    customers,
    paidInvoices,
    outstandingInvoices
  );

  // ========================================
  // 3. INSIGHTS (via useDashboardInsights)
  // ========================================
  const insights = useDashboardInsights(
    invoices,
    quotes,
    paidInvoices,
    outstandingInvoices,
    overdueInvoices,
    customers,
    charts.openByCustomer,
    charts.paymentBehavior
  );

  // ========================================
  // 4. RETURN COMBINED INTERFACE
  // ========================================
  return {
    // Statistics
    stats: {
      transaction: transactionStats,
      invoice: invoiceStats,
      quote: quoteStats,
      openQuotesCount,
      avgPaymentDays,
    },

    // Charts data
    charts: {
      monthlyRevenue: charts.monthlyRevenue,
      outstandingByCustomer: charts.outstandingByCustomer,
      salesByCustomer: charts.salesByCustomer,
      quotesByStatus: charts.quotesByStatus,
      paymentBehavior: charts.paymentBehavior,
      previousYearSales: charts.previousYearSales,
      openByCustomer: charts.openByCustomer,
    },

    // Insights
    insights: {
      comparisonToPrevious: insights.comparisonToPrevious,
    },

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
