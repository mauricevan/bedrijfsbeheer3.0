// features/workorders/utils/filters.ts
// WorkOrders Filter Functions
// Compliant met prompt.git: Max 150 regels per utility

import type { InventoryItem, InventoryCategory } from '../types';

/**
 * Filter inventory for material selection
 */
export const filterInventoryForMaterials = (
  inventory: InventoryItem[],
  searchTerm: string,
  categoryFilter: string,
  categories: InventoryCategory[]
): InventoryItem[] => {
  let filtered = inventory.filter((item) => item.quantity > 0);

  // Filter op categorie
  if (categoryFilter) {
    filtered = filtered.filter((item) => item.categoryId === categoryFilter);
  }

  // Filter op zoekterm
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((item) => {
      // Zoek in naam
      if (item.name.toLowerCase().includes(term)) return true;

      // Zoek in alle SKU types
      if (item.sku?.toLowerCase().includes(term)) return true;
      if (item.supplierSku?.toLowerCase().includes(term)) return true;
      if (item.autoSku?.toLowerCase().includes(term)) return true;
      if (item.customSku?.toLowerCase().includes(term)) return true;

      // Zoek in categorie naam
      if (item.categoryId) {
        const category = categories.find((c) => c.id === item.categoryId);
        if (category?.name.toLowerCase().includes(term)) return true;
      }

      return false;
    });
  }

  return filtered;
};

/**
 * Filter categories for dropdown search
 */
export const filterCategories = (
  categories: InventoryCategory[],
  searchTerm: string
): InventoryCategory[] => {
  if (!searchTerm) return categories;

  const searchLower = searchTerm.toLowerCase();
  return categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchLower) ||
      cat.description?.toLowerCase().includes(searchLower)
  );
};

/**
 * Get category name by ID
 */
export const getCategoryName = (
  categoryId: string | undefined,
  categories: InventoryCategory[]
): string => {
  if (!categoryId) return '';
  const category = categories.find((c) => c.id === categoryId);
  return category?.name || '';
};
