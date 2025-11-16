/**
 * SKU Service - Triple SKU System Management
 *
 * Features:
 * 1. Auto-generated SKU (INV-0001, INV-0002, etc.)
 * 2. Supplier SKU tracking
 * 3. Custom SKU support
 * 4. SKU validation and uniqueness checking
 *
 * Compliant with: INVENTORY_COMPLETE.md Feature 1-3 (P0)
 */

import type { InventoryItem } from '../../../types';

/**
 * Generate next auto SKU in format INV-0001, INV-0002, etc.
 * Sequential without gaps
 *
 * @param existingItems - Array of existing inventory items
 * @returns Next auto SKU string
 */
export const generateAutoSKU = (existingItems: InventoryItem[]): string => {
  // Get all existing autoSku values
  const existingAutoSKUs = existingItems
    .map(item => item.autoSku)
    .filter(Boolean) as string[];

  // Extract numbers from INV-XXXX format
  const existingNumbers = existingAutoSKUs
    .map(sku => {
      const match = sku.match(/^INV-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => !isNaN(num));

  // Get next sequential number
  const nextNumber = existingNumbers.length > 0
    ? Math.max(...existingNumbers) + 1
    : 1;

  // Format as INV-0001, INV-0002, etc.
  return `INV-${String(nextNumber).padStart(4, '0')}`;
};

/**
 * Validate SKU uniqueness across all SKU types
 *
 * @param sku - SKU to validate
 * @param skuType - Type of SKU (auto, supplier, custom)
 * @param existingItems - Array of existing inventory items
 * @param currentItemId - ID of current item (for updates, to exclude self)
 * @returns True if SKU is unique, false otherwise
 */
export const validateSKUUniqueness = (
  sku: string,
  skuType: 'auto' | 'supplier' | 'custom',
  existingItems: InventoryItem[],
  currentItemId?: string
): boolean => {
  if (!sku || sku.trim() === '') {
    return true; // Empty SKUs are allowed
  }

  const skuLower = sku.toLowerCase().trim();

  // Check against all items (excluding current item if updating)
  const items = currentItemId
    ? existingItems.filter(item => item.id !== currentItemId)
    : existingItems;

  // Check all three SKU types for duplicates
  for (const item of items) {
    if (item.autoSku && item.autoSku.toLowerCase() === skuLower) {
      return false;
    }
    if (item.supplierSku && item.supplierSku.toLowerCase() === skuLower) {
      return false;
    }
    if (item.customSku && item.customSku.toLowerCase() === skuLower) {
      return false;
    }
    if (item.sku && item.sku.toLowerCase() === skuLower) {
      return false; // Check legacy SKU too
    }
  }

  return true;
};

/**
 * Get display SKU with priority: customSku > supplierSku > autoSku > legacy sku
 *
 * @param item - Inventory item
 * @returns Primary SKU to display
 */
export const getDisplaySKU = (item: InventoryItem): string => {
  return item.customSku || item.supplierSku || item.autoSku || item.sku || 'N/A';
};

/**
 * Get all SKUs for an item (useful for search)
 *
 * @param item - Inventory item
 * @returns Array of all SKUs
 */
export const getAllSKUs = (item: InventoryItem): string[] => {
  const skus: string[] = [];

  if (item.customSku) skus.push(item.customSku);
  if (item.supplierSku) skus.push(item.supplierSku);
  if (item.autoSku) skus.push(item.autoSku);
  if (item.sku) skus.push(item.sku);

  return skus.filter(Boolean);
};

/**
 * Search inventory items by SKU (searches all three SKU types)
 *
 * @param items - Array of inventory items
 * @param searchTerm - Search term
 * @returns Filtered array of items matching SKU search
 */
export const searchBySKU = (
  items: InventoryItem[],
  searchTerm: string
): InventoryItem[] => {
  if (!searchTerm || searchTerm.trim() === '') {
    return items;
  }

  const term = searchTerm.toLowerCase().trim();

  return items.filter(item => {
    const allSKUs = getAllSKUs(item);
    return allSKUs.some(sku => sku.toLowerCase().includes(term));
  });
};

/**
 * Validate SKU format for autoSKU (must be INV-XXXX)
 *
 * @param sku - SKU to validate
 * @returns True if valid format
 */
export const validateAutoSKUFormat = (sku: string): boolean => {
  return /^INV-\d{4}$/.test(sku);
};
