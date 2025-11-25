export type DocumentStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'invoiced' | 'expired';
export type VatRate = 0 | 9 | 21;

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: VatRate;
  discount: number;
  total: number;
  inventoryItemId?: string; // Link to inventory item if applicable
}

export interface LaborItem {
  id: string;
  description: string;
  hours: number;
  hourlyRate: number;
  total: number;
}

export interface Quote {
  id: string;
  generalNumber: string; // e.g., "2024-0001"
  quoteNumber: string; // e.g., "O-2024-0001"
  customerId: string;
  customerName: string;
  customerEmail?: string;
  status: DocumentStatus;
  items: LineItem[];
  labor?: LaborItem[];
  subtotal: number;
  totalVat: number;
  total: number;
  validUntil: string;
  notes?: string;
  location?: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  acceptedAt?: string;
  workOrderId?: string;
  journey?: import('../tracking/types/tracking.types').DocumentJourneyEntry[];
  createdBy?: string;
  createdByName?: string;
}

export interface Invoice {
  id: string;
  generalNumber: string; // e.g., "2024-0001"
  invoiceNumber: string; // e.g., "F-2024-0001"
  customerId: string;
  customerName: string;
  customerEmail?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: LineItem[];
  labor?: LaborItem[];
  subtotal: number;
  totalVat: number;
  total: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentTerms?: string;
  notes?: string;
  location?: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  paidAt?: string;
  quoteId?: string;
  workOrderId?: string;
  reminders?: {
    reminder1Date?: string;
    reminder1Sent?: boolean;
    reminder2Date?: string;
    reminder2Sent?: boolean;
  };
  journey?: import('../tracking/types/tracking.types').DocumentJourneyEntry[];
  createdBy?: string;
  createdByName?: string;
}

// Form input types
export type CreateQuoteInput = Omit<Quote, 'id' | 'generalNumber' | 'quoteNumber' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: DocumentStatus;
};

export type UpdateQuoteInput = Partial<Omit<Quote, 'id' | 'generalNumber' | 'quoteNumber' | 'createdAt' | 'updatedAt'>>;

export type CreateInvoiceInput = Omit<Invoice, 'id' | 'generalNumber' | 'invoiceNumber' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: Invoice['status'];
};

export type UpdateInvoiceInput = Partial<Omit<Invoice, 'id' | 'generalNumber' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>>;