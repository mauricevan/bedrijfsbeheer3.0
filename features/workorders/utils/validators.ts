// features/workorders/utils/validators.ts
// WorkOrders Validation Functions
// Compliant met prompt.git: Max 150 regels per utility

import type { NewOrderForm, MaterialSelection } from '../types';

/**
 * Validate new work order form
 */
export const validateNewOrder = (form: NewOrderForm): string | null => {
  if (!form.title.trim()) {
    return 'Titel is verplicht';
  }

  if (!form.description.trim()) {
    return 'Beschrijving is verplicht';
  }

  if (!form.assignedTo) {
    return 'Medewerker selectie is verplicht';
  }

  if (form.title.length > 100) {
    return 'Titel mag max 100 tekens zijn';
  }

  if (form.description.length > 500) {
    return 'Beschrijving mag max 500 tekens zijn';
  }

  return null;
};

/**
 * Validate material selection
 */
export const validateMaterial = (
  materialId: string,
  quantity: number
): string | null => {
  if (!materialId) {
    return 'Selecteer een materiaal';
  }

  if (quantity <= 0) {
    return 'Aantal moet groter dan 0 zijn';
  }

  if (!Number.isInteger(quantity)) {
    return 'Aantal moet een geheel getal zijn';
  }

  return null;
};

/**
 * Check if material is already in list
 */
export const isMaterialDuplicate = (
  materials: MaterialSelection[],
  materialId: string
): boolean => {
  return materials.some((m) => m.itemId === materialId);
};

/**
 * Validate hours input
 */
export const validateHours = (hours: number): string | null => {
  if (hours < 0) {
    return 'Uren kunnen niet negatief zijn';
  }

  if (hours > 1000) {
    return 'Uren lijken onrealistisch hoog';
  }

  return null;
};
