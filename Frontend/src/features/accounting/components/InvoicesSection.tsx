import React, { useCallback, useState, useEffect } from 'react';
import { Receipt, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { CustomerWarningIndicator } from '@/components/common/CustomerWarningIndicator';
import { useCustomerWarningDisplay } from '@/hooks/useCustomerWarningDisplay';
import { customerWarningService } from '@/features/crm/services/customerWarningService';
import { WorkflowDetailModal } from './WorkflowDetailModal';
import type { Invoice } from '../types';

interface InvoicesSectionProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onStatusChange: (invoiceId: string, status: Invoice['status']) => void;
  onSend: (invoice: Invoice) => void;
  onConvertToWorkOrder: (invoiceId: string) => void;
  onCreateNew: () => void;
  onCloneAsQuote?: (invoice: Invoice) => Promise<void>;
  onCloneAsInvoice?: (invoice: Invoice) => Promise<void>;
  onCloneAsWorkOrder?: (invoice: Invoice) => Promise<void>;
}

export const InvoicesSection: React.FC<InvoicesSectionProps> = React.memo(({
  invoices,
  onEdit,
  onDelete,
  onStatusChange,
  onSend,
  onConvertToWorkOrder,
  onCreateNew,
  onCloneAsQuote,
  onCloneAsInvoice,
  onCloneAsWorkOrder,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [customerWarnings, setCustomerWarnings] = useState<Record<string, boolean>>({});
  const { checkAndShowWarning } = useCustomerWarningDisplay();

  useEffect(() => {
    const checkWarnings = async () => {
      const warnings: Record<string, boolean> = {};
      for (const invoice of invoices) {
        if (invoice.customerId) {
          warnings[invoice.customerId] = await customerWarningService.hasActiveWarnings(invoice.customerId);
        }
      }
      setCustomerWarnings(warnings);
    };
    checkWarnings();
  }, [invoices]);
  const handleEdit = useCallback((invoice: Invoice) => {
    onEdit(invoice);
  }, [onEdit]);

  const handleDelete = useCallback((id: string) => {
    onDelete(id);
  }, [onDelete]);

  const handleStatusChange = useCallback((invoiceId: string, status: Invoice['status']) => {
    onStatusChange(invoiceId, status);
  }, [onStatusChange]);

  const handleSend = useCallback((invoice: Invoice) => {
    onSend(invoice);
  }, [onSend]);

  const handleConvertToWorkOrder = useCallback((invoiceId: string) => {
    onConvertToWorkOrder(invoiceId);
  }, [onConvertToWorkOrder]);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="space-y-3">
        {invoices.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Geen facturen gevonden"
            description="Er zijn nog geen facturen in het systeem. Maak je eerste factuur aan om te beginnen."
            actionLabel="Nieuwe Factuur"
            onAction={onCreateNew}
            suggestions={[
              "Maak facturen aan voor geleverde diensten",
              "Converteer offertes naar facturen",
              "Houd betalingsstatus bij voor overzicht"
            ]}
          />
        ) : (
          invoices.map(invoice => (
            <Card 
              key={invoice.id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onDoubleClick={() => {
                setSelectedInvoice(invoice);
                setShowDetailModal(true);
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{invoice.invoiceNumber}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                      invoice.status === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                      invoice.status === 'cancelled' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {invoice.status === 'paid' ? 'Betaald' :
                       invoice.status === 'sent' ? 'Verzonden' :
                       invoice.status === 'overdue' ? 'Achterstallig' :
                       invoice.status === 'cancelled' ? 'Geannuleerd' :
                       'Concept'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{invoice.customerName}</p>
                    {invoice.customerId && customerWarnings[invoice.customerId] && (
                      <CustomerWarningIndicator
                        hasWarnings={true}
                        onClick={() => invoice.customerId && checkAndShowWarning(invoice.customerId, 'accounting')}
                      />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Vervaldatum: {new Date(invoice.dueDate).toLocaleDateString('nl-NL')}
                  </p>
                  {invoice.location && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">Locatie: {invoice.location}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {invoice.items.length} artikelen
                    </span>
                    {invoice.labor && invoice.labor.length > 0 && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        • {invoice.labor.length} arbeidsitems
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">€{invoice.total.toFixed(2)}</p>
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={() => handleEdit(invoice)}
                      className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="Bewerken"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                      title="Verwijderen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {invoice.status === 'draft' && (
                      <Button size="sm" onClick={() => handleSend(invoice)}>
                        Verzenden
                      </Button>
                    )}
                    {invoice.status === 'sent' && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(invoice.id, 'paid')}>
                        Markeer Betaald
                      </Button>
                    )}
                    {!invoice.workOrderId && (
                      <Button size="sm" variant="outline" onClick={() => handleConvertToWorkOrder(invoice.id)}>
                        Naar Werkorder
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedInvoice && (
        <WorkflowDetailModal
          item={selectedInvoice}
          itemType="invoice"
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedInvoice(null);
          }}
          onEdit={() => {
            setShowDetailModal(false);
            onEdit(selectedInvoice);
          }}
          onDelete={async () => {
            await onDelete(selectedInvoice.id);
            setShowDetailModal(false);
            setSelectedInvoice(null);
          }}
          onCloneAsQuote={onCloneAsQuote ? async (item) => {
            await onCloneAsQuote(item as Invoice);
            setShowDetailModal(false);
            setSelectedInvoice(null);
          } : undefined}
          onCloneAsInvoice={onCloneAsInvoice ? async (item) => {
            await onCloneAsInvoice(item as Invoice);
            setShowDetailModal(false);
            setSelectedInvoice(null);
          } : undefined}
          onCloneAsWorkOrder={onCloneAsWorkOrder ? async (item) => {
            await onCloneAsWorkOrder(item as Invoice);
            setShowDetailModal(false);
            setSelectedInvoice(null);
          } : undefined}
        />
      )}
    </div>
  );
});

InvoicesSection.displayName = 'InvoicesSection';

