import type { CartItem } from '../types';

export const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.pricePerUnit * item.quantity;
    const discountAmount = itemTotal * (item.discount / 100);
    return sum + (itemTotal - discountAmount);
  }, 0);

  const totalVAT = items.reduce((sum, item) => {
    const itemTotal = item.pricePerUnit * item.quantity;
    const discountAmount = itemTotal * (item.discount / 100);
    const itemSubtotal = itemTotal - discountAmount;
    return sum + (itemSubtotal * (item.vatRate / 100));
  }, 0);

  const total = subtotal + totalVAT;

  return { subtotal, totalVAT, total };
};

export const calculateVATBreakdown = (items: CartItem[]) => {
  const breakdown: Record<number, { subtotal: number; vat: number }> = {};

  items.forEach(item => {
    const itemTotal = item.pricePerUnit * item.quantity;
    const discountAmount = itemTotal * (item.discount / 100);
    const itemSubtotal = itemTotal - discountAmount;
    const itemVAT = itemSubtotal * (item.vatRate / 100);

    if (!breakdown[item.vatRate]) {
      breakdown[item.vatRate] = { subtotal: 0, vat: 0 };
    }

    breakdown[item.vatRate].subtotal += itemSubtotal;
    breakdown[item.vatRate].vat += itemVAT;
  });

  return breakdown;
};

export const generateTransactionNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN-${year}${month}${day}-${random}`;
};

export const generatePackingSlipNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const count = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PKB-${year}-${count}`;
};
