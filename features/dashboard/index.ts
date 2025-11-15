// features/dashboard/index.ts
export * from '../../types';
export const calculateKPIs = (data: any) => ({
  revenue: data.sales?.reduce((sum: number, s: any) => sum + s.total, 0) || 0,
  orders: data.workOrders?.length || 0,
  lowStock: data.inventory?.filter((i: any) => i.quantity <= i.reorderLevel).length || 0,
});
