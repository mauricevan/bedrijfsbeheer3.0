/**
 * Invoice Service - CRUD Operations Only
 * Refactored to be < 250 lines per CONVENTIONS.md
 *
 * Workflow functions moved to invoiceWorkflowService.ts:
 * - convertInvoiceToWorkOrder
 * - syncInvoiceToWorkOrder
 * - sendInvoiceReminder
 * - shouldShowValidationModal
 */

import type {
  Invoice,
  QuoteItem,
  QuoteLabor,
  InvoiceHistoryEntry,
  User,
  Employee,
  Customer,
} from '../../types';
import {
  calculateInvoiceTotals,
  generateInvoiceNumber,
} from "../utils/calculations";
import {
  validateInvoiceForm,
  type InvoiceFormData,
} from "../utils/validators";
import {
  createHistoryEntry,
  getEmployeeName,
  getCustomerName,
} from "../utils/helpers";

/**
 * Invoice form data interface
 */
export interface CreateInvoiceData {
  customerId: string;
  items: QuoteItem[];
  labor: QuoteLabor[];
  vatRate: number;
  notes: string;
  paymentTerms: string;
  issueDate: string;
  dueDate: string;
}

/**
 * Create a new invoice
 * @param data - Invoice form data
 * @param currentUser - Current user
 * @param employees - Array of employees
 * @param customers - Array of customers
 * @param existingInvoices - Array of existing invoices (for invoice number generation)
 * @returns New invoice object
 */
export const createInvoice = (
  data: CreateInvoiceData,
  currentUser: User,
  employees: Employee[],
  customers: Customer[],
  existingInvoices: Invoice[] = []
): Invoice => {
  // Validate form data
  const validation = validateInvoiceForm({
    customerId: data.customerId,
    items: data.items,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    vatRate: data.vatRate,
    notes: data.notes,
    paymentTerms: data.paymentTerms,
  });

  if (!validation.isValid) {
    throw new Error(validation.message || "Invalid invoice data");
  }

  // Calculate totals
  const { subtotal, vatAmount, total } = calculateInvoiceTotals(
    data.items,
    data.labor,
    data.vatRate
  );

  const now = new Date().toISOString();
  const customerName = getCustomerName(data.customerId, customers);

  // Generate unique ID and invoice number
  const id = `inv${Date.now()}`;
  const invoiceNumber = generateInvoiceNumber(existingInvoices);

  const invoice: Invoice = {
    id,
    invoiceNumber,
    customerId: data.customerId,
    items: data.items,
    labor: data.labor.length > 0 ? data.labor : undefined,
    subtotal,
    vatRate: data.vatRate,
    vatAmount,
    total,
    status: "draft",
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    notes: data.notes,
    paymentTerms: data.paymentTerms,
    createdBy: currentUser.employeeId,
    timestamps: {
      created: now,
    },
    history: [
      createHistoryEntry(
        "invoice",
        "created",
        `Factuur aangemaakt door ${getEmployeeName(
          currentUser.employeeId,
          employees
        )} voor klant ${customerName}`,
        currentUser
      ) as InvoiceHistoryEntry,
    ],
  };

  return invoice;
};

/**
 * Update an existing invoice
 * @param invoiceId - Invoice ID to update
 * @param data - Updated invoice form data
 * @param existingInvoice - Existing invoice object
 * @param currentUser - Current user
 * @param employees - Array of employees
 * @returns Updated invoice object
 */
export const updateInvoice = (
  invoiceId: string,
  data: CreateInvoiceData,
  existingInvoice: Invoice,
  currentUser: User,
  employees: Employee[]
): Invoice => {
  // Validate form data
  const validation = validateInvoiceForm({
    customerId: data.customerId,
    items: data.items,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    vatRate: data.vatRate,
    notes: data.notes,
    paymentTerms: data.paymentTerms,
  });

  if (!validation.isValid) {
    throw new Error(validation.message || "Invalid invoice data");
  }

  // Calculate totals
  const { subtotal, vatAmount, total } = calculateInvoiceTotals(
    data.items,
    data.labor,
    data.vatRate
  );

  const updatedInvoice: Invoice = {
    ...existingInvoice,
    customerId: data.customerId,
    items: data.items,
    labor: data.labor.length > 0 ? data.labor : undefined,
    subtotal,
    vatRate: data.vatRate,
    vatAmount,
    total,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    notes: data.notes,
    paymentTerms: data.paymentTerms,
    history: [
      ...(existingInvoice.history || []),
      createHistoryEntry(
        "invoice",
        "updated",
        `Factuur bijgewerkt door ${getEmployeeName(
          currentUser.employeeId,
          employees
        )}`,
        currentUser
      ) as InvoiceHistoryEntry,
    ],
  };

  return updatedInvoice;
};

/**
 * Update invoice status
 * @param invoice - Invoice to update
 * @param newStatus - New status
 * @param currentUser - Current user
 * @param employees - Array of employees
 * @returns Updated invoice object
 */
export const updateInvoiceStatus = (
  invoice: Invoice,
  newStatus: Invoice["status"],
  currentUser: User,
  employees: Employee[]
): Invoice => {
  const now = new Date().toISOString();
  const oldStatus = invoice.status;

  const updates: Partial<Invoice> = {
    status: newStatus,
    history: [
      ...(invoice.history || []),
      createHistoryEntry(
        "invoice",
        newStatus,
        `Status gewijzigd van "${oldStatus}" naar "${newStatus}" door ${getEmployeeName(
          currentUser.employeeId,
          employees
        )}`,
        currentUser,
        { fromStatus: oldStatus, toStatus: newStatus }
      ) as InvoiceHistoryEntry,
    ],
  };

  // Update timestamps
  if (!invoice.timestamps) {
    updates.timestamps = { created: invoice.issueDate };
  } else {
    updates.timestamps = { ...invoice.timestamps };
  }

  if (newStatus === "sent" && !updates.timestamps!.sent) {
    updates.timestamps!.sent = now;

    // Auto-set reminder dates when sending
    if (invoice.dueDate) {
      const dueDate = new Date(invoice.dueDate);
      const reminder1Date = new Date(dueDate);
      reminder1Date.setDate(dueDate.getDate() + 7); // +7 days after due date

      const reminder2Date = new Date(dueDate);
      reminder2Date.setDate(dueDate.getDate() + 14); // +14 days after due date

      updates.reminders = {
        reminder1Date: reminder1Date.toISOString().split("T")[0],
        reminder1Sent: false,
        reminder2Date: reminder2Date.toISOString().split("T")[0],
        reminder2Sent: false,
      };
    }
  } else if (newStatus === "paid" && !updates.timestamps!.paid) {
    updates.timestamps!.paid = now;
    updates.paidDate = now.split("T")[0];
  }

  return { ...invoice, ...updates };
};

/**
 * Delete an invoice (returns filtered array)
 * @param invoiceId - Invoice ID to delete
 * @param invoices - Array of invoices
 * @returns Filtered array without the deleted invoice
 */
export const deleteInvoice = (
  invoiceId: string,
  invoices: Invoice[]
): Invoice[] => {
  return invoices.filter((inv) => inv.id !== invoiceId);
};

/**
 * Clone an invoice
 * @param invoice - Invoice to clone
 * @param currentUser - Current user
 * @param employees - Array of employees
 * @param customers - Array of customers
 * @param newInvoiceNumber - New invoice number for the clone
 * @returns Cloned invoice object
 */
export const cloneInvoice = (
  invoice: Invoice,
  currentUser: User,
  employees: Employee[],
  customers: Customer[],
  newInvoiceNumber: string
): Invoice => {
  const now = new Date().toISOString();
  const customerName = getCustomerName(invoice.customerId, customers);
  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // +14 days

  const clonedInvoice: Invoice = {
    id: `inv${Date.now()}`,
    invoiceNumber: newInvoiceNumber,
    customerId: invoice.customerId,
    items: invoice.items.map((item) => ({ ...item })),
    labor: invoice.labor ? invoice.labor.map((l) => ({ ...l })) : undefined,
    subtotal: invoice.subtotal,
    vatRate: invoice.vatRate,
    vatAmount: invoice.vatAmount,
    total: invoice.total,
    status: "draft",
    issueDate: today,
    dueDate: dueDate.toISOString().split("T")[0],
    notes: invoice.notes || "",
    paymentTerms: invoice.paymentTerms,
    createdBy: currentUser.employeeId,
    timestamps: {
      created: now,
    },
    history: [
      createHistoryEntry(
        "invoice",
        "created",
        `Factuur gecloneerd door ${getEmployeeName(
          currentUser.employeeId,
          employees
        )} voor klant ${customerName}`,
        currentUser
      ) as InvoiceHistoryEntry,
    ],
  };

  return clonedInvoice;
};

// Re-export workflow functions from invoiceWorkflowService for backward compatibility
export {
  convertInvoiceToWorkOrder,
  syncInvoiceToWorkOrder,
  sendInvoiceReminder,
  shouldShowValidationModal,
} from './invoiceWorkflowService';
