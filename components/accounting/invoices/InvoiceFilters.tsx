// components/accounting/invoices/InvoiceFilters.tsx - < 300 lines
import React from 'react';

interface InvoiceFiltersProps {
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
}

export const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  filter,
  setFilter,
  resetFilters,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
        🔍 Filters
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Klantnaam
          </label>
          <input
            type="text"
            value={filter.customerName}
            onChange={(e) =>
              setFilter({
                ...filter,
                customerName: e.target.value,
              })
            }
            placeholder="Zoek op klantnaam..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Datum vanaf
          </label>
          <input
            type="date"
            value={filter.dateFrom}
            onChange={(e) =>
              setFilter({
                ...filter,
                dateFrom: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Datum tot
          </label>
          <input
            type="date"
            value={filter.dateTo}
            onChange={(e) =>
              setFilter({
                ...filter,
                dateTo: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min. Bedrag (€)
          </label>
          <input
            type="number"
            value={filter.minAmount}
            onChange={(e) =>
              setFilter({
                ...filter,
                minAmount: e.target.value,
              })
            }
            placeholder="0.00"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max. Bedrag (€)
          </label>
          <input
            type="number"
            value={filter.maxAmount}
            onChange={(e) =>
              setFilter({
                ...filter,
                maxAmount: e.target.value,
              })
            }
            placeholder="0.00"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
          >
            🔄 Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
