// features/accounting/hooks/useQuotes.ts - Refactored < 200 lines
import type { Quote, Customer, Employee, User, WorkOrder, InventoryItem } from '../../../types';
import { useQuoteForm } from './useQuoteForm';
import { useQuoteState } from './useQuoteState';
import { useQuoteActions } from './useQuoteActions';
import { useQuoteClone } from './useQuoteClone';

/**
 * Main hook for managing quotes state and operations
 * Orchestrates all quote-related hooks
 * @param quotes - Quotes array
 * @param setQuotes - Function to update quotes
 * @param inventory - Array of inventory items (for quote form)
 * @param customers - Array of customers
 * @param employees - Array of employees
 * @param currentUser - Current user
 * @param workOrders - Array of work orders (for syncing)
 * @param setWorkOrders - Function to update work orders
 * @returns Quotes state and handlers
 */
export const useQuotes = (
  quotes: Quote[],
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>,
  inventory: InventoryItem[],
  customers: Customer[],
  employees: Employee[],
  currentUser: User,
  workOrders: WorkOrder[],
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>
) => {
  // State management
  const state = useQuoteState();

  // Form management
  const quoteForm = useQuoteForm(inventory);

  // CRUD actions
  const actions = useQuoteActions(
    quotes,
    setQuotes,
    customers,
    employees,
    currentUser,
    workOrders,
    setWorkOrders,
    quoteForm,
    state.setShowQuoteForm
  );

  // Clone and accept operations
  const cloneOps = useQuoteClone(
    quotes,
    setQuotes,
    customers,
    employees,
    currentUser,
    quoteForm,
    state.setShowCloneQuoteModal,
    actions.createQuote,
    actions.updateQuoteStatus,
    state.resetAcceptModal
  );

  return {
    // Modal state
    showQuoteForm: state.showQuoteForm,
    setShowQuoteForm: state.setShowQuoteForm,
    showCloneQuoteModal: state.showCloneQuoteModal,
    setShowCloneQuoteModal: state.setShowCloneQuoteModal,
    showAcceptQuoteModal: state.showAcceptQuoteModal,
    setShowAcceptQuoteModal: state.setShowAcceptQuoteModal,
    quoteToAccept: state.quoteToAccept,
    setQuoteToAccept: state.setQuoteToAccept,
    cloneOnAccept: state.cloneOnAccept,
    setCloneOnAccept: state.setCloneOnAccept,

    // Form (from useQuoteForm)
    quoteForm,

    // Handlers from actions
    createQuote: actions.createQuote,
    editQuote: actions.editQuote,
    updateQuoteStatus: actions.updateQuoteStatus,
    deleteQuote: actions.deleteQuote,

    // Handlers from clone
    cloneQuote: cloneOps.cloneQuote,
    saveClonedQuote: cloneOps.saveClonedQuote,
    acceptQuote: () => cloneOps.acceptQuote(state.quoteToAccept, state.cloneOnAccept),
  };
};
