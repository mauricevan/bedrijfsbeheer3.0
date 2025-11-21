import type { WebshopProduct, WebshopCategory, WebshopOrder } from '../types/webshop.types';
import { storage } from '@/utils/storage';
import { inventoryService } from '@/features/inventory/services/inventoryService';

const PRODUCTS_KEY = 'bedrijfsbeheer_webshop_products';
const CATEGORIES_KEY = 'bedrijfsbeheer_webshop_categories';
const ORDERS_KEY = 'bedrijfsbeheer_webshop_orders';

const DEFAULT_CATEGORIES: WebshopCategory[] = [
  {
    id: '1',
    name: 'Elektronica',
    slug: 'elektronica',
    sortOrder: 1,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Kantoorartikelen',
    slug: 'kantoorartikelen',
    sortOrder: 2,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let PRODUCTS = storage.get<WebshopProduct[]>(PRODUCTS_KEY, []);
let CATEGORIES = storage.get<WebshopCategory[]>(CATEGORIES_KEY, DEFAULT_CATEGORIES);
let ORDERS = storage.get<WebshopOrder[]>(ORDERS_KEY, []);

const saveProducts = () => storage.set(PRODUCTS_KEY, PRODUCTS);
const saveCategories = () => storage.set(CATEGORIES_KEY, CATEGORIES);
const saveOrders = () => storage.set(ORDERS_KEY, ORDERS);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const count = ORDERS.length + 1;
  return `ORD-${year}-${count.toString().padStart(4, '0')}`;
};

export const webshopService = {
  // Products
  getProducts: async (): Promise<WebshopProduct[]> => {
    await delay(300);
    return [...PRODUCTS];
  },

  createProduct: async (data: Omit<WebshopProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebshopProduct> => {
    await delay(500);
    const newProduct: WebshopProduct = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    PRODUCTS.push(newProduct);
    saveProducts();
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<WebshopProduct>): Promise<WebshopProduct> => {
    await delay(500);
    const index = PRODUCTS.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    const updated = {
      ...PRODUCTS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    PRODUCTS[index] = updated;
    saveProducts();
    return updated;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(500);
    PRODUCTS = PRODUCTS.filter(p => p.id !== id);
    saveProducts();
  },

  syncFromInventory: async (inventoryItemId: string): Promise<WebshopProduct> => {
    await delay(500);
    const inventoryItems = await inventoryService.getItems();
    const inventoryItem = inventoryItems.find(i => i.id === inventoryItemId);
    if (!inventoryItem) throw new Error('Inventory item not found');

    const existing = PRODUCTS.find(p => p.inventoryItemId === inventoryItemId);
    if (existing) {
      return webshopService.updateProduct(existing.id, {
        name: inventoryItem.name,
        sku: inventoryItem.sku,
        price: inventoryItem.salePrice,
        cost: inventoryItem.purchasePrice,
        stock: inventoryItem.quantity,
      });
    }

    return webshopService.createProduct({
      name: inventoryItem.name,
      sku: inventoryItem.sku,
      price: inventoryItem.salePrice,
      cost: inventoryItem.purchasePrice,
      stock: inventoryItem.quantity,
      status: 'active',
      inventoryItemId: inventoryItem.id,
      categoryId: inventoryItem.categoryId,
    });
  },

  // Categories
  getCategories: async (): Promise<WebshopCategory[]> => {
    await delay(300);
    return [...CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  createCategory: async (data: Omit<WebshopCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebshopCategory> => {
    await delay(500);
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
    const newCategory: WebshopCategory = {
      ...data,
      id: `cat-${Date.now()}`,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    CATEGORIES.push(newCategory);
    saveCategories();
    return newCategory;
  },

  updateCategory: async (id: string, updates: Partial<WebshopCategory>): Promise<WebshopCategory> => {
    await delay(500);
    const index = CATEGORIES.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const updated = {
      ...CATEGORIES[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    CATEGORIES[index] = updated;
    saveCategories();
    return updated;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await delay(500);
    CATEGORIES = CATEGORIES.filter(c => c.id !== id);
    saveCategories();
  },

  // Orders
  getOrders: async (): Promise<WebshopOrder[]> => {
    await delay(300);
    return [...ORDERS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createOrder: async (data: Omit<WebshopOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<WebshopOrder> => {
    await delay(500);
    const newOrder: WebshopOrder = {
      ...data,
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ORDERS.push(newOrder);
    saveOrders();
    return newOrder;
  },

  updateOrder: async (id: string, updates: Partial<WebshopOrder>): Promise<WebshopOrder> => {
    await delay(500);
    const index = ORDERS.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    
    const updated = {
      ...ORDERS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    ORDERS[index] = updated;
    saveOrders();
    return updated;
  },

  updateOrderStatus: async (id: string, status: WebshopOrder['status']): Promise<WebshopOrder> => {
    const updates: Partial<WebshopOrder> = { status };
    if (status === 'shipped') {
      updates.shippedAt = new Date().toISOString();
    } else if (status === 'delivered') {
      updates.deliveredAt = new Date().toISOString();
    }
    return webshopService.updateOrder(id, updates);
  },
};

