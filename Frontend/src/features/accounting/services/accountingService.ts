import type { Quote, Invoice } from '../types';
import { storage } from '@/utils/storage';
import { getNextGeneralNumber, getNextFactuurNumber, getNextOfferteNumber } from '@/utils/numberGenerator';
import { logActivityHelper } from '@/utils/activityLogger';
import { createJourneyEntry, addJourneyEntry } from '@/features/tracking/services/journeyService';
import { archiveDocument } from '@/features/tracking/services/archiveService';
import { getEntityActivities } from '@/features/tracking/services/activityService';

const QUOTES_KEY = 'bedrijfsbeheer_quotes';
const INVOICES_KEY = 'bedrijfsbeheer_invoices';

const DEFAULT_QUOTES: Quote[] = [];
const DEFAULT_INVOICES: Invoice[] = [];

let QUOTES = storage.get<Quote[]>(QUOTES_KEY, DEFAULT_QUOTES);
let INVOICES = storage.get<Invoice[]>(INVOICES_KEY, DEFAULT_INVOICES);

const saveQuotes = () => storage.set(QUOTES_KEY, QUOTES);
const saveInvoices = () => storage.set(INVOICES_KEY, INVOICES);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get user info from localStorage
const getUserInfo = () => {
  try {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      };
    }
  } catch (error) {
    console.error('Error getting user info:', error);
  }
  return {
    userId: 'unknown',
    userName: 'Unknown User',
    userEmail: 'unknown@example.com',
  };
};

export const accountingService = {
  // Quotes
  getQuotes: async (): Promise<Quote[]> => {
    await delay(500);
    return [...QUOTES];
  },

  createQuote: async (data: Omit<Quote, 'id' | 'quoteNumber' | 'generalNumber' | 'createdAt' | 'updatedAt' | 'journey' | 'createdBy' | 'createdByName'>): Promise<Quote> => {
    await delay(800);
    const userInfo = getUserInfo();
    const generalNumber = getNextGeneralNumber();
    const quoteNumber = getNextOfferteNumber();
    const now = new Date().toISOString();
    
    const newQuote: Quote = {
      ...data,
      id: `quote-${Date.now()}`,
      generalNumber,
      quoteNumber,
      createdAt: now,
      updatedAt: now,
      createdBy: userInfo.userId,
      createdByName: userInfo.userName,
      journey: [
        createJourneyEntry('created', userInfo.userId, userInfo.userName, 'Created', `Offerte ${quoteNumber} aangemaakt`, { generalNumber, quoteNumber })
      ],
    };
    
    QUOTES.push(newQuote);
    saveQuotes();
    
    // Log activity
    logActivityHelper(
      'offerte_created',
      'offerte',
      newQuote.id,
      'created',
      `Offerte ${quoteNumber} aangemaakt voor ${data.customerName}`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Offerte ${quoteNumber}`,
      undefined,
      { generalNumber, quoteNumber, customerId: data.customerId }
    );
    
    return newQuote;
  },

  updateQuote: async (id: string, updates: Partial<Quote>): Promise<Quote> => {
    await delay(500);
    const index = QUOTES.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quote not found');
    
    const userInfo = getUserInfo();
    const existing = QUOTES[index];
    const changes: { field: string; oldValue: unknown; newValue: unknown }[] = [];
    
    // Track changes
    Object.keys(updates).forEach(key => {
      if (key !== 'updatedAt' && key !== 'journey' && (existing as any)[key] !== updates[key as keyof Quote]) {
        changes.push({
          field: key,
          oldValue: (existing as any)[key],
          newValue: updates[key as keyof Quote],
        });
      }
    });
    
    // Update journey if status changed
    let journey = existing.journey || [];
    if (updates.status && updates.status !== existing.status) {
      const stage = updates.status === 'sent' ? 'sent' : updates.status === 'accepted' ? 'completed' : 'draft';
      const action = updates.status === 'sent' ? 'Sent' : updates.status === 'accepted' ? 'Accepted' : 'Updated';
      const description = updates.status === 'sent' 
        ? `Offerte ${existing.quoteNumber} verzonden naar klant`
        : updates.status === 'accepted'
        ? `Offerte ${existing.quoteNumber} geaccepteerd door klant`
        : `Offerte ${existing.quoteNumber} bijgewerkt`;
      
      journey = addJourneyEntry(journey, createJourneyEntry(stage, userInfo.userId, userInfo.userName, action, description, { status: updates.status }));
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      journey,
    };
    QUOTES[index] = updated;
    saveQuotes();
    
    // Log activity
    logActivityHelper(
      'offerte_updated',
      'offerte',
      id,
      'updated',
      `Offerte ${existing.quoteNumber} bijgewerkt`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Offerte ${existing.quoteNumber}`,
      changes.length > 0 ? changes : undefined
    );
    
    return updated;
  },

  deleteQuote: async (id: string): Promise<void> => {
    await delay(500);
    const quote = QUOTES.find(q => q.id === id);
    if (!quote) throw new Error('Quote not found');
    
    const userInfo = getUserInfo();
    const activities = getEntityActivities('offerte', id);
    
    // Archive before deleting
    archiveDocument(
      'offerte',
      quote as any,
      quote.generalNumber || '',
      quote.quoteNumber,
      quote.journey || [],
      activities,
      userInfo.userId,
      userInfo.userName,
      'Deleted by user'
    );
    
    // Log activity
    logActivityHelper(
      'offerte_deleted',
      'offerte',
      id,
      'deleted',
      `Offerte ${quote.quoteNumber} verwijderd`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Offerte ${quote.quoteNumber}`
    );
    
    QUOTES = QUOTES.filter(q => q.id !== id);
    saveQuotes();
  },

  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    await delay(500);
    return [...INVOICES];
  },

  createInvoice: async (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'generalNumber' | 'createdAt' | 'updatedAt' | 'journey' | 'createdBy' | 'createdByName'>): Promise<Invoice> => {
    await delay(800);
    const userInfo = getUserInfo();
    const generalNumber = getNextGeneralNumber();
    const invoiceNumber = getNextFactuurNumber();
    const now = new Date().toISOString();
    
    const newInvoice: Invoice = {
      ...data,
      id: `invoice-${Date.now()}`,
      generalNumber,
      invoiceNumber,
      createdAt: now,
      updatedAt: now,
      createdBy: userInfo.userId,
      createdByName: userInfo.userName,
      journey: [
        createJourneyEntry('created', userInfo.userId, userInfo.userName, 'Created', `Factuur ${invoiceNumber} aangemaakt`, { generalNumber, invoiceNumber })
      ],
    };
    INVOICES.push(newInvoice);
    saveInvoices();
    
    // Log activity
    logActivityHelper(
      'factuur_created',
      'factuur',
      newInvoice.id,
      'created',
      `Factuur ${invoiceNumber} aangemaakt voor ${data.customerName}`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Factuur ${invoiceNumber}`,
      undefined,
      { generalNumber, invoiceNumber, customerId: data.customerId }
    );
    
    return newInvoice;
  },

  updateInvoice: async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
    await delay(500);
    const index = INVOICES.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Invoice not found');
    
    const userInfo = getUserInfo();
    const existing = INVOICES[index];
    const changes: { field: string; oldValue: unknown; newValue: unknown }[] = [];
    
    // Track changes
    Object.keys(updates).forEach(key => {
      if (key !== 'updatedAt' && key !== 'journey' && (existing as any)[key] !== updates[key as keyof Invoice]) {
        changes.push({
          field: key,
          oldValue: (existing as any)[key],
          newValue: updates[key as keyof Invoice],
        });
      }
    });
    
    // Update journey if status changed
    let journey = existing.journey || [];
    if (updates.status && updates.status !== existing.status) {
      const stage = updates.status === 'sent' ? 'sent' : updates.status === 'paid' ? 'paid' : updates.status === 'cancelled' ? 'cancelled' : 'draft';
      const action = updates.status === 'sent' ? 'Sent' : updates.status === 'paid' ? 'Paid' : updates.status === 'cancelled' ? 'Cancelled' : 'Updated';
      const description = updates.status === 'sent' 
        ? `Factuur ${existing.invoiceNumber} verzonden naar klant`
        : updates.status === 'paid'
        ? `Factuur ${existing.invoiceNumber} betaald`
        : updates.status === 'cancelled'
        ? `Factuur ${existing.invoiceNumber} geannuleerd`
        : `Factuur ${existing.invoiceNumber} bijgewerkt`;
      
      journey = addJourneyEntry(journey, createJourneyEntry(stage, userInfo.userId, userInfo.userName, action, description, { status: updates.status }));
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      journey,
    };
    INVOICES[index] = updated;
    saveInvoices();
    
    // Log activity
    logActivityHelper(
      'factuur_updated',
      'factuur',
      id,
      'updated',
      `Factuur ${existing.invoiceNumber} bijgewerkt`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Factuur ${existing.invoiceNumber}`,
      changes.length > 0 ? changes : undefined
    );
    
    return updated;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await delay(500);
    const invoice = INVOICES.find(i => i.id === id);
    if (!invoice) throw new Error('Invoice not found');
    
    const userInfo = getUserInfo();
    const activities = getEntityActivities('factuur', id);
    
    // Archive before deleting
    archiveDocument(
      'factuur',
      invoice as any,
      invoice.generalNumber || '',
      invoice.invoiceNumber,
      invoice.journey || [],
      activities,
      userInfo.userId,
      userInfo.userName,
      'Deleted by user'
    );
    
    // Log activity
    logActivityHelper(
      'factuur_deleted',
      'factuur',
      id,
      'deleted',
      `Factuur ${invoice.invoiceNumber} verwijderd`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Factuur ${invoice.invoiceNumber}`
    );
    
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
