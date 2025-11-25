import React, { useState, useMemo } from 'react';
import type { InventoryItem, Category, Supplier } from '../types';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { defaultCategoryFilters } from '@/components/ExtendedSearchFilters';
import type { Filter, DropdownFilter, CheckboxFilter, ColorFilter } from '@/components/ExtendedSearchFilters';

import type { CreateInventoryItemInput } from '../types';

type InventoryFormProps = {
  initialData?: Partial<InventoryItem>;
  categories: Category[];
  suppliers: Supplier[];
  onSubmit: (data: CreateInventoryItemInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export const InventoryForm: React.FC<InventoryFormProps> = ({
  initialData,
  categories,
  suppliers,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    supplierSku: initialData?.supplierSku || '',
    customSku: initialData?.customSku || '',
    categoryId: initialData?.categoryId || '',
    quantity: initialData?.quantity || 0,
    reorderLevel: initialData?.reorderLevel || 5,
    unit: initialData?.unit || 'stuks',
    purchasePrice: initialData?.purchasePrice || 0,
    salePrice: initialData?.salePrice || 0,
    vatRate: initialData?.vatRate || 21,
    supplierId: initialData?.supplierId || '',
    webshopSync: initialData?.webshopSync || false,
    filterData: initialData?.filterData || {} as Record<string, any>,
  });

  // Get filters for selected category (excluding priceRange filters)
  const categoryFilters = useMemo(() => {
    if (!formData.categoryId) return [];
    const filters = defaultCategoryFilters[formData.categoryId] || [];
    // Exclude priceRange filters as price is already handled by purchasePrice/salePrice
    return filters.filter(f => f.type !== 'priceRange');
  }, [formData.categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Convert empty strings to undefined for optional fields
    const optionalFields = ['supplierSku', 'customSku', 'supplierId'];
    const processedValue = type === 'number' 
      ? parseFloat(value) 
      : (optionalFields.includes(name) && value === '' ? undefined : value);
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleFilterChange = (filterId: string, value: string | number | boolean | string[] | undefined) => {
    setFormData(prev => ({
      ...prev,
      filterData: {
        ...prev.filterData,
        [filterId]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const renderFilterField = (filter: Filter) => {
    switch (filter.type) {
      case 'dropdown': {
        const dropdownFilter = filter as DropdownFilter;
        const currentValue = formData.filterData?.[filter.id] || '';
        return (
          <div key={filter.id} className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {dropdownFilter.label}
            </label>
            <select
              value={currentValue}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {dropdownFilter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      }

      case 'checkbox': {
        const checkboxFilter = filter as CheckboxFilter;
        const currentValues = (formData.filterData?.[filter.id] as string[]) || [];
        return (
          <div key={filter.id} className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {checkboxFilter.label}
            </label>
            <div className="flex flex-wrap gap-2">
              {checkboxFilter.options.map((option) => {
                const isChecked = currentValues.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...currentValues, option.value]
                          : currentValues.filter((v) => v !== option.value);
                        handleFilterChange(filter.id, newValues);
                      }}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      }

      case 'color': {
        const colorFilter = filter as ColorFilter;
        const currentValues = (formData.filterData?.[filter.id] as string[]) || [];
        return (
          <div key={filter.id} className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {colorFilter.label}
            </label>
            <div className="flex flex-wrap gap-2">
              {colorFilter.options.map((option) => {
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

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Product name"
        />
        <Input
          label="SKU (Auto-generated)"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
          placeholder="INV-001"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="SKU (Leverancier)"
          name="supplierSku"
          value={formData.supplierSku}
          onChange={handleChange}
          placeholder="Supplier SKU (optional)"
        />
        <Input
          label="SKU (Aangepast)"
          name="customSku"
          value={formData.customSku}
          onChange={handleChange}
          placeholder="Custom SKU (optional)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="categoryId" className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="supplierId" className="text-sm font-medium text-slate-700 dark:text-slate-300">Supplier</label>
          <select
            id="supplierId"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Select Supplier</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category-specific filter fields */}
      {categoryFilters.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Categorie-specifieke eigenschappen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryFilters.map(filter => renderFilterField(filter))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <Input
          label="Reorder Level"
          name="reorderLevel"
          type="number"
          value={formData.reorderLevel}
          onChange={handleChange}
          required
        />
        <Input
          label="Unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          required
        />
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">VAT Rate</label>
          <select
            name="vatRate"
            value={formData.vatRate}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="21">21%</option>
            <option value="9">9%</option>
            <option value="0">0%</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Purchase Price (Excl.)"
          name="purchasePrice"
          type="number"
          step="0.01"
          value={formData.purchasePrice}
          onChange={handleChange}
          required
        />
        <Input
          label="Sale Price (Excl.)"
          name="salePrice"
          type="number"
          step="0.01"
          value={formData.salePrice}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Save Item
        </Button>
      </div>
    </form>
  );
};
