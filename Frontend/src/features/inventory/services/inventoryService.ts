import type { InventoryItem, Category, Supplier } from '../types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

// Mock Data
const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', color: '#6366f1' },
  { id: '2', name: 'Office Supplies', color: '#10b981' },
  { id: '3', name: 'Furniture', color: '#f59e0b' },
];

const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'TechDistro BV', leadTimeDays: 2 },
  { id: '2', name: 'OfficeGiant', leadTimeDays: 5 },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Laptop Stand Adjustable',
    sku: 'INV-001',
    categoryId: '2',
    quantity: 45,
    reorderLevel: 10,
    unit: 'stuks',
    location: 'A-12',
    purchasePrice: 25.00,
    salePrice: 49.99,
    vatRate: 21,
    supplierId: '2',
    webshopSync: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'USB-C Cable 2m',
    sku: 'INV-002',
    categoryId: '1',
    quantity: 8,
    reorderLevel: 15,
    unit: 'stuks',
    location: 'B-05',
    purchasePrice: 3.50,
    salePrice: 12.99,
    vatRate: 21,
    supplierId: '1',
    webshopSync: true,
    posAlert: 'Check compatibility',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Ergonomic Chair',
    sku: 'INV-003',
    categoryId: '3',
    quantity: 2,
    reorderLevel: 3,
    unit: 'stuks',
    location: 'W-01',
    purchasePrice: 150.00,
    salePrice: 399.00,
    vatRate: 21,
    supplierId: '2',
    webshopSync: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Load from storage or use defaults
let MOCK_INVENTORY = storage.get<InventoryItem[]>(STORAGE_KEYS.INVENTORY, DEFAULT_INVENTORY);

// Save to storage
const saveInventory = () => {
  storage.set(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY);
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const inventoryService = {
  getItems: async (): Promise<InventoryItem[]> => {
    await delay(800);
    return [...MOCK_INVENTORY];
  },

  getCategories: async (): Promise<Category[]> => {
    await delay(500);
    return [...MOCK_CATEGORIES];
  },

  getSuppliers: async (): Promise<Supplier[]> => {
    await delay(500);
    return [...MOCK_SUPPLIERS];
  },

  createItem: async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> => {
    await delay(1000);
    const newItem: InventoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_INVENTORY.push(newItem);
    saveInventory();
    return newItem;
  },

  updateItem: async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
    await delay(800);
    const index = MOCK_INVENTORY.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    
    const updatedItem = {
      ...MOCK_INVENTORY[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    MOCK_INVENTORY[index] = updatedItem;
    saveInventory();
    return updatedItem;
  },

  deleteItem: async (id: string): Promise<void> => {
    await delay(800);
    const index = MOCK_INVENTORY.findIndex(i => i.id === id);
    if (index !== -1) {
      MOCK_INVENTORY.splice(index, 1);
      saveInventory();
    }
  }
};
