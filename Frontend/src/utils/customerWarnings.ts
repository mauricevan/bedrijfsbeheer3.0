import { warningConfigService, type WarningArea } from '@/features/crm/services/warningConfigService';
import type { WarningConfig } from '@/features/crm/services/warningConfigService';

/**
 * Get the customer warning configuration
 */
export const getCustomerWarningConfig = (): WarningConfig => {
  return warningConfigService.getWarningConfig();
};

/**
 * Check if warnings are enabled for a specific area
 */
export const isWarningAreaEnabled = (area: WarningArea): boolean => {
  return warningConfigService.shouldShowWarning(area);
};

/**
 * Format a warning note for display
 */
export const formatWarningNote = (note: string): string => {
  // Capitalize first letter
  return note.charAt(0).toUpperCase() + note.slice(1);
};

/**
 * Get area display name
 */
export const getAreaDisplayName = (area: WarningArea): string => {
  const names: Record<WarningArea, string> = {
    crm: 'CRM',
    accounting: 'Accounting',
    pos: 'POS',
    workOrders: 'Werkorders',
    inventory: 'Voorraad',
    hrm: 'HRM',
    planning: 'Planning',
    reports: 'Rapporten',
    webshop: 'Webshop',
    bookkeeping: 'Boekhouding',
  };
  return names[area] || area;
};

