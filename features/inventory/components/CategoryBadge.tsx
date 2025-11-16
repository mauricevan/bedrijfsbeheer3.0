/**
 * Category Badge Component
 *
 * Displays inventory category with color coding
 *
 * Compliant with: INVENTORY_COMPLETE.md Feature 7 (P1)
 */

import React from 'react';
import type { InventoryCategory } from '../../../types';

interface CategoryBadgeProps {
  category: InventoryCategory | undefined;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

/**
 * Category Badge component with color coding
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = false,
}) => {
  if (!category) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
        Uncategorized
      </span>
    );
  }

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const bgColor = category.color || '#3B82F6';

  // Calculate text color based on background brightness
  const getTextColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? '#000000' : '#FFFFFF';
  };

  const textColor = getTextColor(bgColor);

  return (
    <span
      className={`inline-flex items-center rounded font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      title={category.description || category.name}
    >
      {showIcon && (
        <svg
          className="w-3 h-3 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {category.name}
    </span>
  );
};

export default CategoryBadge;
