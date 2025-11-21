/**
 * Accounting Filters Utilities
 * Pure filtering and search functions
 */

import type { Quote, Invoice } from '../types/accounting.types';

/**
 * Filter quotes by search term
 */
export const filterQuotesBySearch = (
  quotes: Quote[],
  searchTerm: string
): Quote[] => {
  if (!searchTerm) return quotes;

  const searchLower = searchTerm.toLowerCase();

  return quotes.filter((quote) => {
    // Search in quote number
    if (quote.quoteNumber.toLowerCase().includes(searchLower)) return true;

    // Search in customer name
    if (quote.customerName.toLowerCase().includes(searchLower)) return true;

    // Search in customer email
    if (quote.customerEmail?.toLowerCase().includes(searchLower)) return true;

    // Search in location
    if (quote.location?.toLowerCase().includes(searchLower)) return true;

    // Search in notes
    if (quote.notes?.toLowerCase().includes(searchLower)) return true;

    // Search in total amount
    if (quote.total.toString().includes(searchLower)) return true;

    return false;
  });
};

/**
 * Filter quotes by status
 */
export const filterQuotesByStatus = (
  quotes: Quote[],
  status: string | null
): Quote[] => {
  if (!status) return quotes;
  return quotes.filter((quote) => quote.status === status);
};

/**
 * Filter quotes by customer
 */
export const filterQuotesByCustomer = (
  quotes: Quote[],
  customerId: string | null
): Quote[] => {
  if (!customerId) return quotes;
  return quotes.filter((quote) => quote.customerId === customerId);
};

/**
 * Filter invoices by search term
 */
export const filterInvoicesBySearch = (
  invoices: Invoice[],
  searchTerm: string
): Invoice[] => {
  if (!searchTerm) return invoices;

  const searchLower = searchTerm.toLowerCase();

  return invoices.filter((invoice) => {
    // Search in invoice number
    if (invoice.invoiceNumber.toLowerCase().includes(searchLower)) return true;

    // Search in customer name
    if (invoice.customerName.toLowerCase().includes(searchLower)) return true;

    // Search in customer email
    if (invoice.customerEmail?.toLowerCase().includes(searchLower)) return true;

    // Search in location
    if (invoice.location?.toLowerCase().includes(searchLower)) return true;

    // Search in notes
    if (invoice.notes?.toLowerCase().includes(searchLower)) return true;

    // Search in total amount
    if (invoice.total.toString().includes(searchLower)) return true;

    return false;
  });
};

/**
 * Filter invoices by status
 */
export const filterInvoicesByStatus = (
  invoices: Invoice[],
  status: string | null
): Invoice[] => {
  if (!status) return invoices;
  return invoices.filter((invoice) => invoice.status === status);
};

/**
 * Filter invoices by customer
 */
export const filterInvoicesByCustomer = (
  invoices: Invoice[],
  customerId: string | null
): Invoice[] => {
  if (!customerId) return invoices;
  return invoices.filter((invoice) => invoice.customerId === customerId);
};

/**
 * Filter invoices by date range
 */
export const filterInvoicesByDateRange = (
  invoices: Invoice[],
  startDate: string | null,
  endDate: string | null
): Invoice[] => {
  let filtered = invoices;

  if (startDate) {
    filtered = filtered.filter(
      (invoice) => invoice.issueDate >= startDate
    );
  }

  if (endDate) {
    filtered = filtered.filter(
      (invoice) => invoice.issueDate <= endDate
    );
  }

  return filtered;
};

/**
 * Get overdue invoices
 */
export const getOverdueInvoices = (invoices: Invoice[]): Invoice[] => {
  const today = new Date().toISOString().split('T')[0];
  return invoices.filter(
    (invoice) =>
      invoice.status === 'sent' &&
      invoice.dueDate < today &&
      !invoice.paidDate
  );
};

