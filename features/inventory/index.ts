// features/inventory/index.ts
export * from '../../../types';
export const calculateStockStatus = (qty: number, reorder: number) =>
  qty === 0 ? 'out' : qty <= reorder ? 'low' : 'ok';
export const getStockColor = (status: string) =>
  status === 'out' ? 'text-red-600' : status === 'low' ? 'text-yellow-600' : 'text-green-600';
