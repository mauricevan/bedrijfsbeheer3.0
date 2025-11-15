// features/accounting/hooks/useInvoices.ts - Refactored < 200 lines
import { useCallback } from 'react';
import type {
  Invoice,
  Customer,
  Employee,
  User,
  WorkOrder,
  InventoryItem,
} from '../../../types';
import { useInvoiceForm } from './useInvoiceForm';
import { useInvoiceState } from './useInvoiceState';
import { useInvoiceActions } from './useInvoiceActions';
import { useInvoiceClone } from './useInvoiceClone';
import { useInvoiceValidation } from './useInvoiceValidation';

/**
 * Main hook for managing invoices state and operations
 * Orchestrates all invoice-related hooks
 * @param invoices - Invoices array
 * @param setInvoices - Function to update invoices
 * @param inventory - Array of inventory items (for invoice form)
 * @param customers - Array of customers
 * @param employees - Array of employees
 * @param currentUser - Current user
 * @param workOrders - Array of work orders (for syncing)
 * @param setWorkOrders - Function to update work orders
 * @param setNotifications - Optional function to update notifications
 * @returns Invoices state and handlers
 */
export const useInvoices = (
  invoices: Invoice[],
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>,
  inventory: InventoryItem[],
  customers: Customer[],
  employees: Employee[],
  currentUser: User,
  workOrders: WorkOrder[],
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>,
  setNotifications?: React.Dispatch<React.SetStateAction<any[]>>
) => {
  // State management
  const state = useInvoiceState();

  // Form management
  const invoiceForm = useInvoiceForm(inventory);

  /**
   * Generate invoice number
   */
  const generateInvoiceNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const existingNumbers = invoices
      .filter((inv) => inv.invoiceNumber.startsWith(`INV-${year}-`))
      .map((inv) => {
        const parts = inv.invoiceNumber.split('-');
        return parseInt(parts[parts.length - 1], 10);
      });

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

    return `INV-${year}-${nextNumber.toString().padStart(4, '0')}`;
  }, [invoices]);

  // CRUD actions
  const actions = useInvoiceActions(
    invoices,
    setInvoices,
    customers,
    employees,
    currentUser,
    workOrders,
    setWorkOrders,
    invoiceForm,
    generateInvoiceNumber,
    state.setShowInvoiceForm,
    setNotifications
  );

  // Clone operations
  const cloneOps = useInvoiceClone(
    invoices,
    setInvoices,
    customers,
    employees,
    currentUser,
    invoiceForm,
    generateInvoiceNumber,
    state.setShowCloneInvoiceModal,
    actions.createInvoice
  );

  // Validation workflow
  const validation = useInvoiceValidation(
    invoices,
    setInvoices,
    currentUser,
    employees,
    state.invoiceToValidate,
    state.setShowInvoiceValidationModal,
    state.setInvoiceToValidate,
    state.resetValidation
  );

  return {
    // Modal state
    showInvoiceForm: state.showInvoiceForm,
    setShowInvoiceForm: state.setShowInvoiceForm,
    showCloneInvoiceModal: state.showCloneInvoiceModal,
    setShowCloneInvoiceModal: state.setShowCloneInvoiceModal,
    showInvoiceValidationModal: state.showInvoiceValidationModal,
    setShowInvoiceValidationModal: state.setShowInvoiceValidationModal,
    invoiceToValidate: state.invoiceToValidate,
    setInvoiceToValidate: state.setInvoiceToValidate,
    validationChecklist: state.validationChecklist,
    setValidationChecklist: state.setValidationChecklist,

    // Form (from useInvoiceForm)
    invoiceForm,

    // Handlers from actions
    createInvoice: actions.createInvoice,
    editInvoice: actions.editInvoice,
    updateInvoiceStatus: actions.updateInvoiceStatus,
    deleteInvoice: actions.deleteInvoice,
    sendReminder: actions.sendReminder,

    // Handlers from clone
    cloneInvoice: cloneOps.cloneInvoice,
    saveClonedInvoice: cloneOps.saveClonedInvoice,

    // Handlers from validation
    confirmInvoiceValidation: validation.confirmInvoiceValidation,

    // Utility
    generateInvoiceNumber,
  };
};
