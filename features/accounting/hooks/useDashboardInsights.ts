// features/accounting/hooks/useDashboardInsights.ts - Refactored < 200 lines
import { useMemo } from 'react';
import type { Invoice, Quote } from '../../../types';

/**
 * Hook for calculating dashboard insights and comparisons
 * Compares current period to previous period (month-over-month)
 */
export const useDashboardInsights = (
  invoices: Invoice[],
  quotes: Quote[],
  paidInvoices: Invoice[],
  outstandingInvoices: Invoice[]
) => {
  const comparisonToPrevious = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    // Current month stats
    const currentMonthRevenue = paidInvoices
      .filter((inv) => {
        if (!inv.paidDate) return false;
        const paidDate = new Date(inv.paidDate);
        return `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(2, '0')}` === currentMonth;
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    const currentMonthInvoices = invoices.filter((inv) => {
      if (!inv.issueDate) return false;
      const issueDate = new Date(inv.issueDate);
      return `${issueDate.getFullYear()}-${String(issueDate.getMonth() + 1).padStart(2, '0')}` === currentMonth;
    }).length;

    const currentMonthOpenAmount = outstandingInvoices
      .filter((inv) => {
        if (!inv.issueDate) return false;
        const issueDate = new Date(inv.issueDate);
        return `${issueDate.getFullYear()}-${String(issueDate.getMonth() + 1).padStart(2, '0')}` === currentMonth;
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    const currentMonthQuotes = quotes.filter((q) => {
      if (!q.createdDate) return false;
      const createdDate = new Date(q.createdDate);
      return `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}` === currentMonth;
    });

    const currentMonthApprovedQuotes = currentMonthQuotes.filter((q) => q.status === 'approved').length;
    const currentMonthQuoteConversion =
      currentMonthQuotes.length > 0 ? currentMonthApprovedQuotes / currentMonthQuotes.length : 0;

    // Previous month stats
    const previousMonthRevenue = paidInvoices
      .filter((inv) => {
        if (!inv.paidDate) return false;
        const paidDate = new Date(inv.paidDate);
        return `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(2, '0')}` === previousMonthKey;
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    const previousMonthInvoices = invoices.filter((inv) => {
      if (!inv.issueDate) return false;
      const issueDate = new Date(inv.issueDate);
      return `${issueDate.getFullYear()}-${String(issueDate.getMonth() + 1).padStart(2, '0')}` === previousMonthKey;
    }).length;

    const previousMonthOpenAmount = outstandingInvoices
      .filter((inv) => {
        if (!inv.issueDate) return false;
        const issueDate = new Date(inv.issueDate);
        return `${issueDate.getFullYear()}-${String(issueDate.getMonth() + 1).padStart(2, '0')}` === previousMonthKey;
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    const previousMonthQuotes = quotes.filter((q) => {
      if (!q.createdDate) return false;
      const createdDate = new Date(q.createdDate);
      return `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}` === previousMonthKey;
    });

    const previousMonthApprovedQuotes = previousMonthQuotes.filter((q) => q.status === 'approved').length;
    const previousMonthQuoteConversion =
      previousMonthQuotes.length > 0 ? previousMonthApprovedQuotes / previousMonthQuotes.length : 0;

    return {
      revenueChange:
        previousMonthRevenue > 0 ? (currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue : 0,
      invoicesChange:
        previousMonthInvoices > 0 ? (currentMonthInvoices - previousMonthInvoices) / previousMonthInvoices : 0,
      openAmountChange:
        previousMonthOpenAmount > 0 ? (currentMonthOpenAmount - previousMonthOpenAmount) / previousMonthOpenAmount : 0,
      quoteConversionChange:
        previousMonthQuoteConversion > 0
          ? (currentMonthQuoteConversion - previousMonthQuoteConversion) / previousMonthQuoteConversion
          : 0,
    };
  }, [paidInvoices, invoices, outstandingInvoices, quotes]);

  return {
    comparisonToPrevious,
  };
};
