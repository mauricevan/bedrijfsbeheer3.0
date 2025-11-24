import { storage } from './storage';

interface DocumentCounters {
  general: number;
  factuur: number;
  offerte: number;
  werkorder: number;
}

const DEFAULT_COUNTERS: DocumentCounters = {
  general: 0,
  factuur: 0,
  offerte: 0,
  werkorder: 0,
};

/**
 * Get the current year for counter key
 */
const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Get counter key for a specific year
 */
const getCounterKey = (year: number): string => {
  return `document_counters_${year}`;
};

/**
 * Initialize counters for a year (called on system init or year change)
 */
export const initializeCounters = (year: number = getCurrentYear()): void => {
  const key = getCounterKey(year);
  const existing = storage.get<DocumentCounters | null>(key, null);
  
  if (!existing) {
    storage.set(key, { ...DEFAULT_COUNTERS });
  }
};

/**
 * Get current counters for a year
 */
const getCounters = (year: number = getCurrentYear()): DocumentCounters => {
  const key = getCounterKey(year);
  initializeCounters(year);
  return storage.get<DocumentCounters>(key, { ...DEFAULT_COUNTERS });
};

/**
 * Increment and save counter
 */
const incrementCounter = (type: keyof DocumentCounters, year: number = getCurrentYear()): number => {
  const counters = getCounters(year);
  counters[type] += 1;
  counters.general += 1; // Always increment general counter
  
  const key = getCounterKey(year);
  storage.set(key, counters);
  
  return counters[type];
};

/**
 * Format number with leading zeros
 */
const formatNumber = (num: number, padding: number = 4): string => {
  return num.toString().padStart(padding, '0');
};

/**
 * Get next general number (shared across all document types)
 * Format: YYYY-NNNN
 */
export const getNextGeneralNumber = (): string => {
  const year = getCurrentYear();
  const counter = incrementCounter('general', year);
  return `${year}-${formatNumber(counter)}`;
};

/**
 * Get next Factuur (Invoice) number
 * Format: F-YYYY-NNNN
 */
export const getNextFactuurNumber = (): string => {
  const year = getCurrentYear();
  const counter = incrementCounter('factuur', year);
  return `F-${year}-${formatNumber(counter)}`;
};

/**
 * Get next Offerte (Quote) number
 * Format: O-YYYY-NNNN
 */
export const getNextOfferteNumber = (): string => {
  const year = getCurrentYear();
  const counter = incrementCounter('offerte', year);
  return `O-${year}-${formatNumber(counter)}`;
};

/**
 * Get next Werkorder (Work Order) number
 * Format: W-YYYY-NNNN
 */
export const getNextWerkorderNumber = (): string => {
  const year = getCurrentYear();
  const counter = incrementCounter('werkorder', year);
  return `W-${year}-${formatNumber(counter)}`;
};

/**
 * Initialize counters for current year on module load
 */
if (typeof window !== 'undefined') {
  initializeCounters();
}

