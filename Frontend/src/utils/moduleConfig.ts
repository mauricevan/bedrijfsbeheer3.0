/**
 * Module Configuration Utilities
 * Manage enabled/disabled modules dynamically
 */

export type ModuleKey = 
  | 'dashboard'
  | 'inventory'
  | 'pos'
  | 'work-orders'
  | 'accounting'
  | 'bookkeeping'
  | 'crm'
  | 'hrm'
  | 'planning'
  | 'reports'
  | 'webshop'
  | 'settings';

export interface ModuleConfig {
  key: ModuleKey;
  name: string;
  description: string;
  enabled: boolean;
  icon?: string;
}

const MODULES_CONFIG_KEY = 'bedrijfsbeheer_modules_config';

const DEFAULT_MODULES: ModuleConfig[] = [
  { key: 'dashboard', name: 'Dashboard', description: 'Overzicht en statistieken', enabled: true, icon: '📊' },
  { key: 'inventory', name: 'Voorraad', description: 'Voorraadbeheer en producten', enabled: true, icon: '📦' },
  { key: 'pos', name: 'Kassa (POS)', description: 'Point of Sale systeem', enabled: true, icon: '🛒' },
  { key: 'work-orders', name: 'Werkorders', description: 'Productie en werkorders', enabled: true, icon: '📋' },
  { key: 'accounting', name: 'Boekhouding', description: 'Facturen en offertes', enabled: true, icon: '💰' },
  { key: 'bookkeeping', name: 'Boekhouding & Dossier', description: 'Uitgebreide boekhouding', enabled: false, icon: '📚' },
  { key: 'crm', name: 'CRM', description: 'Klantrelatiebeheer', enabled: true, icon: '👥' },
  { key: 'hrm', name: 'HRM', description: 'Human Resource Management', enabled: true, icon: '👔' },
  { key: 'planning', name: 'Planning', description: 'Planning en agenda', enabled: true, icon: '📅' },
  { key: 'reports', name: 'Rapporten', description: 'Rapportages en analyses', enabled: true, icon: '📈' },
  { key: 'webshop', name: 'Webshop', description: 'Online webshop beheer', enabled: false, icon: '🛍️' },
  { key: 'settings', name: 'Instellingen', description: 'Systeeminstellingen', enabled: true, icon: '⚙️' },
];

/**
 * Get all module configurations
 */
export const getModulesConfig = (): ModuleConfig[] => {
  try {
    const stored = localStorage.getItem(MODULES_CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fallback to defaults
  }
  return DEFAULT_MODULES;
};

/**
 * Save module configurations
 */
export const saveModulesConfig = (modules: ModuleConfig[]): void => {
  try {
    localStorage.setItem(MODULES_CONFIG_KEY, JSON.stringify(modules));
  } catch (error) {
    console.error('Failed to save modules config:', error);
  }
};

/**
 * Toggle module enabled state
 */
export const toggleModule = (moduleKey: ModuleKey, enabled: boolean): void => {
  const modules = getModulesConfig();
  const updated = modules.map(m => 
    m.key === moduleKey ? { ...m, enabled } : m
  );
  saveModulesConfig(updated);
};

/**
 * Check if a module is enabled
 */
export const isModuleEnabled = (moduleKey: ModuleKey): boolean => {
  const modules = getModulesConfig();
  const module = modules.find(m => m.key === moduleKey);
  return module?.enabled ?? true; // Default to enabled if not found
};

/**
 * Get enabled modules only
 */
export const getEnabledModules = (): ModuleConfig[] => {
  return getModulesConfig().filter(m => m.enabled);
};

