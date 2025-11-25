import type { InventoryItem, Category, Supplier } from '../types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { checkUniqueConstraints, findPotentialDuplicates } from '@/features/data-quality/services/fuzzyMatching';

// Mock Data
const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', color: '#6366f1' },
  { id: '2', name: 'Office Supplies', color: '#10b981' },
  { id: '3', name: 'Furniture', color: '#f59e0b' },
  // Webshop categories for extended search
  { id: 'cilinders', name: 'Cilinders', color: '#8b5cf6' },
  { id: 'eenpuntsloten', name: 'Eenpuntsloten', color: '#06b6d4' },
  { id: 'meerpuntsloten', name: 'Meerpuntsloten', color: '#10b981' },
  { id: 'deurbeslag', name: 'Deurbeslag', color: '#f59e0b' },
  { id: 'veiligheidsbeslag', name: 'Veiligheidsbeslag', color: '#ef4444' },
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
  // Mock data for extended search filters - Cilinders
  {
    id: '4',
    name: 'Profielcilinder 30/35mm EN1303',
    sku: 'CIL-001',
    categoryId: 'cilinders',
    quantity: 25,
    reorderLevel: 10,
    unit: 'stuks',
    location: 'C-01',
    purchasePrice: 15.00,
    salePrice: 35.00,
    vatRate: 21,
    supplierId: '1',
    webshopSync: true,
    filterData: {
      'outside-dimensions-a': '30',
      'inside-dimensions-b': '35',
      'certification': ['EN1303'],
      'category': ['profile'],
      'color': ['nickel'],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Ronde Cilinder 40/40mm SKG',
    sku: 'CIL-002',
    categoryId: 'cilinders',
    quantity: 18,
    reorderLevel: 10,
    unit: 'stuks',
    location: 'C-02',
    purchasePrice: 18.00,
    salePrice: 42.00,
    vatRate: 21,
    supplierId: '1',
    webshopSync: true,
    filterData: {
      'outside-dimensions-a': '40',
      'inside-dimensions-b': '40',
      'certification': ['SKG'],
      'category': ['round'],
      'color': ['brass'],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Ovale Cilinder 45/50mm VdS',
    sku: 'CIL-003',
    categoryId: 'cilinders',
    quantity: 12,
    reorderLevel: 10,
    unit: 'stuks',
    location: 'C-03',
    purchasePrice: 22.00,
    salePrice: 55.00,
    vatRate: 21,
    supplierId: '1',
    webshopSync: true,
    filterData: {
      'outside-dimensions-a': '45',
      'inside-dimensions-b': '50',
      'certification': ['VdS'],
      'category': ['oval'],
      'color': ['black'],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Mock data for Eenpuntsloten
  {
    id: '7',
    name: 'Eenpuntslot 60mm Centres Staal',
    sku: 'EPS-001',
    categoryId: 'eenpuntsloten',
    quantity: 15,
    reorderLevel: 5,
    unit: 'stuks',
    location: 'E-01',
    purchasePrice: 45.00,
    salePrice: 95.00,
    vatRate: 21,
    supplierId: '2',
    webshopSync: true,
    filterData: {
      'centres': '60',
      'backset': '50',
      'faceplate-dimensions': '120x20',
      'material': 'steel',
      'lock-operation': 'latch',
      'model': 'standard',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Eenpuntslot 70mm Centres Messing Premium',
    sku: 'EPS-002',
    categoryId: 'eenpuntsloten',
    quantity: 8,
    reorderLevel: 5,
    unit: 'stuks',
    location: 'E-02',
    purchasePrice: 65.00,
    salePrice: 145.00,
    vatRate: 21,
    supplierId: '2',
    webshopSync: true,
    filterData: {
      'centres': '70',
      'backset': '55',
      'faceplate-dimensions': '140x20',
      'material': 'brass',
      'lock-operation': 'both',
      'model': 'premium',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Mock data for Meerpuntsloten
  {
    id: '9',
    name: 'Meerpuntslot 5 Punten EN12209',
    sku: 'MPS-001',
    categoryId: 'meerpuntsloten',
    quantity: 10,
    reorderLevel: 5,
    unit: 'stuks',
    location: 'M-01',
    purchasePrice: 120.00,
    salePrice: 280.00,
    vatRate: 21,
    supplierId: '2',
    webshopSync: true,
    filterData: {
      'points': '5',
      'certification': ['EN12209'],
      'direction': ['both'],
      'panic': ['yes'],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Meerpuntslot 7 Punten SKG Links',
    sku: 'MPS-002',
    categoryId: 'meerpuntsloten',
    quantity: 6,
    reorderLevel: 5,
    unit: 'stuks',
    location: 'M-02',
    purchasePrice: 150.00,
    salePrice: 350.00,
    vatRate: 21,
    supplierId: '2',
    webshopSync: true,
    filterData: {
      'points': '7',
      'certification': ['SKG'],
      'direction': ['left'],
      'panic': ['no'],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Mock data for Deurbeslag
  {
    id: '11',
    name: 'Deurbeslag Handgreep Zwart Gepolijst',
    sku: 'DB-001',
    categoryId: 'deurbeslag',
    quantity: 20,
    reorderLevel: 10,
    unit: 'stuks',
    location: 'D-01',
    purchasePrice: 25.00,
    salePrice: 65.00,
    vatRate: 21,
    supplierId: '1',
    webshopSync: true,
    filterData: {
      'type': ['handle'],
      'finish': ['polished'],
      'color': ['black'],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Deurbeslag Kruk Nikkel Geborsteld',
    sku: 'DB-002',
    categoryId: 'deurbeslag',
    quantity: 15,
    reorderLevel: 10,
    unit: 'stuks',
    location: 'D-02',
    purchasePrice: 30.00,
    salePrice: 75.00,
    vatRate: 21,
    supplierId: '1',
    webshopSync: true,
    filterData: {
      'type': ['knob'],
      'finish': ['brushed'],
      'color': ['nickel'],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Mock data for Veiligheidsbeslag
  {
    id: '13',
    name: 'Veiligheidsbeslag Scharnier RVS RC3',
    sku: 'VB-001',
    categoryId: 'veiligheidsbeslag',
    quantity: 12,
    reorderLevel: 5,
    unit: 'stuks',
    location: 'V-01',
    purchasePrice: 85.00,
    salePrice: 195.00,
    vatRate: 21,
    supplierId: '2',
    webshopSync: true,
    filterData: {
      'type': 'hinge',
      'material': 'stainless',
      'security-level': 'rc3',
      'color': ['nickel'],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '14',
    name: 'Veiligheidsbeslag Sluitplaat Staal RC4',
    sku: 'VB-002',
    categoryId: 'veiligheidsbeslag',
    quantity: 8,
    reorderLevel: 5,
    unit: 'stuks',
    location: 'V-02',
    purchasePrice: 95.00,
    salePrice: 220.00,
    vatRate: 21,
    supplierId: '2',
    webshopSync: true,
    filterData: {
      'type': 'strike',
      'material': 'steel',
      'security-level': 'rc4',
      'color': ['black'],
    },
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
    // Filter out soft-deleted records by default
    return MOCK_INVENTORY.filter(i => !i.isDeleted && !i.is_deleted);
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
    
    // Check for unique constraint violations (SKU)
    const uniqueCheck = await checkUniqueConstraints('inventory', item as any);
    if (uniqueCheck.violated) {
      const conflict = uniqueCheck.conflicts[0];
      throw new Error(`Unieke constraint overtreding: ${conflict.field} "${conflict.value}" bestaat al (record: ${conflict.existingRecordId})`);
    }
    
    // Check for potential duplicates
    const potentialDuplicates = await findPotentialDuplicates('inventory', item as any, 0.85);
    if (potentialDuplicates.length > 0) {
      const duplicateWarning = `Waarschuwing: Mogelijk duplicaat gevonden (${potentialDuplicates.length} match(es) met score ≥85%). Duplicaten: ${potentialDuplicates.map(d => d.recordId).join(', ')}`;
      console.warn(duplicateWarning);
    }
    
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
    
    // Check for unique constraint violations (excluding current record)
    const uniqueCheck = await checkUniqueConstraints('inventory', updatedItem as any, id);
    if (uniqueCheck.violated) {
      const conflict = uniqueCheck.conflicts[0];
      throw new Error(`Unieke constraint overtreding: ${conflict.field} "${conflict.value}" bestaat al (record: ${conflict.existingRecordId})`);
    }
    
    // Check for potential duplicates
    const potentialDuplicates = await findPotentialDuplicates('inventory', updatedItem as any, 0.85);
    if (potentialDuplicates.length > 0 && !potentialDuplicates.some(d => d.recordId === id)) {
      const duplicateWarning = `Waarschuwing: Mogelijk duplicaat gevonden na update (${potentialDuplicates.length} match(es)). Duplicaten: ${potentialDuplicates.map(d => d.recordId).join(', ')}`;
      console.warn(duplicateWarning);
    }
    
    MOCK_INVENTORY[index] = updatedItem;
    saveInventory();
    return updatedItem;
  },

  deleteItem: async (id: string): Promise<void> => {
    await delay(800);
    const index = MOCK_INVENTORY.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    
    // Soft delete instead of hard delete
    MOCK_INVENTORY[index] = {
      ...MOCK_INVENTORY[index],
      isDeleted: true,
      is_deleted: true,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveInventory();
  }
};
