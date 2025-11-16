/**
 * Inventory Service - CRUD Operations
 *
 * Features:
 * - Create, read, update, delete inventory items
 * - Stock management and tracking
 * - Pricing and margin calculations
 * - VAT management
 * - Integration with categories and suppliers
 *
 * Compliant with: INVENTORY_COMPLETE.md (P0 features)
 */

import type { InventoryItem } from '../../../types';
import type { InventoryFormData, StockMutation } from '../types';
import { generateAutoSKU, validateSKUUniqueness } from './skuService';

/**
 * Create a new inventory item
 *
 * @param data - Inventory form data
 * @param existingItems - Array of existing inventory items
 * @param currentUserId - Current user ID
 * @returns New inventory item
 */
export const createInventoryItem = (
  data: InventoryFormData,
  existingItems: InventoryItem[] = [],
  currentUserId: string
): InventoryItem => {
  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    throw new Error('Product naam is verplicht');
  }

  if (data.salePrice === undefined || data.salePrice < 0) {
    throw new Error('Verkoopprijs is verplicht en moet positief zijn');
  }

  // Validate SKU uniqueness if provided
  if (data.supplierSku) {
    const isUnique = validateSKUUniqueness(
      data.supplierSku,
      'supplier',
      existingItems
    );
    if (!isUnique) {
      throw new Error('Leveranciers SKU bestaat al');
    }
  }

  if (data.customSku) {
    const isUnique = validateSKUUniqueness(
      data.customSku,
      'custom',
      existingItems
    );
    if (!isUnique) {
      throw new Error('Custom SKU bestaat al');
    }
  }

  // Generate auto SKU
  const autoSku = generateAutoSKU(existingItems);

  // Calculate margin if purchase price provided
  const margin = data.purchasePrice && data.salePrice
    ? ((data.salePrice - data.purchasePrice) / data.purchasePrice) * 100
    : undefined;

  const now = new Date().toISOString();

  const item: InventoryItem = {
    id: `inv-${Date.now()}`,
    name: data.name.trim(),
    sku: autoSku, // Legacy field - use autoSku
    autoSku,
    supplierSku: data.supplierSku?.trim() || undefined,
    customSku: data.customSku?.trim() || undefined,
    quantity: data.quantity || 0,
    reorderLevel: data.reorderLevel || 0,
    supplierId: data.supplierId || undefined,
    categoryId: data.categoryId || undefined,
    purchasePrice: data.purchasePrice || undefined,
    salePrice: data.salePrice,
    margin: margin ? parseFloat(margin.toFixed(2)) : undefined,
    vatRate: data.vatRate || '21',
    customVatRate: data.vatRate === 'custom' ? data.customVatRate : undefined,
    syncEnabled: data.syncEnabled || false,
    unit: data.unit?.trim() || undefined,
    location: data.location?.trim() || undefined,
    posAlertNote: data.posAlertNote?.trim() || undefined,
    description: data.description?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  return item;
};

/**
 * Update an existing inventory item
 *
 * @param itemId - Item ID to update
 * @param data - Updated inventory data
 * @param existingItem - Existing inventory item
 * @param allItems - All inventory items (for SKU validation)
 * @returns Updated inventory item
 */
export const updateInventoryItem = (
  itemId: string,
  data: InventoryFormData,
  existingItem: InventoryItem,
  allItems: InventoryItem[] = []
): InventoryItem => {
  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    throw new Error('Product naam is verplicht');
  }

  if (data.salePrice === undefined || data.salePrice < 0) {
    throw new Error('Verkoopprijs is verplicht en moet positief zijn');
  }

  // Validate SKU uniqueness if changed
  if (data.supplierSku && data.supplierSku !== existingItem.supplierSku) {
    const isUnique = validateSKUUniqueness(
      data.supplierSku,
      'supplier',
      allItems,
      itemId
    );
    if (!isUnique) {
      throw new Error('Leveranciers SKU bestaat al');
    }
  }

  if (data.customSku && data.customSku !== existingItem.customSku) {
    const isUnique = validateSKUUniqueness(
      data.customSku,
      'custom',
      allItems,
      itemId
    );
    if (!isUnique) {
      throw new Error('Custom SKU bestaat al');
    }
  }

  // Recalculate margin if prices changed
  const margin = data.purchasePrice && data.salePrice
    ? ((data.salePrice - data.purchasePrice) / data.purchasePrice) * 100
    : undefined;

  const updatedItem: InventoryItem = {
    ...existingItem,
    name: data.name.trim(),
    supplierSku: data.supplierSku?.trim() || undefined,
    customSku: data.customSku?.trim() || undefined,
    quantity: data.quantity ?? existingItem.quantity,
    reorderLevel: data.reorderLevel ?? existingItem.reorderLevel,
    supplierId: data.supplierId || undefined,
    categoryId: data.categoryId || undefined,
    purchasePrice: data.purchasePrice || undefined,
    salePrice: data.salePrice,
    margin: margin ? parseFloat(margin.toFixed(2)) : undefined,
    vatRate: data.vatRate || existingItem.vatRate,
    customVatRate: data.vatRate === 'custom' ? data.customVatRate : undefined,
    syncEnabled: data.syncEnabled ?? existingItem.syncEnabled,
    unit: data.unit?.trim() || undefined,
    location: data.location?.trim() || undefined,
    posAlertNote: data.posAlertNote?.trim() || undefined,
    description: data.description?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  return updatedItem;
};

/**
 * Delete an inventory item
 *
 * @param itemId - Item ID to delete
 * @param items - Array of inventory items
 * @returns Filtered array without deleted item
 */
export const deleteInventoryItem = (
  itemId: string,
  items: InventoryItem[]
): InventoryItem[] => {
  return items.filter(item => item.id !== itemId);
};

/**
 * Adjust stock quantity
 *
 * @param item - Inventory item
 * @param adjustment - Quantity to add (positive) or remove (negative)
 * @param reason - Reason for adjustment
 * @param userId - User performing adjustment
 * @returns Updated inventory item and mutation record
 */
export const adjustStock = (
  item: InventoryItem,
  adjustment: number,
  reason: string,
  userId: string
): { item: InventoryItem; mutation: StockMutation } => {
  const newQuantity = item.quantity + adjustment;

  if (newQuantity < 0) {
    throw new Error('Voorraad kan niet negatief worden');
  }

  const mutation: StockMutation = {
    id: `mut-${Date.now()}`,
    inventoryItemId: item.id,
    type: adjustment > 0 ? 'in' : adjustment < 0 ? 'out' : 'adjustment',
    quantity: Math.abs(adjustment),
    reason,
    performedBy: userId,
    timestamp: new Date().toISOString(),
  };

  const updatedItem: InventoryItem = {
    ...item,
    quantity: newQuantity,
    lastRestocked: adjustment > 0 ? new Date().toISOString() : item.lastRestocked,
    updatedAt: new Date().toISOString(),
  };

  return { item: updatedItem, mutation };
};

/**
 * Check if item is low stock
 *
 * @param item - Inventory item
 * @returns True if quantity <= reorder level
 */
export const isLowStock = (item: InventoryItem): boolean => {
  return item.quantity > 0 && item.quantity <= item.reorderLevel;
};

/**
 * Check if item is out of stock
 *
 * @param item - Inventory item
 * @returns True if quantity is 0
 */
export const isOutOfStock = (item: InventoryItem): boolean => {
  return item.quantity === 0;
};

/**
 * Get stock status
 *
 * @param item - Inventory item
 * @returns Stock status: 'out', 'low', or 'ok'
 */
export const getStockStatus = (
  item: InventoryItem
): 'out' | 'low' | 'ok' => {
  if (isOutOfStock(item)) return 'out';
  if (isLowStock(item)) return 'low';
  return 'ok';
};

/**
 * Get stock status color for UI
 *
 * @param status - Stock status
 * @returns Tailwind color class
 */
export const getStockStatusColor = (status: 'out' | 'low' | 'ok'): string => {
  switch (status) {
    case 'out':
      return 'text-red-600';
    case 'low':
      return 'text-yellow-600';
    case 'ok':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

/**
 * Calculate total inventory value
 *
 * @param items - Array of inventory items
 * @returns Total value (quantity * sale price)
 */
export const calculateInventoryValue = (items: InventoryItem[]): number => {
  return items.reduce(
    (total, item) => total + item.quantity * item.salePrice,
    0
  );
};

/**
 * Get low stock items
 *
 * @param items - Array of inventory items
 * @returns Items with low stock
 */
export const getLowStockItems = (items: InventoryItem[]): InventoryItem[] => {
  return items.filter(isLowStock);
};

/**
 * Get out of stock items
 *
 * @param items - Array of inventory items
 * @returns Items that are out of stock
 */
export const getOutOfStockItems = (items: InventoryItem[]): InventoryItem[] => {
  return items.filter(isOutOfStock);
};
