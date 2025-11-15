// components/accounting/invoices/InvoiceStatistics.tsx - < 300 lines
import React from 'react';
import type { Invoice } from '../../../types';
import { formatCurrency } from '../../../features/accounting/utils/formatters';

interface InvoiceStatisticsProps {
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  totalOverdue: number;
  paidInvoices: Invoice[];
  outstandingInvoices: Invoice[];
  overdueInvoices: Invoice[];
  onOpenOverviewModal: (type: 'all' | 'paid' | 'outstanding' | 'overdue') => void;
}

export const InvoiceStatistics: React.FC<InvoiceStatisticsProps> = ({
  totalInvoiced,
  totalPaid,
  totalOutstanding,
  totalOverdue,
  paidInvoices,
  outstandingInvoices,
  overdueInvoices,
  onOpenOverviewModal,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Invoiced */}
      <div
        onClick={() => onOpenOverviewModal('all')}
        className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-blue-700">
            Totaal Gefactureerd
          </h3>
          <span className="text-2xl group-hover:scale-110 transition-transform">
            📊
          </span>
        </div>
        <p className="text-3xl font-bold text-blue-600">
          {formatCurrency(totalInvoiced)}
        </p>
        <p className="text-xs text-blue-600 mt-1 group-hover:underline">
          Klik voor overzicht →
        </p>
      </div>

      {/* Total Paid */}
      <div
        onClick={() => onOpenOverviewModal('paid')}
        className="bg-green-50 border-2 border-green-200 p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-green-700">Betaald</h3>
          <span className="text-2xl group-hover:scale-110 transition-transform">
            ✅
          </span>
        </div>
        <p className="text-3xl font-bold text-green-600">
          {formatCurrency(totalPaid)}
        </p>
        <p className="text-xs text-green-600 mt-1">
          {paidInvoices.length} facturen
        </p>
      </div>

      {/* Total Outstanding */}
      <div
        onClick={() => onOpenOverviewModal('outstanding')}
        className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-yellow-700">Uitstaand</h3>
          <span className="text-2xl group-hover:scale-110 transition-transform">
            ⏳
          </span>
        </div>
        <p className="text-3xl font-bold text-yellow-600">
          {formatCurrency(totalOutstanding)}
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          {outstandingInvoices.length} facturen
        </p>
      </div>

      {/* Total Overdue */}
      <div
        onClick={() => onOpenOverviewModal('overdue')}
        className="bg-red-50 border-2 border-red-200 p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-red-700">Verlopen</h3>
          <span className="text-2xl group-hover:scale-110 transition-transform">
            ⚠️
          </span>
        </div>
        <p className="text-3xl font-bold text-red-600">
          {formatCurrency(totalOverdue)}
        </p>
        <p className="text-xs text-red-600 mt-1">
          {overdueInvoices.length} facturen
        </p>
      </div>
    </div>
  );
};
