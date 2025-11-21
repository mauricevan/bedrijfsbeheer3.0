import { useState, useEffect, useCallback } from 'react';
import type { WebshopProduct, WebshopCategory, WebshopOrder } from '../types/webshop.types';
import { webshopService } from '../services/webshopService';

export const useWebshop = () => {
  const [products, setProducts] = useState<WebshopProduct[]>([]);
  const [categories, setCategories] = useState<WebshopCategory[]>([]);
  const [orders, setOrders] = useState<WebshopOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData, ordersData] = await Promise.all([
        webshopService.getProducts(),
        webshopService.getCategories(),
        webshopService.getOrders(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch webshop data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createProduct = async (data: Omit<WebshopProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    const product = await webshopService.createProduct(data);
    setProducts(prev => [...prev, product]);
    return product;
  };

  const updateProduct = async (id: string, updates: Partial<WebshopProduct>) => {
    const updated = await webshopService.updateProduct(id, updates);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };

  const deleteProduct = async (id: string) => {
    await webshopService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const syncFromInventory = async (inventoryItemId: string) => {
    const product = await webshopService.syncFromInventory(inventoryItemId);
    setProducts(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [...prev, product];
    });
    return product;
  };

  const createCategory = async (data: Omit<WebshopCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const category = await webshopService.createCategory(data);
    setCategories(prev => [...prev, category]);
    return category;
  };

  const updateCategory = async (id: string, updates: Partial<WebshopCategory>) => {
    const updated = await webshopService.updateCategory(id, updates);
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  };

  const deleteCategory = async (id: string) => {
    await webshopService.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const createOrder = async (data: Omit<WebshopOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const order = await webshopService.createOrder(data);
    setOrders(prev => [...prev, order]);
    return order;
  };

  const updateOrder = async (id: string, updates: Partial<WebshopOrder>) => {
    const updated = await webshopService.updateOrder(id, updates);
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
    return updated;
  };

  const updateOrderStatus = async (id: string, status: WebshopOrder['status']) => {
    const updated = await webshopService.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
    return updated;
  };

  return {
    products,
    categories,
    orders,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    syncFromInventory,
    createCategory,
    updateCategory,
    deleteCategory,
    createOrder,
    updateOrder,
    updateOrderStatus,
    refresh: fetchData,
  };
};

