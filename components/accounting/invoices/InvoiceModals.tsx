// components/accounting/invoices/InvoiceModals.tsx - < 300 lines
import React from 'react';
import type { Invoice, Customer, WorkOrder } from '../../../types';
import type { ReturnType } from 'react';
import type { useInvoiceForm } from '../../../features/accounting/hooks/useInvoiceForm';
import { InvoiceOverviewModal } from './InvoiceOverviewModal';
import { InvoiceCloneModal } from './InvoiceCloneModal';
import { InvoiceValidationModal } from './InvoiceValidationModal';

export interface InvoiceModalsProps {
  // Clone Invoice Modal
  showCloneModal: boolean;
  onCloseClone: () => void;
  onSaveClone: () => void;

  // Validation Modal
  showValidationModal: boolean;
  onCloseValidation: () => void;
  onConfirmValidation: () => void;
  invoiceToValidate: Invoice | null;
  validationChecklist: {
    hoursChecked: boolean;
    materialsChecked: boolean;
    extraWorkAdded: boolean;
  };
  setValidationChecklist: React.Dispatch<React.SetStateAction<{
    hoursChecked: boolean;
    materialsChecked: boolean;
    extraWorkAdded: boolean;
  }>>;
}

export const InvoiceModals: React.FC<InvoiceModalsProps> = ({
  showCloneModal,
  onCloseClone,
  onSaveClone,
  showValidationModal,
  onCloseValidation,
  onConfirmValidation,
  invoiceToValidate,
  validationChecklist,
  setValidationChecklist,
}) => {
  return (
    <>
      {/* Clone Invoice Modal */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Factuur Klonen</h2>
            <p className="text-gray-600 mb-6">
              Weet u zeker dat u deze factuur wilt klonen?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCloseClone}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Annuleren
              </button>
              <button
                onClick={onSaveClone}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Klonen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Modal */}
      <InvoiceValidationModal
        show={showValidationModal}
        invoiceToValidate={invoiceToValidate}
        invoices={[]}
        workOrders={[]}
        validationChecklist={validationChecklist}
        setValidationChecklist={setValidationChecklist}
        onClose={onCloseValidation}
        onEdit={() => {}}
        onConfirm={onConfirmValidation}
      />
    </>
  );
};
