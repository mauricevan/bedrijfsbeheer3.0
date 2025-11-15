// features/accounting/hooks/useDashboardInsights.ts - Refactored < 200 lines
import { useMemo } from 'react';
import type { Invoice, Quote, Customer } from '../../../types';

// Type definitions for chart data
type OpenByCustomerData = { name: string; amount: number; avgDaysOpen: number; }[];
type PaymentBehaviorData = { month: string; 'Op tijd': number; 'Te laat': number; }[];

export const useDashboardInsights = (
  invoices: Invoice[],
  quotes: Quote[],
  paidInvoices: Invoice[],
  outstandingInvoices: Invoice[],
  overdueInvoices: Invoice[],
  customers: Customer[],
  openByCustomer: OpenByCustomerData,
  paymentBehavior: PaymentBehaviorData
) => {
  const comparisonToPrevious = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    const currentMonthRevenue = paidInvoices
      .filter((inv) => inv.paidDate && new Date(inv.paidDate).toISOString().slice(0, 7) === currentMonth.replace('-0', '-'))
      .reduce((sum, inv) => sum + inv.total, 0);

    const previousMonthRevenue = paidInvoices
      .filter((inv) => inv.paidDate && new Date(inv.paidDate).toISOString().slice(0, 7) === previousMonthKey.replace('-0', '-'))
      .reduce((sum, inv) => sum + inv.total, 0);

    const currentMonthQuotes = quotes.filter((q) => q.createdDate?.slice(0, 7) === currentMonth.replace('-0', '-'));
    const previousMonthQuotes = quotes.filter((q) => q.createdDate?.slice(0, 7) === previousMonthKey.replace('-0', '-'));
    const currentConversion = currentMonthQuotes.filter((q) => q.status === 'approved').length / Math.max(currentMonthQuotes.length, 1);
    const prevConversion = previousMonthQuotes.filter((q) => q.status === 'approved').length / Math.max(previousMonthQuotes.length, 1);

    return {
      revenueChange: previousMonthRevenue > 0 ? (currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue : 0,
      quoteConversionChange: prevConversion > 0 ? (currentConversion - prevConversion) / prevConversion : 0,
    };
  }, [paidInvoices, quotes]);

  const topCustomers = useMemo(() => {
    const customerMap: Record<string, { revenue: number; invoiceCount: number }> = {};
    paidInvoices.forEach((inv) => {
      const name = customers.find((c) => c.id === inv.customerId)?.name || 'Onbekend';
      if (!customerMap[name]) customerMap[name] = { revenue: 0, invoiceCount: 0 };
      customerMap[name].revenue += inv.total;
      customerMap[name].invoiceCount += 1;
    });

    const now = new Date();
    return Object.entries(customerMap)
      .map(([name, data]) => {
        const last3MonthsRevenue = paidInvoices
          .filter((inv) => {
            const customerName = customers.find((c) => c.id === inv.customerId)?.name;
            if (customerName !== name || !inv.paidDate) return false;
            const monthsDiff = (now.getFullYear() - new Date(inv.paidDate).getFullYear()) * 12 + (now.getMonth() - new Date(inv.paidDate).getMonth());
            return monthsDiff >= 0 && monthsDiff < 3;
          })
          .reduce((sum, inv) => sum + inv.total, 0);

        const prev3MonthsRevenue = paidInvoices
          .filter((inv) => {
            const customerName = customers.find((c) => c.id === inv.customerId)?.name;
            if (customerName !== name || !inv.paidDate) return false;
            const monthsDiff = (now.getFullYear() - new Date(inv.paidDate).getFullYear()) * 12 + (now.getMonth() - new Date(inv.paidDate).getMonth());
            return monthsDiff >= 3 && monthsDiff < 6;
          })
          .reduce((sum, inv) => sum + inv.total, 0);

        const trend = prev3MonthsRevenue > 0 ? (last3MonthsRevenue - prev3MonthsRevenue) / prev3MonthsRevenue : 0;
        return {
          name,
          revenue: Math.round(data.revenue * 100) / 100,
          profit: Math.round(data.revenue * 0.3 * 100) / 100,
          trend: Math.round(trend * 100) / 100,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [paidInvoices, customers]);

  const quotesByStatusWithValue = useMemo(() => {
    const statusMap: Record<string, { count: number; totalValue: number }> = {
      approved: { count: 0, totalValue: 0 },
      sent: { count: 0, totalValue: 0 },
      draft: { count: 0, totalValue: 0 },
      rejected: { count: 0, totalValue: 0 },
      expired: { count: 0, totalValue: 0 },
    };

    quotes.forEach((q) => {
      if (!statusMap[q.status]) statusMap[q.status] = { count: 0, totalValue: 0 };
      statusMap[q.status].count += 1;
      statusMap[q.status].totalValue += q.total;
    });

    return [
      { status: 'Goedgekeurd', count: statusMap.approved.count, totalValue: Math.round(statusMap.approved.totalValue * 100) / 100, statusKey: 'approved' },
      { status: 'Verzonden', count: statusMap.sent.count, totalValue: Math.round(statusMap.sent.totalValue * 100) / 100, statusKey: 'sent' },
      { status: 'In afwachting', count: statusMap.draft.count, totalValue: Math.round(statusMap.draft.totalValue * 100) / 100, statusKey: 'draft' },
      { status: 'Afgewezen', count: statusMap.rejected.count, totalValue: Math.round(statusMap.rejected.totalValue * 100) / 100, statusKey: 'rejected' },
      { status: 'Verlopen', count: statusMap.expired.count, totalValue: Math.round(statusMap.expired.totalValue * 100) / 100, statusKey: 'expired' },
    ].filter((item) => item.count > 0);
  }, [quotes]);

  const insights = useMemo(() => {
    const insightsList: string[] = [];
    if (overdueInvoices.length > 0) {
      const totalOverdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);
      insightsList.push(`⚠️ Er zijn ${overdueInvoices.length} verlopen facturen met een totaalbedrag van €${totalOverdueAmount.toFixed(2)}.`);
    }

    const highDaysOpen = openByCustomer.filter((c) => c.avgDaysOpen > 30);
    highDaysOpen.forEach((customer) => {
      insightsList.push(`💡 Klant ${customer.name} heeft openstaande facturen van €${customer.amount.toFixed(2)} die gemiddeld ${customer.avgDaysOpen} dagen oud zijn.`);
    });

    if (comparisonToPrevious.revenueChange > 0.1) {
      insightsList.push(`✅ Omzet steeg met ${(comparisonToPrevious.revenueChange * 100).toFixed(0)}% t.o.v. vorige maand — beste maand dit kwartaal.`);
    } else if (comparisonToPrevious.revenueChange < -0.1) {
      insightsList.push(`📉 Omzet daalde met ${Math.abs(comparisonToPrevious.revenueChange * 100).toFixed(0)}% t.o.v. vorige maand.`);
    }

    if (comparisonToPrevious.quoteConversionChange > 0.05) {
      const currentConversion = quotesByStatusWithValue.filter((q) => q.statusKey === 'approved').reduce((sum, q) => sum + q.count, 0) / Math.max(quotes.length, 1);
      insightsList.push(`📈 Conversieratio offertes: ${(currentConversion * 100).toFixed(0)}% (+${(comparisonToPrevious.quoteConversionChange * 100).toFixed(0)}% t.o.v. vorige maand).`);
    }

    const recentPaymentBehavior = paymentBehavior.slice(-1)[0];
    if (recentPaymentBehavior && recentPaymentBehavior['Te laat'] > recentPaymentBehavior['Op tijd'] * 0.3) {
      insightsList.push(`⚠️ Hoge percentage te late betalingen deze maand: ${((recentPaymentBehavior['Te laat'] / (recentPaymentBehavior['Op tijd'] + recentPaymentBehavior['Te laat'])) * 100).toFixed(0)}%.`);
    }

    return insightsList.slice(0, 4);
  }, [overdueInvoices, openByCustomer, comparisonToPrevious, quotesByStatusWithValue, quotes.length, paymentBehavior]);

  return { comparisonToPrevious, topCustomers, quotesByStatusWithValue, insights };
};
