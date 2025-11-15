// features/accounting/hooks/useQuoteActions.ts - Refactored < 200 lines
import { useCallback } from 'react';
import type { Quote, Customer, Employee, User, WorkOrder, ModuleKey } from '../../../types';
import { trackAction } from '../../../utils/analytics';
import {
  createQuote,
  updateQuote,
  updateQuoteStatus as updateQuoteStatusService,
  deleteQuote as deleteQuoteService,
  syncQuoteToWorkOrder as syncQuoteToWorkOrderService,
} from '../services/quoteService';
import type { QuoteFormHook } from './useQuoteForm';

/**
 * Hook for quote CRUD operations
 * Handles create, edit, update, delete actions
 */
export const useQuoteActions = (
  quotes: Quote[],
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>,
  customers: Customer[],
  employees: Employee[],
  currentUser: User,
  workOrders: WorkOrder[],
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>,
  quoteForm: QuoteFormHook,
  setShowQuoteForm: (show: boolean) => void
) => {
  /**
   * Create a new quote
   */
  const createQuoteHandler = useCallback(() => {
    try {
      if (!quoteForm.validate()) {
        alert(quoteForm.errors._form || 'Vul alle verplichte velden in!');
        return;
      }

      // If editing, update existing quote
      if (quoteForm.editingQuoteId) {
        const existingQuote = quotes.find((q) => q.id === quoteForm.editingQuoteId);
        if (!existingQuote) return;

        const updatedQuote = updateQuote(
          quoteForm.editingQuoteId,
          {
            customerId: quoteForm.formData.customerId,
            items: quoteForm.formData.items,
            labor: quoteForm.formData.labor,
            vatRate: quoteForm.formData.vatRate,
            notes: quoteForm.formData.notes,
            validUntil: quoteForm.formData.validUntil,
          },
          existingQuote,
          currentUser,
          employees
        );

        setQuotes(quotes.map((q) => (q.id === quoteForm.editingQuoteId ? updatedQuote : q)));

        // Sync to workorder if exists
        if (updatedQuote.workOrderId) {
          const workOrder = workOrders.find((wo) => wo.id === updatedQuote.workOrderId);
          if (workOrder) {
            const synced = syncQuoteToWorkOrderService(updatedQuote, workOrder);
            if (synced) {
              setWorkOrders(workOrders.map((wo) => (wo.id === workOrder.id ? synced : wo)));
              alert('✅ Offerte en werkorder succesvol gesynchroniseerd!');
            }
          }
        }

        quoteForm.reset();
        setShowQuoteForm(false);
        alert(`✅ Offerte ${updatedQuote.id} succesvol bijgewerkt!`);
        return;
      }

      // Create new quote
      const quote = createQuote(
        {
          customerId: quoteForm.formData.customerId,
          items: quoteForm.formData.items,
          labor: quoteForm.formData.labor,
          vatRate: quoteForm.formData.vatRate,
          notes: quoteForm.formData.notes,
          validUntil: quoteForm.formData.validUntil,
        },
        currentUser,
        employees,
        customers,
        quotes
      );

      setQuotes([...quotes, quote]);
      quoteForm.reset();
      setShowQuoteForm(false);

      trackAction(currentUser.employeeId, currentUser.role, ModuleKey.ACCOUNTING, 'create_quote', 'create', {
        quoteId: quote.id,
        customerId: quote.customerId,
        total: quote.total,
        itemsCount: quote.items.length,
        laborCount: quote.labor?.length || 0,
      });
      alert(`✅ Offerte ${quote.id} succesvol aangemaakt!`);
    } catch (error) {
      alert((error as Error).message || 'Er is een fout opgetreden!');
    }
  }, [quoteForm, quotes, customers, employees, currentUser, workOrders, setWorkOrders, setShowQuoteForm]);

  /**
   * Edit a quote
   */
  const editQuote = useCallback(
    (quoteId: string) => {
      const quote = quotes.find((q) => q.id === quoteId);
      if (!quote) return;

      quoteForm.loadQuoteForEditing({
        customerId: quote.customerId,
        items: quote.items,
        labor: quote.labor || [],
        vatRate: quote.vatRate,
        notes: quote.notes || '',
        validUntil: quote.validUntil,
      });

      quoteForm.setEditingQuoteId(quoteId);
      setShowQuoteForm(true);
    },
    [quotes, quoteForm, setShowQuoteForm]
  );

  /**
   * Update quote status
   */
  const updateQuoteStatus = useCallback(
    (quoteId: string, newStatus: Quote['status']) => {
      const quote = quotes.find((q) => q.id === quoteId);
      if (!quote) return;

      const updatedQuote = updateQuoteStatusService(quote, newStatus, currentUser, employees);

      setQuotes(quotes.map((q) => (q.id === quoteId ? updatedQuote : q)));
    },
    [quotes, currentUser, employees]
  );

  /**
   * Delete a quote
   */
  const deleteQuote = useCallback(
    (quoteId: string) => {
      if (confirm('Weet je zeker dat je deze offerte wilt verwijderen?')) {
        const filteredQuotes = deleteQuoteService(quoteId, quotes);
        setQuotes(filteredQuotes);
      }
    },
    [quotes, setQuotes]
  );

  return {
    createQuote: createQuoteHandler,
    editQuote,
    updateQuoteStatus,
    deleteQuote,
  };
};
