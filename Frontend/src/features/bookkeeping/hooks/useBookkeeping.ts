import { useState, useEffect, useCallback } from 'react';
import type { 
  JournalEntry, 
  JournalEntryLine, 
  VatReport, 
  PosSale, 
  CustomerDossier, 
  SupplierDossier, 
  LedgerAccount,
  PurchaseInvoice,
  FinancialStatement
} from '../types/bookkeeping.types';
import { bookkeepingService } from '../services/bookkeepingService';

export const useBookkeeping = () => {
  const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccount[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [posSales, setPosSales] = useState<PosSale[]>([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>([]);
  const [customerDossiers, setCustomerDossiers] = useState<CustomerDossier[]>([]);
  const [supplierDossiers, setSupplierDossiers] = useState<SupplierDossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [accounts, entries, sales, purchases, customers, suppliers] = await Promise.all([
        bookkeepingService.getLedgerAccounts(),
        bookkeepingService.getJournalEntries(),
        bookkeepingService.getPosSales(),
        bookkeepingService.getPurchaseInvoices(),
        bookkeepingService.getCustomerDossiers(),
        bookkeepingService.getSupplierDossiers(),
      ]);
      setLedgerAccounts(accounts);
      setJournalEntries(entries);
      setPosSales(sales);
      setPurchaseInvoices(purchases);
      setCustomerDossiers(customers);
      setSupplierDossiers(suppliers);
    } catch (error) {
      console.error('Failed to fetch bookkeeping data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getVatReport = async (startDate: string, endDate: string): Promise<VatReport> => {
    return await bookkeepingService.getVatReport(startDate, endDate);
  };

  const createJournalEntryFromInvoice = async (invoiceId: string) => {
    const entry = await bookkeepingService.createJournalEntryFromInvoice(invoiceId);
    setJournalEntries(prev => [...prev, entry]);
    await fetchData(); // Refresh ledger accounts
    return entry;
  };

  const createPosSale = async (data: Omit<PosSale, 'id' | 'saleNumber' | 'createdAt'>) => {
    const sale = await bookkeepingService.createPosSale(data);
    setPosSales(prev => [...prev, sale]);
    await fetchData(); // Refresh journal entries and ledger
    return sale;
  };

  const createManualJournalEntry = async (data: {
    date: string;
    description: string;
    entries: JournalEntryLine[];
    reference?: string;
  }) => {
    const entry = await bookkeepingService.createManualJournalEntry(data);
    setJournalEntries(prev => [...prev, entry]);
    await fetchData(); // Refresh ledger accounts
    return entry;
  };

  // Ledger Account CRUD
  const createLedgerAccount = async (data: Omit<LedgerAccount, 'id' | 'debit' | 'credit' | 'balance' | 'createdAt' | 'updatedAt'>) => {
    const account = await bookkeepingService.createLedgerAccount(data);
    await fetchData();
    return account;
  };

  const updateLedgerAccount = async (id: string, updates: Partial<LedgerAccount>) => {
    const account = await bookkeepingService.updateLedgerAccount(id, updates);
    await fetchData();
    return account;
  };

  const deleteLedgerAccount = async (id: string) => {
    await bookkeepingService.deleteLedgerAccount(id);
    await fetchData();
  };

  // Journal Entry Editing
  const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
    const entry = await bookkeepingService.updateJournalEntry(id, updates);
    await fetchData();
    return entry;
  };

  const deleteJournalEntry = async (id: string) => {
    await bookkeepingService.deleteJournalEntry(id);
    await fetchData();
  };

  const reverseJournalEntry = async (id: string) => {
    const entry = await bookkeepingService.reverseJournalEntry(id);
    await fetchData();
    return entry;
  };

  // Purchase Invoices
  const createPurchaseInvoice = async (data: Omit<PurchaseInvoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => {
    const invoice = await bookkeepingService.createPurchaseInvoice(data);
    await fetchData();
    return invoice;
  };

  const updatePurchaseInvoice = async (id: string, updates: Partial<PurchaseInvoice>) => {
    const invoice = await bookkeepingService.updatePurchaseInvoice(id, updates);
    await fetchData();
    return invoice;
  };

  const deletePurchaseInvoice = async (id: string) => {
    await bookkeepingService.deletePurchaseInvoice(id);
    await fetchData();
  };

  // Financial Statements
  const getFinancialStatement = async (startDate: string, endDate: string): Promise<FinancialStatement> => {
    return await bookkeepingService.getFinancialStatement(startDate, endDate);
  };

  return {
    ledgerAccounts,
    journalEntries,
    posSales,
    purchaseInvoices,
    customerDossiers,
    supplierDossiers,
    isLoading,
    getVatReport,
    createJournalEntryFromInvoice,
    createPosSale,
    createManualJournalEntry,
    createLedgerAccount,
    updateLedgerAccount,
    deleteLedgerAccount,
    updateJournalEntry,
    deleteJournalEntry,
    reverseJournalEntry,
    createPurchaseInvoice,
    updatePurchaseInvoice,
    deletePurchaseInvoice,
    getFinancialStatement,
    refresh: fetchData,
  };
};

