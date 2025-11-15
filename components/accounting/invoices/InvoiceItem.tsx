// components/accounting/invoices/InvoiceItem.tsx - < 300 lines
import React from 'react';
import type { Invoice, Customer, WorkOrder } from '../../../types';
import {
  getCustomerName,
  getInvoiceStatusColor,
  getWorkOrderStatus,
  getWorkOrderBadge,
} from '../../../features/accounting/utils/helpers';
import { formatCurrency } from '../../../features/accounting/utils/formatters';

interface InvoiceItemProps {
  invoice: Invoice;
  customers: Customer[];
  workOrders: WorkOrder[];
  onEdit: (invoiceId: string) => void;
  onClone: (invoiceId: string) => void;
  onConvertToWorkOrder: (invoiceId: string) => void;
}

export const InvoiceItem: React.FC<InvoiceItemProps> = ({
  invoice,
  customers,
  workOrders,
  onEdit,
  onClone,
  onConvertToWorkOrder,
}) => {
  const workOrder = getWorkOrderStatus(invoice.workOrderId, workOrders);
  const badge = getWorkOrderBadge(workOrder);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧾</span>
          <div>
            <p className="font-semibold text-lg text-gray-800">
              {invoice.invoiceNumber}
            </p>
            <p className="text-sm text-gray-600">
              {getCustomerName(invoice.customerId, customers)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(invoice.total)}
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getInvoiceStatusColor(
              invoice.status
            )}`}
          >
            {invoice.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mt-3">
        <div>
          <span className="font-semibold">Factuurdatum:</span>
          <p>{invoice.issueDate}</p>
        </div>
        <div>
          <span className="font-semibold">Vervaldatum:</span>
          <p>{invoice.dueDate}</p>
        </div>
        <div>
          <span className="font-semibold">Betalingstermijn:</span>
          <p>{invoice.paymentTerms}</p>
        </div>
        {invoice.paidDate && (
          <div>
            <span className="font-semibold">Betaald op:</span>
            <p>{invoice.paidDate}</p>
          </div>
        )}
      </div>

      {badge && (
        <div className="mt-3">
          <span
            className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border-2 ${badge.color}`}
          >
            {badge.icon} {badge.text}
          </span>
        </div>
      )}

      {invoice.notes && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
          <strong>Notities:</strong> {invoice.notes}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          onClick={() => onEdit(invoice.id)}
          className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          title="Factuur bewerken"
        >
          ✏️ Bewerken
        </button>
        <button
          onClick={() => onClone(invoice.id)}
          className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors font-semibold"
          title="Factuur clonen"
        >
          📋 Clonen
        </button>
        {(invoice.status === 'sent' || invoice.status === 'draft') &&
          !invoice.workOrderId && (
            <button
              onClick={() => onConvertToWorkOrder(invoice.id)}
              className="flex-1 px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              title="Verzend naar werkorder"
            >
              📤 Naar Werkorder
            </button>
          )}
      </div>
    </div>
  );
};
