import { storage } from '@/utils/storage';

export type WarningArea = 
  | 'crm' 
  | 'accounting' 
  | 'pos' 
  | 'workOrders' 
  | 'inventory' 
  | 'hrm' 
  | 'planning' 
  | 'reports' 
  | 'webshop' 
  | 'bookkeeping';

export interface WarningConfig {
  [key: string]: boolean;
}

const WARNING_CONFIG_KEY = 'bedrijfsbeheer_warning_config';

// Default: all areas enabled
const DEFAULT_CONFIG: WarningConfig = {
  crm: true,
  accounting: true,
  pos: true,
  workOrders: true,
  inventory: true,
  hrm: true,
  planning: true,
  reports: true,
  webshop: true,
  bookkeeping: true,
};

export const warningConfigService = {
  /**
   * Get the current warning configuration
   */
  getWarningConfig: (): WarningConfig => {
    const stored = storage.get<WarningConfig>(WARNING_CONFIG_KEY, DEFAULT_CONFIG);
    // Merge with default to ensure all areas are present
    return { ...DEFAULT_CONFIG, ...stored };
  },

  /**
   * Update warning configuration for a specific area
   */
  updateWarningConfig: (area: WarningArea, enabled: boolean): void => {
    const config = warningConfigService.getWarningConfig();
    config[area] = enabled;
    storage.set(WARNING_CONFIG_KEY, config);
  },

  /**
   * Update multiple areas at once
   */
  updateWarningConfigMultiple: (updates: Partial<WarningConfig>): void => {
    const config = warningConfigService.getWarningConfig();
    Object.assign(config, updates);
    storage.set(WARNING_CONFIG_KEY, config);
  },

  /**
   * Check if warnings should be shown in a specific area
   */
  shouldShowWarning: (area: WarningArea): boolean => {
    const config = warningConfigService.getWarningConfig();
    return config[area] !== false; // Default to true if not explicitly set
  },

  /**
   * Reset to default configuration (all enabled)
   */
  resetToDefault: (): void => {
    storage.set(WARNING_CONFIG_KEY, DEFAULT_CONFIG);
  },
};

