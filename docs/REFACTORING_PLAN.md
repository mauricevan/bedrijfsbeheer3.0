# Complete Refactoring Plan - Bedrijfsbeheer 3.0

**Doel:** Alle code voldoet aan file size limits uit prompt.git
**Datum:** Januari 2025
**Status:** 🔴 In Progress

---

## 📏 File Size Limits (prompt.git)

| Type | Max Lines |
|------|-----------|
| Component | 300 |
| Hook | 200 |
| Service | 250 |
| Utility | 150 |
| Page | 300 |

---

## 🎯 Huidige Situatie (VOOR refactoring)

### Pages (9 files - ALLE te groot)

| File | Regels | Limiet | Overschrijding | Prioriteit |
|------|--------|--------|----------------|------------|
| WorkOrders.tsx | 6,131 | 300 | **20x** | 🔴 P0 |
| CRM.tsx | 4,873 | 300 | **16x** | 🔴 P0 |
| Inventory.tsx | 2,899 | 300 | **10x** | 🔴 P0 |
| Webshop.tsx | 2,079 | 300 | **7x** | 🔴 P0 |
| Accounting.tsx | 2,021 | 300 | **7x** | 🟡 P1 (al deels gerefactord) |
| Bookkeeping.tsx | 1,939 | 300 | **6x** | 🔴 P0 |
| POS.tsx | 1,808 | 300 | **6x** | 🔴 P0 |
| HRM.tsx | 837 | 300 | **2.8x** | 🟡 P1 |
| Dashboard.tsx | 718 | 300 | **2.4x** | 🟡 P1 |

### Components (5 files te groot)

| File | Regels | Limiet | Overschrijding |
|------|--------|--------|----------------|
| InvoiceModals.tsx | 1,067 | 300 | 3.6x |
| AdminSettings.tsx | 1,063 | 300 | 3.5x |
| EmailDropZone.tsx | 831 | 300 | 2.8x |
| EmailWorkOrderEditModal.tsx | 805 | 300 | 2.7x |
| InvoiceList.tsx | 762 | 300 | 2.5x |

### Utilities (1 file te groot)

| File | Regels | Limiet | Overschrijding |
|------|--------|--------|----------------|
| analytics.ts | 765 | 150 | **5x** |

**Totaal te refactoren:** 15 files, ~30,000+ regels code

---

## 🏗️ Refactoring Strategie

### Architectuur Pattern (features/)

Voor elke module:
```
features/{module}/
├── components/         # UI componenten (< 300 regels each)
│   ├── {Module}Dashboard.tsx
│   ├── {Module}List.tsx
│   ├── {Module}Form.tsx
│   ├── {Module}Detail.tsx
│   └── index.ts       # Barrel file
├── hooks/             # Business logic (< 200 regels each)
│   ├── use{Module}.ts
│   ├── use{Module}Form.ts
│   └── index.ts
├── services/          # Pure functions (< 250 regels each)
│   ├── {module}Service.ts
│   └── index.ts
├── utils/             # Helpers (< 150 regels each)
│   ├── helpers.ts
│   ├── validators.ts
│   ├── formatters.ts
│   ├── filters.ts
│   └── index.ts
├── types/             # Type definitions
│   └── index.ts
└── index.ts           # Main barrel file
```

### Pages blijven klein (orchestratie only)

```typescript
// pages/{Module}.tsx (< 300 regels)
import { {Module}Dashboard } from '@/features/{module}';

export const {Module} = () => {
  return <{Module}Dashboard />;
};
```

---

## 📋 Gedetailleerd Refactoring Plan

### 1. WorkOrders Module (6,131 → 300 regels)

**Structuur:**
```
features/workorders/
├── components/
│   ├── WorkOrdersBoard.tsx         (280 regels) - Kanban board container
│   ├── WorkOrderColumn.tsx         (200 regels) - Single column
│   ├── WorkOrderCard.tsx           (250 regels) - Card component
│   ├── WorkOrderForm.tsx           (280 regels) - Create/edit form
│   ├── MaterialSelector.tsx        (220 regels) - Material selection
│   ├── HistoryViewer.tsx           (240 regels) - History timeline
│   ├── StatusBadge.tsx             (80 regels)  - Status indicator
│   ├── AssigneeSelector.tsx        (150 regels) - Employee selector
│   └── index.ts
├── hooks/
│   ├── useWorkOrders.ts            (180 regels) - Main CRUD logic
│   ├── useWorkOrderForm.ts         (160 regels) - Form state
│   ├── useWorkOrderHistory.ts      (120 regels) - History tracking
│   ├── useMaterials.ts             (140 regels) - Material management
│   └── index.ts
├── services/
│   ├── workOrderService.ts         (220 regels) - CRUD operations
│   ├── historyService.ts           (150 regels) - History logic
│   └── index.ts
├── utils/
│   ├── helpers.ts                  (120 regels) - General helpers
│   ├── validators.ts               (100 regels) - Form validation
│   ├── filters.ts                  (90 regels)  - Filter logic
│   └── index.ts
└── index.ts

pages/WorkOrders.tsx                (50 regels)  - Orchestration only
```

**Geschat:** 14 nieuwe files, 6,131 → ~2,800 regels (gesplitst)

---

### 2. CRM Module (4,873 → 300 regels)

**Structuur:**
```
features/crm/
├── components/
│   ├── CRMDashboard.tsx            (290 regels) - Main dashboard
│   ├── Pipeline/
│   │   ├── PipelineBoard.tsx       (270 regels) - 7-fase Kanban
│   │   ├── LeadCard.tsx            (200 regels) - Lead card
│   │   └── StageColumn.tsx         (180 regels) - Pipeline stage
│   ├── Customers/
│   │   ├── CustomerList.tsx        (250 regels) - Customer table
│   │   ├── CustomerDetail.tsx      (240 regels) - Detail view
│   │   └── CustomerForm.tsx        (220 regels) - Create/edit
│   ├── Interactions/
│   │   ├── InteractionTimeline.tsx (230 regels) - Timeline view
│   │   ├── InteractionForm.tsx     (190 regels) - Add interaction
│   │   └── InteractionCard.tsx     (150 regels) - Single interaction
│   ├── Tasks/
│   │   ├── TaskList.tsx            (200 regels) - Task table
│   │   └── TaskForm.tsx            (170 regels) - Create/edit task
│   ├── Email/
│   │   ├── EmailDropZone.tsx       (280 regels) - Email drop
│   │   ├── EmailPreview.tsx        (220 regels) - Email viewer
│   │   └── EmailActions.tsx        (180 regels) - Action buttons
│   └── index.ts
├── hooks/
│   ├── useLeads.ts                 (190 regels) - Lead management
│   ├── useCustomers.ts             (180 regels) - Customer CRUD
│   ├── useInteractions.ts          (160 regels) - Interaction logic
│   ├── useTasks.ts                 (150 regels) - Task management
│   ├── usePipeline.ts              (140 regels) - Pipeline state
│   └── index.ts
├── services/
│   ├── leadService.ts              (200 regels) - Lead operations
│   ├── customerService.ts          (180 regels) - Customer ops
│   ├── interactionService.ts       (150 regels) - Interaction ops
│   └── index.ts
├── utils/
│   ├── helpers.ts                  (140 regels) - CRM helpers
│   ├── validators.ts               (120 regels) - Validation
│   ├── filters.ts                  (100 regels) - Filter logic
│   └── index.ts
└── index.ts

pages/CRM.tsx                       (60 regels)  - Orchestration
```

**Geschat:** 25 nieuwe files, 4,873 → ~4,500 regels (gesplitst)

---

### 3. Inventory Module (2,899 → 300 regels)

**Structuur:**
```
features/inventory/
├── components/
│   ├── InventoryDashboard.tsx      (280 regels) - Main view
│   ├── InventoryTable.tsx          (250 regels) - Items table
│   ├── InventoryForm.tsx           (240 regels) - Create/edit form
│   ├── CategoryManager.tsx         (220 regels) - Category CRUD
│   ├── SKUFields.tsx               (180 regels) - 3 SKU types
│   ├── StockStatus.tsx             (120 regels) - Status indicators
│   ├── QuickAdjust.tsx             (150 regels) - +10/-10 buttons
│   └── index.ts
├── hooks/
│   ├── useInventory.ts             (180 regels) - Main CRUD
│   ├── useCategories.ts            (150 regels) - Category logic
│   ├── useInventoryForm.ts         (140 regels) - Form state
│   ├── useStockAlerts.ts           (110 regels) - Low stock alerts
│   └── index.ts
├── services/
│   ├── inventoryService.ts         (200 regels) - CRUD operations
│   ├── categoryService.ts          (140 regels) - Category ops
│   └── index.ts
├── utils/
│   ├── helpers.ts                  (130 regels) - Inventory helpers
│   ├── validators.ts               (110 regels) - SKU validation
│   ├── formatters.ts               (90 regels)  - Price/SKU format
│   ├── filters.ts                  (100 regels) - Search/filter
│   └── index.ts
└── index.ts

pages/Inventory.tsx                 (50 regels)  - Orchestration
```

**Geschat:** 16 nieuwe files, 2,899 → ~2,600 regels (gesplitst)

---

### 4. Webshop Module (2,079 → 300 regels)

**Structuur:**
```
features/webshop/
├── components/
│   ├── WebshopDashboard.tsx        (280 regels) - Main dashboard
│   ├── Products/
│   │   ├── ProductList.tsx         (250 regels) - Product grid/list
│   │   ├── ProductForm.tsx         (290 regels) - 7-section form
│   │   ├── ProductCard.tsx         (180 regels) - Product card
│   │   └── ProductSearch.tsx       (150 regels) - Search/filter
│   ├── Categories/
│   │   ├── CategoryTree.tsx        (200 regels) - Hierarchical tree
│   │   ├── CategoryForm.tsx        (170 regels) - Create/edit
│   │   └── CategorySelector.tsx    (140 regels) - Multi-select
│   ├── Orders/
│   │   ├── OrderList.tsx           (240 regels) - Order table
│   │   ├── OrderDetail.tsx         (260 regels) - Detail modal
│   │   └── OrderStatus.tsx         (130 regels) - Status workflow
│   └── index.ts
├── hooks/
│   ├── useProducts.ts              (180 regels) - Product CRUD
│   ├── useCategories.ts            (150 regels) - Category logic
│   ├── useOrders.ts                (170 regels) - Order management
│   ├── useProductForm.ts           (160 regels) - Form state
│   └── index.ts
├── services/
│   ├── productService.ts           (220 regels) - Product operations
│   ├── orderService.ts             (180 regels) - Order operations
│   └── index.ts
├── utils/
│   ├── helpers.ts                  (130 regels) - Webshop helpers
│   ├── validators.ts               (120 regels) - Product validation
│   ├── slugGenerator.ts            (80 regels)  - URL slug gen
│   └── index.ts
└── index.ts

pages/Webshop.tsx                   (60 regels)  - Orchestration
```

**Geschat:** 18 nieuwe files, 2,079 → ~3,100 regels (gesplitst)

---

### 5. Bookkeeping Module (1,939 → 300 regels)

**Structuur:**
```
features/bookkeeping/
├── components/
│   ├── BookkeepingDashboard.tsx    (280 regels) - Main view
│   ├── LedgerAccounts.tsx          (250 regels) - Grootboek table
│   ├── JournalEntries.tsx          (240 regels) - Journaal view
│   ├── VATReport.tsx               (220 regels) - BTW overzicht
│   ├── InvoiceArchive.tsx          (230 regels) - Factuur archief
│   ├── CustomerDossier.tsx         (240 regels) - Klant dossier
│   └── index.ts
├── hooks/
│   ├── useLedger.ts                (170 regels) - Ledger logic
│   ├── useJournal.ts               (160 regels) - Journal entries
│   ├── useVAT.ts                   (150 regels) - BTW calculations
│   ├── useDossiers.ts              (140 regels) - Dossier management
│   └── index.ts
├── services/
│   ├── ledgerService.ts            (200 regels) - Ledger operations
│   ├── vatService.ts               (180 regels) - VAT calculations
│   └── index.ts
├── utils/
│   ├── helpers.ts                  (140 regels) - Accounting helpers
│   ├── vatCalculations.ts          (120 regels) - BTW logic
│   ├── exporters.ts                (130 regels) - CSV/XML export
│   └── index.ts
└── index.ts

pages/Bookkeeping.tsx               (50 regels)  - Orchestration
```

**Geschat:** 15 nieuwe files, 1,939 → ~2,700 regels (gesplitst)

---

### 6. POS Module (1,808 → 300 regels)

**Structuur:**
```
features/pos/
├── components/
│   ├── POSDashboard.tsx            (280 regels) - Main POS view
│   ├── ProductSelector.tsx         (240 regels) - Product selection
│   ├── ShoppingCart.tsx            (250 regels) - Cart display
│   ├── CustomerSelector.tsx        (180 regels) - Customer select
│   ├── PaymentMethods.tsx          (200 regels) - Payment options
│   ├── Receipt.tsx                 (220 regels) - Receipt display
│   └── index.ts
├── hooks/
│   ├── useCart.ts                  (180 regels) - Cart management
│   ├── usePOS.ts                   (170 regels) - Main POS logic
│   ├── usePayment.ts               (140 regels) - Payment handling
│   └── index.ts
├── services/
│   ├── posService.ts               (200 regels) - POS operations
│   ├── receiptService.ts           (150 regels) - Receipt generation
│   └── index.ts
├── utils/
│   ├── helpers.ts                  (120 regels) - POS helpers
│   ├── calculations.ts             (100 regels) - Price calculations
│   ├── validators.ts               (90 regels)  - Validation
│   └── index.ts
└── index.ts

pages/POS.tsx                       (50 regels)  - Orchestration
```

**Geschat:** 13 nieuwe files, 1,808 → ~2,500 regels (gesplitst)

---

### 7. HRM Module (837 → 300 regels)

**Structuur:**
```
features/hrm/
├── components/
│   ├── HRMDashboard.tsx            (280 regels) - Main view
│   ├── EmployeeList.tsx            (240 regels) - Employee table
│   ├── EmployeeForm.tsx            (220 regels) - Create/edit
│   ├── EmployeeDossier.tsx         (250 regels) - Dossier view
│   ├── NoteManager.tsx             (200 regels) - 8 note types
│   └── index.ts
├── hooks/
│   ├── useEmployees.ts             (170 regels) - Employee CRUD
│   ├── useNotes.ts                 (140 regels) - Notes logic
│   └── index.ts
├── services/
│   ├── employeeService.ts          (180 regels) - Employee ops
│   └── index.ts
├── utils/
│   ├── helpers.ts                  (110 regels) - HRM helpers
│   ├── validators.ts               (90 regels)  - Validation
│   └── index.ts
└── index.ts

pages/HRM.tsx                       (50 regels)  - Orchestration
```

**Geschat:** 10 nieuwe files, 837 → ~1,930 regels (gesplitst)

---

### 8. Dashboard Module (718 → 300 regels)

**Structuur:**
```
features/dashboard/
├── components/
│   ├── DashboardView.tsx           (280 regels) - Main layout
│   ├── KPICards.tsx                (220 regels) - KPI widgets
│   ├── EmailDropZone.tsx           (250 regels) - Email drop (moved)
│   ├── NotificationsPanel.tsx      (200 regels) - Notifications
│   ├── RecentActivity.tsx          (180 regels) - Activity feed
│   └── index.ts
├── hooks/
│   ├── useDashboard.ts             (150 regels) - Dashboard logic
│   ├── useKPIs.ts                  (130 regels) - KPI calculations
│   └── index.ts
├── services/
│   ├── dashboardService.ts         (160 regels) - Dashboard data
│   └── index.ts
├── utils/
│   ├── helpers.ts                  (100 regels) - Dashboard helpers
│   └── index.ts
└── index.ts

pages/Dashboard.tsx                 (50 regels)  - Orchestration
```

**Geschat:** 9 nieuwe files, 718 → ~1,700 regels (gesplitst)

---

### 9. Grote Components Refactoren

**InvoiceModals.tsx (1,067 → 300)**
```
features/accounting/components/invoices/
├── InvoiceCreateModal.tsx          (280 regels)
├── InvoiceEditModal.tsx            (270 regels)
├── InvoiceViewModal.tsx            (240 regels)
└── InvoiceConvertModal.tsx         (200 regels)
```

**AdminSettings.tsx (1,063 → 300)**
```
features/admin/
├── components/
│   ├── ModuleToggle.tsx            (280 regels)
│   ├── AnalyticsDashboard.tsx      (290 regels)
│   ├── DiagnosticsPanel.tsx        (270 regels)
│   └── index.ts
└── index.ts
```

**EmailDropZone.tsx (831 → 280)**
- Verplaatsen naar features/dashboard/components/

**EmailWorkOrderEditModal.tsx (805 → 300)**
```
features/workorders/components/modals/
├── WorkOrderEmailModal.tsx         (280 regels)
└── EmailParser.tsx                 (220 regels)
```

**InvoiceList.tsx (762 → 300)**
```
features/accounting/components/invoices/
├── InvoiceTable.tsx                (280 regels)
├── InvoiceFilters.tsx              (200 regels)
└── InvoiceActions.tsx              (180 regels)
```

---

### 10. Utilities Refactoren

**analytics.ts (765 → 150)**
```
utils/analytics/
├── tracking.ts                     (150 regels) - Event tracking
├── metrics.ts                      (140 regels) - Metric calculations
├── reporting.ts                    (130 regels) - Report generation
├── storage.ts                      (120 regels) - Data persistence
└── index.ts
```

---

## 📊 Refactoring Statistieken

**Voor Refactoring:**
- Total files met violations: 15
- Total regels te veel: ~22,000
- Grootste file: 6,131 regels (WorkOrders.tsx)

**Na Refactoring (geschat):**
- Nieuwe files gecreëerd: ~150+
- Gemiddelde file size: ~180 regels
- Grootste file: ~290 regels
- **Alle files < limiet:** ✅

---

## ✅ Refactoring Checklist

### Per Module:
- [ ] Maak features/{module}/ structuur
- [ ] Split in components/ (< 300 regels each)
- [ ] Extract hooks/ (< 200 regels each)
- [ ] Extract services/ (< 250 regels each)
- [ ] Extract utils/ (< 150 regels each)
- [ ] Maak barrel files (index.ts)
- [ ] Update pages/{Module}.tsx (orchestration only)
- [ ] Update imports in App.tsx
- [ ] Test functionaliteit
- [ ] Verify file sizes

### Modules:
- [ ] 1. WorkOrders (P0 - 6,131 regels)
- [ ] 2. CRM (P0 - 4,873 regels)
- [ ] 3. Inventory (P0 - 2,899 regels)
- [ ] 4. Webshop (P0 - 2,079 regels)
- [ ] 5. Bookkeeping (P0 - 1,939 regels)
- [ ] 6. POS (P0 - 1,808 regels)
- [ ] 7. HRM (P1 - 837 regels)
- [ ] 8. Dashboard (P1 - 718 regels)
- [ ] 9. Accounting (P1 - al deels klaar)

### Components:
- [ ] InvoiceModals.tsx
- [ ] AdminSettings.tsx
- [ ] EmailDropZone.tsx
- [ ] EmailWorkOrderEditModal.tsx
- [ ] InvoiceList.tsx

### Utilities:
- [ ] analytics.ts

### Finaal:
- [ ] Run size audit opnieuw
- [ ] Verify alle files < limiet
- [ ] Test complete applicatie
- [ ] Update documentatie
- [ ] Git commit met details
- [ ] Git push

---

## 🚀 Execution Order

**Phase 1: Core Modules (P0)**
1. WorkOrders (grootste)
2. CRM (tweede grootste)
3. Inventory
4. Webshop
5. Bookkeeping
6. POS

**Phase 2: Supporting Modules (P1)**
7. HRM
8. Dashboard

**Phase 3: Components & Utilities**
9. Grote components
10. analytics.ts

**Phase 4: Testing & Documentation**
11. Integration testing
12. Documentation updates
13. Commit & push

**Geschatte tijd:** 4-6 uur (volledig systematisch)

---

## 📝 Notes

- Gebruik Accounting module als referentie (al gerefactord)
- Behoud alle functionaliteit (geen features verwijderen)
- Test na elke module refactoring
- Commit per module (niet alles tegelijk)
- Gebruik barrel files voor clean imports

---

**Status:** 🔴 Ready to Execute
**Laatste Update:** Januari 2025
