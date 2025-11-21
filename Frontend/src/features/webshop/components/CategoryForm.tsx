import React, { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import type { WebshopCategory } from '../types/webshop.types';

interface CategoryFormProps {
  category?: WebshopCategory | null;
  categories: WebshopCategory[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, categories, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    parentId: '',
    sortOrder: '0',
    status: 'active' as WebshopCategory['status'],
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        slug: category.slug || '',
        parentId: category.parentId || '',
        sortOrder: category.sortOrder?.toString() || '0',
        status: category.status || 'active',
      });
    }
  }, [category]);

  const handleSlugChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || name.toLowerCase().replace(/\s+/g, '-'),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      parentId: formData.parentId || undefined,
      sortOrder: parseInt(formData.sortOrder) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Categorienaam *"
          value={formData.name}
          onChange={(e) => handleSlugChange(e.target.value)}
          required
        />
        <Input
          label="Slug *"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Beschrijving
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Hoofdcategorie
          </label>
          <select
            value={formData.parentId}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Geen (hoofdcategorie)</option>
            {categories.filter(c => c.id !== category?.id).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <Input
          label="Sorteervolgorde"
          type="number"
          value={formData.sortOrder}
          onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as WebshopCategory['status'] })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="active">Actief</option>
            <option value="inactive">Inactief</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {category ? 'Bijwerken' : 'Aanmaken'}
        </Button>
      </div>
    </form>
  );
};

