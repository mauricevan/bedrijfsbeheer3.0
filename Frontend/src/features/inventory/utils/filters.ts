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

/**
 * Apply extended filters to inventory items
 * Filters are applied based on filterData field and standard item properties
 */
export const applyExtendedFilters = (
  items: InventoryItem[],
  filters: Record<string, any>,
  selectedCategory?: string | null
): InventoryItem[] => {
  if (!filters || Object.keys(filters).length === 0) {
    return items;
  }

  return items.filter((item) => {
    // If category filter is set, check category match first
    if (selectedCategory) {
      // Map webshop category IDs to inventory category matching
      // This is a simplified matching - you may need to adjust based on your category structure
      const categoryMatch = item.categoryId === selectedCategory;
      if (!categoryMatch) return false;
    }

    // Apply each filter
    for (const [filterId, filterValue] of Object.entries(filters)) {
      if (filterValue === null || filterValue === undefined || filterValue === '' || 
          (Array.isArray(filterValue) && filterValue.length === 0)) {
        continue; // Skip empty filters
      }

      // Price range filter
      if (filterId === 'price' && typeof filterValue === 'object' && filterValue.min !== undefined) {
        const itemPrice = item.salePrice || 0;
        if (itemPrice < filterValue.min || itemPrice > filterValue.max) {
          return false;
        }
        continue;
      }

      // Check filterData field first (category-specific attributes)
      if (item.filterData && item.filterData[filterId] !== undefined) {
        const itemValue = item.filterData[filterId];
        
        // Array filters (checkboxes, colors)
        if (Array.isArray(filterValue)) {
          if (Array.isArray(itemValue)) {
            // Check if any selected value matches any item value
            if (!filterValue.some(fv => itemValue.includes(fv))) {
              return false;
            }
          } else {
            // Single item value, check if it's in filter array
            if (!filterValue.includes(itemValue)) {
              return false;
            }
          }
        } else {
          // Single value filter (dropdown)
          if (itemValue !== filterValue) {
            return false;
          }
        }
        continue;
      }

      // Fallback to standard item properties
      // Map common filter IDs to item properties
      const propertyMap: Record<string, keyof InventoryItem> = {
        'material': 'name' as keyof InventoryItem, // You may need to add a material field
        'color': 'name' as keyof InventoryItem, // You may need to add a color field
      };

      const property = propertyMap[filterId];
      if (property && item[property]) {
        const itemValue = String(item[property]).toLowerCase();
        
        if (Array.isArray(filterValue)) {
          if (!filterValue.some(fv => itemValue.includes(String(fv).toLowerCase()))) {
            return false;
          }
        } else {
          if (!itemValue.includes(String(filterValue).toLowerCase())) {
            return false;
          }
        }
      }
    }

    return true;
  });
};

