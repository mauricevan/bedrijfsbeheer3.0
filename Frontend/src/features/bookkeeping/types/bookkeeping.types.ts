export interface LedgerAccount {
  id: string;
  accountNumber: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  debit: number;
  credit: number;
  balance: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  entries: JournalEntryLine[];
  invoiceId?: string;
  posSaleId?: string;
  createdAt: string;
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

