// features/workorders/services/materialService.ts
// Material Management Service
// Compliant met prompt.git: Max 250 regels, pure functions

import type { InventoryItem, MaterialSelection } from '../types';

/**
 * Add material to work order
 */
export const addMaterial = (
  currentMaterials: MaterialSelection[],
  materialId: string,
  quantity: number
): MaterialSelection[] => {
  // Check if material already exists
  const exists = currentMaterials.some((m) => m.itemId === materialId);
  if (exists) {
    // Update quantity if exists
    return currentMaterials.map((m) =>
      m.itemId === materialId ? { ...m, quantity: m.quantity + quantity } : m
    );
  }

  // Add new material
  return [...currentMaterials, { itemId: materialId, quantity }];
};

/**
 * Remove material from work order
 */
export const removeMaterial = (
  currentMaterials: MaterialSelection[],
  materialId: string
): MaterialSelection[] => {
  return currentMaterials.filter((m) => m.itemId !== materialId);
};

/**
 * Update material quantity
 */
export const updateMaterialQuantity = (
  currentMaterials: MaterialSelection[],
  materialId: string,
  newQuantity: number
): MaterialSelection[] => {
  return currentMaterials.map((m) =>
    m.itemId === materialId ? { ...m, quantity: newQuantity } : m
  );
};

/**
 * Reserve inventory for work order
 */
export const reserveInventory = (
  inventory: InventoryItem[],
  materials: MaterialSelection[]
): InventoryItem[] => {
  return inventory.map((item) => {
    const material = materials.find((m) => m.itemId === item.id);
    if (material) {
      return {
        ...item,
        quantity: item.quantity - material.quantity,
      };
    }
    return item;
  });
};

/**
 * Release reserved inventory (on work order cancellation)
 */
export const releaseInventory = (
  inventory: InventoryItem[],
  materials: MaterialSelection[]
): InventoryItem[] => {
  return inventory.map((item) => {
    const material = materials.find((m) => m.itemId === item.id);
    if (material) {
      return {
        ...item,
        quantity: item.quantity + material.quantity,
      };
    }
    return item;
  });
};

/**
 * Check if materials are available in inventory
 */
export const checkMaterialsAvailability = (
  inventory: InventoryItem[],
  materials: MaterialSelection[]
): { available: boolean; missing: string[] } => {
  const missing: string[] = [];

  for (const material of materials) {
    const item = inventory.find((i) => i.id === material.itemId);
    if (!item || item.quantity < material.quantity) {
      missing.push(
        item?.name || material.itemId
      );
    }
  }

  return {
    available: missing.length === 0,
    missing,
  };
};

/**
 * Get total material cost
 */
export const calculateMaterialCost = (
  inventory: InventoryItem[],
  materials: MaterialSelection[]
): number => {
  return materials.reduce((total, material) => {
    const item = inventory.find((i) => i.id === material.itemId);
    if (item) {
      return total + item.salePrice * material.quantity;
    }
    return total;
  }, 0);
};
