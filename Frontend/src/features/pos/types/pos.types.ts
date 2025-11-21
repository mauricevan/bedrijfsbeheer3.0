export type PaymentMethod = 'cash' | 'pin' | 'ideal' | 'credit_card';
export type POSMode = 'b2c' | 'b2b';

export interface CartItem {
  id: string;
  inventoryItemId: string;
  name: string;
  quantity: number;
  pricePerUnit: number; // Excl. VAT
  vatRate: number;
  discount: number; // Percentage
  isManual?: boolean; // Custom item not in inventory
}

export interface Cart {
  items: CartItem[];
  mode: POSMode;
  customerId?: string; // For B2B mode
}

export interface POSTransaction {
  id: string;
  transactionNumber: string;
  mode: POSMode;
  items: CartItem[];
  subtotal: number; // Excl. VAT
  totalVAT: number;
  total: number; // Incl. VAT
  paymentMethod?: PaymentMethod;
  customerId?: string;
  customerName?: string;
  createdAt: string;
  createdBy?: string;
}

export interface PackingSlip {
  id: string;
  slipNumber: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  totalVAT: number;
  total: number;
  shippingAddress?: string;
  dueDate?: string;
  createdAt: string;
  invoiceId?: string; // Link to invoice if created
}
