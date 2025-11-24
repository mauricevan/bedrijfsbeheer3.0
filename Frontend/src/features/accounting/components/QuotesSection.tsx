import React, { useCallback, useState } from 'react';
import { FileText, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { WorkflowDetailModal } from './WorkflowDetailModal';
import type { Quote } from '../types';

interface QuotesSectionProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (id: string) => void;
  onStatusChange: (quoteId: string, status: Quote['status']) => void;
  onConvertToInvoice: (quoteId: string) => void;
  onConvertToWorkOrder: (quoteId: string) => void;
  onCreateNew: () => void;
  onCloneAsQuote?: (quote: Quote) => Promise<void>;
  onCloneAsInvoice?: (quote: Quote) => Promise<void>;
  onCloneAsWorkOrder?: (quote: Quote) => Promise<void>;
}

export const QuotesSection: React.FC<QuotesSectionProps> = React.memo(({
  quotes,
  onEdit,
  onDelete,
  onStatusChange,
  onConvertToInvoice,
  onConvertToWorkOrder,
  onCreateNew,
  onCloneAsQuote,
  onCloneAsInvoice,
  onCloneAsWorkOrder,
}) => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const handleEdit = useCallback((quote: Quote) => {
    onEdit(quote);
  }, [onEdit]);

  const handleDelete = useCallback((id: string) => {
    onDelete(id);
  }, [onDelete]);

  const handleStatusChange = useCallback((quoteId: string, status: Quote['status']) => {
    onStatusChange(quoteId, status);
  }, [onStatusChange]);

  const handleConvertToInvoice = useCallback((quoteId: string) => {
    onConvertToInvoice(quoteId);
  }, [onConvertToInvoice]);

  const handleConvertToWorkOrder = useCallback((quoteId: string) => {
    onConvertToWorkOrder(quoteId);
  }, [onConvertToWorkOrder]);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="space-y-3">
        {quotes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Geen offertes gevonden"
            description="Er zijn nog geen offertes in het systeem. Maak je eerste offerte aan om te beginnen."
            actionLabel="Nieuwe Offerte"
            onAction={onCreateNew}
            suggestions={[
              "Maak offertes aan voor potentiële klanten",
              "Converteer offertes naar facturen wanneer geaccepteerd",
              "Bewaar offertegeschiedenis voor referentie"
            ]}
          />
        ) : (
          quotes.map(quote => (
            <Card 
              key={quote.id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onDoubleClick={() => {
                setSelectedQuote(quote);
                setShowDetailModal(true);
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{quote.quoteNumber}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quote.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                      quote.status === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      quote.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                      quote.status === 'invoiced' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300' :
                      quote.status === 'expired' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {quote.status === 'accepted' ? 'Geaccepteerd' :
                       quote.status === 'sent' ? 'Verzonden' :
                       quote.status === 'rejected' ? 'Afgewezen' :
                       quote.status === 'invoiced' ? 'Gefactureerd' :
                       quote.status === 'expired' ? 'Verlopen' :
                       'Concept'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{quote.customerName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Geldig tot: {new Date(quote.validUntil).toLocaleDateString('nl-NL')}
                  </p>
                  {quote.location && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">Locatie: {quote.location}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {quote.items.length} artikelen
                    </span>
                    {quote.labor && quote.labor.length > 0 && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        • {quote.labor.length} arbeidsitems
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">€{quote.total.toFixed(2)}</p>
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={() => handleEdit(quote)}
                      className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="Bewerken"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(quote.id)}
                      className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                      title="Verwijderen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {quote.status === 'draft' && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(quote.id, 'sent')}>
                        Verzenden
                      </Button>
                    )}
                    {quote.status === 'sent' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(quote.id, 'accepted')}>
                          Accepteren
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(quote.id, 'rejected')}>
                          Afwijzen
                        </Button>
                      </>
                    )}
                    {quote.status === 'accepted' && !quote.workOrderId && (
                      <>
                        <Button size="sm" onClick={() => handleConvertToInvoice(quote.id)}>
                          Naar Factuur
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleConvertToWorkOrder(quote.id)}>
                          Naar Werkorder
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedQuote && (
        <WorkflowDetailModal
          item={selectedQuote}
          itemType="quote"
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedQuote(null);
          }}
          onEdit={() => {
            setShowDetailModal(false);
            onEdit(selectedQuote);
          }}
          onDelete={async () => {
            await onDelete(selectedQuote.id);
            setShowDetailModal(false);
            setSelectedQuote(null);
          }}
          onCloneAsQuote={onCloneAsQuote ? async (item) => {
            await onCloneAsQuote(item as Quote);
            setShowDetailModal(false);
            setSelectedQuote(null);
          } : undefined}
          onCloneAsInvoice={onCloneAsInvoice ? async (item) => {
            await onCloneAsInvoice(item as Quote);
            setShowDetailModal(false);
            setSelectedQuote(null);
          } : undefined}
          onCloneAsWorkOrder={onCloneAsWorkOrder ? async (item) => {
            await onCloneAsWorkOrder(item as Quote);
            setShowDetailModal(false);
            setSelectedQuote(null);
          } : undefined}
        />
      )}
    </div>
  );
});

QuotesSection.displayName = 'QuotesSection';

