import React, { useState, useEffect, useCallback } from 'react';
import { X, ArrowLeft } from 'lucide-react';

// Type Definitions
export interface Category {
  id: string;
  name: string;
  categoryId: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface ColorOption {
  value: string;
  label: string;
  color: string;
}

export type DropdownFilter = {
  id: string;
  type: 'dropdown';
  label: string;
  options: FilterOption[];
};

export type CheckboxFilter = {
  id: string;
  type: 'checkbox';
  label: string;
  options: FilterOption[];
};

export type ColorFilter = {
  id: string;
  type: 'color';
  label: string;
  options: ColorOption[];
};

export type PriceRangeFilter = {
  id: string;
  type: 'priceRange';
  label: string;
  min: number;
  max: number;
};

export type Filter = DropdownFilter | CheckboxFilter | ColorFilter | PriceRangeFilter;

interface ExtendedSearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[];
  categoryFilters?: Record<string, Filter[]>;
  onApplyFilters?: (filters: Record<string, any>, categoryId?: string | null) => void;
}

// Default webshop categories (for backward compatibility)
export const defaultCategories: Category[] = [
  { id: 'cilinders', name: 'Cilinders', categoryId: 2 },
  { id: 'eenpuntsloten', name: 'Eenpuntsloten', categoryId: 29 },
  { id: 'meerpuntsloten', name: 'Meerpuntsloten', categoryId: 28 },
  { id: 'deurbeslag', name: 'Deurbeslag', categoryId: 5 },
  { id: 'veiligheidsbeslag', name: 'Veiligheidsbeslag', categoryId: 4 },
];

export const defaultCategoryFilters: Record<string, Filter[]> = {
  cilinders: [
    {
      id: 'outside-dimensions-a',
      type: 'dropdown',
      label: 'Buitenafmetingen A (mm)',
      options: [
        { value: '', label: '-' },
        { value: '30', label: '30' },
        { value: '35', label: '35' },
        { value: '40', label: '40' },
        { value: '45', label: '45' },
        { value: '50', label: '50' },
      ],
    },
    {
      id: 'inside-dimensions-b',
      type: 'dropdown',
      label: 'Binnenafmetingen B (mm)',
      options: [
        { value: '', label: '-' },
        { value: '30', label: '30' },
        { value: '35', label: '35' },
        { value: '40', label: '40' },
        { value: '45', label: '45' },
        { value: '50', label: '50' },
      ],
    },
    {
      id: 'certification',
      type: 'checkbox',
      label: 'Certificering',
      options: [
        { value: 'EN1303', label: 'EN 1303' },
        { value: 'EN1304', label: 'EN 1304' },
        { value: 'SKG', label: 'SKG' },
        { value: 'VdS', label: 'VdS' },
      ],
    },
    {
      id: 'category',
      type: 'checkbox',
      label: 'Categorie',
      options: [
        { value: 'profile', label: 'Profielcilinder' },
        { value: 'round', label: 'Ronde cilinder' },
        { value: 'oval', label: 'Ovale cilinder' },
      ],
    },
    {
      id: 'color',
      type: 'color',
      label: 'Kleur',
      options: [
        { value: 'black', label: 'Zwart', color: '#000000' },
        { value: 'white', label: 'Wit', color: '#FFFFFF' },
        { value: 'nickel', label: 'Nikkel', color: '#C0C0C0' },
        { value: 'brass', label: 'Messing', color: '#B87333' },
        { value: 'chrome', label: 'Chroom', color: '#E8E8E8' },
      ],
    },
    {
      id: 'price',
      type: 'priceRange',
      label: 'Prijs',
      min: 0,
      max: 1000,
    },
  ],
  eenpuntsloten: [
    {
      id: 'centres',
      type: 'dropdown',
      label: 'Centres (mm)',
      options: [
        { value: '', label: '-' },
        { value: '50', label: '50' },
        { value: '55', label: '55' },
        { value: '60', label: '60' },
        { value: '65', label: '65' },
        { value: '70', label: '70' },
      ],
    },
    {
      id: 'backset',
      type: 'dropdown',
      label: 'Backset (mm)',
      options: [
        { value: '', label: '-' },
        { value: '45', label: '45' },
        { value: '50', label: '50' },
        { value: '55', label: '55' },
        { value: '60', label: '60' },
      ],
    },
    {
      id: 'faceplate-dimensions',
      type: 'dropdown',
      label: 'Deurplaat afmetingen',
      options: [
        { value: '', label: '-' },
        { value: '100x20', label: '100 x 20 mm' },
        { value: '120x20', label: '120 x 20 mm' },
        { value: '140x20', label: '140 x 20 mm' },
      ],
    },
    {
      id: 'material',
      type: 'dropdown',
      label: 'Materiaal',
      options: [
        { value: '', label: '-' },
        { value: 'steel', label: 'Staal' },
        { value: 'brass', label: 'Messing' },
        { value: 'zinc', label: 'Zink' },
      ],
    },
    {
      id: 'lock-operation',
      type: 'dropdown',
      label: 'Sluitwerking',
      options: [
        { value: '', label: '-' },
        { value: 'latch', label: 'Klink' },
        { value: 'deadbolt', label: 'Sluitbout' },
        { value: 'both', label: 'Beide' },
      ],
    },
    {
      id: 'model',
      type: 'dropdown',
      label: 'Model',
      options: [
        { value: '', label: '-' },
        { value: 'standard', label: 'Standaard' },
        { value: 'premium', label: 'Premium' },
        { value: 'security', label: 'Beveiliging' },
      ],
    },
    {
      id: 'price',
      type: 'priceRange',
      label: 'Prijs',
      min: 0,
      max: 2000,
    },
  ],
  meerpuntsloten: [
    {
      id: 'points',
      type: 'dropdown',
      label: 'Aantal punten',
      options: [
        { value: '', label: '-' },
        { value: '3', label: '3 punten' },
        { value: '5', label: '5 punten' },
        { value: '7', label: '7 punten' },
      ],
    },
    {
      id: 'certification',
      type: 'checkbox',
      label: 'Certificering',
      options: [
        { value: 'EN12209', label: 'EN 12209' },
        { value: 'SKG', label: 'SKG' },
        { value: 'VdS', label: 'VdS' },
      ],
    },
    {
      id: 'direction',
      type: 'checkbox',
      label: 'Draairichting',
      options: [
        { value: 'left', label: 'Links' },
        { value: 'right', label: 'Rechts' },
        { value: 'both', label: 'Beide' },
      ],
    },
    {
      id: 'panic',
      type: 'checkbox',
      label: 'Paniekfunctie',
      options: [
        { value: 'yes', label: 'Ja' },
        { value: 'no', label: 'Nee' },
      ],
    },
    {
      id: 'price',
      type: 'priceRange',
      label: 'Prijs',
      min: 0,
      max: 3000,
    },
  ],
  deurbeslag: [
    {
      id: 'type',
      type: 'checkbox',
      label: 'Type',
      options: [
        { value: 'handle', label: 'Handgreep' },
        { value: 'knob', label: 'Kruk' },
        { value: 'lever', label: 'Hefboom' },
      ],
    },
    {
      id: 'finish',
      type: 'checkbox',
      label: 'Afwerking',
      options: [
        { value: 'polished', label: 'Gepolijst' },
        { value: 'brushed', label: 'Geborsteld' },
        { value: 'matt', label: 'Mat' },
      ],
    },
    {
      id: 'color',
      type: 'color',
      label: 'Kleur',
      options: [
        { value: 'black', label: 'Zwart', color: '#000000' },
        { value: 'white', label: 'Wit', color: '#FFFFFF' },
        { value: 'nickel', label: 'Nikkel', color: '#C0C0C0' },
        { value: 'brass', label: 'Messing', color: '#B87333' },
        { value: 'chrome', label: 'Chroom', color: '#E8E8E8' },
        { value: 'bronze', label: 'Brons', color: '#CD7F32' },
        { value: 'ral-gradient', label: 'RAL Kleuren', color: 'linear-gradient(90deg, #FF0000 0%, #FF7F00 14%, #FFFF00 28%, #00FF00 42%, #0000FF 57%, #4B0082 71%, #9400D3 100%)' },
      ],
    },
  ],
  veiligheidsbeslag: [
    {
      id: 'type',
      type: 'dropdown',
      label: 'Type',
      options: [
        { value: '', label: '-' },
        { value: 'hinge', label: 'Scharnier' },
        { value: 'strike', label: 'Sluitplaat' },
        { value: 'reinforcement', label: 'Versterking' },
      ],
    },
    {
      id: 'material',
      type: 'dropdown',
      label: 'Materiaal',
      options: [
        { value: '', label: '-' },
        { value: 'steel', label: 'Staal' },
        { value: 'stainless', label: 'RVS' },
        { value: 'brass', label: 'Messing' },
      ],
    },
    {
      id: 'security-level',
      type: 'dropdown',
      label: 'Beveiligingsniveau',
      options: [
        { value: '', label: '-' },
        { value: 'rc2', label: 'RC2' },
        { value: 'rc3', label: 'RC3' },
        { value: 'rc4', label: 'RC4' },
      ],
    },
    {
      id: 'color',
      type: 'color',
      label: 'Kleur',
      options: [
        { value: 'black', label: 'Zwart', color: '#000000' },
        { value: 'white', label: 'Wit', color: '#FFFFFF' },
        { value: 'nickel', label: 'Nikkel', color: '#C0C0C0' },
        { value: 'chrome', label: 'Chroom', color: '#E8E8E8' },
      ],
    },
    {
      id: 'price',
      type: 'priceRange',
      label: 'Prijs',
      min: 0,
      max: 1500,
    },
  ],
};

export const ExtendedSearchFilters: React.FC<ExtendedSearchFiltersProps> = ({ 
  isOpen, 
  onClose,
  categories: providedCategories,
  categoryFilters: providedCategoryFilters,
  onApplyFilters
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  
  // Use provided categories/filters or defaults
  const categories = providedCategories || defaultCategories;
  const categoryFilters = providedCategoryFilters || defaultCategoryFilters;

  const handleClose = useCallback(() => {
    setSelectedCategory(null);
    setFilterValues({});
    onClose();
  }, [onClose]);

  const handleApplyFilters = useCallback(() => {
    if (onApplyFilters) {
      onApplyFilters(filterValues, selectedCategory);
    }
    handleClose();
  }, [filterValues, selectedCategory, onApplyFilters, handleClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const renderFilter = (filter: Filter) => {
    switch (filter.type) {
      case 'dropdown': {
        const currentValue = filterValues[filter.id] || '';
        return (
          <div key={filter.id} className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {filter.label}
            </label>
            <select
              value={currentValue}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      }

      case 'checkbox': {
        const currentValues = (filterValues[filter.id] as string[]) || [];
        return (
          <div key={filter.id} className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {filter.label}
            </label>
            <div className="flex flex-col space-y-2">
              {filter.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={currentValues.includes(option.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v) => v !== option.value);
                      handleFilterChange(filter.id, newValues);
                    }}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      }

      case 'color': {
        const currentValues = (filterValues[filter.id] as string[]) || [];
        return (
          <div key={filter.id} className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {filter.label}
            </label>
            <div className="flex flex-wrap gap-3">
              {filter.options.map((option) => {
                const isSelected = currentValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      const newValues = isSelected
                        ? currentValues.filter((v) => v !== option.value)
                        : [...currentValues, option.value];
                      handleFilterChange(filter.id, newValues);
                    }}
                    className={`w-10 h-10 rounded border-2 transition-all ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500 scale-110'
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                    }`}
                    style={{
                      backgroundColor: option.color.startsWith('linear-gradient') ? 'transparent' : option.color,
                      backgroundImage: option.color.startsWith('linear-gradient') ? option.color : undefined,
                    }}
                    title={option.label}
                  />
                );
              })}
            </div>
          </div>
        );
      }

      case 'priceRange': {
        const currentValue = filterValues[filter.id] as { min: number; max: number } || {
          min: filter.min,
          max: filter.max,
        };
        const minValue = currentValue.min || filter.min;
        const maxValue = currentValue.max || filter.max;

        const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newMin = Math.min(Number(e.target.value), maxValue);
          handleFilterChange(filter.id, { min: newMin, max: maxValue });
        };

        const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newMax = Math.max(Number(e.target.value), minValue);
          handleFilterChange(filter.id, { min: minValue, max: newMax });
        };

        const percentageMin = ((minValue - filter.min) / (filter.max - filter.min)) * 100;
        const percentageMax = ((maxValue - filter.min) / (filter.max - filter.min)) * 100;

        return (
          <div key={filter.id} className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {filter.label}
            </label>
            <div className="relative">
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <div
                  className="absolute h-2 bg-indigo-600 rounded-lg"
                  style={{
                    left: `${percentageMin}%`,
                    width: `${percentageMax - percentageMin}%`,
                  }}
                />
              </div>
              <input
                type="range"
                min={filter.min}
                max={filter.max}
                value={minValue}
                onChange={handleMinChange}
                className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
              />
              <input
                type="range"
                min={filter.min}
                max={filter.max}
                value={maxValue}
                onChange={handleMaxChange}
                className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>€{minValue.toFixed(2)}</span>
              <span>€{maxValue.toFixed(2)}</span>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 animate-fadeIn"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-xl animate-slideInRight"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
              {selectedCategory ? (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Terug naar categorieën
                </button>
              ) : (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Uitgebreid zoeken</h2>
              )}
              <button
                onClick={handleClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Sluiten"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-[calc(100vh-8rem)] p-4">
              {!selectedCategory ? (
                // Category Selection
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full p-4 text-left border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                    </button>
                  ))}
                </div>
              ) : (
                // Filter Selection
                <div className="space-y-4">
                  {categoryFilters[selectedCategory]?.map((filter) => renderFilter(filter))}
                </div>
              )}
            </div>

            {/* Footer with Apply Button */}
            {selectedCategory && (
              <div className="sticky bottom-0 p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Terug
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Filters Toepassen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

