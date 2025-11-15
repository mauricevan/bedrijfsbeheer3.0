// features/accounting/utils/validators.ts - Refactored < 150 lines
import type { QuoteItem } from '../../../types';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface QuoteFormData {
  customerId: string;
  items: QuoteItem[];
  validUntil: string;
  vatRate?: number;
  notes?: string;
}

export interface InvoiceFormData {
  customerId: string;
  items: QuoteItem[];
  issueDate: string;
  dueDate: string;
  vatRate?: number;
  notes?: string;
  paymentTerms?: string;
}

const fail = (message: string): ValidationResult => ({ isValid: false, message });
const pass = (): ValidationResult => ({ isValid: true });

export const validateQuoteForm = (data: QuoteFormData): ValidationResult => {
  if (!data.customerId) return fail('Klant is verplicht!');
  if (!data.items?.length) return fail('Minimaal 1 item is verplicht!');
  if (!data.validUntil) return fail('Geldig tot datum is verplicht!');
  if (isNaN(Date.parse(data.validUntil))) return fail('Ongeldige datum formaat!');
  return pass();
};

export const validateInvoiceForm = (data: InvoiceFormData): ValidationResult => {
  if (!data.customerId) return fail('Klant is verplicht!');
  if (!data.items?.length) return fail('Minimaal 1 item is verplicht!');
  if (!data.issueDate) return fail('Factuurdatum is verplicht!');
  if (!data.dueDate) return fail('Vervaldatum is verplicht!');
  if (isNaN(Date.parse(data.issueDate))) return fail('Ongeldig factuurdatum formaat!');
  if (isNaN(Date.parse(data.dueDate))) return fail('Ongeldig vervaldatum formaat!');
  if (new Date(data.dueDate) < new Date(data.issueDate))
    return fail('Vervaldatum moet na factuurdatum zijn!');
  return pass();
};

export const validateQuoteItems = (items: QuoteItem[]): ValidationResult => {
  if (!items?.length) return fail('Minimaal 1 item is verplicht!');
  for (const item of items) {
    if (!item.description && !item.inventoryItemId)
      return fail('Elk item moet een beschrijving of inventaris item hebben!');
    if (!item.quantity || item.quantity <= 0)
      return fail('Elk item moet een hoeveelheid groter dan 0 hebben!');
    if (item.price === undefined || item.price < 0)
      return fail('Elk item moet een prijs hebben!');
  }
  return pass();
};

export const validateInvoiceItems = (items: QuoteItem[]): ValidationResult => {
  return validateQuoteItems(items);
};

export const validateVatRate = (vatRate: number): ValidationResult => {
  if (vatRate < 0 || vatRate > 100) return fail('BTW percentage moet tussen 0 en 100 zijn!');
  return pass();
};

export const validateCustomerId = (customerId: string): ValidationResult => {
  if (!customerId) return fail('Klant is verplicht!');
  return pass();
};

export const validateDate = (date: string, fieldName: string = 'Datum'): ValidationResult => {
  if (!date) return fail(`${fieldName} is verplicht!`);
  if (isNaN(Date.parse(date))) return fail(`Ongeldige ${fieldName.toLowerCase()} formaat!`);
  return pass();
};

export const validateDateRange = (fromDate: string, toDate: string): ValidationResult => {
  if (!fromDate || !toDate) return fail('Beide datums zijn verplicht!');
  if (isNaN(Date.parse(fromDate)) || isNaN(Date.parse(toDate)))
    return fail('Ongeldige datum formaat!');
  if (new Date(toDate) < new Date(fromDate))
    return fail('Einddatum moet na begindatum zijn!');
  return pass();
};

export const validateAmount = (amount: number, fieldName: string = 'Bedrag'): ValidationResult => {
  if (amount === undefined || amount === null) return fail(`${fieldName} is verplicht!`);
  if (amount < 0) return fail(`${fieldName} moet positief zijn!`);
  return pass();
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email) return fail('Email is verplicht!');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return fail('Ongeldige email formaat!');
  return pass();
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) return pass(); // Phone is optional in most cases
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) return fail('Ongeldige telefoonnummer formaat!');
  return pass();
};

export const validateNonEmpty = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') return fail(`${fieldName} is verplicht!`);
  return pass();
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): ValidationResult => {
  if (!value || value.length < minLength)
    return fail(`${fieldName} moet minimaal ${minLength} tekens bevatten!`);
  return pass();
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): ValidationResult => {
  if (value && value.length > maxLength)
    return fail(`${fieldName} mag maximaal ${maxLength} tekens bevatten!`);
  return pass();
};

export const validateNumericRange = (value: number, min: number, max: number, fieldName: string): ValidationResult => {
  if (value < min || value > max)
    return fail(`${fieldName} moet tussen ${min} en ${max} zijn!`);
  return pass();
};
