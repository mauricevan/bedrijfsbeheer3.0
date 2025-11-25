import type {
  Customer,
  CustomerDashboard,
  CustomerSalesSummary,
  CustomerFinancialSummary,
  CustomerDocument,
  CustomerJourneyEntry,
  Interaction,
  Task,
} from '../types/crm.types';
import { crmService } from './crmService';


// Mock data for invoices and quotes (will be replaced with actual accounting integration)
interface Invoice {
  id: string;
  customerId: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
}

interface Quote {
  id: string;
  customerId: string;
  quoteNumber: string;
  date: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil: string;
}

interface WorkOrder {
  id: string;
  customerId: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
}

const INVOICES_KEY = 'crm_invoices';
const QUOTES_KEY = 'crm_quotes';
const WORK_ORDERS_KEY = 'crm_work_orders';

// Helper functions to get mock data
function getInvoicesByCustomer(customerId: string): Invoice[] {
  const data = localStorage.getItem(INVOICES_KEY);
  const invoices: Invoice[] = data ? JSON.parse(data) : [];
  return invoices.filter(inv => inv.customerId === customerId);
}

function getQuotesByCustomer(customerId: string): Quote[] {
  const data = localStorage.getItem(QUOTES_KEY);
  const quotes: Quote[] = data ? JSON.parse(data) : [];
  return quotes.filter(q => q.customerId === customerId);
}

function getWorkOrdersByCustomer(customerId: string): WorkOrder[] {
  const data = localStorage.getItem(WORK_ORDERS_KEY);
  const orders: WorkOrder[] = data ? JSON.parse(data) : [];
  return orders.filter(wo => wo.customerId === customerId);
}

// Customer Dashboard Service
export const customerDashboardService = {
  // Get complete customer dashboard data
  async getCustomerDashboard(customerId: string): Promise<CustomerDashboard | null> {
    const customers = await crmService.getCustomers();
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return null;

    const salesSummary = this.calculateSalesSummary(customerId);
    const financialSummary = this.calculateFinancialSummary(customerId, customer);
    const recentDocuments = this.getRecentDocuments(customerId);
    const journeyEntries = await this.getJourneyEntries(customerId);
    const allInteractions = await crmService.getInteractions({ customerId });
    const recentInteractions = allInteractions.slice(0, 5); // Last 5 interactions
    const allTasks = await crmService.getTasks({ customerId });
    const openTasks = allTasks.filter(task => task.status !== 'done');


    return {
      customer,
      salesSummary,
      financialSummary,
      recentDocuments,
      journeyEntries,
      recentInteractions,
      openTasks,
    };
  },

  // Calculate sales summary for a customer
  calculateSalesSummary(customerId: string): CustomerSalesSummary {
    const invoices = getInvoicesByCustomer(customerId);
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');

    const totalSales = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalOrders = paidInvoices.length;
    const averageSalePerOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Get last sale date
    const lastSaleDate = paidInvoices.length > 0
      ? paidInvoices.sort((a, b) => new Date(b.paidDate || b.date).getTime() - new Date(a.paidDate || a.date).getTime())[0].paidDate || paidInvoices[0].date
      : undefined;

    // Calculate trend (compare last 3 months with previous 3 months)
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

    const recentSales = paidInvoices.filter(inv => {
      const date = new Date(inv.paidDate || inv.date);
      return date >= threeMonthsAgo;
    }).reduce((sum, inv) => sum + inv.amount, 0);

    const previousSales = paidInvoices.filter(inv => {
      const date = new Date(inv.paidDate || inv.date);
      return date >= sixMonthsAgo && date < threeMonthsAgo;
    }).reduce((sum, inv) => sum + inv.amount, 0);

    let trend: 'up' | 'down' | 'stable' = 'stable';
    let trendPercentage = 0;

    if (previousSales > 0) {
      trendPercentage = ((recentSales - previousSales) / previousSales) * 100;
      if (trendPercentage > 5) trend = 'up';
      else if (trendPercentage < -5) trend = 'down';
    } else if (recentSales > 0) {
      trend = 'up';
      trendPercentage = 100;
    }

    return {
      customerId,
      totalSales,
      averageSalePerOrder,
      lastSaleDate,
      totalOrders,
      trend,
      trendPercentage,
    };
  },

  // Calculate financial summary for a customer
  calculateFinancialSummary(customerId: string, customer: Customer): CustomerFinancialSummary {
    const invoices = getInvoicesByCustomer(customerId);
    
    // Calculate outstanding balance
    const outstandingBalance = invoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Calculate overdue amount
    const now = new Date();
    const overdueAmount = invoices
      .filter(inv => {
        if (inv.status !== 'sent' && inv.status !== 'overdue') return false;
        return new Date(inv.dueDate) < now;
      })
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Get credit limit and calculate usage
    const creditLimit = customer.creditLimit || 0;
    const creditUsed = outstandingBalance;

    // Get last payment date
    const paidInvoices = invoices
      .filter(inv => inv.status === 'paid' && inv.paidDate)
      .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime());
    const lastPaymentDate = paidInvoices.length > 0 ? paidInvoices[0].paidDate : undefined;

    // Calculate average payment days
    const paymentsWithDays = paidInvoices
      .filter(inv => inv.paidDate)
      .map(inv => {
        const invoiceDate = new Date(inv.date);
        const paidDate = new Date(inv.paidDate!);
        return Math.floor((paidDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
      });
    const averagePaymentDays = paymentsWithDays.length > 0
      ? Math.round(paymentsWithDays.reduce((sum, days) => sum + days, 0) / paymentsWithDays.length)
      : 0;

    return {
      customerId,
      outstandingBalance,
      creditLimit,
      creditUsed,
      paymentTerms: customer.paymentTerms || 30,
      overdueAmount,
      lastPaymentDate,
      averagePaymentDays,
    };
  },

  // Get recent documents for a customer
  getRecentDocuments(customerId: string, limit: number = 10): CustomerDocument[] {
    const invoices = getInvoicesByCustomer(customerId);
    const quotes = getQuotesByCustomer(customerId);
    const workOrders = getWorkOrdersByCustomer(customerId);

    const documents: CustomerDocument[] = [];

    // Add invoices
    invoices.forEach(inv => {
      documents.push({
        id: inv.id,
        customerId,
        type: 'invoice',
        documentNumber: inv.invoiceNumber,
        title: `Invoice ${inv.invoiceNumber}`,
        date: inv.date,
        amount: inv.amount,
        status: inv.status,
        createdAt: inv.date,
        updatedAt: inv.date,
      });
    });

    // Add quotes
    quotes.forEach(quote => {
      documents.push({
        id: quote.id,
        customerId,
        type: 'quote',
        documentNumber: quote.quoteNumber,
        title: `Quote ${quote.quoteNumber}`,
        date: quote.date,
        amount: quote.amount,
        status: quote.status === 'accepted' ? 'paid' : quote.status === 'rejected' ? 'cancelled' : quote.status,
        createdAt: quote.date,
        updatedAt: quote.date,
      });
    });

    // Add work orders
    workOrders.forEach(wo => {
      documents.push({
        id: wo.id,
        customerId,
        type: 'work_order',
        documentNumber: wo.orderNumber,
        title: `Work Order ${wo.orderNumber}`,
        date: wo.date,
        status: wo.status === 'completed' ? 'paid' : wo.status === 'cancelled' ? 'cancelled' : 'draft',
        createdAt: wo.date,
        updatedAt: wo.date,
      });
    });

    // Sort by date (most recent first) and limit
    return documents
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  // Get customer journey entries
  async getJourneyEntries(customerId: string, limit: number = 50): Promise<CustomerJourneyEntry[]> {
    const entries: CustomerJourneyEntry[] = [];

    // Add interactions
    const interactions = await crmService.getInteractions({ customerId });
    interactions.forEach(interaction => {
      entries.push({
        id: `journey_interaction_${interaction.id}`,
        customerId,
        type: 'interaction',
        title: `${interaction.type.toUpperCase()}: ${interaction.subject}`,
        description: interaction.description,
        date: interaction.date,
        employeeId: interaction.employeeId,
        relatedId: interaction.id,
        createdAt: interaction.createdAt,
      });
    });

    // Add invoices
    const invoices = getInvoicesByCustomer(customerId);
    invoices.forEach(inv => {
      entries.push({
        id: `journey_invoice_${inv.id}`,
        customerId,
        type: 'invoice',
        title: `Invoice ${inv.invoiceNumber}`,
        description: `Invoice ${inv.status}`,
        date: inv.date,
        amount: inv.amount,
        status: inv.status,
        relatedId: inv.id,
        createdAt: inv.date,
      });

      // Add payment entry if paid
      if (inv.status === 'paid' && inv.paidDate) {
        entries.push({
          id: `journey_payment_${inv.id}`,
          customerId,
          type: 'payment',
          title: `Payment Received`,
          description: `Payment for Invoice ${inv.invoiceNumber}`,
          date: inv.paidDate,
          amount: inv.amount,
          status: 'paid',
          relatedId: inv.id,
          createdAt: inv.paidDate,
        });
      }
    });

    // Add quotes
    const quotes = getQuotesByCustomer(customerId);
    quotes.forEach(quote => {
      entries.push({
        id: `journey_quote_${quote.id}`,
        customerId,
        type: 'quote',
        title: `Quote ${quote.quoteNumber}`,
        description: `Quote ${quote.status}`,
        date: quote.date,
        amount: quote.amount,
        status: quote.status,
        relatedId: quote.id,
        createdAt: quote.date,
      });
    });

    // Add work orders
    const workOrders = getWorkOrdersByCustomer(customerId);
    workOrders.forEach(wo => {
      entries.push({
        id: `journey_workorder_${wo.id}`,
        customerId,
        type: 'work_order',
        title: `Work Order ${wo.orderNumber}`,
        description: wo.description,
        date: wo.date,
        status: wo.status,
        relatedId: wo.id,
        createdAt: wo.date,
      });
    });

    // Sort by date (most recent first) and limit
    return entries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  // Get customer activity summary
  async getActivitySummary(customerId: string, days: number = 30): Promise<{
    totalInteractions: number;
    totalInvoices: number;
    totalQuotes: number;
    totalWorkOrders: number;
    lastActivityDate: string | undefined;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const allInteractions = await crmService.getInteractions({ customerId });
    const interactions = allInteractions.filter(i => new Date(i.date) >= cutoffDate);

    const invoices = getInvoicesByCustomer(customerId)
      .filter(inv => new Date(inv.date) >= cutoffDate);

    const quotes = getQuotesByCustomer(customerId)
      .filter(q => new Date(q.date) >= cutoffDate);

    const workOrders = getWorkOrdersByCustomer(customerId)
      .filter(wo => new Date(wo.date) >= cutoffDate);

    // Get last activity date
    const allDates = [
      ...interactions.map(i => i.date),
      ...invoices.map(inv => inv.date),
      ...quotes.map(q => q.date),
      ...workOrders.map(wo => wo.date),
    ];

    const lastActivityDate = allDates.length > 0
      ? allDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
      : undefined;

    return {
      totalInteractions: interactions.length,
      totalInvoices: invoices.length,
      totalQuotes: quotes.length,
      totalWorkOrders: workOrders.length,
      lastActivityDate,
    };
  },
};

// Export helper functions for creating mock data (for testing)
export const mockDataHelpers = {
  createMockInvoice(customerId: string, amount: number, status: Invoice['status'] = 'sent'): Invoice {
    const invoices = getInvoicesByCustomer(customerId);
    const invoiceNumber = `INV-${String(invoices.length + 1).padStart(5, '0')}`;
    
    const invoice: Invoice = {
      id: `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      invoiceNumber,
      date: new Date().toISOString(),
      amount,
      status,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      paidDate: status === 'paid' ? new Date().toISOString() : undefined,
    };

    const allInvoices = JSON.parse(localStorage.getItem(INVOICES_KEY) || '[]');
    allInvoices.push(invoice);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(allInvoices));

    return invoice;
  },

  createMockQuote(customerId: string, amount: number, status: Quote['status'] = 'sent'): Quote {
    const quotes = getQuotesByCustomer(customerId);
    const quoteNumber = `QUO-${String(quotes.length + 1).padStart(5, '0')}`;
    
    const quote: Quote = {
      id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      quoteNumber,
      date: new Date().toISOString(),
      amount,
      status,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };

    const allQuotes = JSON.parse(localStorage.getItem(QUOTES_KEY) || '[]');
    allQuotes.push(quote);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(allQuotes));

    return quote;
  },
};
