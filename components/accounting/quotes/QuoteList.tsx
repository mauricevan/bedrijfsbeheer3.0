// components/accounting/quotes/QuoteList.tsx - Refactored < 300 lines
import React from 'react';
import type { Quote, Customer, Employee } from '../../../types';

interface QuoteListPropsSimplified {
  quotes: Quote[];
  customers: Customer[];
  employees: Employee[];
  onEditQuote: (quoteId: string) => void;
  onDeleteQuote: (quoteId: string) => void;
  onCloneQuote: (quoteId: string) => void;
  onUpdateStatus: (quoteId: string, status: Quote['status']) => void;
  onCreate: () => void;
}

export const QuoteList: React.FC<QuoteListPropsSimplified> = ({
  quotes,
  customers,
  employees,
  onEditQuote,
  onDeleteQuote,
  onCloneQuote,
  onUpdateStatus,
  onCreate,
}) => {
  // Calculate statistics
  const totalQuoted = quotes.reduce((sum, q) => sum + q.total, 0);
  const approvedQuotes = quotes.filter(q => q.status === 'approved');
  const totalApproved = approvedQuotes.reduce((sum, q) => sum + q.total, 0);
  const sentQuotes = quotes.filter(q => q.status === 'sent');
  const totalSent = sentQuotes.reduce((sum, q) => sum + q.total, 0);
  const expiredQuotes = quotes.filter(q => q.status === 'expired');
  const totalExpired = expiredQuotes.reduce((sum, q) => sum + q.total, 0);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Onbekend';
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Action Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Offertes</h2>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Nieuwe Offerte
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700">Totaal Geoffreerd</h3>
          <p className="text-3xl font-bold text-blue-600">€{totalQuoted.toFixed(2)}</p>
          <p className="text-xs text-blue-600">{quotes.length} offertes</p>
        </div>
        <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-700">Goedgekeurd</h3>
          <p className="text-3xl font-bold text-green-600">€{totalApproved.toFixed(2)}</p>
          <p className="text-xs text-green-600">{approvedQuotes.length} offertes</p>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-700">Verzonden</h3>
          <p className="text-3xl font-bold text-purple-600">€{totalSent.toFixed(2)}</p>
          <p className="text-xs text-purple-600">{sentQuotes.length} offertes</p>
        </div>
        <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-orange-700">Verlopen</h3>
          <p className="text-3xl font-bold text-orange-600">€{totalExpired.toFixed(2)}</p>
          <p className="text-xs text-orange-600">{expiredQuotes.length} offertes</p>
        </div>
      </div>

      {/* Quote List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Alle Offertes</h3>

        {quotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nog geen offertes aangemaakt</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{quote.quoteNumber}</h4>
                    <p className="text-sm text-gray-600">{getCustomerName(quote.customerId)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">€{quote.total.toFixed(2)}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-semibold">Datum:</span>
                    <p>{quote.issueDate}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Geldig tot:</span>
                    <p>{quote.validUntil}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Items:</span>
                    <p>{quote.items.length} items</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onEditQuote(quote.id)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                  >
                    ✏️ Bewerken
                  </button>
                  <button
                    onClick={() => onCloneQuote(quote.id)}
                    className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                  >
                    📋 Klonen
                  </button>
                  {quote.status === 'draft' && (
                    <button
                      onClick={() => onUpdateStatus(quote.id, 'sent')}
                      className="flex-1 px-3 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600"
                    >
                      📤 Verzenden
                    </button>
                  )}
                  {quote.status === 'sent' && (
                    <button
                      onClick={() => onUpdateStatus(quote.id, 'approved')}
                      className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                    >
                      ✓ Goedkeuren
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteQuote(quote.id)}
                    className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
