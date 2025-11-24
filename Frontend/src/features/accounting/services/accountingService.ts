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

  // Convert completed work order to invoice (Poka-Yoke #2 - Automatic Invoice Creation)
  convertWorkOrderToInvoice: async (workOrderId: string, providedWorkOrder?: any): Promise<Invoice | null> => {
    // Import work order service dynamically to avoid circular dependency
    const { workOrderService } = await import('@/features/work-orders/services/workOrderService');
    // Use provided work order if available (to avoid fetching stale data), otherwise fetch it
    const workOrder = providedWorkOrder || await workOrderService.getById(workOrderId);
    if (!workOrder) throw new Error('Work order not found');

    // Check if invoice already exists (Poka-Yoke #5 - Duplicate Prevention)
    if (workOrder.invoiceId) {
      const existingInvoice = INVOICES.find(i => i.id === workOrder.invoiceId);
      if (existingInvoice) {
        // Update existing invoice with actual hours/materials
        return await accountingService.updateInvoiceFromWorkOrder(existingInvoice.id, workOrderId);
      }
    }

    // Check if work order is completed
    if (workOrder.status !== 'completed') {
      throw new Error('Work order must be completed before creating invoice');
    }

    // Validate required fields
    if (!workOrder.customerId) {
      throw new Error('Work order must have a customer assigned');
    }

    // Create invoice from work order
    const userInfo = getUserInfo();
    const generalNumber = getNextGeneralNumber();
    const invoiceNumber = getNextFactuurNumber();
    const now = new Date().toISOString();
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 14 days default

    // Convert materials to line items
    const items: LineItem[] = workOrder.materials?.map((material, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      description: material.name,
      quantity: material.quantity,
      unitPrice: 0, // Will need to get from inventory
      vatRate: 21, // Default VAT rate
      discount: 0,
      total: 0, // Will need to calculate
      inventoryItemId: material.inventoryItemId,
    })) || [];

    // Convert hours to labor items
    const labor: LaborItem[] = workOrder.hoursSpent > 0 ? [{
      id: `labor-${Date.now()}`,
      description: 'Uren gewerkt',
      hours: workOrder.hoursSpent,
      hourlyRate: workOrder.estimatedCost / (workOrder.estimatedHours || workOrder.hoursSpent || 1), // Calculate rate
      total: workOrder.hoursSpent * (workOrder.estimatedCost / (workOrder.estimatedHours || workOrder.hoursSpent || 1)),
    }] : [];

    // Calculate totals
    const itemsSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    const laborSubtotal = labor.reduce((sum, l) => sum + l.total, 0);
    const subtotal = itemsSubtotal + laborSubtotal || workOrder.estimatedCost;
    const totalVat = subtotal * 0.21; // Default 21% VAT
    const total = subtotal + totalVat;

    const newInvoice: Invoice = {
      id: `invoice-${Date.now()}`,
      generalNumber,
      invoiceNumber,
      customerId: workOrder.customerId,
      customerName: workOrder.customerName || '',
      customerEmail: undefined,
      status: 'draft',
      items,
      labor: labor.length > 0 ? labor : undefined,
      subtotal,
      totalVat,
      total,
      issueDate: now,
      dueDate,
      paymentTerms: '14 dagen',
      notes: workOrder.notes || `Factuur gegenereerd vanuit werkorder ${workOrder.workOrderNumber}`,
      location: workOrder.location,
      scheduledDate: workOrder.scheduledDate,
      createdAt: now,
      updatedAt: now,
      workOrderId: workOrder.id,
      quoteId: workOrder.quoteId,
      reminders: {
        reminder1Date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        reminder2Date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      journey: [
        createJourneyEntry('created', userInfo.userId, userInfo.userName, 'Created', `Factuur ${invoiceNumber} automatisch aangemaakt vanuit werkorder ${workOrder.workOrderNumber}`, { generalNumber, invoiceNumber, workOrderId: workOrder.id })
      ],
      createdBy: userInfo.userId,
      createdByName: userInfo.userName,
    };

    INVOICES.push(newInvoice);
    saveInvoices();

    // Update work order with invoice ID
    await workOrderService.update(workOrderId, { invoiceId: newInvoice.id }, userInfo.userId, userInfo.userName);

    // Update quote status if linked (Poka-Yoke #9)
    if (workOrder.quoteId) {
      const quote = QUOTES.find(q => q.id === workOrder.quoteId);
      if (quote) {
        await accountingService.updateQuote(workOrder.quoteId, { 
          status: 'invoiced',
          invoiceId: newInvoice.id,
        });
      }
    }

    // Log activity
    logActivityHelper(
      'factuur_auto_created',
      'factuur',
      newInvoice.id,
      'created',
      `Factuur ${invoiceNumber} automatisch aangemaakt vanuit werkorder ${workOrder.workOrderNumber}`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Factuur ${invoiceNumber}`,
      undefined,
      { generalNumber, invoiceNumber, workOrderId: workOrder.id, autoCreated: true }
    );

    return newInvoice;
  },

  // Update existing invoice with work order data
  updateInvoiceFromWorkOrder: async (invoiceId: string, workOrderId: string): Promise<Invoice> => {
    const invoice = INVOICES.find(i => i.id === invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const { workOrderService } = await import('@/features/work-orders/services/workOrderService');
    const workOrder = await workOrderService.getById(workOrderId);
    if (!workOrder) throw new Error('Work order not found');

    const userInfo = getUserInfo();

    // Update labor with actual hours
    const updatedLabor: LaborItem[] = invoice.labor?.map(l => ({
      ...l,
      hours: workOrder.hoursSpent || l.hours,
      total: (workOrder.hoursSpent || l.hours) * l.hourlyRate,
    })) || [];

    // Recalculate totals
    const itemsSubtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    const laborSubtotal = updatedLabor.reduce((sum, l) => sum + l.total, 0);
    const subtotal = itemsSubtotal + laborSubtotal;
    const totalVat = subtotal * 0.21;
    const total = subtotal + totalVat;

    const updated: Invoice = {
      ...invoice,
      labor: updatedLabor.length > 0 ? updatedLabor : undefined,
      subtotal,
      totalVat,
      total,
      updatedAt: new Date().toISOString(),
      journey: addJourneyEntry(invoice.journey || [], createJourneyEntry(
        'updated',
        userInfo.userId,
        userInfo.userName,
        'Updated',
        `Factuur bijgewerkt met werkelijke uren (${workOrder.hoursSpent}u) van werkorder ${workOrder.workOrderNumber}`,
        { workOrderId: workOrder.id, hoursSpent: workOrder.hoursSpent }
      )),
    };

    const index = INVOICES.findIndex(i => i.id === invoiceId);
    INVOICES[index] = updated;
    saveInvoices();

    return updated;
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

  // Clone functionality
  cloneQuote: async (quoteId: string): Promise<Quote> => {
    const quote = QUOTES.find(q => q.id === quoteId);
    if (!quote) throw new Error('Quote not found');

    const userInfo = getUserInfo();
    const generalNumber = getNextGeneralNumber();
    const quoteNumber = getNextOfferteNumber();
    const now = new Date().toISOString();
    
    const clonedQuote: Quote = {
      ...quote,
      id: `quote-${Date.now()}`,
      generalNumber,
      quoteNumber,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      sentAt: undefined,
      acceptedAt: undefined,
      workOrderId: undefined,
      createdBy: userInfo.userId,
      createdByName: userInfo.userName,
      journey: [
        createJourneyEntry('created', userInfo.userId, userInfo.userName, 'Cloned', `Offerte ${quoteNumber} gekloond van ${quote.quoteNumber}`, { generalNumber, quoteNumber, clonedFrom: quote.id })
      ],
    };
    
    QUOTES.push(clonedQuote);
    saveQuotes();
    
    logActivityHelper(
      'offerte_cloned',
      'offerte',
      clonedQuote.id,
      'created',
      `Offerte ${quoteNumber} gekloond van ${quote.quoteNumber}`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Offerte ${quoteNumber}`,
      undefined,
      { generalNumber, quoteNumber, clonedFrom: quote.id }
    );
    
    return clonedQuote;
  },

  cloneInvoice: async (invoiceId: string): Promise<Invoice> => {
    const invoice = INVOICES.find(i => i.id === invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const userInfo = getUserInfo();
    const generalNumber = getNextGeneralNumber();
    const invoiceNumber = getNextFactuurNumber();
    const now = new Date().toISOString();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const clonedInvoice: Invoice = {
      ...invoice,
      id: `invoice-${Date.now()}`,
      generalNumber,
      invoiceNumber,
      status: 'draft',
      issueDate: now,
      dueDate,
      createdAt: now,
      updatedAt: now,
      sentAt: undefined,
      paidAt: undefined,
      paidDate: undefined,
      workOrderId: undefined,
      quoteId: undefined,
      createdBy: userInfo.userId,
      createdByName: userInfo.userName,
      journey: [
        createJourneyEntry('created', userInfo.userId, userInfo.userName, 'Cloned', `Factuur ${invoiceNumber} gekloond van ${invoice.invoiceNumber}`, { generalNumber, invoiceNumber, clonedFrom: invoice.id })
      ],
    };
    
    INVOICES.push(clonedInvoice);
    saveInvoices();
    
    logActivityHelper(
      'factuur_cloned',
      'factuur',
      clonedInvoice.id,
      'created',
      `Factuur ${invoiceNumber} gekloond van ${invoice.invoiceNumber}`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Factuur ${invoiceNumber}`,
      undefined,
      { generalNumber, invoiceNumber, clonedFrom: invoice.id }
    );
    
    return clonedInvoice;
  },

  cloneAsQuote: async (sourceId: string, sourceType: 'quote' | 'invoice' | 'workorder'): Promise<Quote> => {
    if (sourceType === 'quote') {
      return accountingService.cloneQuote(sourceId);
    } else if (sourceType === 'invoice') {
      const invoice = INVOICES.find(i => i.id === sourceId);
      if (!invoice) throw new Error('Invoice not found');

      const userInfo = getUserInfo();
      const generalNumber = getNextGeneralNumber();
      const quoteNumber = getNextOfferteNumber();
      const now = new Date().toISOString();
      const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const newQuote: Quote = {
        id: `quote-${Date.now()}`,
        generalNumber,
        quoteNumber,
        customerId: invoice.customerId,
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        status: 'draft',
        items: invoice.items,
        labor: invoice.labor,
        subtotal: invoice.subtotal,
        totalVat: invoice.totalVat,
        total: invoice.total,
        validUntil,
        notes: invoice.notes,
        location: invoice.location,
        scheduledDate: invoice.scheduledDate,
        createdAt: now,
        updatedAt: now,
        createdBy: userInfo.userId,
        createdByName: userInfo.userName,
        journey: [
          createJourneyEntry('created', userInfo.userId, userInfo.userName, 'Cloned', `Offerte ${quoteNumber} gekloond van factuur ${invoice.invoiceNumber}`, { generalNumber, quoteNumber, clonedFrom: invoice.id })
        ],
      };
      
      QUOTES.push(newQuote);
      saveQuotes();
      
      logActivityHelper(
        'offerte_cloned',
        'offerte',
        newQuote.id,
        'created',
        `Offerte ${quoteNumber} gekloond van factuur ${invoice.invoiceNumber}`,
        userInfo.userId,
        userInfo.userName,
        userInfo.userEmail,
        `Offerte ${quoteNumber}`,
        undefined,
        { generalNumber, quoteNumber, clonedFrom: invoice.id }
      );
      
      return newQuote;
    } else {
      // From work order - would need work order service
      throw new Error('Cloning from work order not yet implemented');
    }
  },

  cloneAsInvoice: async (sourceId: string, sourceType: 'quote' | 'invoice' | 'workorder'): Promise<Invoice> => {
    if (sourceType === 'invoice') {
      return accountingService.cloneInvoice(sourceId);
    } else if (sourceType === 'quote') {
      const quote = QUOTES.find(q => q.id === sourceId);
      if (!quote) throw new Error('Quote not found');

      const userInfo = getUserInfo();
      const generalNumber = getNextGeneralNumber();
      const invoiceNumber = getNextFactuurNumber();
      const now = new Date().toISOString();
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const newInvoice: Invoice = {
        id: `invoice-${Date.now()}`,
        generalNumber,
        invoiceNumber,
        customerId: quote.customerId,
        customerName: quote.customerName,
        customerEmail: quote.customerEmail,
        status: 'draft',
        items: quote.items,
        labor: quote.labor,
        subtotal: quote.subtotal,
        totalVat: quote.totalVat,
        total: quote.total,
        issueDate: now,
        dueDate,
        notes: quote.notes,
        location: quote.location,
        scheduledDate: quote.scheduledDate,
        createdAt: now,
        updatedAt: now,
        quoteId: quote.id,
        createdBy: userInfo.userId,
        createdByName: userInfo.userName,
        journey: [
          createJourneyEntry('created', userInfo.userId, userInfo.userName, 'Cloned', `Factuur ${invoiceNumber} gekloond van offerte ${quote.quoteNumber}`, { generalNumber, invoiceNumber, clonedFrom: quote.id })
        ],
      };
      
      INVOICES.push(newInvoice);
      saveInvoices();
      
      logActivityHelper(
        'factuur_cloned',
        'factuur',
        newInvoice.id,
        'created',
        `Factuur ${invoiceNumber} gekloond van offerte ${quote.quoteNumber}`,
        userInfo.userId,
        userInfo.userName,
        userInfo.userEmail,
        `Factuur ${invoiceNumber}`,
        undefined,
        { generalNumber, invoiceNumber, clonedFrom: quote.id }
      );
      
      return newInvoice;
    } else {
      // From work order
      try {
        const { workOrderService } = await import('@/features/work-orders/services/workOrderService');
        const workOrder = await workOrderService.getById(sourceId);
        if (!workOrder) {
          throw new Error('Work order not found');
        }

        const userInfo = getUserInfo();
        const generalNumber = getNextGeneralNumber();
        const invoiceNumber = getNextFactuurNumber();
        const now = new Date().toISOString();
        const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        // Validate required fields
        if (!workOrder.customerId) {
          throw new Error('Work order must have a customer assigned');
        }

        // Convert materials to line items
        const items: LineItem[] = workOrder.materials?.map((material, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          description: material.name,
          quantity: material.quantity,
          unitPrice: 0, // Will need to get from inventory
          vatRate: 21, // Default VAT rate
          discount: 0,
          total: 0, // Will need to calculate
          inventoryItemId: material.inventoryItemId,
        })) || [];

        // Convert hours to labor items
        const hoursToUse = workOrder.hoursSpent > 0 ? workOrder.hoursSpent : workOrder.estimatedHours;
        const labor: LaborItem[] = hoursToUse > 0 ? [{
          id: `labor-${Date.now()}`,
          description: 'Uren gewerkt',
          hours: hoursToUse,
          hourlyRate: workOrder.estimatedCost / (workOrder.estimatedHours || hoursToUse || 1),
          total: hoursToUse * (workOrder.estimatedCost / (workOrder.estimatedHours || hoursToUse || 1)),
        }] : [];

        // Calculate totals
        const itemsSubtotal = items.reduce((sum, item) => sum + item.total, 0);
        const laborSubtotal = labor.reduce((sum, l) => sum + l.total, 0);
        const subtotal = itemsSubtotal + laborSubtotal || workOrder.estimatedCost;
        const totalVat = subtotal * 0.21; // Default 21% VAT
        const total = subtotal + totalVat;

        const newInvoice: Invoice = {
          id: `invoice-${Date.now()}`,
          generalNumber,
          invoiceNumber,
          customerId: workOrder.customerId,
          customerName: workOrder.customerName || '',
          customerEmail: undefined,
          status: 'draft',
          items,
          labor: labor.length > 0 ? labor : undefined,
          subtotal,
          totalVat,
          total,
          issueDate: now,
          dueDate,
          paymentTerms: '14 dagen',
          notes: workOrder.notes || `Factuur gekloond van werkorder ${workOrder.workOrderNumber}`,
          location: workOrder.location,
          scheduledDate: workOrder.scheduledDate,
          createdAt: now,
          updatedAt: now,
          workOrderId: workOrder.id,
          quoteId: workOrder.quoteId,
          reminders: {
            reminder1Date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            reminder2Date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          },
          journey: [
            createJourneyEntry('created', userInfo.userId, userInfo.userName, 'Cloned', `Factuur ${invoiceNumber} gekloond van werkorder ${workOrder.workOrderNumber}`, { generalNumber, invoiceNumber, clonedFrom: workOrder.id })
          ],
          createdBy: userInfo.userId,
          createdByName: userInfo.userName,
        };

        INVOICES.push(newInvoice);
        saveInvoices();

        logActivityHelper(
          'factuur_cloned',
          'factuur',
          newInvoice.id,
          'created',
          `Factuur ${invoiceNumber} gekloond van werkorder ${workOrder.workOrderNumber}`,
          userInfo.userId,
          userInfo.userName,
          userInfo.userEmail,
          `Factuur ${invoiceNumber}`,
          undefined,
          { generalNumber, invoiceNumber, clonedFrom: workOrder.id }
        );

        return newInvoice;
      } catch (error) {
        console.error('Error cloning work order as invoice:', error);
        // Ensure we always throw a proper Error object
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(typeof error === 'string' ? error : 'Failed to clone work order as invoice');
      }
    }
  },
};
