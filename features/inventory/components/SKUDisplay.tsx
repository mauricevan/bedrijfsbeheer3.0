/**
 * SKU Display Component
 *
 * Displays SKU with priority: customSku > supplierSku > autoSku
 * Shows all available SKUs on hover
 *
 * Compliant with: INVENTORY_COMPLETE.md Feature 1-3 (P0)
 */

import React from 'react';
import type { InventoryItem } from '../../../types';
import { getDisplaySKU, getAllSKUs } from '../services/skuService';

interface SKUDisplayProps {
  item: InventoryItem;
  showAll?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * SKU Display component with tooltip showing all SKUs
 */
export const SKUDisplay: React.FC<SKUDisplayProps> = ({
  item,
  showAll = false,
  variant = 'default',
}) => {
  const displaySKU = getDisplaySKU(item);
  const allSKUs = getAllSKUs(item);

  if (variant === 'compact') {
    return (
      <span
        className="font-mono text-sm text-gray-700"
        title={allSKUs.join(', ')}
      >
        {displaySKU}
      </span>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Primary:</span>
          <span className="font-mono text-sm font-medium text-gray-900">
            {displaySKU}
          </span>
        </div>
        {item.customSku && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Custom:</span>
            <span className="font-mono text-xs text-gray-600">
              {item.customSku}
            </span>
          </div>
        )}
        {item.supplierSku && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Supplier:</span>
            <span className="font-mono text-xs text-gray-600">
              {item.supplierSku}
            </span>
          </div>
        )}
        {item.autoSku && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Auto:</span>
            <span className="font-mono text-xs text-gray-600">
              {item.autoSku}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  if (showAll && allSKUs.length > 1) {
    return (
      <div className="flex flex-col gap-1">
        <span className="font-mono text-sm font-medium text-gray-900">
          {displaySKU}
        </span>
        <div className="flex flex-wrap gap-1">
          {allSKUs
            .filter((sku) => sku !== displaySKU)
            .map((sku, index) => (
              <span
                key={index}
                className="font-mono text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded"
              >
                {sku}
              </span>
            ))}
        </div>
      </div>
    );
  }

  return (
    <span
      className="font-mono text-sm text-gray-700 cursor-help"
      title={allSKUs.length > 1 ? `All SKUs: ${allSKUs.join(', ')}` : displaySKU}
    >
      {displaySKU}
    </span>
  );
};

/**
 * SKU Badge component (for compact display)
 */
export const SKUBadge: React.FC<{ sku: string; type?: 'auto' | 'supplier' | 'custom' }> = ({
  sku,
  type,
}) => {
  const colorClasses = {
    auto: 'bg-blue-100 text-blue-800',
    supplier: 'bg-purple-100 text-purple-800',
    custom: 'bg-green-100 text-green-800',
  };

  const bgClass = type ? colorClasses[type] : 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium ${bgClass}`}
    >
      {type && (
        <span className="mr-1 text-xs opacity-60">
          {type === 'auto' ? 'A' : type === 'supplier' ? 'S' : 'C'}:
        </span>
      )}
      {sku}
    </span>
  );
};

export default SKUDisplay;
