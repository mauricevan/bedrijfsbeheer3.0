import { useCallback } from "react";
import type {
  Invoice,
  Customer,
  Employee,
  User,
  WorkOrder,
  InventoryItem,
} from '../../types';
import { useInvoiceForm } from "./useInvoiceForm";
import { useInvoiceState } from "./useInvoiceState";
import { useInvoiceActions } from "./useInvoiceActions";
import { useInvoiceClone } from "./useInvoiceClone";
import { useInvoiceValidation } from "./useInvoiceValidation";

/**
 * Main hook for managing invoices - Refactored to be < 200 lines
 * Orchestrates smaller, focused hooks for better separation of concerns
 *
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
  // ========================================
  // 1. STATE MANAGEMENT (via useInvoiceState)
  // ========================================
  const state = useInvoiceState();

  // ========================================
  // 2. FORM MANAGEMENT (via useInvoiceForm)
  // ========================================
  const invoiceForm = useInvoiceForm(inventory);

  // ========================================
  // 3. GENERATE INVOICE NUMBER
  // ========================================
  const generateInvoiceNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const existingNumbers = invoices
      .filter((inv) => inv.invoiceNumber.startsWith(`INV-${year}-`))
      .map((inv) => {
        const parts = inv.invoiceNumber.split("-");
        return parseInt(parts[parts.length - 1], 10);
      });

    const nextNumber = existingNumbers.length > 0
      ? Math.max(...existingNumbers) + 1
      : 1;

    return `INV-${year}-${nextNumber.toString().padStart(4, "0")}`;
  }, [invoices]);

  // ========================================
  // 4. CRUD ACTIONS (via useInvoiceActions)
  // ========================================
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

  // ========================================
  // 5. CLONE OPERATIONS (via useInvoiceClone)
  // ========================================
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

  // ========================================
  // 6. VALIDATION (via useInvoiceValidation)
  // ========================================
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

  // ========================================
  // 7. RETURN COMBINED INTERFACE
  // ========================================
  return {
    // State (from useInvoiceState)
    ...state,

    // Form (from useInvoiceForm)
    invoiceForm,

    // Actions (from useInvoiceActions)
    createInvoice: actions.createInvoice,
    editInvoice: actions.editInvoice,
    updateInvoiceStatus: actions.updateInvoiceStatus,
    deleteInvoice: actions.deleteInvoice,
    sendReminder: actions.sendReminder,

    // Clone (from useInvoiceClone)
    cloneInvoice: cloneOps.cloneInvoice,
    saveClonedInvoice: cloneOps.saveClonedInvoice,

    // Validation (from useInvoiceValidation)
    confirmInvoiceValidation: validation.confirmInvoiceValidation,

    // Utility
    generateInvoiceNumber,
  };
};
