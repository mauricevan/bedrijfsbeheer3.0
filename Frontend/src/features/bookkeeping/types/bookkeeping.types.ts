export interface LedgerAccount {
  id: string;
  accountNumber: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category?: string; // e.g., 'Vaste Activa', 'Vlottende Activa'
  debit: number;
  credit: number;
  balance: number;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JournalEntryAudit {
  id: string;
  entryId: string;
  action: 'created' | 'updated' | 'deleted' | 'reversed';
  userId?: string;
  userName?: string;
  timestamp: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  entries: JournalEntryLine[];
  invoiceId?: string;
  posSaleId?: string;
  purchaseInvoiceId?: string;
  reference?: string; // External reference number
  isManual: boolean; // true for manual entries, false for auto-generated
  isReversed: boolean; // true if this is a reversal entry
  reversedEntryId?: string; // ID of entry that was reversed
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  createdByName?: string;
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export interface VatReport {
  period: string;
  salesVat21: number;
  salesVat9: number;
  salesVat0: number;
  inputVat21: number;
  inputVat9: number;
  inputVat0: number;
  vatToPay: number;
  sales21: number;
  sales9: number;
  sales0: number;
  purchases21: number;
  purchases9: number;
  purchases0: number;
}

export interface PosSale {
  id: string;
  saleNumber: string;
  date: string;
  items: PosSaleItem[];
  subtotal: number;
  totalVat: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'other';
  employeeId: string;
  employeeName: string;
  createdAt: string;
}

export interface PosSaleItem {
  id: string;
  inventoryItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  vatRate: 0 | 9 | 21;
  total: number;
}

export interface CustomerDossier {
  customerId: string;
  customerName: string;
  totalInvoiced: number;
  totalPaid: number;
  outstandingBalance: number;
  invoices: string[]; // Invoice IDs
  quotes: string[]; // Quote IDs
  workOrders: string[]; // Work Order IDs
  lastInvoiceDate?: string;
  lastPaymentDate?: string;
}

export interface SupplierDossier {
  supplierId: string;
  supplierName: string;
  totalPurchased: number;
  totalPaid: number;
  outstandingBalance: number;
  purchaseOrders: string[]; // Purchase Order IDs
  invoices: string[]; // Invoice IDs
  lastPurchaseDate?: string;
  lastPaymentDate?: string;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string; // Supplier invoice number
  supplierId: string;
  supplierName: string;
  supplierEmail?: string;
  issueDate: string;
  dueDate: string;
  items: PurchaseInvoiceItem[];
  subtotal: number;
  totalVat: number;
  total: number;
  status: 'draft' | 'received' | 'paid' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface PurchaseInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: 0 | 9 | 21;
  total: number;
}

export interface FinancialStatement {
  period: string;
  startDate: string;
  endDate: string;
  balanceSheet: BalanceSheet;
  profitLoss: ProfitLoss;
  trialBalance: TrialBalanceEntry[];
}

export interface BalanceSheet {
  assets: {
    fixedAssets: number;
    currentAssets: number;
    totalAssets: number;
  };
  liabilities: {
    equity: number;
    longTermLiabilities: number;
    currentLiabilities: number;
    totalLiabilities: number;
  };
  total: number;
}

export interface ProfitLoss {
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingProfit: number;
  otherIncome: number;
  otherExpenses: number;
  netProfit: number;
}

export interface TrialBalanceEntry {
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
}

