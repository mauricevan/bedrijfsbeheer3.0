import { useState, useEffect, useCallback } from 'react';
import type { InventoryItem, Category, Supplier, InventoryFilter } from '../types';
import { inventoryService } from '../services';

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [itemsData, categoriesData, suppliersData] = await Promise.all([
        inventoryService.getItems(),
        inventoryService.getCategories(),
        inventoryService.getSuppliers(),
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newItem = await inventoryService.createItem(item);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to create item');
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const updatedItem = await inventoryService.updateItem(id, updates);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to update item');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await inventoryService.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete item');
    }
  };

  const quickAdjustStock = async (id: string, adjustment: number) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) throw new Error('Item not found');
      
      const newQuantity = Math.max(0, item.quantity + adjustment);
      await updateItem(id, { quantity: newQuantity });
    } catch (err) {
      console.error(err);
      throw new Error('Failed to adjust stock');
    }
  };

  const getFilteredItems = useCallback((filter: InventoryFilter) => {
    return items.filter(item => {
      const matchesSearch = !filter.search || 
        item.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        item.sku.toLowerCase().includes(filter.search.toLowerCase());
        
      const matchesCategory = !filter.categoryId || item.categoryId === filter.categoryId;
      
      const matchesLowStock = !filter.lowStock || item.quantity <= item.reorderLevel;
      
      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [items]);

  return {
    items,
    categories,
    suppliers,
    isLoading,
    error,
    refresh: fetchData,
    createItem,
    updateItem,
    deleteItem,
    quickAdjustStock,
    getFilteredItems,
  };
};
