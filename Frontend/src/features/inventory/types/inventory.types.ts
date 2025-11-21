export type VatRate = 21 | 9 | 0;

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  leadTimeDays?: number;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  description?: string;
}

export interface InventoryItem {
  id: string;
  // Basic Info
  name: string;
  sku: string; // Auto-generated SKU
  supplierSku?: string; // SKU (Leverancier)
  customSku?: string; // SKU (Aangepast)
  description?: string;
  categoryId: string;
  
  // Stock
  quantity: number;
  reorderLevel: number;
  unit: string; // e.g., 'stuks', 'meter'
  location?: string;
  
  // Pricing
  purchasePrice: number; // Excl. VAT
  salePrice: number; // Excl. VAT
  vatRate: VatRate;
  
  // Supplier
  supplierId?: string;
  
  // Settings
  webshopSync: boolean;
  posAlert?: string;
  
  // Filter Data (category-specific attributes for extended search)
  filterData?: Record<string, any>;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export type InventoryFilter = {
  search?: string;
  categoryId?: string;
  lowStock?: boolean;
};
