// features/accounting/hooks/useInvoiceClone.ts - Refactored < 200 lines
import { useCallback } from 'react';
import type { Invoice, Customer, Employee, User } from '../../../types';
import { cloneInvoice } from '../services/invoiceService';
import type { InvoiceFormHook } from './useInvoiceForm';

/**
 * Hook for invoice cloning operations
 * Handles cloning invoices with optional workorder integration
 */
export const useInvoiceClone = (
  invoices: Invoice[],
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>,
  customers: Customer[],
  employees: Employee[],
  currentUser: User,
  invoiceForm: InvoiceFormHook,
  generateInvoiceNumber: () => string,
  setShowCloneInvoiceModal: (show: boolean) => void,
  createInvoiceHandler: () => void
) => {
  /**
   * Clone an invoice
   */
  const cloneInvoiceHandler = useCallback(
    (invoiceId: string) => {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (!invoice) return;

      // Prepare clone data with new ID and reset fields
      invoiceForm.setFields({
        customerId: invoice.customerId,
        items: invoice.items,
        labor: invoice.labor || [],
        vatRate: invoice.vatRate,
        notes: invoice.notes || '',
        paymentTerms: invoice.paymentTerms || '14 dagen',
        issueDate: '',
        dueDate: '',
      });
      setShowCloneInvoiceModal(true);
    },
    [invoices, invoiceForm, setShowCloneInvoiceModal]
  );

  /**
   * Save cloned invoice
   */
  const saveClonedInvoice = useCallback(
    (sendToWorkOrder: boolean = false) => {
      // Find the original invoice being cloned
      const originalInvoiceId = invoices.find(
        (inv) =>
          inv.customerId === invoiceForm.formData.customerId &&
          JSON.stringify(inv.items) === JSON.stringify(invoiceForm.formData.items)
      )?.id;

      if (!originalInvoiceId) {
        // If no original found, create as new invoice
        createInvoiceHandler();
        return;
      }

      const originalInvoice = invoices.find((inv) => inv.id === originalInvoiceId);
      if (!originalInvoice) {
        createInvoiceHandler();
        return;
      }

      try {
        const clonedInvoice = cloneInvoice(
          originalInvoice,
          currentUser,
          employees,
          customers,
          generateInvoiceNumber()
        );

        // Override with form data
        clonedInvoice.issueDate = invoiceForm.formData.issueDate;
        clonedInvoice.dueDate = invoiceForm.formData.dueDate;
        clonedInvoice.notes = invoiceForm.formData.notes;

        setInvoices([...invoices, clonedInvoice]);
        invoiceForm.reset();
        setShowCloneInvoiceModal(false);

        if (sendToWorkOrder) {
          // This will be handled by the parent component
          return clonedInvoice;
        } else {
          alert(`✅ Factuur ${clonedInvoice.invoiceNumber} succesvol gecloneerd!`);

          // Scroll to the new invoice
          setTimeout(() => {
            const element = document.getElementById(clonedInvoice.id);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      } catch (error) {
        alert((error as Error).message || 'Er is een fout opgetreden!');
      }
    },
    [invoices, invoiceForm, currentUser, employees, customers, generateInvoiceNumber, createInvoiceHandler, setShowCloneInvoiceModal]
  );

  return {
    cloneInvoice: cloneInvoiceHandler,
    saveClonedInvoice,
  };
};
