// features/accounting/hooks/useAccounting.ts - Max 200 regels
import { useState } from 'react';
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
} from '../../../types';
import { useTransactions } from './useTransactions';
import { useInventorySelection } from './useInventorySelection';
import { useQuotes } from './useQuotes';
import { useInvoices } from './useInvoices';
import { useAccountingDashboard } from './useAccountingDashboard';

export interface UseAccountingProps {
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

export const useAccounting = ({
  transactions,
  quotes,
  setQuotes,
  invoices,
  setInvoices,
  customers,
  inventory,
  workOrders,
  setWorkOrders,
  employees,
  currentUser,
  isAdmin,
  notifications = [],
  setNotifications,
  categories = [],
}: UseAccountingProps) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'transactions' | 'quotes' | 'invoices'
  >('dashboard');

  // Dashboard navigation state
  const [dashboardView, setDashboardView] = useState<string | null>(null);

  // Overview modal states
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [overviewType, setOverviewType] = useState<
    'all' | 'paid' | 'outstanding' | 'overdue'
  >('all');
  const [showQuotesOverviewModal, setShowQuotesOverviewModal] = useState(false);
  const [quotesOverviewType, setQuotesOverviewType] = useState<
    'all' | 'approved' | 'sent' | 'expired'
  >('all');
  const [overviewFilter, setOverviewFilter] = useState({
    customerName: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
  });

  // Batch operations states
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [batchMode, setBatchMode] = useState(false);

  // User selection modal state
  const [showUserSelectionModal, setShowUserSelectionModal] = useState(false);
  const [conversionData, setConversionData] = useState<{
    type: 'quote' | 'invoice';
    sourceId: string;
    data: any;
  } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Inventory selection hook
  const inventorySelection = useInventorySelection(inventory, categories);

  // Transactions hook
  const transactionsHook = useTransactions(transactions);

  // Quotes hook
  const quotesHook = useQuotes(
    quotes,
    setQuotes,
    inventory,
    customers,
    employees,
    currentUser,
    workOrders,
    setWorkOrders
  );

  // Invoices hook
  const invoicesHook = useInvoices(
    invoices,
    setInvoices,
    inventory,
    customers,
    employees,
    currentUser,
    workOrders,
    setWorkOrders,
    setNotifications
  );

  // Dashboard hook
  const dashboard = useAccountingDashboard(invoices, quotes, transactions, customers);

  return {
    // Tab state
    activeTab,
    setActiveTab,
    dashboardView,
    setDashboardView,

    // Overview modals
    showOverviewModal,
    setShowOverviewModal,
    overviewType,
    setOverviewType,
    showQuotesOverviewModal,
    setShowQuotesOverviewModal,
    quotesOverviewType,
    setQuotesOverviewType,
    overviewFilter,
    setOverviewFilter,

    // Batch operations
    selectedQuotes,
    setSelectedQuotes,
    selectedInvoices,
    setSelectedInvoices,
    batchMode,
    setBatchMode,

    // User selection modal
    showUserSelectionModal,
    setShowUserSelectionModal,
    conversionData,
    setConversionData,
    selectedUserId,
    setSelectedUserId,

    // Sub-hooks
    inventorySelection,
    transactionsHook,
    quotesHook,
    invoicesHook,
    dashboard,

    // Props passed through
    customers,
    employees,
    currentUser,
    isAdmin,
    inventory,
    workOrders,
    setWorkOrders,
    categories,
  };
};
