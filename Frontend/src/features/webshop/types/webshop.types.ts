export interface WebshopProduct {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  comparePrice?: number;
  cost: number;
  stock: number;
  categoryId?: string;
  categoryName?: string;
  images?: string[];
  status: 'active' | 'inactive' | 'draft';
  inventoryItemId?: string; // Link to inventory
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WebshopCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  image?: string;
  sortOrder: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface WebshopOrder {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: string;
  notes?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

// Form input types
export type CreateWebshopProductInput = Omit<WebshopProduct, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWebshopProductInput = Partial<Omit<WebshopProduct, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateWebshopCategoryInput = Omit<WebshopCategory, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWebshopCategoryInput = Partial<Omit<WebshopCategory, 'id' | 'createdAt' | 'updatedAt'>>;

