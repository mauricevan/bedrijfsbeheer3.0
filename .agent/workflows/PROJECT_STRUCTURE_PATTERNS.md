---
description: PROJECT STRUCTURE PATTERNS
---

# Project Structure Patterns
**Versie:** 1.0.0
**Laatst bijgewerkt:** November 2024
**Bron:** Geëxtraheerd uit bedrijfsbeheer2.0 project

---

## 📋 Inhoudsopgave

1. [Modulaire Architectuur](#modulaire-architectuur)
2. [Feature-Based Structure](#feature-based-structure)
3. [Layer Separation](#layer-separation)
4. [Naming Conventions](#naming-conventions)
5. [Barrel Files](#barrel-files)

---

## 🏗️ Modulaire Architectuur

### Principes

```
1. **Modulair Design** - Elke feature is los in/uit te schakelen
2. **Component-Based** - Herbruikbare UI componenten
3. **Type-Safe** - TypeScript interfaces voor alle data types
4. **Responsive** - Mobile-first benadering
5. **Separation of Concerns** - Duidelijke scheiding van verantwoordelijkheden
6. **Performance-First** - Code wordt altijd geoptimaliseerd voor maximale efficiëntie en minimale resource-consumptie
```

### Performance-First Development

**Belangrijk Principe:** Bij het ontwikkelen van code moet performance-optimalisatie altijd een primaire overweging zijn. Elke implementatie dient ontworpen te worden voor optimale efficiëntie, minimale resource-consumptie en maximale uitvoersnelheid, terwijl alle benodigde functionaliteit behouden blijft.

**Richtlijnen:**
- ✅ **Optimaliseer standaard** - Overweeg performance-implicaties tijdens de initiële implementatie
- ✅ **Minimaliseer computationele overhead** - Vermijd onnodige berekeningen, re-renders en geheugentoewijzingen
- ✅ **Lichte implementaties** - Houd code lean en efficiënt zonder functionaliteit op te offeren
- ✅ **Meet en valideer** - Gebruik profiling tools om bottlenecks te identificeren en optimalisaties te verifiëren
- ✅ **Balans complexiteit** - Optimaliseer waar het het meest uitmaakt; vermijd premature optimalisatie die code duidelijkheid vermindert

**Performance Overwegingen:**
- Zijn dure berekeningen gememoized?
- Zijn event handlers gewrapped in `useCallback`?
- Zijn componenten gememoized met `React.memo` waar nodig?
- Is code splitting geïmplementeerd voor grote componenten?
- Worden onnodige re-renders voorkomen?
- Is de bundle size geoptimaliseerd?
- Zijn API calls gedebounced/getthrottled waar nodig?
- Wordt virtualisatie gebruikt voor grote lijsten?

**Onthoud:** Performance-optimalisatie is geen optie—het is een integraal onderdeel van het schrijven van kwalitatieve, production-ready code. Elke regel code moet geschreven worden met efficiëntie in gedachten.

### Directory Structure

```
project/
├── src/
│   ├── components/           # UI-componenten (geen business logic)
│   │   ├── common/          # Herbruikbare UI
│   │   │   ├── modals/      # ConfirmModal, FormModal
│   │   │   ├── forms/       # InputField, Select, Checkbox
│   │   │   ├── charts/      # LineChart, BarChart
│   │   │   └── index.ts
│   │   ├── [feature]/       # Feature-specifieke UI
│   │   │   ├── List.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── features/            # Business logic per domein
│   │   └── [feature]/
│   │       ├── hooks/       # useFeature.ts, useFeatureForm.ts
│   │       │   ├── useFeature.ts
│   │       │   ├── useFeatureForm.ts
│   │       │   └── index.ts
│   │       ├── services/    # Pure business logic functies
│   │       │   ├── featureService.ts
│   │       │   └── index.ts
│   │       ├── utils/       # Pure utility functies
│   │       │   ├── helpers.ts
│   │       │   ├── calculations.ts
│   │       │   ├── validators.ts
│   │       │   ├── formatters.ts
│   │       │   ├── filters.ts
│   │       │   └── index.ts
│   │       ├── types/       # TypeScript types
│   │       │   ├── feature.types.ts
│   │       │   └── index.ts
│   │       ├── README.md    # Module documentatie
│   │       └── index.ts
│   │
│   ├── pages/               # Orchestratie (max 300 regels)
│   │   ├── HomePage.tsx
│   │   ├── FeaturePage.tsx
│   │   └── index.ts
│   │
│   ├── hooks/               # Globale custom hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   │
│   ├── utils/               # Algemene helpers
│   │   ├── dateUtils.ts
│   │   ├── stringUtils.ts
│   │   └── index.ts
│   │
│   └── types/               # Globale TypeScript types
│       ├── index.ts
│       └── global.d.ts
│
├── docs/                    # Documentatie
│   ├── 01-getting-started/
│   ├── 02-architecture/
│   └── README.md
│
└── tests/                   # Test files
    ├── unit/
    └── integration/
```

---

## 🎯 Feature-Based Structure

### Feature Module Template

```
features/[feature-name]/
├── hooks/                   # Custom hooks (business logic)
│   ├── useFeature.ts       # Main hook (CRUD operations)
│   ├── useFeatureForm.ts   # Form-specific logic
│   ├── useFeatureModal.ts  # Modal state management
│   └── index.ts            # Barrel file
│
├── services/                # Pure functions (no React)
│   ├── featureService.ts   # CRUD operations
│   ├── validationService.ts# Validation logic
│   └── index.ts
│
├── utils/                   # Pure utility functions
│   ├── helpers.ts          # Generic helpers
│   ├── calculations.ts     # Business calculations
│   ├── validators.ts       # Input validation
│   ├── formatters.ts       # Data formatting
│   ├── filters.ts          # Data filtering/sorting
│   └── index.ts
│
├── types/                   # TypeScript definitions
│   ├── feature.types.ts    # Main types
│   ├── form.types.ts       # Form-specific types
│   └── index.ts
│
├── README.md               # Feature documentation
└── index.ts                # Main barrel file
```

### Example: Auth Feature

```
features/auth/
├── hooks/
│   ├── useAuth.ts          # Login, logout, session
│   ├── useAuthForm.ts      # Form validation
│   └── index.ts
│
├── services/
│   ├── authService.ts      # API calls (login, register)
│   ├── tokenService.ts     # JWT handling
│   └── index.ts
│
├── utils/
│   ├── passwordUtils.ts    # Password validation
│   ├── emailUtils.ts       # Email validation
│   └── index.ts
│
├── types/
│   ├── auth.types.ts       # User, Credentials, Session
│   └── index.ts
│
└── index.ts
```

---

## 📊 Layer Separation

### 1. Component Layer (UI Only)

```typescript
// components/[feature]/List.tsx
type ListProps = {
  items: Item[];
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
};

export const List: React.FC<ListProps> = ({ items, onUpdate, onDelete }) => {
  // ✅ ONLY UI rendering
  // ✅ NO business logic
  // ✅ Props drilling for data and callbacks

  return (
    <div>
      {items.map(item => (
        <Card
          key={item.id}
          item={item}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
```

**Rules:**
- ✅ Alleen UI rendering
- ✅ Props drilling voor data en callbacks
- ✅ Max 300 regels per component
- ❌ Geen useState voor data (wel voor UI state zoals open/closed)
- ❌ Geen API calls (data komt via props)

### 2. Hooks Layer (Business Logic)

```typescript
// features/[feature]/hooks/useFeature.ts
export const useFeature = (
  data: Item[],
  setData: React.Dispatch<React.SetStateAction<Item[]>>
) => {
  const [showForm, setShowForm] = useState(false);

  const createItem = useCallback((newItem: Item) => {
    const id = `${Date.now()}`;
    setData(prev => [...prev, { ...newItem, id }]);
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
    createItem,
    updateItem,
    deleteItem,
  };
};
```

**Rules:**
- ✅ Business logic voor feature
- ✅ State management (useState, useReducer)
- ✅ Side effects (useEffect voor data sync)
- ✅ Max 200 regels per hook
- ❌ Geen JSX (wel return object met functies/state)

### 3. Services Layer (Pure Functions)

```typescript
// features/[feature]/services/featureService.ts

// ✅ Pure functies alleen
export const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const transformData = (rawData: any): Item => {
  return {
    id: rawData.id,
    name: rawData.name,
    price: parseFloat(rawData.price),
  };
};

// ❌ Geen React (geen hooks, geen JSX)
// ❌ Geen side effects (geen API calls in services)
```

**Rules:**
- ✅ Pure functies alleen
- ✅ Berekeningen, transformaties
- ✅ Max 250 regels per service
- ❌ Geen React (geen hooks, geen JSX)
- ❌ Geen side effects

### 4. Pages Layer (Orchestration)

```typescript
// pages/FeaturePage.tsx
export const FeaturePage = () => {
  // ✅ State ophalen van App.tsx of parent
  const [items, setItems] = useState<Item[]>([]);

  // ✅ Use hooks
  const { createItem, updateItem, deleteItem } = useFeature(items, setItems);

  // ✅ Orchestratie - componenten samenbrengen
  return (
    <div>
      <Header title="Feature" />
      <List
        items={items}
        onUpdate={updateItem}
        onDelete={deleteItem}
      />
      <Footer />
    </div>
  );
};
```

**Rules:**
- ✅ Orchestratie alleen (componenten samenbrengen)
- ✅ State ophalen van parent
- ✅ Props doorgeven aan child componenten
- ✅ Max 300 regels
- ❌ Geen business logic (delegeer naar hooks)
- ❌ Geen complexe berekeningen (delegeer naar services)

---

## 📝 Naming Conventions

### Directory Names

```bash
# kebab-case voor directories
features/user-management/
components/data-table/
utils/date-helpers/

# ❌ AVOID
features/UserManagement/
components/DataTable/
utils/dateHelpers/
```

### File Names

```bash
# Components: PascalCase
UserProfile.tsx
DataTable.tsx

# Hooks: camelCase met "use" prefix
useAuth.ts
useUserData.ts

# Services: camelCase met suffix
userService.ts
authService.ts

# Utils: camelCase met beschrijvend suffix
dateUtils.ts
stringHelpers.ts

# Types: camelCase met ".types" suffix
user.types.ts
api.types.ts
```

### Barrel File Pattern

```typescript
// features/auth/index.ts
export { useAuth } from './hooks/useAuth';
export { authService } from './services/authService';
export { validateEmail, validatePassword } from './utils/validators';
export type { User, LoginCredentials, AuthState } from './types';

// Usage in andere files
import { useAuth, authService, validateEmail } from '@/features/auth';
import type { User } from '@/features/auth';
```

---

## 🔄 Component Organization Patterns

### Code Reusability & DRY Principle

**Belangrijk Principe:** Evalueer altijd of code hergebruikt kan worden voordat duplicaat functionaliteit wordt geïmplementeerd. Gedeelde componenten, utilities en patronen moeten worden geëxtraheerd en hergebruikt binnen de applicatie om consistentie te behouden, onderhoudskosten te verlagen en codekwaliteit te verbeteren.

**Voordat je nieuwe code schrijft, vraag jezelf af:**
- ✅ Bestaat er al een vergelijkbaar component/functie?
- ✅ Kan dit worden geëxtraheerd naar een herbruikbaar component?
- ✅ Wordt dit op meerdere plekken gebruikt?
- ✅ Kan deze logica worden gedeeld via een utility functie of hook?

**Veelvoorkomende herbruikbare elementen:**
- **Layout Componenten**: Header, Footer, Navigation, Sidebar
- **UI Componenten**: Buttons, Modals, Forms, Cards, Tables
- **Utility Functies**: Datum formattering, validatie, data transformatie
- **Custom Hooks**: Data fetching, form handling, state management
- **Constants**: Configuratie waarden, API endpoints, theme waarden

**Voorbeeld: Herbruikbaar Footer Component**

```typescript
// ❌ FOUT - Footer code gedupliceerd op elke pagina
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

// ✅ GOED - Herbruikbaar Footer component
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

// Gebruik in pagina's
import { Footer } from '@/components/common/Footer';

const HomePage = () => {
  return (
    <div>
      <main>Home content</main>
      <Footer />
    </div>
  );
};
```

**Voordelen van Code Hergebruik:**
- ✅ **Consistentie**: Zelfde component/functie gedraagt zich overal hetzelfde
- ✅ **Onderhoudbaarheid**: Bugs oplossen of features updaten op één plek
- ✅ **Performance**: Gedeelde componenten kunnen één keer geoptimaliseerd worden
- ✅ **Testing**: Test herbruikbare componenten één keer, gebruik overal
- ✅ **Kleinere Bundle Size**: Code wordt één keer opgenomen, niet gedupliceerd
- ✅ **Snellere Development**: Hergebruik bestaande oplossingen in plaats van opnieuw bouwen

**Wanneer extracten voor hergebruik:**
- Code verschijnt op 2+ plekken
- Vergelijkbare logica met kleine variaties
- Component gebruikt op meerdere pagina's/features
- Utility functie nodig in verschillende contexten
- Constants of configuratie gedeeld tussen modules

**Onthoud:** Als je merkt dat je code kopieert en plakt, stop en extraheer het naar een herbruikbaar component, hook of utility functie. Het DRY (Don't Repeat Yourself) principe is fundamenteel voor onderhoudbare codebases.

### Container/Presenter Pattern

```typescript
// Container (hooks/logic)
const useUserListLogic = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSelect = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  return { users, selectedUser, handleSelect };
};

// Presenter (UI only)
type UserListProps = {
  users: User[];
  selectedUser: User | null;
  onSelect: (user: User) => void;
};

const UserList: React.FC<UserListProps> = ({ users, selectedUser, onSelect }) => {
  return (
    <ul>
      {users.map(user => (
        <li
          key={user.id}
          onClick={() => onSelect(user)}
          className={selectedUser?.id === user.id ? 'selected' : ''}
        >
          {user.name}
        </li>
      ))}
    </ul>
  );
};

// Combined
export const UserListContainer = () => {
  const { users, selectedUser, handleSelect } = useUserListLogic();
  return <UserList users={users} selectedUser={selectedUser} onSelect={handleSelect} />;
};
```

### Composition Pattern

```typescript
// Base components
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="card">{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="card-header">{children}</div>
);

const CardBody = ({ children }: { children: React.ReactNode }) => (
  <div className="card-body">{children}</div>
);

// Usage - compose together
const UserCard = ({ user }: { user: User }) => (
  <Card>
    <CardHeader>{user.name}</CardHeader>
    <CardBody>{user.email}</CardBody>
  </Card>
);
```

---

## 📏 File Size Guidelines

### When to Split Components

```typescript
// BEFORE (too large - 400+ lines)
const ComplexComponent = () => {
  // State (50 lines)
  const [data, setData] = useState(...);
  const [filters, setFilters] = useState(...);
  const [modals, setModals] = useState(...);

  // Handlers (100 lines)
  const handleCreate = () => { /* ... */ };
  const handleUpdate = () => { /* ... */ };
  const handleDelete = () => { /* ... */ };

  // Render (250 lines)
  return (
    <div>
      {/* Complex JSX */}
    </div>
  );
};

// AFTER (split - each < 300 lines)
// hooks/useComplexComponentLogic.ts (150 lines)
export const useComplexComponentLogic = () => {
  const [data, setData] = useState(...);
  const handleCreate = () => { /* ... */ };
  return { data, handleCreate };
};

// components/ComplexComponent.tsx (150 lines)
export const ComplexComponent = () => {
  const { data, handleCreate } = useComplexComponentLogic();
  return <DataList data={data} onCreate={handleCreate} />;
};

// components/DataList.tsx (100 lines)
export const DataList = ({ data, onCreate }) => {
  return <div>{/* Simpler JSX */}</div>;
};
```

---

## ✅ Project Structure Checklist

Bij het opzetten van een nieuw project:

```markdown
- [ ] Features structuur aangemaakt (`features/`)
- [ ] Components gescheiden van business logic
- [ ] Barrel files in elke directory
- [ ] Types directory met shared types
- [ ] Hooks directory voor global hooks
- [ ] Utils directory voor helpers
- [ ] Pages directory voor orchestratie
- [ ] Docs directory voor documentatie
- [ ] README.md met project overzicht
```

Bij het toevoegen van een nieuwe feature:

```markdown
- [ ] Feature directory aangemaakt (`features/[naam]/`)
- [ ] Hooks directory (`hooks/`)
- [ ] Services directory (`services/`)
- [ ] Utils directory (`utils/`)
- [ ] Types directory (`types/`)
- [ ] Barrel files (`index.ts`) in elke subdirectory
- [ ] README.md in feature directory
- [ ] Main barrel file in feature root
```

---

## 📚 Gerelateerde Patronen

- [React TypeScript Best Practices](./REACT_TYPESCRIPT_BEST_PRACTICES.md)
- [State Management Patterns](./STATE_MANAGEMENT_PATTERNS.md)
- [Documentation Patterns](./DOCUMENTATION_PATTERNS.md)

