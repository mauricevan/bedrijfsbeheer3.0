/**
 * Inventory Module Types
 *
 * Defines interfaces for inventory management including:
 * - Triple SKU system (supplierSku, autoSku, customSku)
 * - Category management
 * - Stock mutations
 * - Search and filtering
 */

import type {
  InventoryItem,
  InventoryCategory,
} from '../../../types';

/**
 * Inventory form data for creating/editing items
 */
export interface InventoryFormData {
  name: string;
  supplierSku?: string;
  customSku?: string;
  quantity: number;
  reorderLevel: number;
  supplierId?: string;
  categoryId?: string;
  purchasePrice?: number;
  salePrice: number;
  margin?: number;
  vatRate: '21' | '9' | '0' | 'custom';
  customVatRate?: number;
  syncEnabled: boolean;
  unit?: string;
  location?: string;
  posAlertNote?: string;
  description?: string;
}

/**
 * Category form data
 */
export interface CategoryFormData {
  name: string;
  description?: string;
  color?: string;
}

/**
 * Stock mutation types
 */
export type StockMutationType = 'in' | 'out' | 'adjustment';

/**
 * Stock mutation record
 */
export interface StockMutation {
  id: string;
  inventoryItemId: string;
  type: StockMutationType;
  quantity: number;
  reason?: string;
  performedBy: string;
  timestamp: string;
}

/**
 * Inventory search filters
 */
export interface InventoryFilters {
  searchTerm?: string;
  categoryId?: string;
  supplierId?: string;
  stockStatus?: 'all' | 'low' | 'ok' | 'out';
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Inventory statistics
 */
export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoriesCount: number;
}

/**
 * SKU display priority helper
 * Priority: customSku > supplierSku > autoSku
 */
export const getDisplaySKU = (item: InventoryItem): string => {
  return item.customSku || item.supplierSku || item.autoSku || item.sku;
};

/**
 * Get all SKUs for an item (for search)
 */
export const getAllSKUs = (item: InventoryItem): string[] => {
  const skus: string[] = [];
  if (item.customSku) skus.push(item.customSku);
  if (item.supplierSku) skus.push(item.supplierSku);
  if (item.autoSku) skus.push(item.autoSku);
  if (item.sku) skus.push(item.sku);
  return skus;
};

export type {
  InventoryItem,
  InventoryCategory,
};
