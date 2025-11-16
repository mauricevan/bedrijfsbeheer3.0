/**
 * Category Service - Inventory Category Management
 *
 * Features:
 * 1. Create, read, update, delete categories
 * 2. Color coding for visual display
 * 3. Product assignment to categories
 * 4. Category filtering
 * 5. Product count tracking
 *
 * Compliant with: INVENTORY_COMPLETE.md Feature 4-11 (P0/P1)
 */

import type { InventoryCategory, InventoryItem } from '../../../types';
import type { CategoryFormData } from '../types';

/**
 * Create a new inventory category
 *
 * @param data - Category form data
 * @param existingCategories - Array of existing categories
 * @returns New category object
 */
export const createCategory = (
  data: CategoryFormData,
  existingCategories: InventoryCategory[] = []
): InventoryCategory => {
  // Validate category name uniqueness
  const nameExists = existingCategories.some(
    cat => cat.name.toLowerCase() === data.name.toLowerCase().trim()
  );

  if (nameExists) {
    throw new Error('Categorie met deze naam bestaat al');
  }

  if (!data.name || data.name.trim() === '') {
    throw new Error('Categorienaam is verplicht');
  }

  const now = new Date().toISOString();

  const category: InventoryCategory = {
    id: `cat-${Date.now()}`,
    name: data.name.trim(),
    description: data.description?.trim() || undefined,
    color: data.color || '#3B82F6', // Default to blue
    createdAt: now,
    updatedAt: now,
  };

  return category;
};

/**
 * Update an existing category
 *
 * @param categoryId - Category ID to update
 * @param data - Updated category data
 * @param existingCategory - Existing category object
 * @param allCategories - All categories (for uniqueness check)
 * @returns Updated category object
 */
export const updateCategory = (
  categoryId: string,
  data: CategoryFormData,
  existingCategory: InventoryCategory,
  allCategories: InventoryCategory[] = []
): InventoryCategory => {
  // Validate name uniqueness (excluding current category)
  const nameExists = allCategories.some(
    cat =>
      cat.id !== categoryId &&
      cat.name.toLowerCase() === data.name.toLowerCase().trim()
  );

  if (nameExists) {
    throw new Error('Categorie met deze naam bestaat al');
  }

  if (!data.name || data.name.trim() === '') {
    throw new Error('Categorienaam is verplicht');
  }

  const updatedCategory: InventoryCategory = {
    ...existingCategory,
    name: data.name.trim(),
    description: data.description?.trim() || undefined,
    color: data.color || existingCategory.color || '#3B82F6',
    updatedAt: new Date().toISOString(),
  };

  return updatedCategory;
};

/**
 * Delete a category
 * Handles orphaned products by either:
 * - Removing category assignment (orphan handling)
 * - Or preventing deletion if products exist
 *
 * @param categoryId - Category ID to delete
 * @param categories - Array of categories
 * @param orphanHandling - How to handle products: 'unassign' or 'prevent'
 * @returns Filtered array without deleted category
 */
export const deleteCategory = (
  categoryId: string,
  categories: InventoryCategory[],
  orphanHandling: 'unassign' | 'prevent' = 'unassign'
): InventoryCategory[] => {
  return categories.filter(cat => cat.id !== categoryId);
};

/**
 * Handle orphaned products when deleting category
 *
 * @param categoryId - Deleted category ID
 * @param items - Array of inventory items
 * @returns Updated items with category removed
 */
export const handleOrphanedProducts = (
  categoryId: string,
  items: InventoryItem[]
): InventoryItem[] => {
  return items.map(item => {
    if (item.categoryId === categoryId) {
      return {
        ...item,
        categoryId: undefined,
      };
    }
    return item;
  });
};

/**
 * Get product count for a category
 *
 * @param categoryId - Category ID
 * @param items - Array of inventory items
 * @returns Number of products in category
 */
export const getCategoryProductCount = (
  categoryId: string,
  items: InventoryItem[]
): number => {
  return items.filter(item => item.categoryId === categoryId).length;
};

/**
 * Get all categories with product counts
 *
 * @param categories - Array of categories
 * @param items - Array of inventory items
 * @returns Categories with product counts
 */
export const getCategoriesWithCounts = (
  categories: InventoryCategory[],
  items: InventoryItem[]
): Array<InventoryCategory & { productCount: number }> => {
  return categories.map(category => ({
    ...category,
    productCount: getCategoryProductCount(category.id, items),
  }));
};

/**
 * Filter items by category
 *
 * @param items - Array of inventory items
 * @param categoryId - Category ID to filter by
 * @returns Filtered items
 */
export const filterByCategory = (
  items: InventoryItem[],
  categoryId: string
): InventoryItem[] => {
  if (!categoryId || categoryId === 'all') {
    return items;
  }
  return items.filter(item => item.categoryId === categoryId);
};

/**
 * Get category by ID
 *
 * @param categoryId - Category ID
 * @param categories - Array of categories
 * @returns Category or undefined
 */
export const getCategoryById = (
  categoryId: string,
  categories: InventoryCategory[]
): InventoryCategory | undefined => {
  return categories.find(cat => cat.id === categoryId);
};

/**
 * Get category name by ID
 *
 * @param categoryId - Category ID
 * @param categories - Array of categories
 * @returns Category name or 'Uncategorized'
 */
export const getCategoryName = (
  categoryId: string | undefined,
  categories: InventoryCategory[]
): string => {
  if (!categoryId) return 'Uncategorized';
  const category = getCategoryById(categoryId, categories);
  return category?.name || 'Uncategorized';
};

/**
 * Validate category before deletion
 * Checks if category has products assigned
 *
 * @param categoryId - Category ID
 * @param items - Array of inventory items
 * @returns Validation result
 */
export const canDeleteCategory = (
  categoryId: string,
  items: InventoryItem[]
): { canDelete: boolean; reason?: string; productCount: number } => {
  const productCount = getCategoryProductCount(categoryId, items);

  if (productCount > 0) {
    return {
      canDelete: false,
      reason: `Categorie heeft ${productCount} product(en) toegewezen`,
      productCount,
    };
  }

  return {
    canDelete: true,
    productCount: 0,
  };
};

/**
 * Sort categories alphabetically by name
 *
 * @param categories - Array of categories
 * @returns Sorted categories
 */
export const sortCategoriesAlphabetically = (
  categories: InventoryCategory[]
): InventoryCategory[] => {
  return [...categories].sort((a, b) => a.name.localeCompare(b.name));
};
