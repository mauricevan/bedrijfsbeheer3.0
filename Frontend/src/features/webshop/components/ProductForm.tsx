import React, { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import type { WebshopProduct } from '../types/webshop.types';
import { useInventory } from '@/features/inventory/hooks/useInventory';

interface ProductFormProps {
  product?: WebshopProduct | null;
  categories: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onSubmit, onCancel, isLoading }) => {
  const { items: inventoryItems } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    comparePrice: '',
    cost: '',
    stock: '',
    categoryId: '',
    status: 'active' as WebshopProduct['status'],
    inventoryItemId: '',
    weight: '',
    seoTitle: '',
    seoDescription: '',
    tags: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        sku: product.sku || '',
        price: product.price?.toString() || '',
        comparePrice: product.comparePrice?.toString() || '',
        cost: product.cost?.toString() || '',
        stock: product.stock?.toString() || '',
        categoryId: product.categoryId || '',
        status: product.status || 'active',
        inventoryItemId: product.inventoryItemId || '',
        weight: product.weight?.toString() || '',
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        tags: product.tags?.join(', ') || '',
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0,
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock) || 0,
      categoryId: formData.categoryId || undefined,
      inventoryItemId: formData.inventoryItemId || undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Productnaam *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
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
        <Input
          label="SKU *"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as WebshopProduct['status'] })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="active">Actief</option>
            <option value="inactive">Inactief</option>
            <option value="draft">Concept</option>
          </select>
        </div>
        <Input
          label="Verkoopprijs (€) *"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <Input
          label="Vergelijkingsprijs (€)"
          type="number"
          step="0.01"
          value={formData.comparePrice}
          onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
        />
        <Input
          label="Inkoopprijs (€) *"
          type="number"
          step="0.01"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          required
        />
        <Input
          label="Voorraad *"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Categorie
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Geen categorie</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Synchroniseren met Voorraad
          </label>
          <select
            value={formData.inventoryItemId}
            onChange={(e) => setFormData({ ...formData, inventoryItemId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Geen synchronisatie</option>
            {inventoryItems.map(item => (
              <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
            ))}
          </select>
        </div>
        <Input
          label="Gewicht (kg)"
          type="number"
          step="0.01"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
        />
        <Input
          label="Tags (komma gescheiden)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="tag1, tag2, tag3"
        />
        <Input
          label="SEO Titel"
          value={formData.seoTitle}
          onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
        />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            SEO Beschrijving
          </label>
          <textarea
            value={formData.seoDescription}
            onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {product ? 'Bijwerken' : 'Aanmaken'}
        </Button>
      </div>
    </form>
  );
};

