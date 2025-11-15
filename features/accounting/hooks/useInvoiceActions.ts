// features/accounting/hooks/useInvoiceActions.ts - Refactored < 200 lines
import { useCallback } from 'react';
import type { Invoice, Customer, Employee, User, WorkOrder, InventoryItem, ModuleKey } from '../../../types';
import { trackAction } from '../../../utils/analytics';
import {
  createInvoice,
  updateInvoice,
  updateInvoiceStatus as updateInvoiceStatusService,
  deleteInvoice as deleteInvoiceService,
  syncInvoiceToWorkOrder as syncInvoiceToWorkOrderService,
  sendInvoiceReminder,
} from '../services/invoiceService';
import { createInvoiceSentNotification } from '../../../utils/smartNotifications';
import type { InvoiceFormHook } from './useInvoiceForm';

/**
 * Hook for invoice CRUD operations
 * Handles create, edit, update, delete actions
 */
export const useInvoiceActions = (
  invoices: Invoice[],
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>,
  customers: Customer[],
  employees: Employee[],
  currentUser: User,
  workOrders: WorkOrder[],
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>,
  invoiceForm: InvoiceFormHook,
  generateInvoiceNumber: () => string,
  setShowInvoiceForm: (show: boolean) => void,
  setNotifications?: React.Dispatch<React.SetStateAction<any[]>>
) => {
  /**
   * Create a new invoice
   */
  const createInvoiceHandler = useCallback(() => {
    try {
      if (!invoiceForm.validate()) {
        alert(invoiceForm.errors._form || 'Vul alle verplichte velden in!');
        return;
      }

      // If editing, update existing invoice
      if (invoiceForm.editingInvoiceId) {
        const existingInvoice = invoices.find((inv) => inv.id === invoiceForm.editingInvoiceId);
        if (!existingInvoice) return;

        const updatedInvoice = updateInvoice(
          invoiceForm.editingInvoiceId,
          {
            customerId: invoiceForm.formData.customerId,
            items: invoiceForm.formData.items,
            labor: invoiceForm.formData.labor,
            vatRate: invoiceForm.formData.vatRate,
            notes: invoiceForm.formData.notes,
            paymentTerms: invoiceForm.formData.paymentTerms,
            issueDate: invoiceForm.formData.issueDate,
            dueDate: invoiceForm.formData.dueDate,
          },
          existingInvoice,
          currentUser,
          employees
        );

        setInvoices(invoices.map((inv) => (inv.id === invoiceForm.editingInvoiceId ? updatedInvoice : inv)));

        // Sync to workorder if exists
        if (updatedInvoice.workOrderId) {
          const workOrder = workOrders.find((wo) => wo.id === updatedInvoice.workOrderId);
          if (workOrder) {
            const synced = syncInvoiceToWorkOrderService(updatedInvoice, workOrder);
            if (synced) {
              setWorkOrders(workOrders.map((wo) => (wo.id === workOrder.id ? synced : wo)));
              alert('✅ Factuur en werkorder succesvol gesynchroniseerd!');
            }
          }
        }

        invoiceForm.reset();
        setShowInvoiceForm(false);
        alert(`✅ Factuur ${updatedInvoice.invoiceNumber} succesvol bijgewerkt!`);
        return;
      }

      // Create new invoice
      const invoice = createInvoice(
        {
          customerId: invoiceForm.formData.customerId,
          items: invoiceForm.formData.items,
          labor: invoiceForm.formData.labor,
          vatRate: invoiceForm.formData.vatRate,
          notes: invoiceForm.formData.notes,
          paymentTerms: invoiceForm.formData.paymentTerms,
          issueDate: invoiceForm.formData.issueDate,
          dueDate: invoiceForm.formData.dueDate,
        },
        currentUser,
        employees,
        customers,
        invoices,
        generateInvoiceNumber()
      );

      setInvoices([...invoices, invoice]);
      invoiceForm.reset();
      setShowInvoiceForm(false);

      trackAction(currentUser.employeeId, currentUser.role, ModuleKey.ACCOUNTING, 'create_invoice', 'create', {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        total: invoice.total,
        itemsCount: invoice.items.length,
        laborCount: invoice.labor?.length || 0,
      });
      alert(`✅ Factuur ${invoice.invoiceNumber} succesvol aangemaakt!`);
    } catch (error) {
      alert((error as Error).message || 'Er is een fout opgetreden!');
    }
  }, [invoiceForm, invoices, customers, employees, currentUser, workOrders, setWorkOrders, generateInvoiceNumber, setShowInvoiceForm]);

  /**
   * Edit an invoice
   */
  const editInvoice = useCallback(
    (invoiceId: string) => {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (!invoice) return;

      invoiceForm.loadInvoiceForEditing({
        customerId: invoice.customerId,
        items: invoice.items,
        labor: invoice.labor || [],
        vatRate: invoice.vatRate,
        notes: invoice.notes || '',
        paymentTerms: invoice.paymentTerms || '14 dagen',
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
      });

      invoiceForm.setEditingInvoiceId(invoiceId);
      setShowInvoiceForm(true);
    },
    [invoices, invoiceForm, setShowInvoiceForm]
  );

  /**
   * Update invoice status
   */
  const updateInvoiceStatus = useCallback(
    (invoiceId: string, newStatus: Invoice['status']) => {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (!invoice) return;

      const updatedInvoice = updateInvoiceStatusService(invoice, newStatus, currentUser, employees);

      setInvoices(invoices.map((inv) => (inv.id === invoiceId ? updatedInvoice : inv)));

      // Auto-sync to workorder if status changes
      if (updatedInvoice.workOrderId && newStatus === 'paid') {
        const workOrder = workOrders.find((wo) => wo.id === updatedInvoice.workOrderId);
        if (workOrder) {
          const synced = syncInvoiceToWorkOrderService(updatedInvoice, workOrder);
          if (synced) {
            setWorkOrders(workOrders.map((wo) => (wo.id === workOrder.id ? synced : wo)));
          }
        }
      }
    },
    [invoices, currentUser, employees, workOrders, setWorkOrders]
  );

  /**
   * Delete an invoice
   */
  const deleteInvoice = useCallback(
    (invoiceId: string) => {
      if (confirm('Weet je zeker dat je deze factuur wilt verwijderen?')) {
        const filteredInvoices = deleteInvoiceService(invoiceId, invoices);
        setInvoices(filteredInvoices);
      }
    },
    [invoices, setInvoices]
  );

  /**
   * Send invoice reminder
   */
  const sendReminder = useCallback(
    (invoiceId: string, reminderNumber: 1 | 2) => {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (!invoice) return;

      const updatedInvoice = sendInvoiceReminder(invoice, reminderNumber, currentUser, employees);

      setInvoices(invoices.map((inv) => (inv.id === invoiceId ? updatedInvoice : inv)));

      if (setNotifications) {
        const notification = createInvoiceSentNotification(updatedInvoice, () => {
          // Action handled by parent component
        });
        setNotifications((prev) => [notification, ...prev]);
      }

      alert(`✅ Herinnering ${reminderNumber} voor factuur ${invoice.invoiceNumber} succesvol verzonden!`);
    },
    [invoices, currentUser, employees, setNotifications]
  );

  return {
    createInvoice: createInvoiceHandler,
    editInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    sendReminder,
  };
};
