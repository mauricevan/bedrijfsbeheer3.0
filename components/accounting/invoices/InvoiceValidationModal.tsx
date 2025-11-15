// components/accounting/invoices/InvoiceValidationModal.tsx - < 300 lines
import React from 'react';
import type { Invoice, WorkOrder } from '../../../types';
import { getWorkOrderForInvoice } from '../../../features/accounting/utils/helpers';
import { formatCurrency } from '../../../features/accounting/utils/formatters';

interface InvoiceValidationModalProps {
  show: boolean;
  invoiceToValidate: Invoice | null;
  invoices: Invoice[];
  workOrders: WorkOrder[];
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
  onClose: () => void;
  onEdit: (invoiceId: string) => void;
  onConfirm: () => void;
}

export const InvoiceValidationModal: React.FC<InvoiceValidationModalProps> = ({
  show,
  invoiceToValidate,
  invoices,
  workOrders,
  validationChecklist,
  setValidationChecklist,
  onClose,
  onEdit,
  onConfirm,
}) => {
  if (!show || !invoiceToValidate) return null;

  const workOrder = getWorkOrderForInvoice(
    invoiceToValidate.id,
    invoices,
    workOrders
  );

  const estimatedHours = workOrder?.estimatedHours || 0;
  const actualHours = workOrder?.hoursSpent || 0;
  const estimatedCost = invoiceToValidate.estimatedCost || workOrder?.estimatedCost || 0;
  const actualCost = invoiceToValidate.total;
  const hoursDiff = actualHours - estimatedHours;
  const costDiff = actualCost - estimatedCost;
  const costDiffPercentage = estimatedCost > 0 ? (costDiff / estimatedCost) * 100 : 0;

  const allChecked = validationChecklist.hoursChecked &&
                     validationChecklist.materialsChecked &&
                     validationChecklist.extraWorkAdded;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            ⚠️ Factuur Validatie Voordat Verzenden
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Warning */}
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Belangrijk:</strong> Deze factuur is automatisch aangemaakt na voltooiing
              van een werkorder. Controleer alle gegevens zorgvuldig voordat u naar de klant verzendt.
            </p>
          </div>

          {/* Comparison */}
          {workOrder && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vergelijking: Geschat vs Werkelijk</h3>

              {/* Hours Comparison */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Uren:</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Geschat: {estimatedHours}u | Werkelijk: {actualHours}u
                    </div>
                    <div className={`font-bold ${hoursDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {hoursDiff > 0 ? '+' : ''}{hoursDiff}u {hoursDiff > 0 ? 'meer' : 'minder'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Comparison */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Kosten:</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Geschat: {formatCurrency(estimatedCost)} | Werkelijk: {formatCurrency(actualCost)}
                    </div>
                    <div className={`font-bold ${costDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {costDiff > 0 ? '+' : ''}{formatCurrency(costDiff)} ({costDiffPercentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning for significant differences */}
              {Math.abs(costDiffPercentage) > 20 && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                  <p className="text-sm text-red-800 font-semibold">
                    ⚠️ De werkelijke kosten wijken meer dan 20% af van de schatting!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Validation Checklist */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Validatie Checklist</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={validationChecklist.hoursChecked}
                  onChange={(e) => setValidationChecklist({
                    ...validationChecklist,
                    hoursChecked: e.target.checked,
                  })}
                  className="w-5 h-5"
                />
                <span>Gewerkte uren zijn gecontroleerd en correct</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={validationChecklist.materialsChecked}
                  onChange={(e) => setValidationChecklist({
                    ...validationChecklist,
                    materialsChecked: e.target.checked,
                  })}
                  className="w-5 h-5"
                />
                <span>Materialen zijn gecontroleerd en correct</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={validationChecklist.extraWorkAdded}
                  onChange={(e) => setValidationChecklist({
                    ...validationChecklist,
                    extraWorkAdded: e.target.checked,
                  })}
                  className="w-5 h-5"
                />
                <span>Eventueel meerwerk is toegevoegd aan factuur</span>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Totaal Factuurbedrag:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(invoiceToValidate.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex gap-3">
          <button
            onClick={() => {
              onClose();
              onEdit(invoiceToValidate.id);
            }}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
          >
            ✏️ Bewerken
          </button>
          <button
            onClick={onConfirm}
            disabled={!allChecked}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              allChecked
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            ✓ Bevestigen en Verzenden
          </button>
        </div>
      </div>
    </div>
  );
};
