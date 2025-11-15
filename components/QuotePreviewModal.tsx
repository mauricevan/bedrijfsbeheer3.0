// components/QuotePreviewModal.tsx - Refactored < 300 lines
import React from 'react';
import type { Quote, Customer, QuoteItem, QuoteLabor } from '../types';

interface QuotePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote | null;
  customer: Customer | null;
  onEdit?: () => void;
  onSend?: () => void;
  onPrint?: () => void;
}

export const QuotePreviewModal: React.FC<QuotePreviewModalProps> = ({
  isOpen,
  onClose,
  quote,
  customer,
  onEdit,
  onSend,
  onPrint,
}) => {
  if (!isOpen || !quote) return null;

  const calculateSubtotal = () => {
    const itemsTotal = quote.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const laborTotal = quote.labor?.reduce((sum, labor) => sum + labor.hours * labor.rate, 0) || 0;
    return itemsTotal + laborTotal;
  };

  const subtotal = calculateSubtotal();
  const vatAmount = subtotal * (quote.vatRate / 100);
  const total = subtotal + vatAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Offerte Preview</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        {/* Quote Content */}
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-bold">{quote.quoteNumber}</h3>
              <p className="text-gray-600">{customer?.name || 'Onbekend'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Datum: {quote.issueDate}</p>
              <p className="text-sm text-gray-600">Geldig tot: {quote.validUntil}</p>
            </div>
          </div>

          {/* Items */}
          {quote.items.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Materialen</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-right">Aantal</th>
                    <th className="p-2 text-right">Prijs</th>
                    <th className="p-2 text-right">Totaal</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.productName}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">€{item.price.toFixed(2)}</td>
                      <td className="p-2 text-right">€{(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Labor */}
          {quote.labor && quote.labor.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Arbeid</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Beschrijving</th>
                    <th className="p-2 text-right">Uren</th>
                    <th className="p-2 text-right">Tarief</th>
                    <th className="p-2 text-right">Totaal</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.labor.map((labor, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{labor.description}</td>
                      <td className="p-2 text-right">{labor.hours}</td>
                      <td className="p-2 text-right">€{labor.rate.toFixed(2)}</td>
                      <td className="p-2 text-right">€{(labor.hours * labor.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Subtotaal:</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>BTW ({quote.vatRate}%):</span>
              <span>€{vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Totaal:</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Opmerkingen:</h4>
              <p className="text-sm whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex gap-3">
          {onEdit && (
            <button
              onClick={() => { onEdit(); onClose(); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ✏️ Bewerken
            </button>
          )}
          {onSend && (
            <button
              onClick={() => { onSend(); onClose(); }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              📧 Verzenden
            </button>
          )}
          {onPrint && (
            <button onClick={onPrint} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              🖨️ Afdrukken
            </button>
          )}
          <button onClick={onClose} className="ml-auto px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
