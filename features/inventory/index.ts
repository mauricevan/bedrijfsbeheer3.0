/**
 * Inventory Module Barrel Export
 *
 * Triple SKU System, Category Management, Stock Management
 *
 * Compliant with: INVENTORY_COMPLETE.md (P0 features)
 */

// Re-export from types
export * from '../../types';

// Services
export * from './services';

// Types
export * from './types';

// Components
export * from './components';

// Legacy helpers (keep for backward compatibility)
export const calculateStockStatus = (qty: number, reorder: number) =>
  qty === 0 ? 'out' : qty <= reorder ? 'low' : 'ok';

export const getStockColor = (status: string) =>
  status === 'out' ? 'text-red-600' : status === 'low' ? 'text-yellow-600' : 'text-green-600';
