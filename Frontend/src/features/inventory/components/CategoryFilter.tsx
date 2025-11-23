/**
 * CategoryFilter Component
 * Dropdown to filter inventory items by category
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Category } from '../types';
import { cn } from '@/utils/cn';

type CategoryFilterProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
}) => {
  return (
    <div className="relative">
      <select
        value={selectedCategoryId || ''}
        onChange={(e) => onSelect(e.target.value || null)}
        className={cn(
          'w-full px-4 py-2 pr-10 rounded-lg border-2',
          'bg-white dark:bg-slate-800',
          'border-slate-300 dark:border-slate-600',
          'text-slate-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'appearance-none cursor-pointer'
        )}
      >
        <option value="">🏷️ Filter op categorie...</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
    </div>
  );
};

