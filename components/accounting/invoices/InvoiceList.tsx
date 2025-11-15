// components/accounting/invoices/InvoiceList.tsx - < 300 lines
import React from 'react';
import type { Invoice, Customer, Employee, WorkOrder } from '../../../types';
import { InvoiceItem } from './InvoiceItem';

interface InvoiceListPropsSimplified {
  invoices: Invoice[];
  customers: Customer[];
  employees: Employee[];
  workOrders: WorkOrder[];
  onEditInvoice: (invoiceId: string) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onCloneInvoice: (invoiceId: string) => void;
  onUpdateStatus: (invoiceId: string, status: Invoice['status']) => void;
  onSendReminder: (invoiceId: string, reminderNumber: 1 | 2) => void;
  onCreate: () => void;
  currentUser: { id?: string; name: string; role?: string };
}

export const InvoiceList: React.FC<InvoiceListPropsSimplified> = ({
  invoices,
  customers,
  employees,
  workOrders,
  onEditInvoice,
  onDeleteInvoice,
  onCloneInvoice,
  onUpdateStatus,
  onSendReminder,
  onCreate,
  currentUser,
}) => {
  // Calculate statistics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const outstandingInvoices = invoices.filter(inv => inv.status === 'sent');
  const totalOutstanding = outstandingInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const overdueInvoices = invoices.filter(inv => {
    if (inv.status !== 'sent') return false;
    const dueDate = new Date(inv.dueDate);
    return dueDate < new Date();
  });
  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div>
      {/* Action Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Facturen</h2>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Nieuwe Factuur
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700">Totaal Gefactureerd</h3>
          <p className="text-3xl font-bold text-blue-600">€{totalInvoiced.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-700">Betaald</h3>
          <p className="text-3xl font-bold text-green-600">€{totalPaid.toFixed(2)}</p>
          <p className="text-xs text-green-600">{paidInvoices.length} facturen</p>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-700">Uitstaand</h3>
          <p className="text-3xl font-bold text-yellow-600">€{totalOutstanding.toFixed(2)}</p>
          <p className="text-xs text-yellow-600">{outstandingInvoices.length} facturen</p>
        </div>
        <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-700">Verlopen</h3>
          <p className="text-3xl font-bold text-red-600">€{totalOverdue.toFixed(2)}</p>
          <p className="text-xs text-red-600">{overdueInvoices.length} facturen</p>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Alle Facturen</h3>

        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nog geen facturen aangemaakt</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <InvoiceItem
                key={invoice.id}
                invoice={invoice}
                customers={customers}
                workOrders={workOrders}
                onEdit={onEditInvoice}
                onClone={onCloneInvoice}
                onConvertToWorkOrder={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
