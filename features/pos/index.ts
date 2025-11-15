// features/pos/index.ts
export * from '../../types';
export const calculateTotal = (items: any[]) => items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
export const calculateVATTotal = (total: number, rate: number) => total * (rate / 100);
