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
  quoteNumber: string;
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
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
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
}
