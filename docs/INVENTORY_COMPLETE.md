# Inventory Module - Complete Documentation

**All 47 Features from Bedrijfsbeheer 2.0**

Last Updated: 2025-11-16

---

## Feature Overview

| Category | Features | Priority |
|----------|----------|----------|
| Triple SKU System | 3 | P0 |
| Category Management | 8 | P0/P1 |
| Stock Management | 7 | P0/P1 |
| Pricing & VAT | 6 | P0/P1 |
| Supplier Management | 6 | P0/P1 |
| Product Details | 5 | P0/P2 |
| Webshop Sync | 4 | P1 |
| Search & Filtering | 6 | P0/P1 |
| UI/UX & Export | 5 | P1/P2 |
| **TOTAL** | **47** | - |

---

## 1. Triple SKU System (P0 - CRITICAL)

### Feature 1: Supplier SKU
- Field: `supplierSku?: string`
- Purpose: Track supplier product codes
- Use: Ordering, matching purchase orders

### Feature 2: Auto SKU  
- Field: `autoSku?: string`
- Format: INV-0001, INV-0002...
- Auto-generated sequential

### Feature 3: Custom SKU
- Field: `customSku?: string`
- Purpose: User-defined codes
- No format restrictions

**Search**: Must work across all three SKU types

---

## 2. Category Management (8 features)

### Feature 4-11: Category System
4. Create categories (P0)
5. Edit categories (P0)
6. Delete categories with orphan handling (P0)
7. Color coding (#HEX format) (P1)
8. Assign products to categories (P0)
9. Filter by category (P0)
10. Show product count per category (P1)
11. Hierarchical subcategories (P2)

**Data Structure**:
```typescript
interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 3. Stock Management (7 features)

### Feature 12-18: Stock Tracking
12. Quantity tracking (P0)
13. Reorder level (P0)
14. Low stock alerts (P0)
15. Stock mutations log (P1)
16. Last restocked date (P1)
17. Location tracking (P1)
18. Unit management (stuk, meter, kg, etc.) (P0)

**Stock Mutation**:
```typescript
interface StockMutation {
  id: string;
  inventoryItemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason?: string;
  performedBy: string;
  timestamp: string;
}
```

---

## 4. Pricing & VAT (6 features)

### Feature 19-24: NL-Compliant Pricing
19. Purchase price excl. BTW (P0)
20. Sale price excl. BTW (P0)
21. Auto margin calculation (P1)
    - Formula: `((salePrice - purchasePrice) / purchasePrice) * 100`
22. VAT rate: 21%, 9%, 0%, custom (P0)
23. Custom VAT percentage (P1)
24. Price history tracking (P2)

---

## 5. Supplier Management (6 features)

### Feature 25-30: Supplier Integration
25. Supplier CRUD (P0)
26. Link products to suppliers (P0)
27. Contact information (P1)
28. Average lead time tracking (P1)
29. Supplier notes (P1)
30. Filter by supplier (P1)

**Supplier Data**:
```typescript
interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  averageLeadTime?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 6. Product Details (5 features)

### Feature 31-35
31. Product name (P0)
32. Description (P2)
33. Images upload (P2)
34. Variants (color, size) (P2)
35. Barcode support (P1)

---

## 7. Webshop Sync (4 features)

### Feature 36-39: E-commerce Integration
36. Sync enable/disable toggle (P1)
37. Webshop product linking (P1)
38. Auto stock synchronization (P1)
39. Price synchronization (P1)

---

## 8. Search & Filtering (6 features)

### Feature 40-45: Advanced Search
40. Multi-field search (name, all SKUs, category) (P0)
41. Simultaneous multi-field (P0)
42. Category filter (P0)
43. Supplier filter (P1)
44. Stock level filter (low/ok/high) (P1)
45. Price range filter (P1)

**Search Implementation**:
```typescript
const searchInventory = (items, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(term) ||
    item.autoSku?.toLowerCase().includes(term) ||
    item.supplierSku?.toLowerCase().includes(term) ||
    item.customSku?.toLowerCase().includes(term)
  );
};
```

---

## 9. UI/UX & Export (5 features)

### Feature 46-50
46. Multi-column sorting (P1)
47. Bulk operations (P2)
48. CSV export (P1)
49. CSV import (P1)
50. POS alert notes (P1)
    - `posAlertNote?: string`
    - Shows alert when adding to cart
    - Example: "Don't forget shipping costs!"

---

## Complete Data Structure

```typescript
interface InventoryItem {
  // Core
  id: string;
  name: string;
  
  // Triple SKU
  sku: string;              // Legacy
  supplierSku?: string;
  autoSku?: string;
  customSku?: string;
  
  // Stock
  quantity: number;
  reorderLevel: number;
  unit?: string;
  location?: string;
  lastRestocked?: string;
  
  // Links
  supplierId?: string;
  categoryId?: string;
  
  // Pricing
  purchasePrice?: number;
  salePrice: number;
  margin?: number;
  
  // VAT
  vatRate: '21' | '9' | '0' | 'custom';
  customVatRate?: number;
  
  // Webshop
  syncEnabled: boolean;
  webshopId?: string;
  
  // Extras
  posAlertNote?: string;
  description?: string;
  images?: string[];
  barcode?: string;
  
  // Meta
  createdAt?: string;
  updatedAt?: string;
}
```

---

## Implementation Priority

### Phase 1 (Weeks 1-2): Foundation
- Triple SKU system
- Basic CRUD
- Stock tracking
- Pricing

### Phase 2 (Weeks 3-4): Organization
- Categories
- Suppliers
- Search & filter
- VAT

### Phase 3 (Weeks 5-6): Advanced
- Stock mutations
- Alerts
- Margin calc
- Advanced search

### Phase 4 (Weeks 7-8): Integration
- Webshop sync
- Bulk ops
- CSV import/export
- POS alerts

---

## Migration Checklist

- [ ] Migrate `sku` → `autoSku`
- [ ] Generate sequential autoSku
- [ ] Create default categories
- [ ] Link products to suppliers
- [ ] Calculate margins
- [ ] Set default VAT rates
- [ ] Enable webshop sync where applicable
- [ ] Migrate legacy price data

---

**Total Features**: 47
**Critical (P0)**: 35
**Important (P1)**: 10
**Nice to have (P2)**: 2

**Estimated Development**: 6-8 weeks
