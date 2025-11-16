/**
 * Stock Status Badge Component
 *
 * Displays stock status with color coding
 *
 * Compliant with: INVENTORY_COMPLETE.md Feature 12-14 (P0)
 */

import React from 'react';
import type { InventoryItem } from '../../../types';
import { getStockStatus, getStockStatusColor } from '../services/inventoryService';

interface StockStatusBadgeProps {
  item: InventoryItem;
  showQuantity?: boolean;
  variant?: 'badge' | 'text' | 'dot';
}

/**
 * Stock Status Badge component
 */
export const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({
  item,
  showQuantity = true,
  variant = 'badge',
}) => {
  const status = getStockStatus(item);
  const colorClass = getStockStatusColor(status);

  const statusText = {
    out: 'Out of Stock',
    low: 'Low Stock',
    ok: 'In Stock',
  };

  const bgColorClasses = {
    out: 'bg-red-100 text-red-800',
    low: 'bg-yellow-100 text-yellow-800',
    ok: 'bg-green-100 text-green-800',
  };

  if (variant === 'dot') {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            status === 'out'
              ? 'bg-red-500'
              : status === 'low'
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }`}
        />
        {showQuantity && (
          <span className="text-sm text-gray-700">
            {item.quantity} {item.unit || 'pcs'}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <span className={`text-sm font-medium ${colorClass}`}>
        {statusText[status]}
        {showQuantity && ` (${item.quantity} ${item.unit || 'pcs'})`}
      </span>
    );
  }

  // Badge variant
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${bgColorClasses[status]}`}
    >
      {statusText[status]}
      {showQuantity && (
        <span className="ml-1">
          ({item.quantity} {item.unit || 'pcs'})
        </span>
      )}
    </span>
  );
};

/**
 * Low Stock Warning component
 */
export const LowStockWarning: React.FC<{ item: InventoryItem }> = ({ item }) => {
  const status = getStockStatus(item);

  if (status === 'ok') return null;

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded ${
        status === 'out' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
      }`}
    >
      <svg
        className={`w-5 h-5 ${status === 'out' ? 'text-red-500' : 'text-yellow-500'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <div className="flex-1">
        <p className={`text-sm font-medium ${status === 'out' ? 'text-red-800' : 'text-yellow-800'}`}>
          {status === 'out' ? 'Out of Stock' : 'Low Stock Alert'}
        </p>
        <p className={`text-xs ${status === 'out' ? 'text-red-600' : 'text-yellow-600'}`}>
          {status === 'out'
            ? 'This item is currently out of stock'
            : `Only ${item.quantity} ${item.unit || 'pcs'} remaining (Reorder level: ${item.reorderLevel})`}
        </p>
      </div>
    </div>
  );
};

export default StockStatusBadge;
