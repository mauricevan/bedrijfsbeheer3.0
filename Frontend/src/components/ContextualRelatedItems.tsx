/**
 * Contextual Related Items Component
 * Shows related items across modules
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Quote, Invoice } from '@/features/accounting/types/accounting.types';
import type { WorkOrder } from '@/features/work-orders/types/workOrder.types';

type RelatedItem = {
  id: string;
  type: 'quote' | 'invoice' | 'workorder';
  label: string;
  status?: string;
  amount?: number;
  date?: string;
  onClick: () => void;
};

type ContextualRelatedItemsProps = {
  title: string;
  items: RelatedItem[];
  onClose?: () => void;
};

export const ContextualRelatedItems: React.FC<ContextualRelatedItemsProps> = ({
  title,
  items,
  onClose,
}) => {
  if (items.length === 0) return null;

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return '📋';
      case 'invoice':
        return '🧾';
      case 'workorder':
        return '📦';
      default:
        return '📄';
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'quote':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'invoice':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'workorder':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-l-4 border-indigo-500 dark:bg-slate-800 dark:border-indigo-400">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-neutral flex items-center gap-2 dark:text-white">
          <span>🔗</span>
          {title}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg dark:text-slate-400 dark:hover:text-slate-200"
            title="Sluiten"
          >
            ×
          </button>
        )}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`w-full text-left p-3 rounded-lg border-l-4 hover:shadow-md transition-all ${getItemColor(
              item.type
            )} dark:hover:bg-opacity-30`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-lg">{getItemIcon(item.type)}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm text-neutral dark:text-white">
                    {item.label}
                  </p>
                  {item.status && (
                    <span className="text-xs text-gray-600 mt-1 inline-block dark:text-slate-400">
                      Status: {item.status}
                    </span>
                  )}
                  {item.date && (
                    <p className="text-xs text-gray-500 mt-1 dark:text-slate-500">
                      {new Date(item.date).toLocaleDateString('nl-NL')}
                    </p>
                  )}
                </div>
              </div>
              {item.amount !== undefined && (
                <div className="text-right">
                  <p className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                    €{item.amount.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Helper function to get related items for a quote
 */
export function getRelatedItemsForQuote(
  quote: Quote,
  invoices: Invoice[],
  workOrders: WorkOrder[],
  navigate: ReturnType<typeof useNavigate>
): RelatedItem[] {
  const items: RelatedItem[] = [];

  // Related work order
  if (quote.workOrderId) {
    const workOrder = workOrders.find((wo) => wo.id === quote.workOrderId);
    if (workOrder) {
      items.push({
        id: workOrder.id,
        type: 'workorder',
        label: `Werkorder ${workOrder.id}`,
        status: workOrder.status,
        date: workOrder.createdAt,
        onClick: () => navigate('/work-orders'),
      });
    }
  }

  // Related invoice (if quote was converted)
  const relatedInvoice = invoices.find((inv) => inv.quoteId === quote.id);
  if (relatedInvoice) {
    items.push({
      id: relatedInvoice.id,
      type: 'invoice',
      label: `Factuur ${relatedInvoice.invoiceNumber}`,
      status: relatedInvoice.status === 'paid' ? 'Betaald' : relatedInvoice.status,
      amount: relatedInvoice.total,
      date: relatedInvoice.issueDate,
      onClick: () => navigate('/accounting'),
    });
  }

  return items;
}

/**
 * Helper function to get related items for an invoice
 */
export function getRelatedItemsForInvoice(
  invoice: Invoice,
  quotes: Quote[],
  workOrders: WorkOrder[],
  navigate: ReturnType<typeof useNavigate>
): RelatedItem[] {
  const items: RelatedItem[] = [];

  // Related quote
  if (invoice.quoteId) {
    const quote = quotes.find((q) => q.id === invoice.quoteId);
    if (quote) {
      items.push({
        id: quote.id,
        type: 'quote',
        label: `Offerte ${quote.quoteNumber}`,
        status: quote.status === 'accepted' ? 'Geaccepteerd' : quote.status,
        amount: quote.total,
        date: quote.createdAt,
        onClick: () => navigate('/accounting'),
      });
    }
  }

  // Related work order
  if (invoice.workOrderId) {
    const workOrder = workOrders.find((wo) => wo.id === invoice.workOrderId);
    if (workOrder) {
      items.push({
        id: workOrder.id,
        type: 'workorder',
        label: `Werkorder ${workOrder.id}`,
        status: workOrder.status,
        date: workOrder.createdAt,
        onClick: () => navigate('/work-orders'),
      });
    }
  }

  return items;
}

/**
 * Helper function to get related items for a work order
 */
export function getRelatedItemsForWorkOrder(
  workOrder: WorkOrder,
  quotes: Quote[],
  invoices: Invoice[],
  navigate: ReturnType<typeof useNavigate>
): RelatedItem[] {
  const items: RelatedItem[] = [];

  // Related quote
  if (workOrder.quoteId) {
    const quote = quotes.find((q) => q.id === workOrder.quoteId);
    if (quote) {
      items.push({
        id: quote.id,
        type: 'quote',
        label: `Offerte ${quote.quoteNumber}`,
        status: quote.status === 'accepted' ? 'Geaccepteerd' : quote.status,
        amount: quote.total,
        date: quote.createdAt,
        onClick: () => navigate('/accounting'),
      });
    }
  }

  // Related invoice
  if (workOrder.invoiceId) {
    const invoice = invoices.find((inv) => inv.id === workOrder.invoiceId);
    if (invoice) {
      items.push({
        id: invoice.id,
        type: 'invoice',
        label: `Factuur ${invoice.invoiceNumber}`,
        status: invoice.status === 'paid' ? 'Betaald' : invoice.status,
        amount: invoice.total,
        date: invoice.issueDate,
        onClick: () => navigate('/accounting'),
      });
    }
  }

  return items;
}

