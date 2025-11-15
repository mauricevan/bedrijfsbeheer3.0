// features/accounting/services/quoteWorkflowService.ts - Refactored < 250 lines
import type { Quote, Invoice, QuoteHistoryEntry, WorkOrder, User, Employee } from '../../../types';
import { generateInvoiceNumber } from '../utils/calculations';
import { validateQuoteToInvoice } from '../../../utils/workflowValidation';
import { createHistoryEntry, getEmployeeName } from '../utils/helpers';

/**
 * Convert quote to invoice
 */
export const convertQuoteToInvoice = (
  quote: Quote,
  currentUser: User,
  employees: Employee[],
  invoices: Invoice[] = []
): { invoice: Invoice; updatedQuote: Quote } => {
  const validation = validateQuoteToInvoice(quote, []);
  if (!validation.canProceed) {
    throw new Error(validation.message);
  }

  const issueDate = new Date().toISOString().split('T')[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const now = new Date().toISOString();

  const invoice: Invoice = {
    id: `inv${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(invoices),
    customerId: quote.customerId,
    quoteId: quote.id,
    items: quote.items,
    labor: quote.labor,
    subtotal: quote.subtotal,
    vatRate: quote.vatRate,
    vatAmount: quote.vatAmount,
    total: quote.total,
    status: 'draft',
    issueDate: issueDate,
    dueDate: dueDate.toISOString().split('T')[0],
    notes: quote.notes,
    paymentTerms: '14 dagen',
    workOrderId: quote.workOrderId,
    createdBy: currentUser.employeeId,
    timestamps: {
      created: now,
    },
    history: [
      createHistoryEntry(
        'invoice',
        'created',
        `Factuur aangemaakt door ${getEmployeeName(currentUser.employeeId, employees)} vanuit offerte ${quote.id}`,
        currentUser
      ) as any,
    ],
  };

  const updatedQuote: Quote = {
    ...quote,
    timestamps: {
      ...quote.timestamps,
      convertedToInvoice: now,
    },
    history: [
      ...(quote.history || []),
      createHistoryEntry(
        'quote',
        'converted_to_invoice',
        `Geconverteerd naar factuur ${invoice.invoiceNumber} door ${getEmployeeName(currentUser.employeeId, employees)}`,
        currentUser
      ) as QuoteHistoryEntry,
    ],
  };

  return { invoice, updatedQuote };
};

/**
 * Sync quote data to work order
 */
export const syncQuoteToWorkOrder = (quote: Quote, workOrder: WorkOrder): WorkOrder | null => {
  if (workOrder.status === 'Completed') {
    return null;
  }

  const totalHours = quote.labor?.reduce((sum, labor) => sum + labor.hours, 0) || 0;

  const updatedWorkOrder: WorkOrder = {
    ...workOrder,
    requiredInventory: quote.items
      .filter((item) => item.inventoryItemId)
      .map((item) => ({
        itemId: item.inventoryItemId!,
        quantity: item.quantity,
      })),
    estimatedHours: totalHours,
    estimatedCost: quote.total,
    notes: `${workOrder.notes || ''}\n\n[Update: ${new Date().toLocaleDateString()}] Offerte aangepast - Geschatte uren: ${totalHours}u, Kosten: €${quote.total.toFixed(
      2
    )}`,
  };

  return updatedWorkOrder;
};
