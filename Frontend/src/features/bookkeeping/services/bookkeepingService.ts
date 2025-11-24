import type { 
  JournalEntry, 
  JournalEntryLine, 
  VatReport, 
  PosSale, 
  CustomerDossier, 
  SupplierDossier, 
  LedgerAccount,
  PurchaseInvoice,
  FinancialStatement,
  BalanceSheet,
  ProfitLoss,
  TrialBalanceEntry
} from '../types/bookkeeping.types';
import { storage } from '@/utils/storage';
import { accountingService } from '@/features/accounting/services/accountingService';
import { getStandardLedgerAccounts } from '../utils/standardAccounts';

const JOURNAL_ENTRIES_KEY = 'bedrijfsbeheer_journal_entries';
const POS_SALES_KEY = 'bedrijfsbeheer_pos_sales';
const LEDGER_ACCOUNTS_KEY = 'bedrijfsbeheer_ledger_accounts';
const PURCHASE_INVOICES_KEY = 'bedrijfsbeheer_purchase_invoices';

// Initialize with standard accounts if not exists
const getInitialLedgerAccounts = (): LedgerAccount[] => {
  const stored = storage.get<LedgerAccount[]>(LEDGER_ACCOUNTS_KEY, []);
  if (stored.length === 0) {
    return getStandardLedgerAccounts();
  }
  // Merge with standard accounts to ensure all standard accounts exist
  const standardAccounts = getStandardLedgerAccounts();
  const accountMap = new Map<string, LedgerAccount>();
  
  // Add stored accounts first (preserve balances)
  stored.forEach(acc => accountMap.set(acc.accountNumber, acc));
  
  // Add standard accounts that don't exist yet
  standardAccounts.forEach(acc => {
    if (!accountMap.has(acc.accountNumber)) {
      accountMap.set(acc.accountNumber, acc);
    }
  });
  
  return Array.from(accountMap.values());
};

const JOURNAL_ENTRIES = storage.get<JournalEntry[]>(JOURNAL_ENTRIES_KEY, []);
const POS_SALES = storage.get<PosSale[]>(POS_SALES_KEY, []);
const LEDGER_ACCOUNTS = getInitialLedgerAccounts();
const PURCHASE_INVOICES = storage.get<PurchaseInvoice[]>(PURCHASE_INVOICES_KEY, []);

const saveJournalEntries = () => storage.set(JOURNAL_ENTRIES_KEY, JOURNAL_ENTRIES);
const savePosSales = () => storage.set(POS_SALES_KEY, POS_SALES);
const saveLedgerAccounts = () => storage.set(LEDGER_ACCOUNTS_KEY, LEDGER_ACCOUNTS);
const savePurchaseInvoices = () => storage.set(PURCHASE_INVOICES_KEY, PURCHASE_INVOICES);

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
    account.updatedAt = new Date().toISOString();
    saveLedgerAccounts();
  }
};

const generatePurchaseInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const count = PURCHASE_INVOICES.length + 1;
  return `INK-${year}-${count.toString().padStart(4, '0')}`;
};

export const bookkeepingService = {
  // Ledger Accounts
  getLedgerAccounts: async (): Promise<LedgerAccount[]> => {
    await delay(300);
    return [...LEDGER_ACCOUNTS].filter(acc => acc.isActive);
  },

  createLedgerAccount: async (data: Omit<LedgerAccount, 'id' | 'debit' | 'credit' | 'balance' | 'createdAt' | 'updatedAt'>): Promise<LedgerAccount> => {
    await delay(500);
    
    // Check if account number already exists
    if (LEDGER_ACCOUNTS.some(acc => acc.accountNumber === data.accountNumber)) {
      throw new Error(`Rekeningnummer ${data.accountNumber} bestaat al`);
    }
    
    const newAccount: LedgerAccount = {
      ...data,
      id: `acc-${data.accountNumber}-${Date.now()}`,
      debit: 0,
      credit: 0,
      balance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    LEDGER_ACCOUNTS.push(newAccount);
    saveLedgerAccounts();
    return newAccount;
  },

  updateLedgerAccount: async (id: string, updates: Partial<LedgerAccount>): Promise<LedgerAccount> => {
    await delay(500);
    const index = LEDGER_ACCOUNTS.findIndex(acc => acc.id === id);
    if (index === -1) throw new Error('Rekening niet gevonden');
    
    const account = LEDGER_ACCOUNTS[index];
    
    // Check if account number change conflicts with existing account
    if (updates.accountNumber && updates.accountNumber !== account.accountNumber) {
      if (LEDGER_ACCOUNTS.some(acc => acc.accountNumber === updates.accountNumber && acc.id !== id)) {
        throw new Error(`Rekeningnummer ${updates.accountNumber} bestaat al`);
      }
    }
    
    const updated = {
      ...account,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    LEDGER_ACCOUNTS[index] = updated;
    saveLedgerAccounts();
    return updated;
  },

  deleteLedgerAccount: async (id: string): Promise<void> => {
    await delay(500);
    const index = LEDGER_ACCOUNTS.findIndex(acc => acc.id === id);
    if (index === -1) throw new Error('Rekening niet gevonden');
    
    const account = LEDGER_ACCOUNTS[index];
    
    // Don't delete if account has transactions
    if (account.debit !== 0 || account.credit !== 0) {
      // Deactivate instead of delete
      account.isActive = false;
      account.updatedAt = new Date().toISOString();
      LEDGER_ACCOUNTS[index] = account;
    } else {
      LEDGER_ACCOUNTS.splice(index, 1);
    }
    
    saveLedgerAccounts();
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

  createManualJournalEntry: async (data: {
    date: string;
    description: string;
    entries: JournalEntryLine[];
    reference?: string;
  }): Promise<JournalEntry> => {
    await delay(500);
    
    const entryNumber = generateJournalEntryNumber();
    
    const journalEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      entryNumber,
      date: data.date,
      description: data.description,
      entries: data.entries.map((line, index) => ({
        ...line,
        id: `line-${Date.now()}-${index}`,
      })),
      reference: data.reference,
      isManual: true,
      isReversed: false,
      createdAt: new Date().toISOString(),
    };

    // Update ledger account balances
    data.entries.forEach(line => {
      updateAccountBalance(line.accountNumber, line.debit, line.credit);
    });

    JOURNAL_ENTRIES.push(journalEntry);
    saveJournalEntries();
    return journalEntry;
  },

  updateJournalEntry: async (id: string, updates: Partial<JournalEntry>): Promise<JournalEntry> => {
    await delay(500);
    const index = JOURNAL_ENTRIES.findIndex(entry => entry.id === id);
    if (index === -1) throw new Error('Journaalpost niet gevonden');
    
    const entry = JOURNAL_ENTRIES[index];
    
    // Only allow editing manual entries
    if (!entry.isManual) {
      throw new Error('Alleen handmatige journaalposten kunnen worden bewerkt');
    }
    
    // If entries are being updated, reverse old balances and apply new ones
    if (updates.entries) {
      // Reverse old balances
      entry.entries.forEach(line => {
        updateAccountBalance(line.accountNumber, -line.debit, -line.credit);
      });
      
      // Apply new balances
      updates.entries.forEach(line => {
        updateAccountBalance(line.accountNumber, line.debit, line.credit);
      });
    }
    
    const updated: JournalEntry = {
      ...entry,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    JOURNAL_ENTRIES[index] = updated;
    saveJournalEntries();
    return updated;
  },

  deleteJournalEntry: async (id: string): Promise<void> => {
    await delay(500);
    const index = JOURNAL_ENTRIES.findIndex(entry => entry.id === id);
    if (index === -1) throw new Error('Journaalpost niet gevonden');
    
    const entry = JOURNAL_ENTRIES[index];
    
    // Only allow deleting manual entries
    if (!entry.isManual) {
      throw new Error('Alleen handmatige journaalposten kunnen worden verwijderd');
    }
    
    // Reverse balances
    entry.entries.forEach(line => {
      updateAccountBalance(line.accountNumber, -line.debit, -line.credit);
    });
    
    JOURNAL_ENTRIES.splice(index, 1);
    saveJournalEntries();
  },

  reverseJournalEntry: async (id: string): Promise<JournalEntry> => {
    await delay(500);
    const originalEntry = JOURNAL_ENTRIES.find(entry => entry.id === id);
    if (!originalEntry) throw new Error('Journaalpost niet gevonden');
    
    const entryNumber = generateJournalEntryNumber();
    
    // Create reversed entries (swap debit/credit)
    const reversedEntries: JournalEntryLine[] = originalEntry.entries.map((line, index) => ({
      ...line,
      id: `line-${Date.now()}-${index}`,
      debit: line.credit,
      credit: line.debit,
      description: `Storno: ${line.description}`,
    }));
    
    // Update balances
    reversedEntries.forEach(line => {
      updateAccountBalance(line.accountNumber, line.debit, line.credit);
    });
    
    const reversalEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      entryNumber,
      date: new Date().toISOString().split('T')[0],
      description: `Storno: ${originalEntry.description}`,
      entries: reversedEntries,
      isManual: true,
      isReversed: true,
      reversedEntryId: originalEntry.id,
      createdAt: new Date().toISOString(),
    };
    
    JOURNAL_ENTRIES.push(reversalEntry);
    saveJournalEntries();
    return reversalEntry;
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
      isManual: false,
      isReversed: false,
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
      isManual: false,
      isReversed: false,
      createdAt: new Date().toISOString(),
    };

    JOURNAL_ENTRIES.push(journalEntry);
    saveJournalEntries();
    return journalEntry;
  },

  // Purchase Invoices
  getPurchaseInvoices: async (): Promise<PurchaseInvoice[]> => {
    await delay(300);
    return [...PURCHASE_INVOICES].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  },

  createPurchaseInvoice: async (data: Omit<PurchaseInvoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<PurchaseInvoice> => {
    await delay(500);
    const newInvoice: PurchaseInvoice = {
      ...data,
      id: `purch-${Date.now()}`,
      invoiceNumber: generatePurchaseInvoiceNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    PURCHASE_INVOICES.push(newInvoice);
    savePurchaseInvoices();
    
    // Auto-create journal entry
    await bookkeepingService.createJournalEntryFromPurchaseInvoice(newInvoice.id);
    
    return newInvoice;
  },

  updatePurchaseInvoice: async (id: string, updates: Partial<PurchaseInvoice>): Promise<PurchaseInvoice> => {
    await delay(500);
    const index = PURCHASE_INVOICES.findIndex(inv => inv.id === id);
    if (index === -1) throw new Error('Inkoopfactuur niet gevonden');
    
    const updated = {
      ...PURCHASE_INVOICES[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    PURCHASE_INVOICES[index] = updated;
    savePurchaseInvoices();
    return updated;
  },

  deletePurchaseInvoice: async (id: string): Promise<void> => {
    await delay(500);
    const index = PURCHASE_INVOICES.findIndex(inv => inv.id === id);
    if (index === -1) throw new Error('Inkoopfactuur niet gevonden');
    
    // Find and delete related journal entry
    const relatedEntry = JOURNAL_ENTRIES.find(entry => entry.purchaseInvoiceId === id);
    if (relatedEntry) {
      await bookkeepingService.deleteJournalEntry(relatedEntry.id);
    }
    
    PURCHASE_INVOICES.splice(index, 1);
    savePurchaseInvoices();
  },

  createJournalEntryFromPurchaseInvoice: async (purchaseInvoiceId: string): Promise<JournalEntry> => {
    await delay(500);
    const purchaseInvoice = PURCHASE_INVOICES.find(pi => pi.id === purchaseInvoiceId);
    if (!purchaseInvoice) throw new Error('Inkoopfactuur niet gevonden');

    const entryNumber = generateJournalEntryNumber();
    const entries: JournalEntryLine[] = [];

    // Debit: Expenses/Crediteuren
    const crediteurenAccount = findAccount('1600');
    if (crediteurenAccount) {
      entries.push({
        id: `line-${Date.now()}-1`,
        accountId: crediteurenAccount.id,
        accountNumber: '1600',
        accountName: 'Crediteuren',
        debit: purchaseInvoice.total,
        credit: 0,
        description: `Inkoopfactuur ${purchaseInvoice.invoiceNumber}`,
      });
      updateAccountBalance('1600', purchaseInvoice.total, 0);
    }

    // Credit: Expense accounts and VAT based on VAT rates
    const vat21Items = purchaseInvoice.items.filter(i => i.vatRate === 21);
    const vat9Items = purchaseInvoice.items.filter(i => i.vatRate === 9);

    if (vat21Items.length > 0) {
      const expense21 = vat21Items.reduce((sum, i) => sum + i.total, 0);
      const vat21 = expense21 * 0.21;
      const netExpense21 = expense21 - vat21;

      const expenseAccount = findAccount('4000');
      if (expenseAccount) {
        entries.push({
          id: `line-${Date.now()}-2`,
          accountId: expenseAccount.id,
          accountNumber: '4000',
          accountName: 'Inkoop grondstoffen',
          debit: netExpense21,
          credit: 0,
          description: `Inkoop factuur ${purchaseInvoice.invoiceNumber}`,
        });
        updateAccountBalance('4000', netExpense21, 0);
      }

      const vatAccount = findAccount('2220'); // BTW te vorderen 21%
      if (vatAccount) {
        entries.push({
          id: `line-${Date.now()}-3`,
          accountId: vatAccount.id,
          accountNumber: '2220',
          accountName: 'BTW te vorderen 21%',
          debit: vat21,
          credit: 0,
          description: `Voorbelasting factuur ${purchaseInvoice.invoiceNumber}`,
        });
        updateAccountBalance('2220', vat21, 0);
      }
    }

    if (vat9Items.length > 0) {
      const expense9 = vat9Items.reduce((sum, i) => sum + i.total, 0);
      const vat9 = expense9 * 0.09;
      const netExpense9 = expense9 - vat9;

      const expenseAccount = findAccount('4100');
      if (expenseAccount) {
        entries.push({
          id: `line-${Date.now()}-4`,
          accountId: expenseAccount.id,
          accountNumber: '4100',
          accountName: 'Inkoop diensten',
          debit: netExpense9,
          credit: 0,
          description: `Inkoop factuur ${purchaseInvoice.invoiceNumber}`,
        });
        updateAccountBalance('4100', netExpense9, 0);
      }

      const vatAccount = findAccount('2230'); // BTW te vorderen 9%
      if (vatAccount) {
        entries.push({
          id: `line-${Date.now()}-5`,
          accountId: vatAccount.id,
          accountNumber: '2230',
          accountName: 'BTW te vorderen 9%',
          debit: vat9,
          credit: 0,
          description: `Voorbelasting factuur ${purchaseInvoice.invoiceNumber}`,
        });
        updateAccountBalance('2230', vat9, 0);
      }
    }

    const journalEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      entryNumber,
      date: purchaseInvoice.issueDate,
      description: `Inkoopfactuur ${purchaseInvoice.invoiceNumber} - ${purchaseInvoice.supplierName}`,
      entries,
      purchaseInvoiceId: purchaseInvoice.id,
      isManual: false,
      isReversed: false,
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
    const purchaseInvoices = PURCHASE_INVOICES;

    const filteredInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.issueDate || inv.createdAt);
      return invDate >= new Date(startDate) && invDate <= new Date(endDate);
    });

    const filteredPosSales = posSales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });

    const filteredPurchaseInvoices = purchaseInvoices.filter(pi => {
      const piDate = new Date(pi.issueDate);
      return piDate >= new Date(startDate) && piDate <= new Date(endDate);
    });

    // Calculate Sales VAT
    let salesVat21 = 0;
    let salesVat9 = 0;
    let salesVat0 = 0;
    let sales21 = 0;
    let sales9 = 0;
    let sales0 = 0;

    [...filteredInvoices, ...filteredPosSales].forEach(doc => {
      const items = ('items' in doc ? (doc as { items: Array<{ total: number; vatRate: number }> }).items : (doc as { items: Array<{ total: number; vatRate: number }> }).items);
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

    // Calculate Input VAT (Voorbelasting) from purchase invoices
    let inputVat21 = 0;
    let inputVat9 = 0;
    let inputVat0 = 0;
    let purchases21 = 0;
    let purchases9 = 0;
    let purchases0 = 0;

    filteredPurchaseInvoices.forEach(pi => {
      pi.items.forEach(item => {
        const total = item.total;
        if (item.vatRate === 21) {
          purchases21 += total;
          inputVat21 += total * 0.21;
        } else if (item.vatRate === 9) {
          purchases9 += total;
          inputVat9 += total * 0.09;
        } else {
          purchases0 += total;
        }
      });
    });

    // Also get input VAT from BTW te vorderen accounts (from journal entries)
    const btwTeVorderen21Account = findAccount('2220');
    const btwTeVorderen9Account = findAccount('2230');
    
    // Calculate from journal entries in period
    const periodEntries = JOURNAL_ENTRIES.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });

    periodEntries.forEach(entry => {
      entry.entries.forEach(line => {
        if (line.accountNumber === '2220' && line.debit > 0) {
          inputVat21 += line.debit;
        } else if (line.accountNumber === '2230' && line.debit > 0) {
          inputVat9 += line.debit;
        }
      });
    });

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

  // Financial Statements
  getFinancialStatement: async (startDate: string, endDate: string): Promise<FinancialStatement> => {
    await delay(500);
    
    // Get all journal entries in period
    const periodEntries = JOURNAL_ENTRIES.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });

    // Calculate trial balance
    const trialBalanceMap = new Map<string, TrialBalanceEntry>();
    
    LEDGER_ACCOUNTS.forEach(account => {
      if (account.isActive) {
        trialBalanceMap.set(account.accountNumber, {
          accountNumber: account.accountNumber,
          accountName: account.name,
          debit: 0,
          credit: 0,
          balance: 0,
        });
      }
    });

    // Sum up all transactions in period
    periodEntries.forEach(entry => {
      entry.entries.forEach(line => {
        const tbEntry = trialBalanceMap.get(line.accountNumber);
        if (tbEntry) {
          tbEntry.debit += line.debit;
          tbEntry.credit += line.credit;
        }
      });
    });

    // Calculate balances
    trialBalanceMap.forEach((entry, accountNumber) => {
      const account = findAccount(accountNumber);
      if (account) {
        entry.balance = account.type === 'asset' || account.type === 'expense'
          ? entry.debit - entry.credit
          : entry.credit - entry.debit;
      }
    });

    const trialBalance = Array.from(trialBalanceMap.values())
      .filter(entry => entry.debit !== 0 || entry.credit !== 0)
      .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber));

    // Calculate Balance Sheet
    const assets = {
      fixedAssets: trialBalance
        .filter(e => {
          const acc = findAccount(e.accountNumber);
          return acc?.type === 'asset' && acc?.category === 'Vaste Activa';
        })
        .reduce((sum, e) => sum + Math.max(0, e.balance), 0),
      currentAssets: trialBalance
        .filter(e => {
          const acc = findAccount(e.accountNumber);
          return acc?.type === 'asset' && acc?.category === 'Vlottende Activa';
        })
        .reduce((sum, e) => sum + Math.max(0, e.balance), 0),
      totalAssets: 0,
    };
    assets.totalAssets = assets.fixedAssets + assets.currentAssets;

    const liabilities = {
      equity: trialBalance
        .filter(e => {
          const acc = findAccount(e.accountNumber);
          return acc?.type === 'equity';
        })
        .reduce((sum, e) => sum + Math.max(0, e.balance), 0),
      longTermLiabilities: trialBalance
        .filter(e => {
          const acc = findAccount(e.accountNumber);
          return acc?.type === 'liability' && acc?.category === 'Langlopende Schulden';
        })
        .reduce((sum, e) => sum + Math.max(0, e.balance), 0),
      currentLiabilities: trialBalance
        .filter(e => {
          const acc = findAccount(e.accountNumber);
          return acc?.type === 'liability' && acc?.category === 'Kortlopende Schulden';
        })
        .reduce((sum, e) => sum + Math.max(0, e.balance), 0),
      totalLiabilities: 0,
    };
    liabilities.totalLiabilities = liabilities.equity + liabilities.longTermLiabilities + liabilities.currentLiabilities;

    const balanceSheet: BalanceSheet = {
      assets,
      liabilities,
      total: assets.totalAssets,
    };

    // Calculate Profit & Loss
    const revenue = trialBalance
      .filter(e => {
        const acc = findAccount(e.accountNumber);
        return acc?.type === 'revenue';
      })
      .reduce((sum, e) => sum + Math.max(0, e.balance), 0);

    const costOfSales = trialBalance
      .filter(e => {
        const acc = findAccount(e.accountNumber);
        return acc?.type === 'expense' && (acc?.accountNumber.startsWith('4000') || acc?.accountNumber.startsWith('4010'));
      })
      .reduce((sum, e) => sum + Math.abs(e.balance), 0);

    const grossProfit = revenue - costOfSales;

    const operatingExpenses = trialBalance
      .filter(e => {
        const acc = findAccount(e.accountNumber);
        return acc?.type === 'expense' && !acc?.accountNumber.startsWith('4000') && !acc?.accountNumber.startsWith('4010');
      })
      .reduce((sum, e) => sum + Math.abs(e.balance), 0);

    const operatingProfit = grossProfit - operatingExpenses;

    const otherIncome = trialBalance
      .filter(e => {
        const acc = findAccount(e.accountNumber);
        return acc?.type === 'revenue' && acc?.accountNumber === '8100';
      })
      .reduce((sum, e) => sum + Math.max(0, e.balance), 0);

    const otherExpenses = trialBalance
      .filter(e => {
        const acc = findAccount(e.accountNumber);
        return acc?.type === 'expense' && (acc?.accountNumber === '5100' || acc?.accountNumber === '5500');
      })
      .reduce((sum, e) => sum + Math.abs(e.balance), 0);

    const netProfit = operatingProfit + otherIncome - otherExpenses;

    const profitLoss: ProfitLoss = {
      revenue,
      costOfSales,
      grossProfit,
      operatingExpenses,
      operatingProfit,
      otherIncome,
      otherExpenses,
      netProfit,
    };

    return {
      period: `${startDate} - ${endDate}`,
      startDate,
      endDate,
      balanceSheet,
      profitLoss,
      trialBalance,
    };
  },
};

