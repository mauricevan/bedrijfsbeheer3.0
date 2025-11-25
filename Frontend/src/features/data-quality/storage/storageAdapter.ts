import type { EntityType } from '../types/data-quality.types';
import { storage } from '@/utils/storage';

// Storage keys mapping
const ENTITY_STORAGE_KEYS: Record<EntityType, string> = {
  customer: 'bedrijfsbeheer_customers',
  supplier: 'bedrijfsbeheer_suppliers',
  inventory: 'bedrijfsbeheer_inventory',
  contact: 'bedrijfsbeheer_contacts',
  employee: 'bedrijfsbeheer_employees',
};

// Foreign key relationships mapping
const FOREIGN_KEY_RELATIONS: Record<EntityType, Array<{ entityType: string; field: string; storageKey: string }>> = {
  customer: [
    { entityType: 'interaction', field: 'customerId', storageKey: 'bedrijfsbeheer_interactions' },
    { entityType: 'task', field: 'customerId', storageKey: 'bedrijfsbeheer_tasks' },
    { entityType: 'invoice', field: 'customerId', storageKey: 'bedrijfsbeheer_invoices' },
    { entityType: 'quote', field: 'customerId', storageKey: 'bedrijfsbeheer_quotes' },
    { entityType: 'work_order', field: 'customerId', storageKey: 'bedrijfsbeheer_work_orders' },
  ],
  supplier: [
    { entityType: 'inventory', field: 'supplierId', storageKey: 'bedrijfsbeheer_inventory' },
  ],
  inventory: [
    { entityType: 'pos_sale_item', field: 'inventoryItemId', storageKey: 'bedrijfsbeheer_pos_transactions' },
    { entityType: 'work_order_material', field: 'inventoryItemId', storageKey: 'bedrijfsbeheer_work_orders' },
  ],
  contact: [],
  employee: [
    { entityType: 'interaction', field: 'employeeId', storageKey: 'bedrijfsbeheer_interactions' },
    { entityType: 'task', field: 'employeeId', storageKey: 'bedrijfsbeheer_tasks' },
  ],
};

export interface StorageAdapter {
  getAllRecords(entityType: EntityType): Promise<any[]>;
  getRecordById(entityType: EntityType, id: string): Promise<any | null>;
  findSimilarRecords(entityType: EntityType, criteria: Record<string, any>): Promise<any[]>;
  updateRecord(entityType: EntityType, id: string, updates: Record<string, any>): Promise<any>;
  getRelatedRecords(entityType: EntityType, recordId: string): Promise<Array<{ entityType: string; records: any[] }>>;
  updateRelatedRecords(entityType: string, field: string, oldId: string, newId: string): Promise<number>;
}

class LocalStorageAdapter implements StorageAdapter {
  async getAllRecords(entityType: EntityType): Promise<any[]> {
    const key = ENTITY_STORAGE_KEYS[entityType];
    if (!key) return [];
    return storage.get<any[]>(key, []);
  }

  async getRecordById(entityType: EntityType, id: string): Promise<any | null> {
    const records = await this.getAllRecords(entityType);
    return records.find(r => r.id === id) || null;
  }

  async findSimilarRecords(entityType: EntityType, criteria: Record<string, any>): Promise<any[]> {
    const records = await this.getAllRecords(entityType);
    
    // Filter out soft-deleted records
    const activeRecords = records.filter(r => !r.isDeleted && !r.is_deleted);
    
    // Simple exact match for now - fuzzy matching will be done in the service layer
    return activeRecords.filter(record => {
      for (const [key, value] of Object.entries(criteria)) {
        if (value && record[key] && record[key] === value) {
          return true;
        }
      }
      return false;
    });
  }

  async updateRecord(entityType: EntityType, id: string, updates: Record<string, any>): Promise<any> {
    const key = ENTITY_STORAGE_KEYS[entityType];
    const records = await this.getAllRecords(entityType);
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error(`Record not found: ${id}`);
    }
    
    const updated = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    records[index] = updated;
    storage.set(key, records);
    return updated;
  }

  async getRelatedRecords(entityType: EntityType, recordId: string): Promise<Array<{ entityType: string; records: any[] }>> {
    const relations = FOREIGN_KEY_RELATIONS[entityType] || [];
    const results: Array<{ entityType: string; records: any[] }> = [];
    
    for (const relation of relations) {
      const relatedRecords = storage.get<any[]>(relation.storageKey, []);
      const filtered = relatedRecords.filter(r => r[relation.field] === recordId);
      
      if (filtered.length > 0) {
        results.push({
          entityType: relation.entityType,
          records: filtered,
        });
      }
    }
    
    return results;
  }

  async updateRelatedRecords(entityType: string, field: string, oldId: string, newId: string): Promise<number> {
    // Find all storage keys that might contain this relationship
    const allStorageKeys = [
      'bedrijfsbeheer_interactions',
      'bedrijfsbeheer_tasks',
      'bedrijfsbeheer_invoices',
      'bedrijfsbeheer_quotes',
      'bedrijfsbeheer_work_orders',
      'bedrijfsbeheer_inventory',
      'bedrijfsbeheer_pos_transactions',
    ];
    
    let updatedCount = 0;
    
    for (const storageKey of allStorageKeys) {
      const records = storage.get<any[]>(storageKey, []);
      let changed = false;
      
      const updated = records.map(record => {
        if (record[field] === oldId) {
          changed = true;
          updatedCount++;
          return {
            ...record,
            [field]: newId,
            updatedAt: new Date().toISOString(),
          };
        }
        return record;
      });
      
      if (changed) {
        storage.set(storageKey, updated);
      }
    }
    
    return updatedCount;
  }
}

// Export singleton instance
export const storageAdapter: StorageAdapter = new LocalStorageAdapter();

// For future database migration, create DatabaseStorageAdapter implementing the same interface
// export class DatabaseStorageAdapter implements StorageAdapter { ... }

