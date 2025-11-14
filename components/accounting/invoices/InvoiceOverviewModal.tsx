// components/accounting/invoices/InvoiceOverviewModal.tsx - < 300 lines
import React from 'react';
import type { Invoice, Customer, WorkOrder } from '../../../types';
import { formatCurrency } from '../../../features/accounting/utils/formatters';
import {
  filterInvoices,
  calculateFilteredInvoiceTotal,
  type InvoiceFilterOptions,
} from '../../../features/accounting/utils/filters';
import { InvoiceFilters } from './InvoiceFilters';
import { InvoiceItem } from './InvoiceItem';

interface InvoiceOverviewModalProps {
  show: boolean;
  onClose: () => void;
  type: 'all' | 'paid' | 'outstanding' | 'overdue';
  filter: {
    customerName: string;
    dateFrom: string;
    dateTo: string;
    minAmount: string;
    maxAmount: string;
  };
  setFilter: React.Dispatch<React.SetStateAction<{
    customerName: string;
    dateFrom: string;
    dateTo: string;
    minAmount: string;
    maxAmount: string;
  }>>;
  resetFilters: () => void;
  invoices: Invoice[];
  customers: Customer[];
  workOrders: WorkOrder[];
  onEdit: (invoiceId: string) => void;
  onClone: (invoiceId: string) => void;
  onConvertToWorkOrder: (invoiceId: string) => void;
}

export const InvoiceOverviewModal: React.FC<InvoiceOverviewModalProps> = ({
  show,
  onClose,
  type,
  filter,
  setFilter,
  resetFilters,
  invoices,
  customers,
  workOrders,
  onEdit,
  onClone,
  onConvertToWorkOrder,
}) => {
  if (!show) return null;

  const getFilteredInvoices = () => {
    const filterOptions: InvoiceFilterOptions = {
      type,
      customerName: filter.customerName,
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
      minAmount: filter.minAmount ? parseFloat(filter.minAmount) : undefined,
      maxAmount: filter.maxAmount ? parseFloat(filter.maxAmount) : undefined,
    };
    return filterInvoices(invoices, customers, filterOptions);
  };

  const getFilteredTotal = () => {
    return calculateFilteredInvoiceTotal(getFilteredInvoices());
  };

  const handleClose = () => {
    onClose();
    resetFilters();
  };

  const getTitle = () => {
    switch (type) {
      case 'all': return '📊 Totaal Gefactureerd';
      case 'paid': return '✅ Betaalde Facturen';
      case 'outstanding': return '⏳ Uitstaande Facturen';
      case 'overdue': return '⚠️ Verlopen Facturen';
    }
  };

  const filteredInvoices = getFilteredInvoices();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-none sm:rounded-lg shadow-2xl w-full sm:max-w-6xl sm:w-full h-full sm:h-auto sm:my-8 sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral flex items-center gap-3">
              {getTitle()}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Info banner for paid invoices */}
          {type === 'paid' && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">
                    Betaalde facturen zijn verplaatst naar Boekhouding & Dossier
                  </p>
                  <p className="text-xs text-blue-700">
                    Alle betaalde facturen zijn automatisch geregistreerd in het{' '}
                    <span className="font-semibold">Boekhouding & Dossier</span> module.
                    Ga daarheen voor een volledig overzicht van alle betaalde facturen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <InvoiceFilters
            filter={filter}
            setFilter={setFilter}
            resetFilters={resetFilters}
          />

          {/* Total Summary */}
          <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">
                Totaal Gefilterd:
              </span>
              <span className="text-3xl font-bold text-blue-600">
                {formatCurrency(getFilteredTotal())}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {filteredInvoices.length} facturen gevonden
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                🔍 Geen facturen gevonden met deze filters
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <InvoiceItem
                  key={invoice.id}
                  invoice={invoice}
                  customers={customers}
                  workOrders={workOrders}
                  onEdit={(id) => {
                    onClose();
                    onEdit(id);
                  }}
                  onClone={(id) => {
                    onClose();
                    onClone(id);
                  }}
                  onConvertToWorkOrder={(id) => {
                    onClose();
                    onConvertToWorkOrder(id);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-semibold"
          >
            ✓ Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
