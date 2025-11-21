import type { JournalEntry, JournalEntryLine, VatReport, PosSale, CustomerDossier, SupplierDossier, LedgerAccount } from '../types';
import { storage } from '@/utils/storage';
import { accountingService } from '@/features/accounting/services/accountingService';

const JOURNAL_ENTRIES_KEY = 'bedrijfsbeheer_journal_entries';
const POS_SALES_KEY = 'bedrijfsbeheer_pos_sales';
const LEDGER_ACCOUNTS_KEY = 'bedrijfsbeheer_ledger_accounts';

const DEFAULT_LEDGER_ACCOUNTS: LedgerAccount[] = [
  { id: '1', accountNumber: '1300', name: 'Debiteuren', type: 'asset', debit: 0, credit: 0, balance: 0 },
  { id: '2', accountNumber: '1400', name: 'Voorraad', type: 'asset', debit: 0, credit: 0, balance: 0 },
  { id: '3', accountNumber: '1600', name: 'Crediteuren', type: 'liability', debit: 0, credit: 0, balance: 0 },
  { id: '4', accountNumber: '2200', name: 'BTW hoog 21%', type: 'liability', debit: 0, credit: 0, balance: 0 },
  { id: '5', accountNumber: '2210', name: 'BTW laag 9%', type: 'liability', debit: 0, credit: 0, balance: 0 },
  { id: '6', accountNumber: '8000', name: 'Omzet goederen 21%', type: 'revenue', debit: 0, credit: 0, balance: 0 },
  { id: '7', accountNumber: '8010', name: 'Omzet diensten 9%', type: 'revenue', debit: 0, credit: 0, balance: 0 },
  { id: '8', accountNumber: '4000', name: 'Inkoop grondstoffen', type: 'expense', debit: 0, credit: 0, balance: 0 },
];

let JOURNAL_ENTRIES = storage.get<JournalEntry[]>(JOURNAL_ENTRIES_KEY, []);
let POS_SALES = storage.get<PosSale[]>(POS_SALES_KEY, []);
let LEDGER_ACCOUNTS = storage.get<LedgerAccount[]>(LEDGER_ACCOUNTS_KEY, DEFAULT_LEDGER_ACCOUNTS);

const saveJournalEntries = () => storage.set(JOURNAL_ENTRIES_KEY, JOURNAL_ENTRIES);
const savePosSales = () => storage.set(POS_SALES_KEY, POS_SALES);
const saveLedgerAccounts = () => storage.set(LEDGER_ACCOUNTS_KEY, LEDGER_ACCOUNTS);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateJournalEntryNumber = () => {
  const year = new Date().getFullYear();
  const count = JOURNAL_ENTRIES.length + 1;
  return `JRN-${year}-${count.toString().padStart(4, '0')}`;
};

const generatePosSaleNumber = () => {
  const year = new Date().getFullYear();
  const count = POS_SALES.length + 1;
  return `POS-${year}-${count.toString().padStart(4, '0')}`;
};

const findAccount = (accountNumber: string): LedgerAccount | undefined => {
  return LEDGER_ACCOUNTS.find(acc => acc.accountNumber === accountNumber);
};

const updateAccountBalance = (accountNumber: string, debit: number, credit: number) => {
  const account = findAccount(accountNumber);
  if (account) {
    account.debit += debit;
    account.credit += credit;
    account.balance = account.type === 'asset' || account.type === 'expense' 
      ? account.debit - account.credit 
      : account.credit - account.debit;
    saveLedgerAccounts();
  }
};

export const bookkeepingService = {
  // Ledger Accounts
  getLedgerAccounts: async (): Promise<LedgerAccount[]> => {
    await delay(300);
    return [...LEDGER_ACCOUNTS];
  },

  // Journal Entries
  getJournalEntries: async (startDate?: string, endDate?: string): Promise<JournalEntry[]> => {
    await delay(300);
    let entries = [...JOURNAL_ENTRIES];
    
    if (startDate || endDate) {
      entries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        if (startDate && entryDate < new Date(startDate)) return false;
        if (endDate && entryDate > new Date(endDate)) return false;
        return true;
      });
    }
    
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  createJournalEntryFromInvoice: async (invoiceId: string): Promise<JournalEntry> => {
    await delay(500);
    const invoices = await accountingService.getInvoices();
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const entryNumber = generateJournalEntryNumber();
    const entries: JournalEntryLine[] = [];

    // Debit: Accounts Receivable (Debiteuren)
    const debiteurenAccount = findAccount('1300');
    if (debiteurenAccount) {
      entries.push({
        id: `line-${Date.now()}-1`,
        accountId: debiteurenAccount.id,
        accountNumber: '1300',
        accountName: 'Debiteuren',
        debit: invoice.total,
        credit: 0,
        description: `Factuur ${invoice.invoiceNumber}`,
      });
      updateAccountBalance('1300', invoice.total, 0);
    }

    // Credit: Revenue accounts based on VAT rates
    const vat21Items = invoice.items.filter(i => i.vatRate === 21);
    const vat9Items = invoice.items.filter(i => i.vatRate === 9);
    const vat0Items = invoice.items.filter(i => i.vatRate === 0);

    if (vat21Items.length > 0) {
      const revenue21 = vat21Items.reduce((sum, i) => sum + i.total, 0);
      const vat21 = revenue21 * 0.21;
      const netRevenue21 = revenue21 - vat21;

      const revenueAccount = findAccount('8000');
      if (revenueAccount) {
        entries.push({
          id: `line-${Date.now()}-2`,
          accountId: revenueAccount.id,
          accountNumber: '8000',
          accountName: 'Omzet goederen 21%',
          debit: 0,
          credit: netRevenue21,
          description: `Omzet factuur ${invoice.invoiceNumber}`,
        });
        updateAccountBalance('8000', 0, netRevenue21);
      }

      const vatAccount = findAccount('2200');
      if (vatAccount) {
        entries.push({
          id: `line-${Date.now()}-3`,
          accountId: vatAccount.id,
          accountNumber: '2200',
          accountName: 'BTW hoog 21%',
          debit: 0,
          credit: vat21,
          description: `BTW factuur ${invoice.invoiceNumber}`,
        });
        updateAccountBalance('2200', 0, vat21);
      }
    }

    if (vat9Items.length > 0) {
      const revenue9 = vat9Items.reduce((sum, i) => sum + i.total, 0);
      const vat9 = revenue9 * 0.09;
      const netRevenue9 = revenue9 - vat9;

      const revenueAccount = findAccount('8010');
      if (revenueAccount) {
        entries.push({
          id: `line-${Date.now()}-4`,
          accountId: revenueAccount.id,
          accountNumber: '8010',
          accountName: 'Omzet diensten 9%',
          debit: 0,
          credit: netRevenue9,
          description: `Omzet factuur ${invoice.invoiceNumber}`,
        });
        updateAccountBalance('8010', 0, netRevenue9);
      }

      const vatAccount = findAccount('2210');
      if (vatAccount) {
        entries.push({
          id: `line-${Date.now()}-5`,
          accountId: vatAccount.id,
          accountNumber: '2210',
          accountName: 'BTW laag 9%',
          debit: 0,
          credit: vat9,
          description: `BTW factuur ${invoice.invoiceNumber}`,
        });
        updateAccountBalance('2210', 0, vat9);
      }
    }

    const journalEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      entryNumber,
      date: invoice.issueDate || invoice.createdAt,
      description: `Factuur ${invoice.invoiceNumber} - ${invoice.customerName}`,
      entries,
      invoiceId: invoice.id,
      createdAt: new Date().toISOString(),
    };

    JOURNAL_ENTRIES.push(journalEntry);
    saveJournalEntries();
    return journalEntry;
  },

  createJournalEntryFromPosSale: async (posSaleId: string): Promise<JournalEntry> => {
    await delay(500);
    const posSale = POS_SALES.find(s => s.id === posSaleId);
    if (!posSale) throw new Error('POS sale not found');

    const entryNumber = generateJournalEntryNumber();
    const entries: JournalEntryLine[] = [];

    // Similar logic as invoice but for cash sales
    // Debit: Cash/Bank account (simplified as revenue)
    // Credit: Revenue and VAT accounts

    const vat21Items = posSale.items.filter(i => i.vatRate === 21);
    const vat9Items = posSale.items.filter(i => i.vatRate === 9);

    if (vat21Items.length > 0) {
      const revenue21 = vat21Items.reduce((sum, i) => sum + i.total, 0);
      const vat21 = revenue21 * 0.21;
      const netRevenue21 = revenue21 - vat21;

      const revenueAccount = findAccount('8000');
      if (revenueAccount) {
        entries.push({
          id: `line-${Date.now()}-1`,
          accountId: revenueAccount.id,
          accountNumber: '8000',
          accountName: 'Omzet goederen 21%',
          debit: 0,
          credit: netRevenue21,
          description: `Kassaverkoop ${posSale.saleNumber}`,
        });
        updateAccountBalance('8000', 0, netRevenue21);
      }

      const vatAccount = findAccount('2200');
      if (vatAccount) {
        entries.push({
          id: `line-${Date.now()}-2`,
          accountId: vatAccount.id,
          accountNumber: '2200',
          accountName: 'BTW hoog 21%',
          debit: 0,
          credit: vat21,
          description: `BTW kassaverkoop ${posSale.saleNumber}`,
        });
        updateAccountBalance('2200', 0, vat21);
      }
    }

    if (vat9Items.length > 0) {
      const revenue9 = vat9Items.reduce((sum, i) => sum + i.total, 0);
      const vat9 = revenue9 * 0.09;
      const netRevenue9 = revenue9 - vat9;

      const revenueAccount = findAccount('8010');
      if (revenueAccount) {
        entries.push({
          id: `line-${Date.now()}-3`,
          accountId: revenueAccount.id,
          accountNumber: '8010',
          accountName: 'Omzet diensten 9%',
          debit: 0,
          credit: netRevenue9,
          description: `Kassaverkoop ${posSale.saleNumber}`,
        });
        updateAccountBalance('8010', 0, netRevenue9);
      }

      const vatAccount = findAccount('2210');
      if (vatAccount) {
        entries.push({
          id: `line-${Date.now()}-4`,
          accountId: vatAccount.id,
          accountNumber: '2210',
          accountName: 'BTW laag 9%',
          debit: 0,
          credit: vat9,
          description: `BTW kassaverkoop ${posSale.saleNumber}`,
        });
        updateAccountBalance('2210', 0, vat9);
      }
    }

    const journalEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      entryNumber,
      date: posSale.date,
      description: `Kassaverkoop ${posSale.saleNumber}`,
      entries,
      posSaleId: posSale.id,
      createdAt: new Date().toISOString(),
    };

    JOURNAL_ENTRIES.push(journalEntry);
    saveJournalEntries();
    return journalEntry;
  },

  // VAT Report
  getVatReport: async (startDate: string, endDate: string): Promise<VatReport> => {
    await delay(500);
    const invoices = await accountingService.getInvoices();
    const posSales = POS_SALES;

    const filteredInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.issueDate || inv.createdAt);
      return invDate >= new Date(startDate) && invDate <= new Date(endDate);
    });

    const filteredPosSales = posSales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });

    let salesVat21 = 0;
    let salesVat9 = 0;
    let salesVat0 = 0;
    let sales21 = 0;
    let sales9 = 0;
    let sales0 = 0;

    [...filteredInvoices, ...filteredPosSales].forEach(doc => {
      const items = 'items' in doc ? doc.items : doc.items;
      items.forEach(item => {
        const total = item.total;
        if (item.vatRate === 21) {
          sales21 += total;
          salesVat21 += total * 0.21;
        } else if (item.vatRate === 9) {
          sales9 += total;
          salesVat9 += total * 0.09;
        } else {
          sales0 += total;
        }
      });
    });

    // Input VAT (simplified - would come from purchase invoices)
    const inputVat21 = 0;
    const inputVat9 = 0;
    const inputVat0 = 0;
    const purchases21 = 0;
    const purchases9 = 0;
    const purchases0 = 0;

    const vatToPay = salesVat21 + salesVat9 - inputVat21 - inputVat9;

    return {
      period: `${startDate} - ${endDate}`,
      salesVat21,
      salesVat9,
      salesVat0,
      inputVat21,
      inputVat9,
      inputVat0,
      vatToPay,
      sales21,
      sales9,
      sales0,
      purchases21,
      purchases9,
      purchases0,
    };
  },

  // POS Sales
  getPosSales: async (): Promise<PosSale[]> => {
    await delay(300);
    return [...POS_SALES].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  createPosSale: async (data: Omit<PosSale, 'id' | 'saleNumber' | 'createdAt'>): Promise<PosSale> => {
    await delay(500);
    const newSale: PosSale = {
      ...data,
      id: `pos-${Date.now()}`,
      saleNumber: generatePosSaleNumber(),
      createdAt: new Date().toISOString(),
    };
    POS_SALES.push(newSale);
    savePosSales();
    
    // Auto-create journal entry
    await bookkeepingService.createJournalEntryFromPosSale(newSale.id);
    
    return newSale;
  },

  // Dossiers
  getCustomerDossiers: async (): Promise<CustomerDossier[]> => {
    await delay(500);
    const invoices = await accountingService.getInvoices();
    const quotes = await accountingService.getQuotes();
    
    const customerMap = new Map<string, CustomerDossier>();

    invoices.forEach(inv => {
      if (!customerMap.has(inv.customerId)) {
        customerMap.set(inv.customerId, {
          customerId: inv.customerId,
          customerName: inv.customerName,
          totalInvoiced: 0,
          totalPaid: 0,
          outstandingBalance: 0,
          invoices: [],
          quotes: [],
          workOrders: [],
        });
      }
      const dossier = customerMap.get(inv.customerId)!;
      dossier.invoices.push(inv.id);
      dossier.totalInvoiced += inv.total;
      if (inv.status === 'paid') {
        dossier.totalPaid += inv.total;
        if (!dossier.lastPaymentDate || new Date(inv.paidAt || '') > new Date(dossier.lastPaymentDate)) {
          dossier.lastPaymentDate = inv.paidAt;
        }
      } else {
        dossier.outstandingBalance += inv.total;
      }
      if (!dossier.lastInvoiceDate || new Date(inv.issueDate || inv.createdAt) > new Date(dossier.lastInvoiceDate)) {
        dossier.lastInvoiceDate = inv.issueDate || inv.createdAt;
      }
    });

    quotes.forEach(quote => {
      if (customerMap.has(quote.customerId)) {
        customerMap.get(quote.customerId)!.quotes.push(quote.id);
      }
    });

    return Array.from(customerMap.values());
  },

  getSupplierDossiers: async (): Promise<SupplierDossier[]> => {
    await delay(500);
    // Simplified - would integrate with purchase orders
    return [];
  },
};

