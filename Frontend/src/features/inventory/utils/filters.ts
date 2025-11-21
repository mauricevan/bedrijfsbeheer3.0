/**
 * Inventory Filters Utilities
 * Pure filtering and search functions
 */

import type { InventoryItem, Category, Supplier } from '../types/inventory.types';

/**
 * Filter inventory by search term (searches all fields)
 */
export const filterBySearchTerm = (
  items: InventoryItem[],
  searchTerm: string,
  suppliers: Supplier[],
  categories: Category[]
): InventoryItem[] => {
  if (!searchTerm) return items;

  const searchLower = searchTerm.toLowerCase();

  return items.filter((item) => {
    // Search in name
    if (item.name.toLowerCase().includes(searchLower)) return true;

    // Search in SKU types
    if (item.sku?.toLowerCase().includes(searchLower)) return true;
    if (item.supplierSku?.toLowerCase().includes(searchLower)) return true;

    // Search in location
    if (item.location?.toLowerCase().includes(searchLower)) return true;

    // Search in unit
    if (item.unit?.toLowerCase().includes(searchLower)) return true;

    // Search in supplier name
    if (item.supplierId) {
      const supplier = suppliers.find((s) => s.id === item.supplierId);
      if (supplier?.name.toLowerCase().includes(searchLower)) return true;
    }

    // Search in category name
    if (item.categoryId) {
      const category = categories.find((c) => c.id === item.categoryId);
      if (category?.name.toLowerCase().includes(searchLower)) return true;
    }

    // Search in prices (as string)
    if (item.purchasePrice?.toString().includes(searchLower)) return true;
    if (item.salePrice?.toString().includes(searchLower)) return true;

    // Search in POS alert note
    if (item.posAlert?.toLowerCase().includes(searchLower)) return true;

    return false;
  });
};

/**
 * Filter inventory by category
 */
export const filterByCategory = (
  items: InventoryItem[],
  categoryId: string
): InventoryItem[] => {
  if (!categoryId) return items;
  return items.filter((item) => item.categoryId === categoryId);
};

/**
 * Filter inventory by supplier
 */
export const filterBySupplier = (
  items: InventoryItem[],
  supplierId: string
): InventoryItem[] => {
  if (!supplierId) return items;
  return items.filter((item) => item.supplierId === supplierId);
};

/**
 * Filter inventory by stock status
 */
export const filterByStockStatus = (
  items: InventoryItem[],
  status: 'low' | 'out' | 'ok'
): InventoryItem[] => {
  switch (status) {
    case 'out':
      return items.filter((item) => item.quantity === 0);
    case 'low':
      return items.filter(
        (item) => item.quantity > 0 && item.quantity <= item.reorderLevel
      );
    case 'ok':
      return items.filter((item) => item.quantity > item.reorderLevel);
    default:
      return items;
  }
};

/**
 * Filter categories by search term
 */
export const filterCategoriesBySearch = (
  categories: Category[],
  searchTerm: string
): Category[] => {
  if (!searchTerm) return categories;
  const searchLower = searchTerm.toLowerCase();
  return categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchLower) ||
      cat.description?.toLowerCase().includes(searchLower)
  );
};

/**
 * Get items that need reordering
 */
export const getItemsNeedingReorder = (items: InventoryItem[]): InventoryItem[] => {
  return items.filter((item) => item.quantity <= item.reorderLevel);
};

/**
 * Get out of stock items
 */
export const getOutOfStockItems = (items: InventoryItem[]): InventoryItem[] => {
  return items.filter((item) => item.quantity === 0);
};

/**
 * Sort items by field
 */
export const sortInventoryItems = (
  items: InventoryItem[],
  field: keyof InventoryItem,
  direction: 'asc' | 'desc' = 'asc'
): InventoryItem[] => {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });
};

