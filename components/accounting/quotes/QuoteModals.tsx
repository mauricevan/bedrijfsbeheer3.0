// components/accounting/quotes/QuoteModals.tsx - Refactored < 300 lines
import React from 'react';
import type { Quote, Customer, WorkOrder } from '../../../types';
import type { ReturnType } from 'react';
import type { useQuoteForm } from '../../../features/accounting/hooks/useQuoteForm';

export interface QuoteModalsProps {
  // Clone Quote Modal
  showCloneModal: boolean;
  onCloseClone: () => void;
  onSaveClone: () => void;

  // Accept Quote Modal
  showAcceptModal: boolean;
  onCloseAccept: () => void;
  onAccept: () => void;
  quoteToAccept: Quote | null;
  cloneOnAccept: boolean;
  setCloneOnAccept: (clone: boolean) => void;
}

export const QuoteModals: React.FC<QuoteModalsProps> = ({
  showCloneModal,
  onCloseClone,
  onSaveClone,
  showAcceptModal,
  onCloseAccept,
  onAccept,
  quoteToAccept,
  cloneOnAccept,
  setCloneOnAccept,
}) => {
  return (
    <>
      {/* Clone Quote Modal */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Offerte Klonen</h2>
            <p className="text-gray-600 mb-6">
              Weet u zeker dat u deze offerte wilt klonen?
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

      {/* Accept Quote Modal */}
      {showAcceptModal && quoteToAccept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Offerte Accepteren</h2>
            <p className="text-gray-600 mb-4">
              Weet u zeker dat u deze offerte wilt accepteren?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-semibold">{quoteToAccept.quoteNumber}</p>
              <p className="text-sm text-gray-600">€{quoteToAccept.total.toFixed(2)}</p>
            </div>
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cloneOnAccept}
                  onChange={(e) => setCloneOnAccept(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Kloon deze offerte na acceptatie</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCloseAccept}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Annuleren
              </button>
              <button
                onClick={onAccept}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Accepteren
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
