import React, { useState, useMemo } from 'react';
import { 
  FileText, Receipt, Wrench, Calendar, MapPin, User, DollarSign, Clock, 
  Package, History, Copy, X, ArrowRight, CheckCircle, Eye, Send, 
  FileCheck, RefreshCw, Edit, Trash2, UserPlus, Archive
} from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { Quote, Invoice } from '../types';
import type { WorkOrder } from '@/features/work-orders/types';
import { useAccounting } from '../hooks/useAccounting';
import { useWorkOrders } from '@/features/work-orders/hooks/useWorkOrders';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useHRM } from '@/features/hrm/hooks/useHRM';
import { useToast } from '@/context/ToastContext';

type WorkflowItem = Quote | Invoice | WorkOrder;

interface WorkflowDetailModalProps {
  item: WorkflowItem | null;
  itemType: 'quote' | 'invoice' | 'workorder';
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: (item: WorkflowItem) => void;
  onCloneAsQuote?: (item: WorkflowItem) => void;
  onCloneAsInvoice?: (item: WorkflowItem) => void;
  onCloneAsWorkOrder?: (item: WorkflowItem) => void;
}

export const WorkflowDetailModal: React.FC<WorkflowDetailModalProps> = ({
  item,
  itemType,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onArchive,
  onCloneAsQuote,
  onCloneAsInvoice,
  onCloneAsWorkOrder,
}) => {
  const { quotes, invoices } = useAccounting();
  const { workOrders } = useWorkOrders({ userId: '', userName: '' });
  const { user } = useAuth();
  const { employees } = useHRM();
  const { showToast } = useToast();
  
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [cloneTarget, setCloneTarget] = useState<'quote' | 'invoice' | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get related documents
  const relatedDocuments = useMemo(() => {
    if (!item) return { quote: null, invoice: null, workOrder: null };

    let relatedQuote: Quote | null = null;
    let relatedInvoice: Invoice | null = null;
    let relatedWorkOrder: WorkOrder | null = null;

    if (itemType === 'quote') {
      const quote = item as Quote;
      if (quote.workOrderId) {
        relatedWorkOrder = workOrders.find(wo => wo.id === quote.workOrderId) || null;
      }
      relatedInvoice = invoices.find(inv => inv.quoteId === quote.id) || null;
    } else if (itemType === 'invoice') {
      const invoice = item as Invoice;
      if (invoice.quoteId) {
        relatedQuote = quotes.find(q => q.id === invoice.quoteId) || null;
      }
      if (invoice.workOrderId) {
        relatedWorkOrder = workOrders.find(wo => wo.id === invoice.workOrderId) || null;
      }
    } else if (itemType === 'workorder') {
      const workOrder = item as WorkOrder;
      if (workOrder.quoteId) {
        relatedQuote = quotes.find(q => q.id === workOrder.quoteId) || null;
      }
      if (workOrder.invoiceId) {
        relatedInvoice = invoices.find(inv => inv.id === workOrder.invoiceId) || null;
      }
    }

    return { quote: relatedQuote, invoice: relatedInvoice, workOrder: relatedWorkOrder };
  }, [item, itemType, quotes, invoices, workOrders]);

  if (!item) return null;

  const handleClone = (target: 'quote' | 'invoice') => {
    setCloneTarget(target);
    setShowCloneDialog(true);
  };

  const confirmClone = async () => {
    if (!item || !cloneTarget) return;

    try {
      if (cloneTarget === 'quote' && onCloneAsQuote) {
        await onCloneAsQuote(item);
        showToast({ type: 'success', message: 'Offerte gekloond en aangemaakt!' });
      } else if (cloneTarget === 'invoice' && onCloneAsInvoice) {
        await onCloneAsInvoice(item);
        showToast({ type: 'success', message: 'Factuur gekloond en aangemaakt!' });
      }
      setShowCloneDialog(false);
      setCloneTarget(null);
    } catch (error) {
      showToast({ type: 'error', message: 'Fout bij klonen. Probeer opnieuw.' });
    }
  };

  const handleCloneAsWorkOrder = async () => {
    if (!item || !onCloneAsWorkOrder) return;
    
    try {
      await onCloneAsWorkOrder(item);
      showToast({ type: 'success', message: 'Werkorder gekloond en aangemaakt!' });
    } catch (error) {
      showToast({ type: 'error', message: 'Fout bij klonen. Probeer opnieuw.' });
    }
  };

  const getItemTitle = () => {
    if (itemType === 'quote') {
      const quote = item as Quote;
      return `Offerte: ${quote.quoteNumber}`;
    } else if (itemType === 'invoice') {
      const invoice = item as Invoice;
      return `Factuur: ${invoice.invoiceNumber}`;
    } else {
      const workOrder = item as WorkOrder;
      return `Werkorder: ${workOrder.workOrderNumber || workOrder.title}`;
    }
  };

  const getItemIcon = () => {
    if (itemType === 'quote') return FileText;
    if (itemType === 'invoice') return Receipt;
    return Wrench;
  };

  const renderQuoteDetails = (quote: Quote) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Klant</p>
            <p className="font-medium text-slate-900 dark:text-white">{quote.customerName}</p>
          </div>
        </div>
        {quote.customerEmail && (
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p className="font-medium text-slate-900 dark:text-white">{quote.customerEmail}</p>
            </div>
          </div>
        )}
        {quote.location && (
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Locatie</p>
              <p className="font-medium text-slate-900 dark:text-white">{quote.location}</p>
            </div>
          </div>
        )}
        {quote.scheduledDate && (
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Geplande datum</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {new Date(quote.scheduledDate).toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Geldig tot</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {new Date(quote.validUntil).toLocaleDateString('nl-NL')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Totaal</p>
            <p className="font-medium text-slate-900 dark:text-white">€{quote.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {quote.items && quote.items.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Artikelen ({quote.items.length})
          </h3>
          <div className="space-y-2">
            {quote.items.map((item, idx) => (
              <div key={idx} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{item.description}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.quantity} × €{item.unitPrice.toFixed(2)} (BTW {item.vatRate}%)
                    </p>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">€{item.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {quote.labor && quote.labor.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Arbeid ({quote.labor.length})
          </h3>
          <div className="space-y-2">
            {quote.labor.map((labor, idx) => (
              <div key={idx} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{labor.description}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {labor.hours} uur × €{labor.hourlyRate.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">€{labor.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Subtotaal</p>
          <p className="font-medium text-slate-900 dark:text-white">€{quote.subtotal.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">BTW</p>
          <p className="font-medium text-slate-900 dark:text-white">€{quote.totalVat.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Totaal</p>
          <p className="font-bold text-lg text-slate-900 dark:text-white">€{quote.total.toFixed(2)}</p>
        </div>
      </div>
    </>
  );

  const renderInvoiceDetails = (invoice: Invoice) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Klant</p>
            <p className="font-medium text-slate-900 dark:text-white">{invoice.customerName}</p>
          </div>
        </div>
        {invoice.customerEmail && (
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p className="font-medium text-slate-900 dark:text-white">{invoice.customerEmail}</p>
            </div>
          </div>
        )}
        {invoice.location && (
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Locatie</p>
              <p className="font-medium text-slate-900 dark:text-white">{invoice.location}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Factuurdatum</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {new Date(invoice.issueDate).toLocaleDateString('nl-NL')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Vervaldatum</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {new Date(invoice.dueDate).toLocaleDateString('nl-NL')}
            </p>
          </div>
        </div>
        {invoice.paidDate && (
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Betaald op</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {new Date(invoice.paidDate).toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Totaal</p>
            <p className="font-medium text-slate-900 dark:text-white">€{invoice.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {invoice.items && invoice.items.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Artikelen ({invoice.items.length})
          </h3>
          <div className="space-y-2">
            {invoice.items.map((item, idx) => (
              <div key={idx} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{item.description}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.quantity} × €{item.unitPrice.toFixed(2)} (BTW {item.vatRate}%)
                    </p>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">€{item.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {invoice.labor && invoice.labor.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Arbeid ({invoice.labor.length})
          </h3>
          <div className="space-y-2">
            {invoice.labor.map((labor, idx) => (
              <div key={idx} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{labor.description}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {labor.hours} uur × €{labor.hourlyRate.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">€{labor.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Subtotaal</p>
          <p className="font-medium text-slate-900 dark:text-white">€{invoice.subtotal.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">BTW</p>
          <p className="font-medium text-slate-900 dark:text-white">€{invoice.totalVat.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Totaal</p>
          <p className="font-bold text-lg text-slate-900 dark:text-white">€{invoice.total.toFixed(2)}</p>
        </div>
      </div>
    </>
  );

  const renderWorkOrderDetails = (workOrder: WorkOrder) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workOrder.assignedToName && (
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Toegewezen aan</p>
              <p className="font-medium text-slate-900 dark:text-white">{workOrder.assignedToName}</p>
            </div>
          </div>
        )}
        {workOrder.customerName && (
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Klant</p>
              <p className="font-medium text-slate-900 dark:text-white">{workOrder.customerName}</p>
            </div>
          </div>
        )}
        {workOrder.location && (
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Locatie</p>
              <p className="font-medium text-slate-900 dark:text-white">{workOrder.location}</p>
            </div>
          </div>
        )}
        {workOrder.scheduledDate && (
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Geplande datum</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {new Date(workOrder.scheduledDate).toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>
        )}
        {workOrder.completedDate && (
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Voltooid op</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {new Date(workOrder.completedDate).toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Geschatte uren</p>
            <p className="font-medium text-slate-900 dark:text-white">{workOrder.estimatedHours} uur</p>
          </div>
        </div>
        {workOrder.hoursSpent > 0 && (
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Gewerkte uren</p>
              <p className="font-medium text-slate-900 dark:text-white">{workOrder.hoursSpent} uur</p>
            </div>
          </div>
        )}
        {workOrder.estimatedCost > 0 && (
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Geschatte kosten</p>
              <p className="font-medium text-slate-900 dark:text-white">€{workOrder.estimatedCost.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {workOrder.materials && workOrder.materials.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Benodigde Materialen ({workOrder.materials.length})
          </h3>
          <div className="space-y-2">
            {workOrder.materials.map((material, index) => (
              <div
                key={index}
                className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{material.name}</p>
                    {material.inventoryItemId && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">Uit voorraad</p>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {material.quantity} {material.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderRelatedDocuments = () => {
    const { quote, invoice, workOrder } = relatedDocuments;
    if (!quote && !invoice && !workOrder) return null;

    return (
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Gerelateerde Documenten
        </h3>
        <div className="space-y-2">
          {quote && (
            <div className="p-3 border border-indigo-200 dark:border-indigo-800 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Offerte {quote.quoteNumber}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Status: {quote.status === 'accepted' ? 'Geaccepteerd' : quote.status === 'sent' ? 'Verzonden' : 'Concept'}
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">€{quote.total.toFixed(2)}</p>
              </div>
            </div>
          )}
          {invoice && (
            <div className="p-3 border border-emerald-200 dark:border-emerald-800 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Factuur {invoice.invoiceNumber}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Status: {invoice.status === 'paid' ? 'Betaald' : invoice.status === 'sent' ? 'Verzonden' : 'Concept'}
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">€{invoice.total.toFixed(2)}</p>
              </div>
            </div>
          )}
          {workOrder && (
            <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Werkorder {workOrder.workOrderNumber || workOrder.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Status: {workOrder.status === 'completed' ? 'Voltooid' : workOrder.status === 'in_progress' ? 'Bezig' : 'Te Doen'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNotes = () => {
    let notes: string | undefined;
    if (itemType === 'quote') {
      notes = (item as Quote).notes;
    } else if (itemType === 'invoice') {
      notes = (item as Invoice).notes;
    } else {
      notes = (item as WorkOrder).notes;
    }

    if (!notes) return null;

    return (
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Notities
        </h3>
        <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{notes}</p>
        </div>
      </div>
    );
  };

  const renderJourney = () => {
    let journey: import('@/features/tracking/types/tracking.types').DocumentJourneyEntry[] | undefined;
    if (itemType === 'quote') {
      journey = (item as Quote).journey;
    } else if (itemType === 'invoice') {
      journey = (item as Invoice).journey;
    } else {
      journey = (item as WorkOrder).journey;
    }

    if (!journey || journey.length === 0) return null;

    return (
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <History className="h-5 w-5" />
          Journey & Geschiedenis
        </h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            {[...journey].reverse().map((entry, index) => (
              <div key={entry.id || index} className="relative flex gap-4">
                <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-500 dark:border-indigo-400 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium text-slate-900 dark:text-white">{entry.action || entry.stage}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(entry.timestamp).toLocaleString('nl-NL')}
                      </span>
                    </div>
                    {entry.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">{entry.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <User className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {entry.performedByName || entry.performedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ItemIcon = getItemIcon();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={getItemTitle()} className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header with status */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900">
                <ItemIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                {itemType === 'quote' && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    (item as Quote).status === 'accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                    (item as Quote).status === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    (item as Quote).status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                    (item as Quote).status === 'invoiced' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300' :
                    (item as Quote).status === 'expired' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {(item as Quote).status === 'accepted' ? 'Geaccepteerd' :
                     (item as Quote).status === 'sent' ? 'Verzonden' :
                     (item as Quote).status === 'rejected' ? 'Afgewezen' :
                     (item as Quote).status === 'invoiced' ? 'Gefactureerd' :
                     (item as Quote).status === 'expired' ? 'Verlopen' :
                     'Concept'}
                  </span>
                )}
                {itemType === 'invoice' && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    (item as Invoice).status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                    (item as Invoice).status === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    (item as Invoice).status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                    (item as Invoice).status === 'cancelled' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
                    {(item as Invoice).status === 'paid' ? 'Betaald' :
                     (item as Invoice).status === 'sent' ? 'Verzonden' :
                     (item as Invoice).status === 'overdue' ? 'Achterstallig' :
                     (item as Invoice).status === 'cancelled' ? 'Geannuleerd' :
                     'Concept'}
                  </span>
                )}
                {itemType === 'workorder' && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    (item as WorkOrder).status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                    (item as WorkOrder).status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    (item as WorkOrder).status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {(item as WorkOrder).status === 'completed' ? 'Voltooid' :
                     (item as WorkOrder).status === 'in_progress' ? 'Bezig' :
                     (item as WorkOrder).status === 'pending' ? 'In Afwachting' :
                     'Te Doen'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {(itemType === 'workorder' ? (item as WorkOrder).description : null) && (
            <p className="text-slate-600 dark:text-slate-400">{(item as WorkOrder).description}</p>
          )}

          {/* Details */}
          {itemType === 'quote' && renderQuoteDetails(item as Quote)}
          {itemType === 'invoice' && renderInvoiceDetails(item as Invoice)}
          {itemType === 'workorder' && renderWorkOrderDetails(item as WorkOrder)}

          {/* Related Documents */}
          {renderRelatedDocuments()}

          {/* Notes */}
          {renderNotes()}

          {/* Journey */}
          {renderJourney()}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-2">
              <Button
                variant="outline"
                leftIcon={<Copy className="h-4 w-4" />}
                onClick={() => {
                  if (itemType === 'quote' || itemType === 'invoice') {
                    handleClone('quote');
                  } else {
                    handleCloneAsWorkOrder();
                  }
                }}
              >
                Klonen als Offerte
              </Button>
              {(itemType === 'quote' || itemType === 'workorder') && (
                <Button
                  variant="outline"
                  leftIcon={<Copy className="h-4 w-4" />}
                  onClick={() => handleClone('invoice')}
                >
                  Klonen als Factuur
                </Button>
              )}
              {itemType === 'quote' && (
                <Button
                  variant="outline"
                  leftIcon={<Copy className="h-4 w-4" />}
                  onClick={handleCloneAsWorkOrder}
                >
                  Klonen als Werkorder
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {onDelete && (
                <Button variant="outline" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setShowDeleteConfirm(true)}>
                  Verwijderen
                </Button>
              )}
              {onArchive && itemType === 'workorder' && (item as WorkOrder).status === 'completed' && !(item as WorkOrder).isArchived && (
                <Button variant="outline" leftIcon={<Archive className="h-4 w-4" />} onClick={() => onArchive(item)}>
                  Archiveren
                </Button>
              )}
              {onEdit && (
                <Button leftIcon={<Edit className="h-4 w-4" />} onClick={onEdit}>
                  Bewerken
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Clone Dialog */}
      {showCloneDialog && cloneTarget && (
        <ConfirmDialog
          isOpen={showCloneDialog}
          onClose={() => {
            setShowCloneDialog(false);
            setCloneTarget(null);
          }}
          onConfirm={confirmClone}
          title={`Klonen als ${cloneTarget === 'quote' ? 'Offerte' : 'Factuur'}`}
          message={`Weet je zeker dat je dit document wilt klonen als een nieuwe ${cloneTarget === 'quote' ? 'offerte' : 'factuur'}?`}
          confirmLabel="Klonen"
          cancelLabel="Annuleren"
        />
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && onDelete && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            onDelete();
            setShowDeleteConfirm(false);
          }}
          title="Document verwijderen"
          message="Weet je zeker dat je dit document wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
          confirmLabel="Verwijderen"
          cancelLabel="Annuleren"
          variant="danger"
        />
      )}
    </>
  );
};

