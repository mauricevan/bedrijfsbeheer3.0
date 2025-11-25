import { useState, useEffect, useCallback } from 'react';
import type { Quote, Invoice, CreateQuoteInput, UpdateQuoteInput, CreateInvoiceInput, UpdateInvoiceInput } from '../types';
import { accountingService } from '../services/accountingService';

export const useAccounting = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [quotesData, invoicesData] = await Promise.all([
        accountingService.getQuotes(),
        accountingService.getInvoices(),
      ]);
      setQuotes(quotesData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Failed to fetch accounting data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createQuote = async (data: CreateQuoteInput) => {
    const newQuote = await accountingService.createQuote(data);
    setQuotes(prev => [...prev, newQuote]);
    return newQuote;
  };

  const updateQuote = async (id: string, updates: UpdateQuoteInput) => {
    const updated = await accountingService.updateQuote(id, updates);
    setQuotes(prev => prev.map(q => q.id === id ? updated : q));
    return updated;
  };

  const deleteQuote = async (id: string) => {
    await accountingService.deleteQuote(id);
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  const createInvoice = async (data: CreateInvoiceInput) => {
    const newInvoice = await accountingService.createInvoice(data);
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = async (id: string, updates: UpdateInvoiceInput) => {
    const updated = await accountingService.updateInvoice(id, updates);
    setInvoices(prev => prev.map(i => i.id === id ? updated : i));
    return updated;
  };

  const deleteInvoice = async (id: string) => {
    await accountingService.deleteInvoice(id);
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  const convertQuoteToInvoice = async (quoteId: string) => {
    const invoice = await accountingService.convertQuoteToInvoice(quoteId);
    setInvoices(prev => [...prev, invoice]);
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'invoiced' as const } : q));
    return invoice;
  };

  const convertQuoteToWorkOrder = async (quoteId: string, employeeId: string) => {
    return await accountingService.convertQuoteToWorkOrder(quoteId, employeeId);
  };

  const convertInvoiceToWorkOrder = async (invoiceId: string, employeeId: string) => {
    return await accountingService.convertInvoiceToWorkOrder(invoiceId, employeeId);
  };

  const updateQuoteStatus = async (id: string, status: Quote['status']) => {
    const updated = await accountingService.updateQuoteStatus(id, status);
    setQuotes(prev => prev.map(q => q.id === id ? updated : q));
    return updated;
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['status']) => {
    const updated = await accountingService.updateInvoiceStatus(id, status);
    setInvoices(prev => prev.map(i => i.id === id ? updated : i));
    return updated;
  };

  const cloneQuote = async (quoteId: string) => {
    const cloned = await accountingService.cloneQuote(quoteId);
    setQuotes(prev => [...prev, cloned]);
    return cloned;
  };

  const cloneInvoice = async (invoiceId: string) => {
    const cloned = await accountingService.cloneInvoice(invoiceId);
    setInvoices(prev => [...prev, cloned]);
    return cloned;
  };

  const cloneAsQuote = async (sourceId: string, sourceType: 'quote' | 'invoice' | 'workorder') => {
    try {
      const cloned = await accountingService.cloneAsQuote(sourceId, sourceType);
      setQuotes(prev => [...prev, cloned]);
      return cloned;
    } catch (error) {
      console.error('Error cloning as quote:', error);
      // Re-throw with a proper Error object to ensure consistent error handling
      const errorMessage = error instanceof Error ? error.message : 'Failed to clone as quote';
      throw new Error(errorMessage);
    }
  };

  const cloneAsInvoice = async (sourceId: string, sourceType: 'quote' | 'invoice' | 'workorder') => {
    try {
      const cloned = await accountingService.cloneAsInvoice(sourceId, sourceType);
      setInvoices(prev => [...prev, cloned]);
      return cloned;
    } catch (error) {
      console.error('Error cloning as invoice:', error);
      // Re-throw with a proper Error object to ensure consistent error handling
      const errorMessage = error instanceof Error ? error.message : 'Failed to clone as invoice';
      throw new Error(errorMessage);
    }
  };

  return {
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
    cloneQuote,
    cloneInvoice,
    cloneAsQuote,
    cloneAsInvoice,
    refresh: fetchData,
  };
};
