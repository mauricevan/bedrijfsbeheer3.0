import React, { useState } from 'react';
import type { InventoryItem, Category, Supplier } from '../types';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

type InventoryFormProps = {
  initialData?: Partial<InventoryItem>;
  categories: Category[];
  suppliers: Supplier[];
  onSubmit: (data: any) => Promise<void>;
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
    name: '',
    sku: '',
    categoryId: '',
    quantity: 0,
    reorderLevel: 5,
    unit: 'stuks',
    purchasePrice: 0,
    salePrice: 0,
    vatRate: 21,
    supplierId: '',
    webshopSync: false,
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
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
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
          placeholder="INV-001"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <select
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
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Supplier</label>
          <select
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
