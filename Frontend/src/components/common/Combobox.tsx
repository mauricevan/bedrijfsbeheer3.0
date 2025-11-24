/**
 * Combobox Component
 * Searchable dropdown/select component for large lists
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ComboboxOption {
  value: string;
  label: string;
  subtitle?: string;
}

type ComboboxProps = {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
};

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecteer...',
  searchPlaceholder = 'Zoeken...',
  className,
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when opened
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg',
          'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
          'flex items-center justify-between gap-2',
          'hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500',
          disabled && 'opacity-50 cursor-not-allowed',
          !selectedOption && 'text-slate-500 dark:text-slate-400'
        )}
      >
        <span className="truncate flex-1 text-left">
          {selectedOption ? (
            <div>
              <div className="font-medium">{selectedOption.label}</div>
              {selectedOption.subtitle && (
                <div className="text-xs text-slate-500 dark:text-slate-400">{selectedOption.subtitle}</div>
              )}
            </div>
          ) : (
            placeholder
          )}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-slate-500 transition-transform',
              isOpen && 'transform rotate-180'
            )}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                Geen resultaten gevonden
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full px-3 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
                    'transition-colors',
                    option.value === value && 'bg-indigo-100 dark:bg-indigo-900/30'
                  )}
                >
                  <div className="font-medium text-slate-900 dark:text-white">{option.label}</div>
                  {option.subtitle && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">{option.subtitle}</div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

