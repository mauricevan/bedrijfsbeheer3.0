// LocalStorage utility with type safety
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Storage keys
export const STORAGE_KEYS = {
  INVENTORY: 'bedrijfsbeheer_inventory',
  WORK_ORDERS: 'bedrijfsbeheer_work_orders',
  POS_TRANSACTIONS: 'bedrijfsbeheer_pos_transactions',
  AUTH_USER: 'auth_user',
  THEME: 'theme',
} as const;
