import { useState, useEffect, useCallback } from 'react';
import type { JournalEntry, JournalEntryLine, VatReport, PosSale, CustomerDossier, SupplierDossier, LedgerAccount } from '../types/bookkeeping.types';
import { bookkeepingService } from '../services/bookkeepingService';

export const useBookkeeping = () => {
  const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccount[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [posSales, setPosSales] = useState<PosSale[]>([]);
  const [customerDossiers, setCustomerDossiers] = useState<CustomerDossier[]>([]);
  const [supplierDossiers, setSupplierDossiers] = useState<SupplierDossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [accounts, entries, sales, customers, suppliers] = await Promise.all([
        bookkeepingService.getLedgerAccounts(),
        bookkeepingService.getJournalEntries(),
        bookkeepingService.getPosSales(),
        bookkeepingService.getCustomerDossiers(),
        bookkeepingService.getSupplierDossiers(),
      ]);
      setLedgerAccounts(accounts);
      setJournalEntries(entries);
      setPosSales(sales);
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
  }) => {
    const entry = await bookkeepingService.createManualJournalEntry(data);
    setJournalEntries(prev => [...prev, entry]);
    await fetchData(); // Refresh ledger accounts
    return entry;
  };

  return {
    ledgerAccounts,
    journalEntries,
    posSales,
    customerDossiers,
    supplierDossiers,
    isLoading,
    getVatReport,
    createJournalEntryFromInvoice,
    createPosSale,
    createManualJournalEntry,
    refresh: fetchData,
  };
};

