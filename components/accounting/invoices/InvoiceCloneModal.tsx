import React from "react";
import type {
  Invoice,
  Customer,
  WorkOrder,
} from "../../../types";
import type { ReturnType } from "react";
import type { useInvoiceForm } from "../../../features/accounting/hooks/useInvoiceForm";
import {
  getCustomerName,
  getInvoiceStatusColor,
  getWorkOrderStatus,
  getWorkOrderBadge,
  getWorkOrderForInvoice,
} from "../../../features/accounting/utils/helpers";
import { formatCurrency } from "../../../features/accounting/utils/formatters";
import {
  filterInvoices,
  calculateFilteredInvoiceTotal,
  type InvoiceFilterOptions,
} from "../../../features/accounting/utils/filters";

const CloneInvoiceModal: React.FC<{
  show: boolean;
  invoiceForm: ReturnType<typeof useInvoiceForm>;
  customers: Customer[];
  calculateInvoiceTotals: () => {
    subtotal: number;
    vatAmount: number;
    total: number;
  };
  onClose: () => void;
  onSave: () => void;
  onSaveAndSendToWorkOrder: () => void;
}> = ({
  show,
  invoiceForm,
  customers,
  calculateInvoiceTotals,
  onClose,
  onSave,
  onSaveAndSendToWorkOrder,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-none sm:rounded-lg shadow-xl w-full sm:max-w-4xl sm:w-full h-full sm:h-auto p-4 sm:p-6 sm:my-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-neutral">
            📋 Factuur Clonen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> De nieuwe factuur krijgt automatisch een
            nieuw factuurnummer en de datum wordt op vandaag gezet.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Klant *
            </label>
            <select
              value={invoiceForm.formData.customerId}
              onChange={(e) =>
                invoiceForm.handleChange("customerId", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecteer klant</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Factuurdatum *
              </label>
              <input
                type="date"
                value={invoiceForm.formData.issueDate}
                onChange={(e) =>
                  invoiceForm.handleChange("issueDate", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vervaldatum *
              </label>
              <input
                type="date"
                value={invoiceForm.formData.dueDate}
                onChange={(e) =>
                  invoiceForm.handleChange("dueDate", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BTW Tarief (%)
              </label>
              <input
                type="number"
                value={invoiceForm.formData.vatRate}
                onChange={(e) =>
                  invoiceForm.handleChange("vatRate", Number(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Betalingstermijn
              </label>
              <input
                type="text"
                value={invoiceForm.formData.paymentTerms}
                onChange={(e) =>
                  invoiceForm.handleChange("paymentTerms", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="14 dagen"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notities
            </label>
            <textarea
              value={invoiceForm.formData.notes}
              onChange={(e) =>
                invoiceForm.handleChange("notes", e.target.value)
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Extra opmerkingen..."
            />
          </div>

          {invoiceForm.formData.items.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotaal:</span>
                <span className="font-semibold">
                  {formatCurrency(calculateInvoiceTotals().subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  BTW ({invoiceForm.formData.vatRate}%):
                </span>
                <span className="font-semibold">
                  {formatCurrency(calculateInvoiceTotals().vatAmount)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Totaal:</span>
                <span className="text-primary">
                  {formatCurrency(calculateInvoiceTotals().total)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              ✓ Gecloneerde Factuur Opslaan
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
            >
              Annuleren
            </button>
          </div>
          <button
            onClick={onSaveAndSendToWorkOrder}
            className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            📤 Opslaan en naar Werkorder Sturen
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Invoice Validation Modal Component
 */
