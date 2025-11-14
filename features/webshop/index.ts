// features/webshop/index.ts
export * from '../../../types';
export const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
export const generateSKU = (products: any[]) => `PRD-${String(products.length + 1).padStart(4, '0')}`;
