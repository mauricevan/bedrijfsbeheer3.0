import React, { useState } from 'react';
import { FileText, Plus, DollarSign, Send, Check, X, Edit, Trash2, ClipboardList, Eye, BarChart3, Receipt } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { useAccounting } from '../hooks/useAccounting';
import { QuoteForm, InvoiceForm, InvoiceValidationModal, AccountingDashboard } from '../components';
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
  const [showQuoteDetail, setShowQuoteDetail] = useState(false);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'quotes' | 'invoices'>('dashboard');

  const totalQuoted = quotes.reduce((sum, q) => sum + q.total, 0);
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
  const outstanding = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + i.total, 0);
  const overdue = invoices.filter(i => {
    if (i.status === 'paid' || i.status === 'cancelled') return false;
    return new Date(i.dueDate) < new Date();
  }).reduce((sum, i) => sum + i.total, 0);

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

  const handleDeleteQuote = async (id: string) => {
    if (window.confirm('Weet u zeker dat u deze offerte wilt verwijderen?')) {
      await deleteQuote(id);
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

  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Weet u zeker dat u deze factuur wilt verwijderen?')) {
      await deleteInvoice(id);
    }
  };

  const handleConvertToInvoice = async (quoteId: string) => {
    if (window.confirm('Weet u zeker dat u deze offerte naar een factuur wilt converteren?')) {
      await convertQuoteToInvoice(quoteId);
    }
  };

  const handleConvertQuoteToWorkOrder = async (quoteId: string) => {
    const employeeId = employees[0]?.id || '';
    if (!employeeId) {
      alert('Geen medewerker beschikbaar. Voeg eerst een medewerker toe in HRM.');
      return;
    }
    
    if (window.confirm('Weet u zeker dat u deze offerte naar een werkorder wilt converteren?')) {
      const { quote, workOrderId } = await convertQuoteToWorkOrder(quoteId, employeeId);
      
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
    }
  };

  const handleConvertInvoiceToWorkOrder = async (invoiceId: string) => {
    const employeeId = employees[0]?.id || '';
    if (!employeeId) {
      alert('Geen medewerker beschikbaar. Voeg eerst een medewerker toe in HRM.');
      return;
    }
    
    if (window.confirm('Weet u zeker dat u deze factuur naar een werkorder wilt converteren?')) {
      const { invoice, workOrderId } = await convertInvoiceToWorkOrder(invoiceId, employeeId);
      
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
    }
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
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
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="space-y-3">
            {quotes.length === 0 ? (
              <Card className="p-8 text-center text-slate-500 dark:text-slate-400">
                Geen offertes gevonden
              </Card>
            ) : (
              quotes.map(quote => (
                <Card key={quote.id} className="p-4 hover:shadow-md transition-shadow">
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
                          onClick={() => handleEditQuote(quote)}
                          className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                          title="Bewerken"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                          title="Verwijderen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {quote.status === 'draft' && (
                          <Button size="sm" variant="outline" onClick={() => handleQuoteStatusChange(quote.id, 'sent')}>
                            Verzenden
                          </Button>
                        )}
                        {quote.status === 'sent' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleQuoteStatusChange(quote.id, 'accepted')}>
                              Accepteren
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleQuoteStatusChange(quote.id, 'rejected')}>
                              Afwijzen
                            </Button>
                          </>
                        )}
                        {quote.status === 'accepted' && !quote.workOrderId && (
                          <>
                            <Button size="sm" onClick={() => handleConvertToInvoice(quote.id)}>
                              Naar Factuur
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleConvertQuoteToWorkOrder(quote.id)}>
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
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="space-y-3">
            {invoices.length === 0 ? (
              <Card className="p-8 text-center text-slate-500 dark:text-slate-400">
                Geen facturen gevonden
              </Card>
            ) : (
              invoices.map(invoice => (
                <Card key={invoice.id} className="p-4 hover:shadow-md transition-shadow">
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
                      <p className="text-sm text-slate-600 dark:text-slate-300">{invoice.customerName}</p>
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
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                          title="Bewerken"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                          title="Verwijderen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {invoice.status === 'draft' && (
                          <Button size="sm" onClick={() => handleSendInvoice(invoice)}>
                            Verzenden
                          </Button>
                        )}
                        {invoice.status === 'sent' && (
                          <Button size="sm" variant="outline" onClick={() => handleInvoiceStatusChange(invoice.id, 'paid')}>
                            Markeer Betaald
                          </Button>
                        )}
                        {!invoice.workOrderId && (
                          <Button size="sm" variant="outline" onClick={() => handleConvertInvoiceToWorkOrder(invoice.id)}>
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
        </div>
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
    </div>
  );
};
