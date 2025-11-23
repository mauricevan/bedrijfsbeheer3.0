import type { Quote, Invoice } from '../types';
import { storage } from '@/utils/storage';

const QUOTES_KEY = 'bedrijfsbeheer_quotes';
const INVOICES_KEY = 'bedrijfsbeheer_invoices';

const DEFAULT_QUOTES: Quote[] = [];
const DEFAULT_INVOICES: Invoice[] = [];

let QUOTES = storage.get<Quote[]>(QUOTES_KEY, DEFAULT_QUOTES);
let INVOICES = storage.get<Invoice[]>(INVOICES_KEY, DEFAULT_INVOICES);

const saveQuotes = () => storage.set(QUOTES_KEY, QUOTES);
const saveInvoices = () => storage.set(INVOICES_KEY, INVOICES);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateQuoteNumber = () => {
  const year = new Date().getFullYear();
  const count = QUOTES.length + 1;
  return `OFF-${year}-${count.toString().padStart(4, '0')}`;
};

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const count = INVOICES.length + 1;
  return `FACT-${year}-${count.toString().padStart(4, '0')}`;
};

export const accountingService = {
  // Quotes
  getQuotes: async (): Promise<Quote[]> => {
    await delay(500);
    return [...QUOTES];
  },

  createQuote: async (data: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt'>): Promise<Quote> => {
    await delay(800);
    const newQuote: Quote = {
      ...data,
      id: `quote-${Date.now()}`,
      quoteNumber: generateQuoteNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    QUOTES.push(newQuote);
    saveQuotes();
    return newQuote;
  },

  updateQuote: async (id: string, updates: Partial<Quote>): Promise<Quote> => {
    await delay(500);
    const index = QUOTES.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quote not found');
    
    const updated = {
      ...QUOTES[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    QUOTES[index] = updated;
    saveQuotes();
    return updated;
  },

  deleteQuote: async (id: string): Promise<void> => {
    await delay(500);
    QUOTES = QUOTES.filter(q => q.id !== id);
    saveQuotes();
  },

  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    await delay(500);
    return [...INVOICES];
  },

  createInvoice: async (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
    await delay(800);
    const newInvoice: Invoice = {
      ...data,
      id: `invoice-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    INVOICES.push(newInvoice);
    saveInvoices();
    return newInvoice;
  },

  updateInvoice: async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
    await delay(500);
    const index = INVOICES.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Invoice not found');
    
    const updated = {
      ...INVOICES[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    INVOICES[index] = updated;
    saveInvoices();
    return updated;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await delay(500);
    INVOICES = INVOICES.filter(i => i.id !== id);
    saveInvoices();
  },

  // Conversion
  convertQuoteToInvoice: async (quoteId: string): Promise<Invoice> => {
    const quote = QUOTES.find(q => q.id === quoteId);
    if (!quote) throw new Error('Quote not found');

    const invoice = await accountingService.createInvoice({
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      status: 'draft',
      items: quote.items,
      labor: quote.labor,
      subtotal: quote.subtotal,
      totalVat: quote.totalVat,
      total: quote.total,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: quote.notes,
      location: quote.location,
      scheduledDate: quote.scheduledDate,
      quoteId: quote.id,
    });

    await accountingService.updateQuote(quoteId, { status: 'invoiced' });
    return invoice;
  },

  convertQuoteToWorkOrder: async (quoteId: string, _employeeId: string): Promise<{ quote: Quote; workOrderId: string }> => {
    const quote = QUOTES.find(q => q.id === quoteId);
    if (!quote) throw new Error('Quote not found');
    
    // This will be handled by work order service
    const workOrderId = `wo-${Date.now()}`;
    await accountingService.updateQuote(quoteId, { workOrderId, status: 'accepted' });
    
    return { quote, workOrderId };
  },

  convertInvoiceToWorkOrder: async (invoiceId: string, _employeeId: string): Promise<{ invoice: Invoice; workOrderId: string }> => {
    const invoice = INVOICES.find(i => i.id === invoiceId);
    if (!invoice) throw new Error('Invoice not found');
    
    const workOrderId = `wo-${Date.now()}`;
    await accountingService.updateInvoice(invoiceId, { workOrderId });
    
    return { invoice, workOrderId };
  },

  updateQuoteStatus: async (id: string, status: Quote['status']): Promise<Quote> => {
    const updates: Partial<Quote> = { status };
    if (status === 'sent') {
      updates.sentAt = new Date().toISOString();
    } else if (status === 'accepted') {
      updates.acceptedAt = new Date().toISOString();
    }
    return accountingService.updateQuote(id, updates);
  },

  updateInvoiceStatus: async (id: string, status: Invoice['status']): Promise<Invoice> => {
    const updates: Partial<Invoice> = { status };
    if (status === 'sent') {
      updates.sentAt = new Date().toISOString();
    } else if (status === 'paid') {
      updates.paidAt = new Date().toISOString();
      updates.paidDate = new Date().toISOString();
    }
    return accountingService.updateInvoice(id, updates);
  },
};
