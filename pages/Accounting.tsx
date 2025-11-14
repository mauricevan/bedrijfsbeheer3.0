// pages/Accounting.tsx - Refactored < 300 regels
import React from 'react';
import type {
  Transaction,
  Quote,
  Invoice,
  Customer,
  InventoryItem,
  WorkOrder,
  Employee,
  User,
  Notification,
  InventoryCategory,
} from '../types';
import { useAccounting } from '../features/accounting/hooks';
import { AccountingDashboard } from '../components/accounting/dashboard';
import { QuoteList, QuoteForm, QuoteModals } from '../components/accounting/quotes';
import { InvoiceList, InvoiceForm, InvoiceModals } from '../components/accounting/invoices';
import { TransactionList } from '../components/accounting/transactions';
import { QuoteEmailIntegration } from '../components/QuoteEmailIntegration';

interface AccountingProps {
  transactions: Transaction[];
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  customers: Customer[];
  inventory: InventoryItem[];
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  employees: Employee[];
  currentUser: User;
  isAdmin: boolean;
  notifications?: Notification[];
  setNotifications?: React.Dispatch<React.SetStateAction<Notification[]>>;
  categories?: InventoryCategory[];
}

export const Accounting: React.FC<AccountingProps> = (props) => {
  const accounting = useAccounting(props);

  const {
    activeTab,
    setActiveTab,
    dashboardView,
    setDashboardView,
    quotesHook,
    invoicesHook,
    transactionsHook,
    inventorySelection,
    dashboard,
    customers,
    employees,
    currentUser,
    inventory,
    workOrders,
    setWorkOrders,
    categories,
  } = accounting;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Financieel Beheer</h1>
        <QuoteEmailIntegration
          quotes={props.quotes}
          setQuotes={props.setQuotes}
          customers={customers}
          inventory={inventory}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'dashboard'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Transacties
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'quotes'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Offertes
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'invoices'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Facturen
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <AccountingDashboard
          stats={dashboard.stats}
          recentQuotes={dashboard.recentQuotes}
          recentInvoices={dashboard.recentInvoices}
          overdueInvoices={dashboard.stats.invoice.overdueInvoices}
          onViewInvoices={(type) => {
            setActiveTab('invoices');
            setDashboardView(type);
          }}
          onViewQuotes={(type) => {
            setActiveTab('quotes');
            setDashboardView(type);
          }}
          customers={customers}
          employees={employees}
        />
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <TransactionList
          filter={transactionsHook.filter}
          setFilter={transactionsHook.setFilter}
          filteredTransactions={transactionsHook.filteredTransactions}
        />
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <>
          <QuoteList
            quotes={props.quotes}
            customers={customers}
            employees={employees}
            onEditQuote={quotesHook.editQuote}
            onDeleteQuote={quotesHook.deleteQuote}
            onCloneQuote={quotesHook.cloneQuote}
            onUpdateStatus={quotesHook.updateQuoteStatus}
            onCreate={() => quotesHook.setShowQuoteForm(true)}
          />
          {quotesHook.showQuoteForm && (
            <QuoteForm
              quote={quotesHook.quoteForm.quote}
              onClose={() => quotesHook.setShowQuoteForm(false)}
              onSave={quotesHook.createQuote}
              customers={customers}
              inventory={inventory}
              categories={categories}
              {...inventorySelection}
            />
          )}
          <QuoteModals
            showCloneModal={quotesHook.showCloneQuoteModal}
            onCloseClone={() => quotesHook.setShowCloneQuoteModal(false)}
            onSaveClone={quotesHook.saveClonedQuote}
            showAcceptModal={quotesHook.showAcceptQuoteModal}
            onCloseAccept={() => quotesHook.setShowAcceptQuoteModal(false)}
            onAccept={quotesHook.acceptQuote}
            quoteToAccept={quotesHook.quoteToAccept}
            cloneOnAccept={quotesHook.cloneOnAccept}
            setCloneOnAccept={quotesHook.setCloneOnAccept}
          />
        </>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <>
          <InvoiceList
            invoices={props.invoices}
            customers={customers}
            employees={employees}
            workOrders={workOrders}
            onEditInvoice={invoicesHook.editInvoice}
            onDeleteInvoice={invoicesHook.deleteInvoice}
            onCloneInvoice={invoicesHook.cloneInvoice}
            onUpdateStatus={invoicesHook.updateInvoiceStatus}
            onSendReminder={invoicesHook.sendReminder}
            onCreate={() => invoicesHook.setShowInvoiceForm(true)}
            currentUser={currentUser}
          />
          {invoicesHook.showInvoiceForm && (
            <InvoiceForm
              invoice={invoicesHook.invoiceForm.invoice}
              onClose={() => invoicesHook.setShowInvoiceForm(false)}
              onSave={invoicesHook.createInvoice}
              customers={customers}
              inventory={inventory}
              categories={categories}
              workOrders={workOrders}
              {...inventorySelection}
            />
          )}
          <InvoiceModals
            showCloneModal={invoicesHook.showCloneInvoiceModal}
            onCloseClone={() => invoicesHook.setShowCloneInvoiceModal(false)}
            onSaveClone={invoicesHook.saveClonedInvoice}
            showValidationModal={invoicesHook.showInvoiceValidationModal}
            onCloseValidation={() => invoicesHook.setShowInvoiceValidationModal(false)}
            onConfirmValidation={invoicesHook.confirmInvoiceValidation}
            invoiceToValidate={invoicesHook.invoiceToValidate}
            validationChecklist={invoicesHook.validationChecklist}
            setValidationChecklist={invoicesHook.setValidationChecklist}
          />
        </>
      )}
    </div>
  );
};
