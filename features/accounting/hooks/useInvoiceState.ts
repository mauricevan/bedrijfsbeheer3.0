// features/accounting/hooks/useInvoiceState.ts - Refactored < 200 lines
import { useState } from 'react';
import type { Invoice } from '../../../types';

/**
 * Hook for managing invoice-related modal and UI state
 * Separates state management from business logic
 */
export const useInvoiceState = () => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showCloneInvoiceModal, setShowCloneInvoiceModal] = useState(false);
  const [showInvoiceValidationModal, setShowInvoiceValidationModal] = useState(false);
  const [invoiceToValidate, setInvoiceToValidate] = useState<Invoice | null>(null);
  const [validationChecklist, setValidationChecklist] = useState({
    hoursChecked: false,
    materialsChecked: false,
    extraWorkAdded: false,
  });

  const resetValidation = () => {
    setShowInvoiceValidationModal(false);
    setInvoiceToValidate(null);
    setValidationChecklist({
      hoursChecked: false,
      materialsChecked: false,
      extraWorkAdded: false,
    });
  };

  return {
    // Invoice form
    showInvoiceForm,
    setShowInvoiceForm,

    // Clone modal
    showCloneInvoiceModal,
    setShowCloneInvoiceModal,

    // Validation modal
    showInvoiceValidationModal,
    setShowInvoiceValidationModal,
    invoiceToValidate,
    setInvoiceToValidate,
    validationChecklist,
    setValidationChecklist,

    // Helpers
    resetValidation,
  };
};
