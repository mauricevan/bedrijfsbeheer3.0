import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useInventory } from '@/features/inventory';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import type { CartItem } from '../types';

type ProductSelectorProps = {
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
};

export const ProductSelector: React.FC<ProductSelectorProps> = ({ onAddToCart }) => {
  const { items, categories, isLoading } = useInventory();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredItems = items.filter(item => {
    const matchesSearch = !search || 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory && item.quantity > 0;
  });

  const handleAddToCart = (item: typeof items[0]) => {
    onAddToCart({
      inventoryItemId: item.id,
      name: item.name,
      quantity: 1,
      pricePerUnit: item.salePrice,
      vatRate: item.vatRate,
      discount: 0,
    });
  };

  if (isLoading) {
    return (
      <Card className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="flex-1"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleAddToCart(item)}
          >
            <div className="flex flex-col h-full">
              <h4 className="font-medium text-slate-900 dark:text-white mb-1 line-clamp-2">
                {item.name}
              </h4>
              <p className="text-xs text-slate-500 mb-2">{item.sku}</p>
              <div className="mt-auto">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  €{item.salePrice.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500">
                  Stock: {item.quantity} {item.unit}
                </p>
              </div>
              <Button size="sm" className="w-full mt-3" leftIcon={<Plus className="h-3 w-3" />}>
                Add
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No products found
        </div>
      )}
    </div>
  );
};
