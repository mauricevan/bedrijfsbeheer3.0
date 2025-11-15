// pages/Reports.tsx - Refactored < 300 lines
import React, { useState } from 'react';
import type { WorkOrder, Invoice, Quote, Transaction } from '../types';

interface ReportsProps {
  workOrders: WorkOrder[];
  invoices: Invoice[];
  quotes: Quote[];
  transactions: Transaction[];
}

export const Reports: React.FC<ReportsProps> = ({ workOrders, invoices, quotes, transactions }) => {
  const [selectedReport, setSelectedReport] = useState<'overview' | 'financial' | 'workorders' | 'quotes'>('overview');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Calculate Financial Stats
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalOutstanding = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0);
  const totalQuoted = quotes.reduce((sum, q) => sum + q.total, 0);

  // Calculate WorkOrder Stats
  const completedOrders = workOrders.filter(wo => wo.status === 'Completed').length;
  const activeOrders = workOrders.filter(wo => wo.status !== 'Completed').length;
  const totalHoursSpent = workOrders.reduce((sum, wo) => sum + (wo.hoursSpent || 0), 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Rapporten</h1>

      {/* Report Type Selector */}
      <div className="flex gap-2 mb-6 border-b">
        {['overview', 'financial', 'workorders', 'quotes'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedReport(type as any)}
            className={`px-4 py-2 font-medium ${
              selectedReport === type
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {type === 'overview' && 'Overzicht'}
            {type === 'financial' && 'Financieel'}
            {type === 'workorders' && 'Werkorders'}
            {type === 'quotes' && 'Offertes'}
          </button>
        ))}
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Van:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tot:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Overview Report */}
      {selectedReport === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700 mb-2">Totaal Gefactureerd</h3>
            <p className="text-3xl font-bold text-blue-600">€{totalInvoiced.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-green-700 mb-2">Betaald</h3>
            <p className="text-3xl font-bold text-green-600">€{totalPaid.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-700 mb-2">Uitstaand</h3>
            <p className="text-3xl font-bold text-yellow-600">€{totalOutstanding.toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-purple-700 mb-2">Geoffreerd</h3>
            <p className="text-3xl font-bold text-purple-600">€{totalQuoted.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Financial Report */}
      {selectedReport === 'financial' && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Financieel Overzicht</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span>Totaal Gefactureerd:</span>
              <span className="font-bold">€{totalInvoiced.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Betaald:</span>
              <span className="font-bold text-green-600">€{totalPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Uitstaand:</span>
              <span className="font-bold text-yellow-600">€{totalOutstanding.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Totaal Geoffreerd:</span>
              <span className="font-bold text-purple-600">€{totalQuoted.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* WorkOrders Report */}
      {selectedReport === 'workorders' && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Werkorders Overzicht</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">{workOrders.length}</p>
              <p className="text-sm text-gray-600">Totaal</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
              <p className="text-sm text-gray-600">Afgerond</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{activeOrders}</p>
              <p className="text-sm text-gray-600">Actief</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-lg">
              <span className="font-semibold">Totaal Uren:</span> {totalHoursSpent}u
            </p>
          </div>
        </div>
      )}

      {/* Quotes Report */}
      {selectedReport === 'quotes' && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Offertes Overzicht</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Totaal Offertes:</span>
              <span className="font-bold">{quotes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Goedgekeurd:</span>
              <span className="font-bold text-green-600">
                {quotes.filter(q => q.status === 'approved').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Verzonden:</span>
              <span className="font-bold text-blue-600">
                {quotes.filter(q => q.status === 'sent').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Concept:</span>
              <span className="font-bold text-gray-600">
                {quotes.filter(q => q.status === 'draft').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
