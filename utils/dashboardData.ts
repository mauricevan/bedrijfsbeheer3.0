import { Invoice, Quote, Customer, Transaction } from '../types';

export interface DashboardDataResponse {
  period: string;
  comparisonToPrevious: { revenueChange: number; invoicesChange: number; openAmountChange: number; quoteConversionChange: number };
  stats: { totalRevenue: number; totalInvoiced: number; openAmount: number; averagePaymentTermDays: number; openQuotes: number };
  salesByMonth: Array<{ month: string; revenue: number }>;
  previousYearSales: Array<{ month: string; revenue: number }>;
  openByCustomer: Array<{ name: string; amount: number; daysOpen: number }>;
  topCustomers: Array<{ name: string; revenue: number; profit: number; trend: number }>;
  quotesByStatus: Array<{ status: string; count: number; totalValue: number }>;
  paymentBehavior: Array<{ month: string; onTime: number; late: number }>;
  insights: string[];
}

export function transformDashboardData(
  invoices: Invoice[],
  quotes: Quote[],
  customers: Customer[],
  transactions: Transaction[]
): DashboardDataResponse {
  const now = new Date();
  const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
  const period = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const outstandingInvoices = invoices.filter(inv => ['sent', 'overdue'].includes(inv.status));
  const totalOutstanding = outstandingInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const paidInvoicesWithDates = invoices.filter(inv => inv.status === 'paid' && inv.issueDate && inv.paidDate);
  const avgPaymentDays = paidInvoicesWithDates.length > 0
    ? Math.round(paidInvoicesWithDates.reduce((sum, inv) => {
        const diffTime = Math.abs(new Date(inv.paidDate!).getTime() - new Date(inv.issueDate).getTime());
        return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }, 0) / paidInvoicesWithDates.length)
    : 0;

  const openQuotes = quotes.filter(q => !['approved', 'rejected'].includes(q.status));
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

  const filterByMonth = (items: any[], dateKey: string, monthKey: string) =>
    items.filter(item => item[dateKey]?.startsWith(monthKey));

  const currentMonthRevenue = filterByMonth(paidInvoices, 'paidDate', currentMonth).reduce((sum, inv) => sum + inv.total, 0);
  const previousMonthRevenue = filterByMonth(paidInvoices, 'paidDate', previousMonthKey).reduce((sum, inv) => sum + inv.total, 0);
  const currentMonthInvoices = filterByMonth(invoices, 'issueDate', currentMonth).length;
  const previousMonthInvoices = filterByMonth(invoices, 'issueDate', previousMonthKey).length;
  const currentMonthQuotes = filterByMonth(quotes, 'createdDate', currentMonth);
  const previousMonthQuotes = filterByMonth(quotes, 'createdDate', previousMonthKey);
  const currentMonthApprovedQuotes = currentMonthQuotes.filter(q => q.status === 'approved').length;
  const previousMonthApprovedQuotes = previousMonthQuotes.filter(q => q.status === 'approved').length;

  const months: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months[`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`] = 0;
  }

  paidInvoices.forEach(inv => {
    if (inv.paidDate) {
      const key = inv.paidDate.slice(0, 7);
      if (months[key] !== undefined) months[key] += inv.total;
    }
  });

  const salesByMonth = Object.entries(months).map(([month, revenue]) => ({
    month: month.split('-')[1] + '/' + month.split('-')[0].slice(-2),
    revenue: Math.round(revenue * 100) / 100,
  }));

  const prevYearMonths: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear() - 1, now.getMonth() - i, 1);
    prevYearMonths[`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`] = 0;
  }

  paidInvoices.forEach(inv => {
    if (inv.paidDate) {
      const key = inv.paidDate.slice(0, 7);
      if (prevYearMonths[key] !== undefined) prevYearMonths[key] += inv.total;
    }
  });

  const previousYearSales = Object.entries(prevYearMonths).map(([month, revenue]) => ({
    month: month.split('-')[1] + '/' + month.split('-')[0].slice(-2),
    revenue: Math.round(revenue * 100) / 100,
  }));

  const customerMap: Record<string, { amount: number; daysOpen: number[] }> = {};
  outstandingInvoices.forEach(inv => {
    const name = customers.find(c => c.id === inv.customerId)?.name || 'Onbekend';
    if (!customerMap[name]) customerMap[name] = { amount: 0, daysOpen: [] };
    customerMap[name].amount += inv.total;
    if (inv.issueDate) {
      const diffTime = Math.abs(now.getTime() - new Date(inv.issueDate).getTime());
      customerMap[name].daysOpen.push(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
  });

  const openByCustomer = Object.entries(customerMap)
    .map(([name, data]) => ({
      name,
      amount: Math.round(data.amount * 100) / 100,
      daysOpen: Math.round(data.daysOpen.reduce((sum, d) => sum + d, 0) / data.daysOpen.length) || 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const statusMap: Record<string, { count: number; totalValue: number }> = {
    approved: { count: 0, totalValue: 0 },
    sent: { count: 0, totalValue: 0 },
    draft: { count: 0, totalValue: 0 },
    rejected: { count: 0, totalValue: 0 },
    expired: { count: 0, totalValue: 0 },
  };

  quotes.forEach(q => {
    if (!statusMap[q.status]) statusMap[q.status] = { count: 0, totalValue: 0 };
    statusMap[q.status].count += 1;
    statusMap[q.status].totalValue += q.total;
  });

  const quotesByStatus = [
    { status: 'Goedgekeurd', count: statusMap.approved.count, totalValue: Math.round(statusMap.approved.totalValue * 100) / 100 },
    { status: 'Verzonden', count: statusMap.sent.count, totalValue: Math.round(statusMap.sent.totalValue * 100) / 100 },
    { status: 'In afwachting', count: statusMap.draft.count, totalValue: Math.round(statusMap.draft.totalValue * 100) / 100 },
    { status: 'Afgewezen', count: statusMap.rejected.count, totalValue: Math.round(statusMap.rejected.totalValue * 100) / 100 },
  ].filter(item => item.count > 0);

  return {
    period,
    comparisonToPrevious: {
      revenueChange: previousMonthRevenue > 0 ? (currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue : 0,
      invoicesChange: previousMonthInvoices > 0 ? (currentMonthInvoices - previousMonthInvoices) / previousMonthInvoices : 0,
      openAmountChange: 0,
      quoteConversionChange:
        previousMonthApprovedQuotes > 0 && previousMonthQuotes.length > 0
          ? (currentMonthApprovedQuotes / currentMonthQuotes.length - previousMonthApprovedQuotes / previousMonthQuotes.length) /
            (previousMonthApprovedQuotes / previousMonthQuotes.length)
          : 0,
    },
    stats: {
      totalRevenue: Math.round(totalPaid * 100) / 100,
      totalInvoiced: Math.round(totalInvoiced * 100) / 100,
      openAmount: Math.round(totalOutstanding * 100) / 100,
      averagePaymentTermDays: avgPaymentDays,
      openQuotes: openQuotes.length,
    },
    salesByMonth,
    previousYearSales,
    openByCustomer,
    topCustomers: [],
    quotesByStatus,
    paymentBehavior: [],
    insights: [],
  };
}
