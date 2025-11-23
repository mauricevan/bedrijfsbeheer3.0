/**
 * Webshop Filters Utilities
 * Pure filtering and search functions for webshop products
 */

import type { WebshopProduct } from '../types/webshop.types';

/**
 * Apply extended filters to webshop products
 * Filters are applied based on product properties and filterData
 */
export const applyExtendedFiltersToProducts = (
  products: WebshopProduct[],
  filters: Record<string, any>,
  selectedCategory?: string | null
): WebshopProduct[] => {
  if (!filters || Object.keys(filters).length === 0) {
    return products;
  }

  return products.filter((product) => {
    // If category filter is set, check category match first
    if (selectedCategory) {
      // Map webshop category IDs to product category matching
      const categoryMatch = product.categoryId === selectedCategory;
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
        const productPrice = product.price || 0;
        if (productPrice < filterValue.min || productPrice > filterValue.max) {
          return false;
        }
        continue;
      }

      // Stock filter (if needed)
      if (filterId === 'stock' && typeof filterValue === 'object' && filterValue.min !== undefined) {
        const productStock = product.stock || 0;
        if (productStock < filterValue.min || productStock > filterValue.max) {
          return false;
        }
        continue;
      }

      // Check product properties
      // Map common filter IDs to product properties
      const propertyMap: Record<string, keyof WebshopProduct> = {
        'material': 'name' as keyof WebshopProduct,
        'color': 'name' as keyof WebshopProduct,
        'status': 'status' as keyof WebshopProduct,
      };

      const property = propertyMap[filterId];
      if (property && product[property] !== undefined) {
        const productValue = String(product[property]).toLowerCase();
        
        if (Array.isArray(filterValue)) {
          if (!filterValue.some(fv => productValue.includes(String(fv).toLowerCase()))) {
            return false;
          }
        } else {
          if (property === 'status') {
            // Exact match for status
            if (product.status !== filterValue) {
              return false;
            }
          } else {
            // Partial match for other properties
            if (!productValue.includes(String(filterValue).toLowerCase())) {
              return false;
            }
          }
        }
        continue;
      }

      // Check tags
      if (filterId === 'tags' && product.tags) {
        if (Array.isArray(filterValue)) {
          if (!filterValue.some(tag => product.tags?.includes(tag))) {
            return false;
          }
        } else {
          if (!product.tags.includes(filterValue)) {
            return false;
          }
        }
        continue;
      }

      // Check dimensions if filter is for dimensions
      if (filterId.includes('dimension') && product.dimensions) {
        const dimValue = Number(filterValue);
        if (isNaN(dimValue)) continue;
        
        // Check if any dimension matches
        const matches = 
          (product.dimensions.length === dimValue) ||
          (product.dimensions.width === dimValue) ||
          (product.dimensions.height === dimValue) ||
          (product.dimensions.length && product.dimensions.length === dimValue);
        
        if (!matches) return false;
        continue;
      }

      // Check description for text-based filters
      if (product.description) {
        const descLower = product.description.toLowerCase();
        if (Array.isArray(filterValue)) {
          if (!filterValue.some(fv => descLower.includes(String(fv).toLowerCase()))) {
            return false;
          }
        } else {
          if (!descLower.includes(String(filterValue).toLowerCase())) {
            return false;
          }
        }
      }
    }

    return true;
  });
};

