# AI Assistant Development Guide

**Voor:** AI assistenten die werken aan het Bedrijfsbeheer Dashboard project
**Versie:** 1.0.0
**Laatst bijgewerkt:** December 2024

---

## ⚠️ LEES DIT EERST

**Als je Claude Code bent:** Check eerst [`.claude/README.md`](../.claude/README.md) voor quick reference!

Dit document bevat volledige details (910 regels). Gebruik als **reference**, niet als eerste lezing.

**Voor quick start:**
1. 📖 Lees [`.claude/README.md`](../.claude/README.md) (3 minuten)
2. 📖 Lees [CONVENTIONS.md](../CONVENTIONS.md) voor code style (5 minuten)
3. 📖 Kom terug naar dit document voor details (bij twijfel)

---

## 📋 Inhoudsopgave

1. [Project Overzicht](#project-overzicht)
2. [Coding Standards](#coding-standards)
3. [Visual Design Standards](#visual-design-standards)
4. [Architectuur Principes](#architectuur-principes)
5. [Permission System](#permission-system)
6. [State Management Patterns](#state-management-patterns)
7. [Module Interacties](#module-interacties)
8. [Data Flow & Synchronisatie](#data-flow--synchronisatie)
9. [Common Pitfalls](#common-pitfalls)
10. [Testing Requirements](#testing-requirements)
11. [Code Review Checklist](#code-review-checklist)

---

## 🎯 Project Overzicht

### Wat is dit systeem?

Een volledig geïntegreerd **bedrijfsbeheer dashboard** gebouwd met React 19 + TypeScript voor:
- MKB bedrijven in productie/assemblage sector
- Admin (manager) + Users (medewerkers)
- 12+ modules voor volledige bedrijfsvoering

### Kernwaarden
- ✅ **Type Safety** - Gebruik altijd TypeScript types
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Role-Based Access** - Admin vs User permissions
- ✅ **Data Integrity** - Bidirectional synchronization
- ✅ **User Experience** - Clear feedback, no confusion
- ✅ **Dutch Language** - Alle UI en documentatie in Nederlands

---

## 💻 Coding Standards

### TypeScript

**Gebruik ALTIJD types:**
```typescript
// ✅ GOED
interface WorkOrder {
  id: string;
  title: string;
  assignedTo: string;
  status: 'todo' | 'pending' | 'in_progress' | 'completed';
  hours: number;
}

const createWorkOrder = (data: WorkOrder): WorkOrder => {
  // ...
}

// ❌ FOUT
const createWorkOrder = (data: any) => {
  // ...
}
```

**Type voorbeelden uit het project:**
```typescript
// /src/types.ts bevat alle interfaces
import { WorkOrder, Invoice, Customer, InventoryItem } from './types';
```

### Naming Conventions

**Components:**
```typescript
// PascalCase voor componenten
WorkOrderBoard.tsx
DashboardKPICard.tsx
InventoryManagement.tsx
```

**Functies:**
```typescript
// camelCase voor functies
const handleCreateWorkOrder = () => {};
const fetchInventoryItems = () => {};
const calculateTotalRevenue = () => {};
```

**Constants:**
```typescript
// UPPERCASE voor constants
const MAX_INVENTORY_ITEMS = 1000;
const DEFAULT_WORK_STATUS = 'todo';
```

**Variables:**
```typescript
// camelCase voor variabelen
const workOrders = [];
const currentUser = null;
const isLoading = false;
```

### File Organization

```
/components
  /icons          - SVG icon components
  Component.tsx   - Reusable components

/pages
  PageName.tsx    - Full page components

/utils
  helper.ts       - Utility functions

/data
  initialData.ts  - Default/demo data
```

### Imports

**Volgorde:**
```typescript
// 1. External libraries
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal types
import type { WorkOrder, User } from './types';

// 3. Internal components
import { Button } from './components/Button';
import { Modal } from './components/Modal';

// 4. Internal utilities
import { formatDate } from './utils/dateUtils';

// 5. Icons
import { PlusIcon } from './components/icons';
```

---

## 🎨 Visual Design Standards

### Design Filosofie

**Belangrijk:** Dit project volgt een "Professional but Human" design aanpak:
- Moderne, cleane interface zonder overdreven effecten
- Subtiele visuele verbeteringen die niet afleiden
- Consistent gebruik van kleuren, spacing en typography
- Delightful micro-interactions die feedback geven

**📚 Volledige Design Docs:**
- [Visual Design Guide](./04-features/visual-design-guide.md) - Design filosofie & principes
- [Brand Identity](./04-features/brand-identity.md) - Kleuren, typography, iconografie
- [Component Visual Patterns](./04-features/component-visual-patterns.md) - Component styling
- [Design Quick Wins](./04-features/design-quick-wins.md) - 5 snelle verbeteringen
- [Design Implementation Checklist](./04-features/design-implementation-checklist.md) - QA checklist

### Kleurgebruik

**Gebruik de gedefinieerde color palette:**
```typescript
// ✅ GOED - Gebruik Tailwind custom colors
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Opslaan
</button>

<div className="bg-gradient-to-br from-white to-primary-50/30">
  {/* Subtle gradient background */}
</div>

// Status kleuren
<span className="text-success-600">Voltooid</span>
<span className="text-warning-600">In behandeling</span>
<span className="text-error-600">Fout</span>

// ❌ FOUT - Hardcoded hex colors
<button style={{ backgroundColor: '#3b82f6' }}>
  Opslaan
</button>
```

**Color Palette:**
- **Primary (Blue):** `primary-50` tot `primary-900` - Primaire acties, links
- **Success (Green):** `success-50` tot `success-900` - Positieve status, bevestigingen
- **Warning (Orange):** `warning-50` tot `warning-900` - Waarschuwingen, pending states
- **Error (Red):** `error-50` tot `error-900` - Errors, destructieve acties
- **Accent Colors:** `teal-*`, `purple-*` voor badges en highlights

### Typography

**Font Hierarchy:**
```typescript
// Headings
<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
<h2 className="text-2xl font-semibold text-gray-800">Werkorders</h2>
<h3 className="text-xl font-medium text-gray-700">Materialen</h3>

// Body text
<p className="text-base text-gray-600">Normale tekst</p>
<p className="text-sm text-gray-500">Kleine tekst, helpers</p>

// Labels
<label className="text-sm font-medium text-gray-700">Naam:</label>
```

**BELANGRIJK**: Minimaal `text-base` (16px) voor mobiel (iOS accessibility).

### Component Styling Patterns

**Buttons:**
```typescript
// Primary action
<button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg
  shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200">
  Opslaan
</button>

// Secondary action
<button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg
  border border-gray-300 shadow-sm hover:shadow transition-all duration-200">
  Annuleren
</button>

// Destructive action
<button className="px-4 py-2 bg-error-500 hover:bg-error-600 text-white rounded-lg
  shadow-sm hover:shadow-md transition-all duration-200">
  Verwijderen
</button>
```

**Cards:**
```typescript
// Basic card
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  {/* Content */}
</div>

// Enhanced card met gradient
<div className="bg-gradient-to-br from-white to-primary-50/30 rounded-xl
  shadow-md border border-primary-100 p-6 hover:shadow-lg transition-shadow duration-300">
  {/* Content */}
</div>

// Glassmorphism effect (voor speciale cards)
<div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6">
  {/* Content */}
</div>
```

**Forms:**
```typescript
// Input field
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    transition-all duration-200"
  placeholder="Naam..."
/>

// Input met error state
<input
  type="text"
  className="w-full px-4 py-2 border-2 border-error-500 rounded-lg
    focus:ring-2 focus:ring-error-500 bg-error-50"
  aria-invalid="true"
/>
```

### Micro-Animations

**Gebruik subtiele animations voor feedback:**
```typescript
// Hover scale
<button className="transform hover:scale-105 transition-transform duration-200">
  Click me
</button>

// Fade in
<div className="animate-fadeIn">
  {/* Content appears smoothly */}
</div>

// Slide in from right
<div className="animate-slideInRight">
  {/* Sidebar appears */}
</div>

// Loading pulse
<div className="animate-pulse bg-gray-200 rounded h-4 w-24">
  {/* Loading skeleton */}
</div>
```

**Tailwind config animaties:**
```typescript
// Zorg dat deze animations in tailwind.config.js staan
animation: {
  fadeIn: 'fadeIn 0.3s ease-in',
  slideInRight: 'slideInRight 0.3s ease-out',
  scaleIn: 'scaleIn 0.2s ease-out'
}
```

### Spacing & Layout

**Consistent spacing:**
```typescript
// Section spacing
<div className="space-y-6">  {/* 24px vertical spacing */}
  <Section1 />
  <Section2 />
</div>

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(...)}
</div>

// Card padding
<div className="p-6">        {/* 24px padding */}
<div className="p-4">        {/* 16px padding - compact */}
<div className="p-8">        {/* 32px padding - spacious */}
```

### Icons & Badges

**Icon sizes:**
```typescript
<PlusIcon className="w-5 h-5" />      {/* 20px - default */}
<PlusIcon className="w-6 h-6" />      {/* 24px - buttons */}
<PlusIcon className="w-4 h-4" />      {/* 16px - inline text */}
```

**Status badges:**
```typescript
// Status badge component pattern
const statusColors = {
  completed: 'bg-success-100 text-success-700 border-success-200',
  in_progress: 'bg-primary-100 text-primary-700 border-primary-200',
  pending: 'bg-warning-100 text-warning-700 border-warning-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200'
};

<span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status]}`}>
  {statusLabel}
</span>
```

### Accessibility Requirements

**ALTIJD implementeren:**
```typescript
// ARIA labels voor screen readers
<button aria-label="Verwijder werkorder">
  <TrashIcon className="w-5 h-5" />
</button>

// Focus states (altijd zichtbaar)
<button className="focus:ring-2 focus:ring-primary-500 focus:outline-none">
  Click me
</button>

// Touch targets (minimum 44x44px voor mobiel)
<button className="min-h-[44px] min-w-[44px] p-2">
  <Icon />
</button>

// Reduced motion voor accessibility
<div className="transition-transform motion-reduce:transition-none">
  {/* Respect prefers-reduced-motion */}
</div>
```

### Empty States

**Maak empty states delightful:**
```typescript
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
    <InboxIcon className="w-8 h-8 text-primary-600" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Nog geen werkorders
  </h3>
  <p className="text-sm text-gray-500 mb-6 max-w-sm">
    Maak je eerste werkorder aan om aan de slag te gaan
  </p>
  {currentUser?.isAdmin && (
    <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
      Werkorder Toevoegen
    </button>
  )}
</div>
```

### Loading States

**Skeleton screens:**
```typescript
// Loading card skeleton
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>

// Spinner
<div className="flex items-center justify-center py-8">
  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
</div>
```

### Mobile Design

**Mobile-first responsive patterns:**
```typescript
// Stack op mobiel, grid op desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Verberg labels op mobiel, toon op desktop
<span className="hidden md:inline">Label tekst</span>

// Full width buttons op mobiel
<button className="w-full md:w-auto px-4 py-2 bg-primary-500 text-white rounded-lg">
  Opslaan
</button>

// Compact padding op mobiel
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>
```

### Design Checklist

**Bij elke nieuwe component/feature:**
- [ ] Gebruikt custom color palette (primary, success, warning, error)
- [ ] Consistent spacing (p-4, p-6, p-8, gap-4, gap-6)
- [ ] Hover states op interactive elementen
- [ ] Focus states voor keyboard navigation
- [ ] Loading states voor async operaties
- [ ] Empty states met duidelijke call-to-action
- [ ] Error states met gebruiksvriendelijke messages
- [ ] Responsive design (mobile-first)
- [ ] Touch targets minimum 44x44px
- [ ] ARIA labels waar nodig
- [ ] Reduced motion support
- [ ] Consistent met bestaande components

**→ Zie [Design Implementation Checklist](./04-features/design-implementation-checklist.md) voor volledige checklist**

---

## 🏗 Architectuur Principes

### 1. Centralized State

**BELANGRIJK**: Alle state bevindt zich in `App.tsx`:

```typescript
function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  // ... etc
}
```

**Waarom?**
- Single source of truth
- Easy debugging
- Consistent data flow
- No prop drilling confusion

### 2. Props Drilling Pattern

**State gaat van boven naar beneden:**
```typescript
// App.tsx
<WorkOrderBoard
  workOrders={workOrders}
  setWorkOrders={setWorkOrders}
  users={users}
  currentUser={currentUser}
/>
```

**Component gebruikt state:**
```typescript
interface WorkOrderBoardProps {
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  users: User[];
  currentUser: User | null;
}

const WorkOrderBoard: React.FC<WorkOrderBoardProps> = ({
  workOrders,
  setWorkOrders,
  users,
  currentUser
}) => {
  // Gebruik workOrders, muteer via setWorkOrders
};
```

### 3. Immutable Updates

**ALTIJD gebruik spread operators:**
```typescript
// ✅ GOED - Immutable update
setWorkOrders(prev => prev.map(wo =>
  wo.id === id
    ? { ...wo, status: 'completed', completedAt: new Date().toISOString() }
    : wo
));

// ❌ FOUT - Mutatie
setWorkOrders(prev => {
  const wo = prev.find(w => w.id === id);
  wo.status = 'completed'; // Direct mutation!
  return prev;
});
```

### 4. Derived State met useMemo

**Voor berekende data:**
```typescript
const completedOrders = useMemo(() =>
  workOrders.filter(wo => wo.status === 'completed'),
  [workOrders]
);

const totalRevenue = useMemo(() =>
  invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0),
  [invoices]
);
```

---

## 🔐 Permission System

### Admin vs User Rights

**KRITIEK**: Controleer ALTIJD permissions:

```typescript
// ✅ GOED - Permission check
{currentUser?.isAdmin && (
  <button onClick={handleDeleteWorkOrder}>
    Verwijder Werkorder
  </button>
)}

// ✅ GOED - Show disabled for non-admin
<button
  disabled={!currentUser?.isAdmin}
  onClick={handleEditInventory}
  title={!currentUser?.isAdmin ? 'Alleen admins kunnen bewerken' : ''}
>
  Bewerk Item
</button>

// ❌ FOUT - No permission check
<button onClick={handleDeleteWorkOrder}>
  Verwijder Werkorder
</button>
```

### Permission Matrix

**Gebruik deze regels:**

| Actie | Admin | User | Check |
|-------|-------|------|-------|
| Create (new items/customers/workorders) | ✅ | ❌ | `currentUser?.isAdmin` |
| Edit (all data) | ✅ | ❌ | `currentUser?.isAdmin` |
| Delete | ✅ | ❌ | `currentUser?.isAdmin` |
| View all workorders | ✅ | ❌ | `currentUser?.isAdmin` |
| Assign workorders | ✅ | ❌ | `currentUser?.isAdmin` |
| View own workorders | ✅ | ✅ | `true` (filtered) |
| Update own workorder status | ✅ | ✅ | `wo.assignedTo === currentUser?.id` |
| Register hours | ✅ | ✅ | `wo.assignedTo === currentUser?.id` |

### Filtering Data by User

```typescript
// Voor Users: filter op assignedTo
const userWorkOrders = useMemo(() => {
  if (currentUser?.isAdmin) {
    return workOrders; // Admin ziet alles
  }
  return workOrders.filter(wo => wo.assignedTo === currentUser?.id);
}, [workOrders, currentUser]);

// Voor Admins: optioneel filter
const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

const filteredOrders = useMemo(() => {
  if (selectedEmployee === 'all') return workOrders;
  return workOrders.filter(wo => wo.assignedTo === selectedEmployee);
}, [workOrders, selectedEmployee]);
```

---

## 🔄 State Management Patterns

### 1. Adding New Item

```typescript
const handleAddInventory = (newItem: InventoryItem) => {
  // Genereer ID
  const id = `INV-${String(inventory.length + 1).padStart(4, '0')}`;

  // Voeg toe met spread
  setInventory(prev => [...prev, { ...newItem, id }]);

  // Optioneel: notificatie
  setNotifications(prev => [...prev, {
    id: `notif-${Date.now()}`,
    type: 'success',
    message: `Item ${newItem.name} toegevoegd`,
    timestamp: new Date().toISOString()
  }]);
};
```

### 2. Updating Item

```typescript
const handleUpdateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
  setWorkOrders(prev => prev.map(wo =>
    wo.id === id
      ? {
          ...wo,
          ...updates,
          // Voeg timestamps toe
          updatedAt: new Date().toISOString()
        }
      : wo
  ));
};
```

### 3. Deleting Item

```typescript
const handleDeleteInvoice = (id: string) => {
  // Confirm dialog
  if (!confirm('Weet je zeker dat je deze factuur wilt verwijderen?')) {
    return;
  }

  setInvoices(prev => prev.filter(inv => inv.id !== id));

  // Notificatie
  setNotifications(prev => [...prev, {
    id: `notif-${Date.now()}`,
    type: 'info',
    message: 'Factuur verwijderd',
    timestamp: new Date().toISOString()
  }]);
};
```

### 4. Status Change

```typescript
const handleStatusChange = (id: string, newStatus: WorkOrderStatus) => {
  setWorkOrders(prev => prev.map(wo => {
    if (wo.id !== id) return wo;

    // Timestamp toevoegen op basis van status
    const updates: Partial<WorkOrder> = { status: newStatus };

    if (newStatus === 'in_progress' && !wo.startedAt) {
      updates.startedAt = new Date().toISOString();
    } else if (newStatus === 'completed' && !wo.completedAt) {
      updates.completedAt = new Date().toISOString();
    }

    return { ...wo, ...updates };
  }));
};
```

---

## 🔗 Module Interacties

### Offerte → Werkorder → Factuur Workflow

**KRITIEK**: Deze sync moet bidirectional werken:

#### 1. Offerte → Werkorder

```typescript
const handleCreateWorkOrderFromQuote = (quote: Quote) => {
  // Check: quote moet geaccepteerd zijn
  if (quote.status !== 'approved') {
    alert('Alleen geaccepteerde offertes kunnen worden omgezet');
    return;
  }

  // Check: geen duplicate
  if (quote.workOrderId) {
    alert('Er bestaat al een werkorder voor deze offerte');
    return;
  }

  // Genereer nieuwe werkorder
  const newWorkOrder: WorkOrder = {
    id: `WO${String(workOrders.length + 1).padStart(3, '0')}`,
    title: quote.title || `Werkorder voor ${quote.customerName}`,
    description: quote.description || '',
    assignedTo: '', // Admin wijst toe
    status: 'todo',
    estimatedHours: quote.laborHours || 0,
    actualHours: 0,
    materials: quote.items.map(item => ({
      inventoryItemId: item.inventoryItemId,
      quantity: item.quantity
    })),
    createdAt: new Date().toISOString(),
    quoteId: quote.id // Link terug
  };

  // Update beide states
  setWorkOrders(prev => [...prev, newWorkOrder]);

  setQuotes(prev => prev.map(q =>
    q.id === quote.id
      ? { ...q, workOrderId: newWorkOrder.id }
      : q
  ));
};
```

#### 2. Werkorder Status → Offerte Status Badge

```typescript
// In Quote weergave: sync status badge
const workOrder = useMemo(() =>
  workOrders.find(wo => wo.quoteId === quote.id),
  [workOrders, quote.id]
);

{workOrder && (
  <span className={`badge badge-${getStatusColor(workOrder.status)}`}>
    Werkorder: {getStatusLabel(workOrder.status)}
  </span>
)}
```

#### 3. Bewerk Offerte → Update Werkorder

```typescript
const handleUpdateQuoteWithWorkOrder = (quoteId: string, updates: Partial<Quote>) => {
  // Update quote
  setQuotes(prev => prev.map(q =>
    q.id === quoteId ? { ...q, ...updates } : q
  ));

  // Sync met werkorder
  const workOrder = workOrders.find(wo => wo.quoteId === quoteId);
  if (workOrder) {
    setWorkOrders(prev => prev.map(wo =>
      wo.id === workOrder.id
        ? {
            ...wo,
            title: updates.title || wo.title,
            description: updates.description || wo.description,
            estimatedHours: updates.laborHours || wo.estimatedHours,
            materials: updates.items?.map(item => ({
              inventoryItemId: item.inventoryItemId,
              quantity: item.quantity
            })) || wo.materials
          }
        : wo
    ));
  }
};
```

#### 4. Werkorder → Factuur

```typescript
const handleConvertToInvoice = (quote: Quote) => {
  // Haal werkorder op
  const workOrder = workOrders.find(wo => wo.quoteId === quote.id);

  // KRITIEK: Gebruik actualHours, niet estimatedHours
  const laborHours = workOrder?.actualHours || quote.laborHours || 0;

  const newInvoice: Invoice = {
    id: `2025-${String(invoices.length + 1).padStart(3, '0')}`,
    customerId: quote.customerId,
    customerName: quote.customerName,
    date: new Date().toISOString().split('T')[0],
    dueDate: calculateDueDate(30),
    items: quote.items,
    laborHours: laborHours, // Gewerkte uren!
    hourlyRate: quote.hourlyRate || 50,
    status: 'draft',
    quoteId: quote.id,
    workOrderId: workOrder?.id
  };

  setInvoices(prev => [...prev, newInvoice]);

  // Update quote
  setQuotes(prev => prev.map(q =>
    q.id === quote.id
      ? { ...q, invoiceId: newInvoice.id }
      : q
  ));
};
```

### Voorraad & Werkorders

**Materialen reserveren:**
```typescript
const handleAssignMaterials = (workOrderId: string, materials: Material[]) => {
  // Check voorraad
  for (const material of materials) {
    const item = inventory.find(i => i.id === material.inventoryItemId);
    if (!item || item.quantity < material.quantity) {
      alert(`Onvoldoende voorraad voor ${item?.name || 'item'}`);
      return;
    }
  }

  // Update werkorder
  setWorkOrders(prev => prev.map(wo =>
    wo.id === workOrderId
      ? { ...wo, materials }
      : wo
  ));

  // NIET automatisch aftrekken van voorraad
  // Dit gebeurt bij voltooiing werkorder of POS verkoop
};
```

**Voorraad aftrekken bij voltooiing:**
```typescript
const handleCompleteWorkOrder = (workOrderId: string) => {
  const workOrder = workOrders.find(wo => wo.id === workOrderId);
  if (!workOrder) return;

  // Update status
  setWorkOrders(prev => prev.map(wo =>
    wo.id === workOrderId
      ? {
          ...wo,
          status: 'completed',
          completedAt: new Date().toISOString()
        }
      : wo
  ));

  // Trek materialen af van voorraad
  if (workOrder.materials && workOrder.materials.length > 0) {
    setInventory(prev => prev.map(item => {
      const material = workOrder.materials?.find(m => m.inventoryItemId === item.id);
      if (material) {
        return {
          ...item,
          quantity: item.quantity - material.quantity
        };
      }
      return item;
    }));
  }
};
```

---

## ⚠️ Common Pitfalls

### 1. ❌ Permission Check Vergeten

```typescript
// FOUT: Geen permission check
const handleDelete = (id: string) => {
  setCustomers(prev => prev.filter(c => c.id !== id));
};

// GOED: Check permissions
const handleDelete = (id: string) => {
  if (!currentUser?.isAdmin) {
    alert('Alleen admins kunnen klanten verwijderen');
    return;
  }
  setCustomers(prev => prev.filter(c => c.id !== id));
};
```

### 2. ❌ Direct State Mutation

```typescript
// FOUT: Direct mutation
const wo = workOrders.find(w => w.id === id);
wo.status = 'completed'; // NEVER DO THIS!

// GOED: Immutable update
setWorkOrders(prev => prev.map(wo =>
  wo.id === id ? { ...wo, status: 'completed' } : wo
));
```

### 3. ❌ Niet Synchroniseren

```typescript
// FOUT: Alleen quote updaten
setQuotes(prev => prev.map(q =>
  q.id === id ? { ...q, status: 'approved' } : q
));
// Werkorder status niet geupdate!

// GOED: Beide synchroniseren
const quote = quotes.find(q => q.id === id);
if (quote?.workOrderId) {
  setWorkOrders(prev => prev.map(wo =>
    wo.id === quote.workOrderId
      ? { ...wo, /* update status */ }
      : wo
  ));
}
setQuotes(prev => prev.map(q =>
  q.id === id ? { ...q, status: 'approved' } : q
));
```

### 4. ❌ Geen Error Handling

```typescript
// FOUT: Geen validation
const handleSubmit = (data) => {
  setCustomers(prev => [...prev, data]);
};

// GOED: Validate eerst
const handleSubmit = (data: Customer) => {
  if (!data.name || !data.email) {
    alert('Naam en email zijn verplicht');
    return;
  }

  if (customers.some(c => c.email === data.email)) {
    alert('Email adres bestaat al');
    return;
  }

  setCustomers(prev => [...prev, { ...data, id: generateId() }]);
};
```

### 5. ❌ Timestamps Vergeten

```typescript
// FOUT: Geen timestamps
setWorkOrders(prev => [...prev, newWorkOrder]);

// GOED: Voeg timestamps toe
setWorkOrders(prev => [...prev, {
  ...newWorkOrder,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}]);
```

---

## 🧪 Testing Requirements

### Manual Testing Checklist

Bij elke feature:

**Als Admin:**
- [ ] Kan ik nieuwe items aanmaken?
- [ ] Kan ik items bewerken?
- [ ] Kan ik items verwijderen?
- [ ] Zie ik alle data van alle users?
- [ ] Werken alle knoppen?

**Als User:**
- [ ] Zie ik alleen mijn eigen data?
- [ ] Zijn create/edit/delete knoppen disabled of verborgen?
- [ ] Kan ik mijn eigen werkorders updaten?
- [ ] Kan ik uren registreren?
- [ ] Werkt read-only view voor collega's?

**Workflows:**
- [ ] Offerte → Werkorder: Sync correct?
- [ ] Werkorder status: Toont correct in offerte?
- [ ] Werkorder → Factuur: Gebruikt actualHours?
- [ ] Materialen: Correct afgetrokken bij voltooiing?
- [ ] Voorraad: Lage voorraad warnings tonen?

**Mobile:**
- [ ] Layout responsive op small screen?
- [ ] Hamburger menu werkt?
- [ ] Touch targets groot genoeg (44x44px)?
- [ ] Forms bruikbaar op mobile?

### Automated Testing (Toekomst)

```typescript
// Voorbeeld: Vitest/Jest tests
describe('WorkOrder Creation', () => {
  it('should create workorder from approved quote', () => {
    const quote = { ...mockQuote, status: 'approved' };
    const result = createWorkOrderFromQuote(quote);

    expect(result.quoteId).toBe(quote.id);
    expect(result.status).toBe('todo');
    expect(result.estimatedHours).toBe(quote.laborHours);
  });

  it('should not create workorder from draft quote', () => {
    const quote = { ...mockQuote, status: 'draft' };
    expect(() => createWorkOrderFromQuote(quote)).toThrow();
  });
});
```

---

## ✅ Code Review Checklist

Voor pull requests en code changes:

### TypeScript
- [ ] Alle functies hebben type annotations
- [ ] Geen `any` types (tenzij echt nodig)
- [ ] Interfaces voor alle data structures
- [ ] Props interfaces voor alle components

### Permissions
- [ ] Admin checks voor create/edit/delete
- [ ] User filtering voor data views
- [ ] Disabled states voor unauthorized actions
- [ ] Clear error messages voor denied actions

### State Management
- [ ] Immutable updates (spread operators)
- [ ] No direct mutations
- [ ] useMemo voor derived state
- [ ] Timestamps toegevoegd waar nodig

### Synchronization
- [ ] Offerte ↔ Werkorder sync
- [ ] Werkorder ↔ Factuur sync
- [ ] Voorraad updates bij POS/werkorder
- [ ] Status badges up-to-date

### UX/UI
- [ ] Loading states
- [ ] Error messages
- [ ] Success confirmations
- [ ] Responsive design (mobile)
- [ ] Accessibility (ARIA labels waar nodig)

### Visual Design
- [ ] Custom color palette gebruikt (primary, success, warning, error)
- [ ] Consistent spacing (p-4, p-6, gap-4, gap-6)
- [ ] Hover en focus states aanwezig
- [ ] Subtiele animations waar passend
- [ ] Empty states delightful en duidelijk
- [ ] Touch targets minimum 44x44px
- [ ] Typography hierarchy correct
- [ ] Design consistent met bestaande components

### Dutch Language
- [ ] Alle UI teksten in Nederlands
- [ ] Comments in Nederlands (optioneel)
- [ ] Error messages in Nederlands
- [ ] Tooltips in Nederlands

### Performance
- [ ] useMemo voor expensive calculations
- [ ] useCallback voor event handlers (indien nodig)
- [ ] Lazy loading voor grote lijsten
- [ ] No unnecessary re-renders

---

## 📝 Documentation Standards

### Component Documentation

```typescript
/**
 * WorkOrderBoard - Kanban-stijl board voor werkorders
 *
 * Features:
 * - 4 kolommen: To Do, In Wacht, In Uitvoering, Afgerond
 * - Drag-and-drop (toekomstig)
 * - Filter per medewerker (admin)
 * - Compacte/uitgebreide weergave toggle
 *
 * Permissions:
 * - Admin: Alle werkorders, kan alles bewerken
 * - User: Alleen eigen werkorders, kan status updaten
 *
 * @param workOrders - Array van WorkOrder objecten
 * @param setWorkOrders - State setter voor workOrders
 * @param users - Array van User objecten (voor toewijzing)
 * @param currentUser - Ingelogde gebruiker
 */
interface WorkOrderBoardProps {
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  users: User[];
  currentUser: User | null;
}

export const WorkOrderBoard: React.FC<WorkOrderBoardProps> = ({ ... }) => {
  // Implementation
};
```

### Function Documentation

```typescript
/**
 * Creëer een werkorder vanuit een goedgekeurde offerte
 *
 * Synchroniseert:
 * - Offerte krijgt workOrderId
 * - Werkorder krijgt quoteId
 * - Materialen worden overgenomen
 * - Geschatte uren worden overgenomen
 *
 * @param quote - Goedgekeurde offerte
 * @returns Nieuwe WorkOrder object
 * @throws Error als quote niet approved is
 */
const createWorkOrderFromQuote = (quote: Quote): WorkOrder => {
  if (quote.status !== 'approved') {
    throw new Error('Alleen goedgekeurde offertes kunnen worden omgezet');
  }
  // ...
};
```

---

## 🚀 Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Login voor Testing

**Admin:** sophie@bedrijf.nl / 1234
**User:** jan@bedrijf.nl / 1234

### 3. Hot Module Replacement

Vite HMR is enabled - changes zijn direct zichtbaar.

### 4. Type Checking

```bash
npm run type-check
```

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## 📚 Belangrijke Documentatie Links

- [INDEX](./INDEX.md) - Master documentatie index
- [Technical Stack](./02-architecture/technical-stack.md) - Technische details
- [State Management](./02-architecture/state-management.md) - State patterns
- [User Roles](./04-features/user-roles.md) - Complete permission matrix
- [Workorder Workflow](./04-features/workorder-workflow.md) - End-to-end flow
- [SCALING_GUIDE](./SCALING_GUIDE.md) - Hoe documentatie up-to-date houden

---

## 🆘 Help & Support

**Voor AI Assistenten:**

Als je vast loopt:
1. Check [State Management docs](./02-architecture/state-management.md)
2. Bekijk [Module documentatie](./03-modules/) voor specifieke modules
3. Raadpleeg [Workorder Workflow](./04-features/workorder-workflow.md) voor sync logica
4. Check [User Roles](./04-features/user-roles.md) voor permissions

**Belangrijkste principes:**
- 🔒 Altijd permission checks
- 🔄 Altijd immutable updates
- 🔗 Altijd bidirectional sync
- 🇳🇱 Altijd Nederlands in UI
- ✅ Altijd TypeScript types

---

**Veel succes met development! 🚀**

**Onthoud:** Safety first, user experience second, features third.
