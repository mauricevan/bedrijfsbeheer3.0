import { inventoryService } from './inventoryService';
import type { InventoryItem } from '../types/inventory.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const inventoryWarningService = {
  /**
   * Check if inventory item has an active warning
   * Warning is active if warningNote exists and warningEnabled !== false
   */
  hasActiveWarning: async (itemId: string): Promise<boolean> => {
    await delay(200);
    const items = await inventoryService.getItems();
    const item = items.find(i => i.id === itemId);
    
    if (!item) return false;
    
    // Warning is active if warningNote exists and warningEnabled is not explicitly false
    return !!(item.warningNote && item.warningEnabled !== false);
  },

  /**
   * Get warning note text for an inventory item
   */
  getWarningNote: async (itemId: string): Promise<string | null> => {
    await delay(200);
    const items = await inventoryService.getItems();
    const item = items.find(i => i.id === itemId);
    
    return item?.warningNote || null;
  },

  /**
   * Get the full inventory item to check warning status
   */
  getItem: async (itemId: string): Promise<InventoryItem | null> => {
    await delay(200);
    const items = await inventoryService.getItems();
    return items.find(i => i.id === itemId) || null;
  },
};

