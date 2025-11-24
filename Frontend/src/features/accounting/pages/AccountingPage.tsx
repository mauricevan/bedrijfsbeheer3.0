import React, { useState } from 'react';
import { Plus, DollarSign, BarChart3, Receipt, FileText } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { SkeletonList } from '@/components/common/SkeletonList';
import { useAccounting } from '../hooks/useAccounting';
import { QuoteForm, InvoiceForm, InvoiceValidationModal, AccountingDashboard, QuotesSection, InvoicesSection } from '../components';
import type { Quote, Invoice } from '../types';
import { useWorkOrders } from '@/features/work-orders/hooks/useWorkOrders';
import { useHRM } from '@/features/hrm/hooks/useHRM';

export const AccountingPage: React.FC = () => {
  const {
    quotes,
    invoices,
    isLoading,
    createQuote,
    updateQuote,
    deleteQuote,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    convertQuoteToInvoice,
    convertQuoteToWorkOrder,
    convertInvoiceToWorkOrder,
    updateQuoteStatus,
    updateInvoiceStatus,
  } = useAccounting();
  
  const { createWorkOrder } = useWorkOrders();
  const { employees } = useHRM();
  
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'quotes' | 'invoices'>('dashboard');
  const [showDeleteQuoteConfirm, setShowDeleteQuoteConfirm] = useState(false);
  const [showDeleteInvoiceConfirm, setShowDeleteInvoiceConfirm] = useState(false);
  const [showConvertToInvoiceConfirm, setShowConvertToInvoiceConfirm] = useState(false);
  const [showConvertQuoteToWorkOrderConfirm, setShowConvertQuoteToWorkOrderConfirm] = useState(false);
  const [showConvertInvoiceToWorkOrderConfirm, setShowConvertInvoiceToWorkOrderConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [itemToConvert, setItemToConvert] = useState<string | null>(null);


  const handleCreateQuote = async (data: any) => {
    await createQuote(data);
    setShowQuoteModal(false);
    setEditingQuote(null);
  };

  const handleUpdateQuote = async (data: any) => {
    if (editingQuote) {
      await updateQuote(editingQuote.id, data);
      setShowQuoteModal(false);
      setEditingQuote(null);
    }
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setShowQuoteModal(true);
  };

  const handleDeleteQuote = (id: string) => {
    setItemToDelete(id);
    setShowDeleteQuoteConfirm(true);
  };

  const confirmDeleteQuote = async () => {
    if (itemToDelete) {
      await deleteQuote(itemToDelete);
      setItemToDelete(null);
      setShowDeleteQuoteConfirm(false);
    }
  };

  const handleCreateInvoice = async (data: any) => {
    await createInvoice(data);
    setShowInvoiceModal(false);
    setEditingInvoice(null);
  };

  const handleUpdateInvoice = async (data: any) => {
    if (editingInvoice) {
      await updateInvoice(editingInvoice.id, data);
      setShowInvoiceModal(false);
      setEditingInvoice(null);
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDeleteInvoice = (id: string) => {
    setItemToDelete(id);
    setShowDeleteInvoiceConfirm(true);
  };

  const confirmDeleteInvoice = async () => {
    if (itemToDelete) {
      await deleteInvoice(itemToDelete);
      setItemToDelete(null);
      setShowDeleteInvoiceConfirm(false);
    }
  };

  const handleConvertToInvoice = (quoteId: string) => {
    setItemToConvert(quoteId);
    setShowConvertToInvoiceConfirm(true);
  };

  const confirmConvertToInvoice = async () => {
    if (itemToConvert) {
      await convertQuoteToInvoice(itemToConvert);
      setItemToConvert(null);
      setShowConvertToInvoiceConfirm(false);
    }
  };

  const handleConvertQuoteToWorkOrder = (quoteId: string) => {
    const employeeId = employees[0]?.id || '';
    if (!employeeId) {
      alert('Geen medewerker beschikbaar. Voeg eerst een medewerker toe in HRM.');
      return;
    }
    setItemToConvert(quoteId);
    setShowConvertQuoteToWorkOrderConfirm(true);
  };

  const confirmConvertQuoteToWorkOrder = async () => {
    if (!itemToConvert) return;
    const employeeId = employees[0]?.id || '';
    if (!employeeId) return;
    
    const { quote, workOrderId } = await convertQuoteToWorkOrder(itemToConvert, employeeId);
    
    // Create work order
    await createWorkOrder({
      title: `Werkorder voor ${quote.customerName}`,
      description: quote.notes || 'Werkorder gegenereerd vanuit offerte',
      status: 'todo',
      assignedTo: employeeId,
      customerId: quote.customerId,
      location: quote.location,
      scheduledDate: quote.scheduledDate,
      materials: quote.items.map(item => ({
        inventoryItemId: item.inventoryItemId || '',
        name: item.description,
        quantity: item.quantity,
        unit: 'stuks',
      })).filter(m => m.inventoryItemId),
      estimatedHours: quote.labor?.reduce((sum, l) => sum + l.hours, 0) || 0,
      hoursSpent: 0,
      estimatedCost: quote.total,
      notes: quote.notes,
      quoteId: quote.id,
      sortIndex: 0,
    });
    
    alert(`Werkorder ${workOrderId} aangemaakt!`);
    setItemToConvert(null);
    setShowConvertQuoteToWorkOrderConfirm(false);
  };

  const handleConvertInvoiceToWorkOrder = (invoiceId: string) => {
    const employeeId = employees[0]?.id || '';
    if (!employeeId) {
      alert('Geen medewerker beschikbaar. Voeg eerst een medewerker toe in HRM.');
      return;
    }
    setItemToConvert(invoiceId);
    setShowConvertInvoiceToWorkOrderConfirm(true);
  };

  const confirmConvertInvoiceToWorkOrder = async () => {
    if (!itemToConvert) return;
    const employeeId = employees[0]?.id || '';
    if (!employeeId) return;
    
    const { invoice, workOrderId } = await convertInvoiceToWorkOrder(itemToConvert, employeeId);
    
    await createWorkOrder({
      title: `Werkorder voor ${invoice.customerName}`,
      description: invoice.notes || 'Werkorder gegenereerd vanuit factuur',
      status: 'todo',
      assignedTo: employeeId,
      customerId: invoice.customerId,
      location: invoice.location,
      scheduledDate: invoice.scheduledDate,
      materials: invoice.items.map(item => ({
        inventoryItemId: item.inventoryItemId || '',
        name: item.description,
        quantity: item.quantity,
        unit: 'stuks',
      })).filter(m => m.inventoryItemId),
      estimatedHours: invoice.labor?.reduce((sum, l) => sum + l.hours, 0) || 0,
      hoursSpent: 0,
      estimatedCost: invoice.total,
      notes: invoice.notes,
      invoiceId: invoice.id,
      sortIndex: 0,
    });
    
    alert(`Werkorder ${workOrderId} aangemaakt!`);
    setItemToConvert(null);
    setShowConvertInvoiceToWorkOrderConfirm(false);
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    if (invoice.workOrderId) {
      setSelectedInvoice(invoice);
      setShowValidationModal(true);
    } else {
      await updateInvoiceStatus(invoice.id, 'sent');
    }
  };

  const handleValidateAndSend = async () => {
    if (selectedInvoice) {
      await updateInvoiceStatus(selectedInvoice.id, 'sent');
      setShowValidationModal(false);
      setSelectedInvoice(null);
    }
  };

  const handleQuoteStatusChange = async (quoteId: string, status: Quote['status']) => {
    await updateQuoteStatus(quoteId, status);
  };

  const handleInvoiceStatusChange = async (invoiceId: string, status: Invoice['status']) => {
    await updateInvoiceStatus(invoiceId, status);
  };

  const handleMetricClick = (metric: string) => {
    // Navigate to appropriate view based on metric
    switch (metric) {
      case 'revenue':
      case 'invoiced':
        setActiveTab('invoices');
        break;
      case 'quotes':
        setActiveTab('quotes');
        break;
      case 'outstanding':
      case 'expired':
        setActiveTab('invoices');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return <SkeletonList count={5} showAvatar={false} showActions={true} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Facturen en Offerte</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Genereer offertes, facturen en beheer financiële gegevens
          </p>
        </div>
        <div className="flex gap-2">
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => {
            setEditingQuote(null);
            setShowQuoteModal(true);
          }}>
            Nieuwe Offerte
          </Button>
          <Button leftIcon={<Plus className="h-4 w-4" />} variant="secondary" onClick={() => {
            setEditingInvoice(null);
            setShowInvoiceModal(true);
          }}>
            Nieuwe Factuur
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'transactions'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          💰 Transacties
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'quotes'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="h-4 w-4" />
          📋 Offertes
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'invoices'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Receipt className="h-4 w-4" />
          🧾 Facturen
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <AccountingDashboard
          invoices={invoices}
          quotes={quotes}
          onMetricClick={handleMetricClick}
        />
      )}

      {/* Transactions Tab - Same as invoices for now */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <p className="text-slate-500 dark:text-slate-400">
            Transactie overzicht - To be implemented
          </p>
        </div>
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <QuotesSection
          quotes={quotes}
          onEdit={handleEditQuote}
          onDelete={handleDeleteQuote}
          onStatusChange={handleQuoteStatusChange}
          onConvertToInvoice={handleConvertToInvoice}
          onConvertToWorkOrder={handleConvertQuoteToWorkOrder}
          onCreateNew={() => {
            setEditingQuote(null);
            setShowQuoteModal(true);
          }}
        />
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <InvoicesSection
          invoices={invoices}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onStatusChange={handleInvoiceStatusChange}
          onSend={handleSendInvoice}
          onConvertToWorkOrder={handleConvertInvoiceToWorkOrder}
          onCreateNew={() => {
            setEditingInvoice(null);
            setShowInvoiceModal(true);
          }}
        />
      )}

      {/* Modals */}
      <Modal
        isOpen={showQuoteModal}
        onClose={() => {
          setShowQuoteModal(false);
          setEditingQuote(null);
        }}
        title={editingQuote ? 'Offerte Bewerken' : 'Nieuwe Offerte'}
        className="max-w-4xl"
      >
        <QuoteForm
          quote={editingQuote}
          onSubmit={editingQuote ? handleUpdateQuote : handleCreateQuote}
          onCancel={() => {
            setShowQuoteModal(false);
            setEditingQuote(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setEditingInvoice(null);
        }}
        title={editingInvoice ? 'Factuur Bewerken' : 'Nieuwe Factuur'}
        className="max-w-4xl"
      >
        <InvoiceForm
          invoice={editingInvoice}
          onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
          onCancel={() => {
            setShowInvoiceModal(false);
            setEditingInvoice(null);
          }}
        />
      </Modal>

      {selectedInvoice && (
        <InvoiceValidationModal
          invoice={selectedInvoice}
          isOpen={showValidationModal}
          onClose={() => {
            setShowValidationModal(false);
            setSelectedInvoice(null);
          }}
          onConfirm={handleValidateAndSend}
        />
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteQuoteConfirm}
        onClose={() => {
          setShowDeleteQuoteConfirm(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteQuote}
        title="Offerte Verwijderen"
        message="Weet u zeker dat u deze offerte wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
        confirmText="Verwijderen"
        cancelText="Annuleren"
        type="danger"
      />

      <ConfirmDialog
        isOpen={showDeleteInvoiceConfirm}
        onClose={() => {
          setShowDeleteInvoiceConfirm(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteInvoice}
        title="Factuur Verwijderen"
        message="Weet u zeker dat u deze factuur wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
        confirmText="Verwijderen"
        cancelText="Annuleren"
        type="danger"
      />

      <ConfirmDialog
        isOpen={showConvertToInvoiceConfirm}
        onClose={() => {
          setShowConvertToInvoiceConfirm(false);
          setItemToConvert(null);
        }}
        onConfirm={confirmConvertToInvoice}
        title="Offerte Converteren"
        message="Weet u zeker dat u deze offerte naar een factuur wilt converteren?"
        confirmText="Converteren"
        cancelText="Annuleren"
        type="info"
      />

      <ConfirmDialog
        isOpen={showConvertQuoteToWorkOrderConfirm}
        onClose={() => {
          setShowConvertQuoteToWorkOrderConfirm(false);
          setItemToConvert(null);
        }}
        onConfirm={confirmConvertQuoteToWorkOrder}
        title="Offerte naar Werkorder"
        message="Weet u zeker dat u deze offerte naar een werkorder wilt converteren?"
        confirmText="Converteren"
        cancelText="Annuleren"
        type="info"
      />

      <ConfirmDialog
        isOpen={showConvertInvoiceToWorkOrderConfirm}
        onClose={() => {
          setShowConvertInvoiceToWorkOrderConfirm(false);
          setItemToConvert(null);
        }}
        onConfirm={confirmConvertInvoiceToWorkOrder}
        title="Factuur naar Werkorder"
        message="Weet u zeker dat u deze factuur naar een werkorder wilt converteren?"
        confirmText="Converteren"
        cancelText="Annuleren"
        type="info"
      />
    </div>
  );
};
