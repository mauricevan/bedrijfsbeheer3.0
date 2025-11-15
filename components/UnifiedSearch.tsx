// components/UnifiedSearch.tsx - Refactored < 300 lines
import React, { useState, useMemo } from 'react';
import type { Quote, Invoice, WorkOrder, Customer, ModuleKey } from '../types';

interface SearchResult {
  id: string;
  type: 'quote' | 'invoice' | 'workorder' | 'customer';
  title: string;
  subtitle: string;
  module: ModuleKey;
}

interface UnifiedSearchProps {
  quotes: Quote[];
  invoices: Invoice[];
  workOrders: WorkOrder[];
  customers: Customer[];
  onNavigate: (module: ModuleKey, id: string) => void;
  onClose?: () => void;
}

export const UnifiedSearch: React.FC<UnifiedSearchProps> = ({
  quotes,
  invoices,
  workOrders,
  customers,
  onNavigate,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    // Search quotes
    quotes.forEach(quote => {
      const customerName = customers.find(c => c.id === quote.customerId)?.name || 'Onbekend';
      if (quote.quoteNumber.toLowerCase().includes(term) || customerName.toLowerCase().includes(term)) {
        results.push({
          id: quote.id,
          type: 'quote',
          title: quote.quoteNumber,
          subtitle: `${customerName} - €${quote.total.toFixed(2)}`,
          module: 'Accounting' as ModuleKey,
        });
      }
    });

    // Search invoices
    invoices.forEach(invoice => {
      const customerName = customers.find(c => c.id === invoice.customerId)?.name || 'Onbekend';
      if (invoice.invoiceNumber.toLowerCase().includes(term) || customerName.toLowerCase().includes(term)) {
        results.push({
          id: invoice.id,
          type: 'invoice',
          title: invoice.invoiceNumber,
          subtitle: `${customerName} - €${invoice.total.toFixed(2)}`,
          module: 'Accounting' as ModuleKey,
        });
      }
    });

    // Search work orders
    workOrders.forEach(wo => {
      if (wo.title.toLowerCase().includes(term)) {
        results.push({
          id: wo.id,
          type: 'workorder',
          title: wo.title,
          subtitle: wo.status,
          module: 'WorkOrders' as ModuleKey,
        });
      }
    });

    // Search customers
    customers.forEach(customer => {
      if (customer.name.toLowerCase().includes(term) || customer.email?.toLowerCase().includes(term)) {
        results.push({
          id: customer.id,
          type: 'customer',
          title: customer.name,
          subtitle: customer.email || customer.phone || '',
          module: 'CRM' as ModuleKey,
        });
      }
    });

    return results.slice(0, 20);
  }, [searchTerm, quotes, invoices, workOrders, customers]);

  const handleResultClick = (result: SearchResult) => {
    onNavigate(result.module, result.id);
    setSearchTerm('');
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Zoek alles..."
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Geen resultaten gevonden
            </div>
          ) : (
            <>
              <div className="p-2 text-xs text-gray-500 border-b">
                {searchResults.length} resultaten
              </div>
              {searchResults.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 text-left flex items-center gap-3"
                >
                  <span className="text-2xl">
                    {result.type === 'quote' && '📄'}
                    {result.type === 'invoice' && '🧾'}
                    {result.type === 'workorder' && '🔧'}
                    {result.type === 'customer' && '👤'}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">{result.title}</p>
                    <p className="text-sm text-gray-600">{result.subtitle}</p>
                  </div>
                  <span className="text-xs text-gray-400 uppercase">{result.type}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
