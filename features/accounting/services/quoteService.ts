// features/accounting/services/quoteService.ts - Refactored < 250 lines
import type { Quote, QuoteItem, QuoteLabor, QuoteHistoryEntry, User, Employee } from '../../../types';
import { calculateQuoteTotals } from '../utils/calculations';
import { validateQuoteForm } from '../utils/validators';
import { createHistoryEntry, getEmployeeName, getCustomerName } from '../utils/helpers';

/**
 * Quote form data interface
 */
export interface CreateQuoteData {
  customerId: string;
  items: QuoteItem[];
  labor: QuoteLabor[];
  vatRate: number;
  notes: string;
  validUntil: string;
}

/**
 * Create a new quote
 */
export const createQuote = (
  data: CreateQuoteData,
  currentUser: User,
  employees: Employee[],
  customers: any[],
  existingQuotes: Quote[] = []
): Quote => {
  const validation = validateQuoteForm({
    customerId: data.customerId,
    items: data.items,
    validUntil: data.validUntil,
    vatRate: data.vatRate,
    notes: data.notes,
  });

  if (!validation.isValid) {
    throw new Error(validation.message || 'Invalid quote data');
  }

  const { subtotal, vatAmount, total } = calculateQuoteTotals(data.items, data.labor, data.vatRate);

  const now = new Date().toISOString();
  const customerName = getCustomerName(data.customerId, customers);
  const id = `Q${Date.now()}`;

  const quote: Quote = {
    id,
    customerId: data.customerId,
    items: data.items,
    labor: data.labor.length > 0 ? data.labor : undefined,
    subtotal,
    vatRate: data.vatRate,
    vatAmount,
    total,
    status: 'draft',
    createdDate: new Date().toISOString().split('T')[0],
    validUntil: data.validUntil,
    notes: data.notes,
    createdBy: currentUser.employeeId,
    timestamps: {
      created: now,
    },
    history: [
      createHistoryEntry(
        'quote',
        'created',
        `Offerte aangemaakt door ${getEmployeeName(currentUser.employeeId, employees)} voor klant ${customerName}`,
        currentUser
      ) as QuoteHistoryEntry,
    ],
  };

  return quote;
};

/**
 * Update an existing quote
 */
export const updateQuote = (
  quoteId: string,
  data: CreateQuoteData,
  existingQuote: Quote,
  currentUser: User,
  employees: Employee[]
): Quote => {
  const validation = validateQuoteForm({
    customerId: data.customerId,
    items: data.items,
    validUntil: data.validUntil,
    vatRate: data.vatRate,
    notes: data.notes,
  });

  if (!validation.isValid) {
    throw new Error(validation.message || 'Invalid quote data');
  }

  const { subtotal, vatAmount, total } = calculateQuoteTotals(data.items, data.labor, data.vatRate);

  const updatedQuote: Quote = {
    ...existingQuote,
    customerId: data.customerId,
    items: data.items,
    labor: data.labor.length > 0 ? data.labor : undefined,
    subtotal,
    vatRate: data.vatRate,
    vatAmount,
    total,
    validUntil: data.validUntil,
    notes: data.notes,
    history: [
      ...(existingQuote.history || []),
      createHistoryEntry(
        'quote',
        'updated',
        `Offerte bijgewerkt door ${getEmployeeName(currentUser.employeeId, employees)}`,
        currentUser
      ) as QuoteHistoryEntry,
    ],
  };

  return updatedQuote;
};

/**
 * Update quote status
 */
export const updateQuoteStatus = (
  quote: Quote,
  newStatus: Quote['status'],
  currentUser: User,
  employees: Employee[]
): Quote => {
  const now = new Date().toISOString();
  const oldStatus = quote.status;

  const updates: Partial<Quote> = {
    status: newStatus,
    history: [
      ...(quote.history || []),
      createHistoryEntry(
        'quote',
        newStatus,
        `Status gewijzigd van "${oldStatus}" naar "${newStatus}" door ${getEmployeeName(currentUser.employeeId, employees)}`,
        currentUser,
        { fromStatus: oldStatus, toStatus: newStatus }
      ) as QuoteHistoryEntry,
    ],
  };

  // Update timestamps
  if (!quote.timestamps) {
    updates.timestamps = { created: quote.createdDate };
  } else {
    updates.timestamps = { ...quote.timestamps };
  }

  if (newStatus === 'sent' && !updates.timestamps!.sent) {
    updates.timestamps!.sent = now;
  } else if (newStatus === 'approved' && !updates.timestamps!.approved) {
    updates.timestamps!.approved = now;
  }

  return { ...quote, ...updates };
};

/**
 * Delete a quote (returns filtered array)
 */
export const deleteQuote = (quoteId: string, quotes: Quote[]): Quote[] => {
  return quotes.filter((q) => q.id !== quoteId);
};

/**
 * Clone a quote
 */
export const cloneQuote = (quote: Quote, currentUser: User, employees: Employee[], customers: any[]): Quote => {
  const now = new Date().toISOString();
  const customerName = getCustomerName(quote.customerId, customers);

  const clonedQuote: Quote = {
    id: `Q${Date.now()}`,
    customerId: quote.customerId,
    items: quote.items.map((item) => ({ ...item })),
    labor: quote.labor ? quote.labor.map((l) => ({ ...l })) : undefined,
    subtotal: quote.subtotal,
    vatRate: quote.vatRate,
    vatAmount: quote.vatAmount,
    total: quote.total,
    status: 'draft',
    createdDate: new Date().toISOString().split('T')[0],
    validUntil: quote.validUntil,
    notes: quote.notes || '',
    createdBy: currentUser.employeeId,
    timestamps: {
      created: now,
    },
    history: [
      createHistoryEntry(
        'quote',
        'created',
        `Offerte gecloneerd door ${getEmployeeName(currentUser.employeeId, employees)} voor klant ${customerName}`,
        currentUser
      ) as QuoteHistoryEntry,
    ],
  };

  return clonedQuote;
};

// Re-export workflow functions for backward compatibility
export { convertQuoteToInvoice, syncQuoteToWorkOrder } from './quoteWorkflowService';
