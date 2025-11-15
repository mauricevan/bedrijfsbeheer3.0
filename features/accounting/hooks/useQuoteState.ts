// features/accounting/hooks/useQuoteState.ts - Refactored < 200 lines
import { useState } from 'react';

/**
 * Hook for managing quote-related modal and UI state
 * Separates state management from business logic
 */
export const useQuoteState = () => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showCloneQuoteModal, setShowCloneQuoteModal] = useState(false);
  const [showAcceptQuoteModal, setShowAcceptQuoteModal] = useState(false);
  const [quoteToAccept, setQuoteToAccept] = useState<string | null>(null);
  const [cloneOnAccept, setCloneOnAccept] = useState(false);

  const resetAcceptModal = () => {
    setShowAcceptQuoteModal(false);
    setQuoteToAccept(null);
    setCloneOnAccept(false);
  };

  return {
    // Quote form
    showQuoteForm,
    setShowQuoteForm,

    // Clone modal
    showCloneQuoteModal,
    setShowCloneQuoteModal,

    // Accept modal
    showAcceptQuoteModal,
    setShowAcceptQuoteModal,
    quoteToAccept,
    setQuoteToAccept,
    cloneOnAccept,
    setCloneOnAccept,

    // Helpers
    resetAcceptModal,
  };
};
