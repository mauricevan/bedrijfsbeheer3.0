---
description: REACT TYPESCRIPT BEST PRACTICES
---

# React + TypeScript Best Practices
**Versie:** 1.0.0
**Laatst bijgewerkt:** November 2024
**Bron:** Geëxtraheerd uit bedrijfsbeheer2.0 project

---

## 📋 Inhoudsopgave

1. [TypeScript Conventions](#typescript-conventions)
2. [Component Patterns](#component-patterns)
3. [State Management](#state-management)
4. [Performance Optimization](#performance-optimization)
5. [File Organization](#file-organization)
6. [Naming Conventions](#naming-conventions)

---

## 🎯 TypeScript Conventions

### Always Use Types

```typescript
// ✅ GOED - Explicit types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const createUser = (data: User): User => {
  return data;
}

// ❌ FOUT - Any types
const createUser = (data: any) => {
  return data;
}
```

### Props Types

```typescript
// ✅ Use 'type' for props
type CardProps = {
  title: string;
  description: string;
  onClick?: () => void;
};

// ❌ Avoid 'interface' for props
interface CardProps {
  // ...
}
```

### No Any Types

```typescript
// ✅ GOED - Explicit type
const handleSubmit = (data: FormData) => {
  // ...
};

// ❌ FOUT - Any type
const handleSubmit = (data: any) => {
  // ...
};
```

---

## 🧩 Component Patterns

### Functional Components Only

```typescript
// ✅ GOED - Functional component
type ButtonProps = {
  label: string;
  onClick: () => void;
};

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};

// ❌ FOUT - Class component
class Button extends React.Component {
  render() {
    return <button>...</button>;
  }
}
```

### Component Documentation

```typescript
/**
 * Button Component
 *
 * Features:
 * - Multiple variants (primary, secondary, danger)
 * - Multiple sizes (sm, md, lg)
 * - Accessible keyboard navigation
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 */
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
};
```

### Component Structure

```typescript
// 1. Imports
import React, { useState, useCallback } from 'react';
import type { User } from './types';

// 2. Interface definitions
type ComponentProps = {
  user: User;
  onUpdate: (id: string) => void;
};

// 3. Component definition
export const Component: React.FC<ComponentProps> = ({ user, onUpdate }) => {
  // 4. State declarations
  const [isOpen, setIsOpen] = useState(false);

  // 5. Event handlers
  const handleClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Code Reusability & DRY Principle

**Core Principle:** Always evaluate if code can be reused before implementing duplicate functionality. Shared components, utilities, and patterns should be extracted and reused across the application to maintain consistency, reduce maintenance overhead, and improve code quality.

**Before Writing New Code, Ask:**
- ✅ Does a similar component/function already exist?
- ✅ Can this be extracted into a reusable component?
- ✅ Will this be used in multiple places?
- ✅ Can this logic be shared via a utility function or hook?

**Common Reusable Elements:**
- **Layout Components**: Header, Footer, Navigation, Sidebar
- **UI Components**: Buttons, Modals, Forms, Cards, Tables
- **Utility Functions**: Date formatting, validation, data transformation
- **Custom Hooks**: Data fetching, form handling, state management
- **Constants**: Configuration values, API endpoints, theme values

**Example: Reusable Footer Component**

```typescript
// ❌ FOUT - Duplicate footer code in every page
// pages/HomePage.tsx
const HomePage = () => {
  return (
    <div>
      <main>Home content</main>
      <footer>
        <p>© 2024 Company Name</p>
        <nav>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </footer>
    </div>
  );
};

// pages/AboutPage.tsx
const AboutPage = () => {
  return (
    <div>
      <main>About content</main>
      <footer>
        <p>© 2024 Company Name</p>
        <nav>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </footer>
    </div>
  );
};

// ✅ GOED - Reusable Footer component
// components/common/Footer.tsx
type FooterProps = {
  copyrightYear?: number;
  links?: Array<{ label: string; href: string }>;
};

export const Footer: React.FC<FooterProps> = ({ 
  copyrightYear = new Date().getFullYear(),
  links = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' }
  ]
}) => {
  return (
    <footer>
      <p>© {copyrightYear} Company Name</p>
      <nav>
        {links.map(link => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>
    </footer>
  );
};

// Usage in pages
// pages/HomePage.tsx
import { Footer } from '@/components/common/Footer';

const HomePage = () => {
  return (
    <div>
      <main>Home content</main>
      <Footer />
    </div>
  );
};

// pages/AboutPage.tsx
import { Footer } from '@/components/common/Footer';

const AboutPage = () => {
  return (
    <div>
      <main>About content</main>
      <Footer />
    </div>
  );
};
```

**Benefits of Code Reusability:**
- ✅ **Consistency**: Same component/function behaves the same everywhere
- ✅ **Maintainability**: Fix bugs or update features in one place
- ✅ **Performance**: Shared components can be optimized once
- ✅ **Testing**: Test reusable components once, use everywhere
- ✅ **Reduced Bundle Size**: Code is included once, not duplicated
- ✅ **Faster Development**: Reuse existing solutions instead of rebuilding

**When to Extract for Reuse:**
- Code appears in 2+ places
- Similar logic with slight variations
- Component used across multiple pages/features
- Utility function needed in different contexts
- Constants or configuration shared across modules

**Remember:** If you find yourself copying and pasting code, stop and extract it into a reusable component, hook, or utility function. The DRY (Don't Repeat Yourself) principle is fundamental to maintainable codebases.

---

## 🔄 State Management

### Centralized State Pattern

```typescript
// App.tsx - Single source of truth
function App() {
  // All business state in one place
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  // Pass down via props
  return (
    <Component
      users={users}
      setUsers={setUsers}
      items={items}
    />
  );
}
```

### Immutable Updates

```typescript
// ✅ GOED - Immutable updates
// Add
setItems(prev => [...prev, newItem]);

// Update
setItems(prev => prev.map(item =>
  item.id === id
    ? { ...item, name: 'Updated', updatedAt: new Date().toISOString() }
    : item
));

// Delete
setItems(prev => prev.filter(item => item.id !== id));

// ❌ FOUT - Direct mutation
const item = items.find(i => i.id === id);
item.name = 'Updated'; // NEVER!
```

### Derived State with useMemo

```typescript
// ✅ GOED - useMemo for derived data
const activeItems = useMemo(() =>
  items.filter(item => item.status === 'active'),
  [items]
);

const totalPrice = useMemo(() =>
  items.reduce((sum, item) => sum + item.price, 0),
  [items]
);

// ❌ FOUT - Recalculate on every render
const activeItems = items.filter(item => item.status === 'active');
```

### Timestamps

```typescript
// ✅ GOED - Always add timestamps
setItems(prev => [...prev, {
  ...newItem,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}]);

// ❌ FOUT - Missing timestamps
setItems(prev => [...prev, newItem]);
```

---

## ⚡ Performance Optimization

### Performance-First Development Principle

**Core Principle:** Code should always be written with performance optimization as a primary consideration. Every implementation should be designed to achieve optimal efficiency, minimal resource consumption, and maximum execution speed while maintaining all required functionality.

**Guidelines:**
- ✅ **Optimize by default** - Consider performance implications during initial implementation, not as an afterthought
- ✅ **Minimize computational overhead** - Avoid unnecessary calculations, re-renders, and memory allocations
- ✅ **Lightweight implementations** - Keep code lean and efficient without sacrificing functionality
- ✅ **Measure and validate** - Use profiling tools to identify bottlenecks and verify optimizations
- ✅ **Balance complexity** - Optimize where it matters most; avoid premature optimization that reduces code clarity

**Performance Checklist:**
- [ ] Are expensive calculations memoized?
- [ ] Are event handlers wrapped in `useCallback`?
- [ ] Are components memoized with `React.memo` where appropriate?
- [ ] Is code splitting implemented for large components?
- [ ] Are unnecessary re-renders prevented?
- [ ] Is the bundle size optimized?
- [ ] Are API calls debounced/throttled where needed?
- [ ] Is virtualization used for large lists?

**Remember:** Performance optimization is not optional—it's an integral part of writing quality, production-ready code. Every line of code should be written with efficiency in mind.

### React.memo for Component Memoization

```typescript
// Prevent unnecessary re-renders
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  return <div>{/* render logic */}</div>;
});

// With custom comparison
const ExpensiveComponent = React.memo(
  ({ data }) => {
    return <div>{/* render logic */}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id;
  }
);
```

### useCallback for Event Handlers

```typescript
// ✅ GOED - useCallback
const handleClick = useCallback((id: string) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);

// ❌ FOUT - New function on every render
const handleClick = (id: string) => {
  setItems(prev => prev.filter(item => item.id !== id));
};
```

### useMemo for Expensive Calculations

```typescript
// ✅ GOED - Memoize expensive operations
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// ❌ FOUT - Sort on every render
const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
```

---

## 📁 File Organization

### Project Structure

```
src/
├── components/           # UI-componenten (geen business logic)
│   ├── common/          # Herbruikbare UI
│   │   ├── modals/      # Modal components
│   │   ├── forms/       # Form components
│   │   └── index.ts     # Barrel file
│   └── [feature]/       # Feature-specific UI
│       └── index.ts
│
├── features/            # Business logic per domein
│   └── [feature]/
│       ├── hooks/       # Custom hooks (useFeature.ts)
│       ├── services/    # Pure business logic functies
│       ├── utils/       # Pure utility functies
│       ├── types/       # TypeScript types
│       └── index.ts     # Barrel file
│
├── pages/               # Orchestratie (max 300 regels)
│   ├── Page.tsx
│   └── index.ts
│
├── hooks/               # Globale custom hooks
│   └── index.ts
│
├── utils/               # Algemene helpers
│   └── index.ts
│
└── types/               # Globale TypeScript types
    └── index.ts
```

### File Size Limits

| Type | Max Lines | Waarom |
|------|-----------|---------|
| Component | 300 | Onderhoudbaarheid |
| Hook | 200 | Testbaarheid |
| Service | 250 | Single Responsibility |
| Utility | 150 | Focus & reusability |
| Page | 300 | Alleen orchestratie |

### Barrel Files

```typescript
// ✅ GOED - Use barrel files
// features/auth/index.ts
export { useAuth } from './hooks/useAuth';
export { authService } from './services/authService';
export type { User, LoginCredentials } from './types';

// Usage
import { useAuth, authService } from '@/features/auth';

// ❌ FOUT - Direct imports
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authService } from '@/features/auth/services/authService';
```

---

## 📝 Naming Conventions

### Components

```typescript
// PascalCase
UserProfile.tsx
DataTable.tsx
FormInput.tsx
```

### Functions

```typescript
// camelCase
const handleSubmit = () => {};
const fetchUserData = () => {};
const calculateTotal = () => {};
```

### Constants

```typescript
// UPPERCASE
const MAX_ITEMS = 1000;
const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = 'https://api.example.com';
```

### Variables

```typescript
// camelCase
const userData = [];
const currentUser = null;
const isLoading = false;
```

### Types & Interfaces

```typescript
// PascalCase
interface User { }
type UserRole = 'admin' | 'user';
type ApiResponse<T> = { data: T; error?: string };
```

---

## 📦 Imports Order

```typescript
// 1. External libraries
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal types
import type { User, Item } from './types';

// 3. Internal components
import { Button } from './components/Button';
import { Modal } from './components/Modal';

// 4. Internal utilities
import { formatDate } from './utils/dateUtils';

// 5. Styles (if applicable)
import './styles.css';
```

---

## 🧪 Services (Pure Functions)

### Pure Functions Only

```typescript
// ✅ GOED - Pure function
export const calculateTotals = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ❌ FOUT - React hooks in service
export const calculateTotals = (items: Item[]) => {
  const [total, setTotal] = useState(0); // NO!
  useEffect(() => { /* NO! */ }, []);
  return total;
};
```

### Error Handling in Services

```typescript
// ✅ GOED - Throw errors, don't alert
export const validateData = (data: FormData): void => {
  if (!data.email) {
    throw new Error('Email is required');
  }

  if (!/\S+@\S+\.\S+/.test(data.email)) {
    throw new Error('Invalid email format');
  }
};

// ❌ FOUT - Alert in service
export const validateData = (data: FormData): boolean => {
  if (!data.email) {
    alert('Email is required!'); // NO!
    return false;
  }
};
```

---

## 🎯 Custom Hooks Pattern

```typescript
// ✅ GOED - Custom hook structure
export const useData = (
  initialData: Item[],
  setData: React.Dispatch<React.SetStateAction<Item[]>>
) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const createItem = useCallback((data: Item) => {
    const id = `${Date.now()}`;
    setData(prev => [...prev, { ...data, id }]);
  }, [setData]);

  const updateItem = useCallback((id: string, updates: Partial<Item>) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, [setData]);

  const deleteItem = useCallback((id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, [setData]);

  return {
    showForm,
    setShowForm,
    selectedItem,
    setSelectedItem,
    createItem,
    updateItem,
    deleteItem,
  };
};
```

---

## ✅ Quick Checklist

Voor je commit:

```markdown
- [ ] TypeScript: Geen `any` types
- [ ] State: Immutable updates
- [ ] Imports: Barrel files gebruikt
- [ ] Size: Component < 300 regels
- [ ] Size: Hook < 200 regels
- [ ] Build: `npm run build` succeeds
- [ ] Performance: useMemo/useCallback waar nodig
- [ ] Performance: Code geoptimaliseerd voor maximale efficiëntie
- [ ] Performance: Onnodige berekeningen en re-renders voorkomen
- [ ] Performance: Bundle size geoptimaliseerd waar mogelijk
- [ ] Code reusability: Geen code duplicatie - herbruikbare componenten gebruikt (bijv. Footer, Header)
- [ ] Code reusability: Bestaande componenten/functies gecontroleerd voordat nieuwe code wordt geschreven
```

---

## 📚 Gerelateerde Best Practices

- [Project Structure Guide](./PROJECT_STRUCTURE_PATTERNS.md)
- [State Management Patterns](./STATE_MANAGEMENT_PATTERNS.md)
- [Testing Best Practices](./TESTING_BEST_PRACTICES.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)

