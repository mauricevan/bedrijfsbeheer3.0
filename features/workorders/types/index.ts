// features/workorders/types/index.ts
// WorkOrders Feature Types
// Compliant met prompt.git: Type definitions apart

import type {
  WorkOrder,
  WorkOrderStatus,
  Employee,
  InventoryItem,
  InventoryCategory,
  Customer,
  User,
  Quote,
  Invoice,
  QuoteItem,
  QuoteLabor,
} from '../../../types';

export interface WorkOrdersProps {
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  employees: Employee[];
  customers: Customer[];
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  currentUser: User;
  isAdmin: boolean;
  quotes?: Quote[];
  setQuotes?: React.Dispatch<React.SetStateAction<Quote[]>>;
  invoices?: Invoice[];
  setInvoices?: React.Dispatch<React.SetStateAction<Invoice[]>>;
  categories?: InventoryCategory[];
}

export interface MaterialSelection {
  itemId: string;
  quantity: number;
}

export interface NewOrderForm {
  title: string;
  description: string;
  assignedTo: string;
  customerId: string;
  location: string;
  scheduledDate: string;
  pendingReason: string;
  sortIndex?: number;
}

export interface EditFormData {
  customerId: string;
  items: QuoteItem[];
  labor: QuoteLabor[];
  vatRate: number;
  notes: string;
  validUntil?: string;
  paymentTerms?: string;
  issueDate?: string;
  dueDate?: string;
}

export interface MaterialSearchState {
  searchTerm: string;
  categoryFilter: string;
  categorySearchTerm: string;
  showCategoryDropdown: boolean;
}

// Re-export main types
export type {
  WorkOrder,
  WorkOrderStatus,
  Employee,
  InventoryItem,
  InventoryCategory,
  Customer,
  User,
  Quote,
  Invoice,
  QuoteItem,
  QuoteLabor,
};
