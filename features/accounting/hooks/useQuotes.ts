import { useCallback } from "react";
import type {
  Quote,
  Customer,
  Employee,
  User,
  WorkOrder,
  InventoryItem,
} from '../../types';
import { useQuoteForm } from "./useQuoteForm";
import { useQuoteState } from "./useQuoteState";
import { useQuoteActions } from "./useQuoteActions";
import { useQuoteClone } from "./useQuoteClone";
import { cloneQuote } from "../services/quoteService";

/**
 * Main hook for managing quotes - Refactored to be < 200 lines
 * Orchestrates smaller, focused hooks for better separation of concerns
 *
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
  // ========================================
  // 1. STATE MANAGEMENT (via useQuoteState)
  // ========================================
  const state = useQuoteState();

  // ========================================
  // 2. FORM MANAGEMENT (via useQuoteForm)
  // ========================================
  const quoteForm = useQuoteForm(inventory);

  // ========================================
  // 3. CRUD ACTIONS (via useQuoteActions)
  // ========================================
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

  // ========================================
  // 4. CLONE OPERATIONS (via useQuoteClone)
  // ========================================
  const cloneOps = useQuoteClone(
    quotes,
    setQuotes,
    customers,
    employees,
    currentUser,
    quoteForm,
    state.setShowCloneQuoteModal,
    actions.createQuote
  );

  // ========================================
  // 5. ACCEPT QUOTE (complex workflow)
  // ========================================
  /**
   * Accept quote with optional clone for next period
   * This combines status update + optional cloning logic
   */
  const acceptQuote = useCallback(() => {
    if (!state.quoteToAccept) return;

    const quote = quotes.find((q) => q.id === state.quoteToAccept);
    if (!quote) return;

    // Update quote status to approved
    actions.updateQuoteStatus(state.quoteToAccept, "approved");

    // If clone is requested, create a cloned quote for next period
    if (state.cloneOnAccept) {
      // Calculate next period date
      let nextPeriodDate: Date;
      if (quote.validUntil) {
        const validUntilDate = new Date(quote.validUntil);
        nextPeriodDate = new Date(validUntilDate);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + 30); // +30 days
      } else {
        nextPeriodDate = new Date();
        nextPeriodDate.setDate(nextPeriodDate.getDate() + 30);
      }

      try {
        const clonedQuote = cloneQuote(
          quote,
          currentUser,
          employees,
          customers
        );
        clonedQuote.validUntil = nextPeriodDate.toISOString().split("T")[0];
        clonedQuote.status = "draft";
        clonedQuote.notes = `Gekloond van ${
          quote.id
        } (geaccepteerd op ${new Date().toLocaleDateString(
          "nl-NL"
        )}) voor volgende periode${
          quote.notes ? `\n\nOriginele notitie: ${quote.notes}` : ""
        }`;

        setQuotes([...quotes, clonedQuote]);
        alert(
          `✅ Offerte geaccepteerd!\n\n📋 Nieuwe offerte ${
            clonedQuote.id
          } aangemaakt voor volgende periode (geldig tot ${nextPeriodDate.toLocaleDateString(
            "nl-NL"
          )}).`
        );
      } catch (error) {
        alert((error as Error).message || "Er is een fout opgetreden!");
      }
    } else {
      alert(`✅ Offerte ${quote.id} succesvol geaccepteerd!`);
    }

    // Reset modal state
    state.resetAcceptModal();
  }, [
    state.quoteToAccept,
    state.cloneOnAccept,
    state.resetAcceptModal,
    quotes,
    actions.updateQuoteStatus,
    currentUser,
    employees,
    customers,
  ]);

  // ========================================
  // 6. RETURN COMBINED INTERFACE
  // ========================================
  return {
    // State (from useQuoteState)
    ...state,

    // Form (from useQuoteForm)
    quoteForm,

    // Actions (from useQuoteActions)
    createQuote: actions.createQuote,
    editQuote: actions.editQuote,
    updateQuoteStatus: actions.updateQuoteStatus,
    deleteQuote: actions.deleteQuote,

    // Clone (from useQuoteClone)
    cloneQuote: cloneOps.cloneQuote,
    saveClonedQuote: cloneOps.saveClonedQuote,

    // Accept workflow
    acceptQuote,
  };
};
