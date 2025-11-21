/**
 * Accounting Analytics Utilities
 * Pure functions for financial analysis and insights
 */

import type { Invoice, Quote } from '../types/accounting.types';

export interface InvoiceAging {
  customerId: string;
  customerName: string;
  totalOutstanding: number;
  averageAge: number; // in days
  oldestInvoiceAge: number; // in days
  invoiceCount: number;
}

export interface PaymentBehavior {
  month: string; // Format: "MM/YY"
  onTime: number;
  late: number;
  total: number;
}

export interface FinancialInsight {
  type: 'warning' | 'info' | 'success';
  message: string;
  severity?: 'low' | 'medium' | 'high';
}

/**
 * Calculate invoice age in days
 */
export const calculateInvoiceAge = (invoice: Invoice): number => {
  const dueDate = new Date(invoice.dueDate);
  const now = new Date();
  const diffTime = now.getTime() - dueDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate average payment term
 */
export const calculateAveragePaymentTerm = (invoices: Invoice[]): number => {
  const paidInvoices = invoices.filter(
    inv => inv.status === 'paid' && inv.paidDate && inv.issueDate
  );
  
  if (paidInvoices.length === 0) return 0;
  
  const totalDays = paidInvoices.reduce((sum, inv) => {
    const issueDate = new Date(inv.issueDate);
    const paidDate = new Date(inv.paidDate!);
    const diffTime = paidDate.getTime() - issueDate.getTime();
    return sum + Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }, 0);
  
  return Math.round(totalDays / paidInvoices.length);
};

/**
 * Get invoice aging analysis per customer
 */
export const getInvoiceAgingByCustomer = (invoices: Invoice[]): InvoiceAging[] => {
  const outstandingInvoices = invoices.filter(
    inv => inv.status !== 'paid' && inv.status !== 'cancelled'
  );
  
  const customerMap = new Map<string, Invoice[]>();
  
  outstandingInvoices.forEach(inv => {
    if (!customerMap.has(inv.customerId)) {
      customerMap.set(inv.customerId, []);
    }
    customerMap.get(inv.customerId)!.push(inv);
  });
  
  const aging: InvoiceAging[] = [];
  
  customerMap.forEach((customerInvoices, customerId) => {
    const totalOutstanding = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const ages = customerInvoices.map(calculateInvoiceAge);
    const averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
    const oldestInvoiceAge = Math.max(...ages);
    
    aging.push({
      customerId,
      customerName: customerInvoices[0].customerName,
      totalOutstanding,
      averageAge: Math.round(averageAge),
      oldestInvoiceAge,
      invoiceCount: customerInvoices.length,
    });
  });
  
  return aging.sort((a, b) => b.totalOutstanding - a.totalOutstanding);
};

/**
 * Get payment behavior analysis by month
 */
export const getPaymentBehaviorByMonth = (invoices: Invoice[]): PaymentBehavior[] => {
  const paidInvoices = invoices.filter(
    inv => inv.status === 'paid' && inv.paidDate && inv.issueDate
  );
  
  const monthMap = new Map<string, { onTime: number; late: number }>();
  
  paidInvoices.forEach(inv => {
    const issueDate = new Date(inv.issueDate);
    const paidDate = new Date(inv.paidDate!);
    const dueDate = new Date(inv.dueDate);
    
    const monthKey = `${String(issueDate.getMonth() + 1).padStart(2, '0')}/${String(issueDate.getFullYear()).slice(-2)}`;
    
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { onTime: 0, late: 0 });
    }
    
    const behavior = monthMap.get(monthKey)!;
    if (paidDate <= dueDate) {
      behavior.onTime += inv.total;
    } else {
      behavior.late += inv.total;
    }
  });
  
  return Array.from(monthMap.entries())
    .map(([month, data]) => ({
      month,
      onTime: data.onTime,
      late: data.late,
      total: data.onTime + data.late,
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/').map(Number);
      const [bMonth, bYear] = b.month.split('/').map(Number);
      if (aYear !== bYear) return aYear - bYear;
      return aMonth - bMonth;
    });
};

/**
 * Generate insights and recommendations
 */
export const generateInsights = (
  invoices: Invoice[],
  quotes: Quote[]
): FinancialInsight[] => {
  const insights: FinancialInsight[] = [];
  
  // Check for expired invoices
  const expiredInvoices = invoices.filter(inv => {
    if (inv.status === 'paid' || inv.status === 'cancelled') return false;
    return new Date(inv.dueDate) < new Date();
  });
  
  if (expiredInvoices.length > 0) {
    const totalExpired = expiredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    insights.push({
      type: 'warning',
      severity: 'high',
      message: `⚠️ Er zijn ${expiredInvoices.length} verlopen facturen met een totaalbedrag van €${totalExpired.toFixed(2)}.`,
    });
  }
  
  // Check invoice aging by customer
  const aging = getInvoiceAgingByCustomer(invoices);
  aging.forEach(customer => {
    if (customer.averageAge > 30) {
      insights.push({
        type: 'info',
        severity: customer.averageAge > 90 ? 'high' : customer.averageAge > 60 ? 'medium' : 'low',
        message: `💡 Klant ${customer.customerName} heeft openstaande facturen van €${customer.totalOutstanding.toFixed(2)} die gemiddeld ${customer.averageAge} dagen oud zijn.`,
      });
    }
  });
  
  // Check for open quotes
  const openQuotes = quotes.filter(q => q.status === 'sent' || q.status === 'draft');
  if (openQuotes.length > 0) {
    const totalOpen = openQuotes.reduce((sum, q) => sum + q.total, 0);
    insights.push({
      type: 'info',
      severity: 'low',
      message: `💡 Er zijn ${openQuotes.length} openstaande offertes met een totaalwaarde van €${totalOpen.toFixed(2)}.`,
    });
  }
  
  return insights;
};

/**
 * Get revenue per month
 */
export const getRevenuePerMonth = (invoices: Invoice[]): Array<{ month: string; revenue: number }> => {
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  
  const monthMap = new Map<string, number>();
  
  paidInvoices.forEach(inv => {
    const paidDate = new Date(inv.paidDate || inv.issueDate);
    const monthKey = `${String(paidDate.getMonth() + 1).padStart(2, '0')}/${String(paidDate.getFullYear()).slice(-2)}`;
    
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, 0);
    }
    monthMap.set(monthKey, monthMap.get(monthKey)! + inv.total);
  });
  
  return Array.from(monthMap.entries())
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/').map(Number);
      const [bMonth, bYear] = b.month.split('/').map(Number);
      if (aYear !== bYear) return aYear - bYear;
      return aMonth - bMonth;
    });
};

/**
 * Get top customers by revenue
 */
export const getTopCustomers = (invoices: Invoice[], limit: number = 5): Array<{ customerId: string; customerName: string; total: number }> => {
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  
  const customerMap = new Map<string, { name: string; total: number }>();
  
  paidInvoices.forEach(inv => {
    if (!customerMap.has(inv.customerId)) {
      customerMap.set(inv.customerId, { name: inv.customerName, total: 0 });
    }
    customerMap.get(inv.customerId)!.total += inv.total;
  });
  
  return Array.from(customerMap.entries())
    .map(([customerId, data]) => ({
      customerId,
      customerName: data.name,
      total: data.total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
};

/**
 * Get outstanding amount per customer
 */
export const getOutstandingPerCustomer = (invoices: Invoice[]): Array<{ customerName: string; amount: number }> => {
  const outstandingInvoices = invoices.filter(
    inv => inv.status !== 'paid' && inv.status !== 'cancelled'
  );
  
  const customerMap = new Map<string, number>();
  
  outstandingInvoices.forEach(inv => {
    if (!customerMap.has(inv.customerName)) {
      customerMap.set(inv.customerName, 0);
    }
    customerMap.set(inv.customerName, customerMap.get(inv.customerName)! + inv.total);
  });
  
  return Array.from(customerMap.entries())
    .map(([customerName, amount]) => ({ customerName, amount }))
    .sort((a, b) => b.amount - a.amount);
};

/**
 * Get quotes per status
 */
export const getQuotesPerStatus = (quotes: Quote[]): Record<string, number> => {
  const statusMap: Record<string, number> = {};
  
  quotes.forEach(quote => {
    statusMap[quote.status] = (statusMap[quote.status] || 0) + 1;
  });
  
  return statusMap;
};

