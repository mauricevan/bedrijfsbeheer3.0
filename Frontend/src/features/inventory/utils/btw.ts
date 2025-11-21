/**
 * BTW (VAT) Calculation Utilities
 * NL-compliant VAT calculations for inventory
 */

import type { InventoryItem, VatRate } from '../types/inventory.types';

export interface BTWOverview {
  btw21: number;
  btw9: number;
  btwVrij: number;
  totaal: number;
}

/**
 * Calculate BTW amount for an item
 * @param salePrice - Sale price excluding VAT
 * @param vatRate - VAT rate (21, 9, or 0)
 * @returns VAT amount
 */
export const calculateBTW = (salePrice: number, vatRate: VatRate): number => {
  return salePrice * (vatRate / 100);
};

/**
 * Calculate price including BTW
 * @param salePrice - Sale price excluding VAT
 * @param vatRate - VAT rate (21, 9, or 0)
 * @returns Price including VAT
 */
export const calculatePriceInclBTW = (salePrice: number, vatRate: VatRate): number => {
  return salePrice + calculateBTW(salePrice, vatRate);
};

/**
 * Calculate BTW overview for current month
 * @param items - Array of inventory items
 * @returns BTW overview breakdown
 */
export const calculateBTWOverview = (items: InventoryItem[]): BTWOverview => {
  let btw21 = 0;
  let btw9 = 0;
  let btwVrij = 0;

  items.forEach(item => {
    const btwAmount = calculateBTW(item.salePrice, item.vatRate);
    
    if (item.vatRate === 21) {
      btw21 += btwAmount;
    } else if (item.vatRate === 9) {
      btw9 += btwAmount;
    } else {
      btwVrij += 0; // BTW Vrij means 0% VAT
    }
  });

  return {
    btw21,
    btw9,
    btwVrij,
    totaal: btw21 + btw9 + btwVrij,
  };
};

/**
 * Calculate margin percentage
 * @param purchasePrice - Purchase price
 * @param salePrice - Sale price
 * @returns Margin percentage
 */
export const calculateMargin = (purchasePrice: number, salePrice: number): number => {
  if (purchasePrice === 0) return 0;
  return ((salePrice - purchasePrice) / purchasePrice) * 100;
};

/**
 * Check if BTW overview is ready for tax filing
 * @param overview - BTW overview
 * @returns True if ready for filing
 */
export const isReadyForBTWFiling = (overview: BTWOverview): boolean => {
  // All amounts are calculated and non-negative
  return overview.btw21 >= 0 && overview.btw9 >= 0 && overview.btwVrij >= 0;
};

