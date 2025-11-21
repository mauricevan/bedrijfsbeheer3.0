import React, { useState, useMemo } from 'react';
import { Plus, Search, FileDown } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { InventoryList, BTWOverview, CategoryFilter } from '../components';
import { InventoryForm } from '../components/InventoryForm';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { CSVUpload } from '@/components/common/CSVUpload';
import { ExtendedSearchFilters, defaultCategories as webshopCategories } from '@/components/ExtendedSearchFilters';
import { filterBySearchTerm, filterByCategory } from '../utils/filters';
import type { InventoryItem } from '../types';

export const InventoryPage: React.FC = () => {
  const { 
    items,
    categories, 
    suppliers,
    isLoading, 
    createItem,
    updateItem,
    deleteItem,
    quickAdjustStock,
    getFilteredItems 
  } = useInventory();
  
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExtendedFilters, setShowExtendedFilters] = useState(false);
  
  // Use comprehensive filtering like webshop and POS
  const filteredItems = useMemo(() => {
    let result = items;
    
    // Apply search filter (comprehensive)
    if (search) {
      result = filterBySearchTerm(result, search, suppliers, categories);
    }
    
    // Apply category filter
    if (selectedCategoryId) {
      result = filterByCategory(result, selectedCategoryId);
    }
    
    return result;
  }, [items, search, selectedCategoryId, suppliers, categories]);

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateItem(editingItem.id, data);
      } else {
        await createItem(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdjust = async (id: string, adjustment: number) => {
    try {
      await quickAdjustStock(id, adjustment);
    } catch (error) {
      console.error('Failed to adjust stock:', error);
      alert('Failed to adjust stock. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Voorraadbeheer</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            NL-Compliant voorraadbeheer met BTW-instellingen en webshop sync
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowExtendedFilters(true)}
            leftIcon={<Search className="h-4 w-4" />}
          >
            🔍 Uitgebreid zoeken
          </Button>
          <Button variant="outline" leftIcon={<FileDown className="h-4 w-4" />}>
            📄 CSV Import
          </Button>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleAdd}>
            + Nieuw Item
          </Button>
        </div>
      </div>

      {/* BTW Overview */}
      <BTWOverview items={items} />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400">
          📦 Items ({items.length})
        </button>
        <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
          🏢 Leveranciers ({suppliers.length})
        </button>
        <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
          📊 Rapportages
        </button>
        <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
          🏷️ Categorieën ({categories.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <CategoryFilter
          categories={webshopCategories.map(cat => ({ id: cat.id, name: cat.name }))}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Zoek op naam, SKU, locatie, leverancier, categorie, prijs, etc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={() => setShowExtendedFilters(true)}
            leftIcon={<Search className="h-4 w-4" />}
            className="whitespace-nowrap bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600"
          >
            🔍 Uitgebreid zoeken
          </Button>
        </div>
      </div>

      <InventoryList
        items={filteredItems}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onQuickAdjust={handleQuickAdjust}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        className="max-w-3xl"
      >
        <InventoryForm
          initialData={editingItem || {}}
          categories={webshopCategories.map(cat => ({ id: cat.id, name: cat.name }))}
          suppliers={suppliers}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Extended Search Filters */}
      <ExtendedSearchFilters
        isOpen={showExtendedFilters}
        onClose={() => setShowExtendedFilters(false)}
        onApplyFilters={(filters) => {
          // Apply filters to search - can be extended based on filter values
          console.log('Applied filters:', filters);
          // For now, we'll use the basic search, but this can be extended
        }}
      />
    </div>
  );
};
