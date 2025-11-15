// features/accounting/hooks/useQuoteClone.ts - Refactored < 200 lines
import { useCallback } from 'react';
import type { Quote, Customer, Employee, User } from '../../../types';
import { cloneQuote } from '../services/quoteService';
import type { QuoteFormHook } from './useQuoteForm';

/**
 * Hook for quote cloning and acceptance operations
 * Handles cloning quotes and accepting with optional clone
 */
export const useQuoteClone = (
  quotes: Quote[],
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>,
  customers: Customer[],
  employees: Employee[],
  currentUser: User,
  quoteForm: QuoteFormHook,
  setShowCloneQuoteModal: (show: boolean) => void,
  createQuoteHandler: () => void,
  updateQuoteStatus: (quoteId: string, newStatus: Quote['status']) => void,
  resetAcceptModal: () => void
) => {
  /**
   * Clone a quote
   */
  const cloneQuoteHandler = useCallback(
    (quoteId: string) => {
      const quote = quotes.find((q) => q.id === quoteId);
      if (!quote) return;

      // Prepare clone data with new ID and reset fields
      quoteForm.setFields({
        customerId: quote.customerId,
        items: quote.items,
        labor: quote.labor || [],
        vatRate: quote.vatRate,
        notes: quote.notes || '',
        validUntil: '', // User should set new date
      });
      setShowCloneQuoteModal(true);
    },
    [quotes, quoteForm, setShowCloneQuoteModal]
  );

  /**
   * Save cloned quote
   */
  const saveClonedQuote = useCallback(() => {
    // Find the original quote being cloned
    const originalQuoteId = quotes.find(
      (q) =>
        q.customerId === quoteForm.formData.customerId &&
        JSON.stringify(q.items) === JSON.stringify(quoteForm.formData.items)
    )?.id;

    if (!originalQuoteId) {
      // If no original found, create as new quote
      createQuoteHandler();
      return;
    }

    const originalQuote = quotes.find((q) => q.id === originalQuoteId);
    if (!originalQuote) {
      createQuoteHandler();
      return;
    }

    try {
      const clonedQuote = cloneQuote(originalQuote, currentUser, employees, customers);

      // Override with form data
      clonedQuote.validUntil = quoteForm.formData.validUntil;
      clonedQuote.notes = quoteForm.formData.notes;

      setQuotes([...quotes, clonedQuote]);
      quoteForm.reset();
      setShowCloneQuoteModal(false);
      alert(`✅ Offerte ${clonedQuote.id} succesvol gecloneerd!`);

      // Scroll to the new quote
      setTimeout(() => {
        const element = document.getElementById(clonedQuote.id);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (error) {
      alert((error as Error).message || 'Er is een fout opgetreden!');
    }
  }, [quotes, quoteForm, currentUser, employees, customers, createQuoteHandler, setShowCloneQuoteModal]);

  /**
   * Accept quote with optional clone
   */
  const acceptQuote = useCallback(
    (quoteToAccept: string | null, cloneOnAccept: boolean) => {
      if (!quoteToAccept) return;

      const quote = quotes.find((q) => q.id === quoteToAccept);
      if (!quote) return;

      // Update quote status to approved
      updateQuoteStatus(quoteToAccept, 'approved');

      // If clone is requested, create a cloned quote for next period
      if (cloneOnAccept) {
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
          const clonedQuote = cloneQuote(quote, currentUser, employees, customers);
          clonedQuote.validUntil = nextPeriodDate.toISOString().split('T')[0];
          clonedQuote.status = 'draft';
          clonedQuote.notes = `Gekloond van ${quote.id} (geaccepteerd op ${new Date().toLocaleDateString('nl-NL')}) voor volgende periode${
            quote.notes ? `\n\nOriginele notitie: ${quote.notes}` : ''
          }`;

          setQuotes([...quotes, clonedQuote]);
          alert(
            `✅ Offerte geaccepteerd!\n\n📋 Nieuwe offerte ${clonedQuote.id} aangemaakt voor volgende periode (geldig tot ${nextPeriodDate.toLocaleDateString(
              'nl-NL'
            )}).`
          );
        } catch (error) {
          alert((error as Error).message || 'Er is een fout opgetreden!');
        }
      } else {
        alert(`✅ Offerte ${quote.id} succesvol geaccepteerd!`);
      }

      resetAcceptModal();
    },
    [quotes, updateQuoteStatus, currentUser, employees, customers, resetAcceptModal]
  );

  return {
    cloneQuote: cloneQuoteHandler,
    saveClonedQuote,
    acceptQuote,
  };
};
