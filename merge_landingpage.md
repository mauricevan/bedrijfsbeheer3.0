# Merge Landing Page Integration Plan

## Overview
This document outlines the plan to integrate the frontpage website (`D:\code projects\frontpage\frontpage`) into the bedrijfsbeheer dashboard project. The goal is to create a unified application where:
- **Public visitors** can browse the marketing website (Home, Services, About, Contact, etc.)
- **Authorized users** can log in and access the protected dashboard
- The frontpage LoginPage connects to the dashboard authentication system

---

## Architecture Decisions

### 1. Routing Strategy
**Decision: Use BrowserRouter (already in use)**
- The dashboard already uses `BrowserRouter` from `react-router-dom`
- More SEO-friendly than HashRouter
- Standard approach for modern web applications
- Frontpage currently uses HashRouter - will be migrated to BrowserRouter

### 2. Route Structure
```
Public Routes (No Authentication Required):
├── /                    → Home page (frontpage)
├── /services            → Services listing
├── /services/:slug     → Service detail pages
├── /products/:id       → Product detail pages
├── /bestellen          → Order page
├── /about              → About page
├── /contact            → Contact page
└── /login              → Login page (frontpage design, dashboard auth)

Protected Routes (Authentication Required):
├── /dashboard          → Dashboard home (redirect after login)
├── /inventory          → Inventory management
├── /pos                → Point of Sale
├── /work-orders        → Work Orders
├── /accounting         → Accounting
├── /bookkeeping        → Bookkeeping
├── /webshop            → Webshop management
├── /crm                → CRM
├── /hrm                → HRM
├── /planning           → Planning
├── /reports            → Reports
└── /settings           → Settings
```

### 3. Layout Strategy
- **Public Routes**: Use frontpage layout (Navbar + Footer + FloatingDock, no sidebar)
- **Protected Routes**: Use MainLayout (Sidebar + Header, no Navbar/Footer)
- **Login Page**: Standalone (frontpage design, no layout wrapper)

### 4. Authentication Flow
1. User visits public website
2. User clicks "Login" in Navbar → navigates to `/login`
3. User enters credentials in frontpage-styled LoginPage
4. LoginPage uses dashboard's `useAuth` hook
5. On successful login → redirect to `/dashboard` (dashboard home)
6. Protected routes check authentication via `ProtectedRoute` wrapper

---

## Implementation Phases

### Phase 1: File Structure & Dependencies

#### 1.1 Copy Frontpage Components
**Source**: `D:\code projects\frontpage\frontpage\components\`
**Destination**: `Frontend/src/components/landing/`

Files to copy:
- `Button.tsx` → Check if compatible with existing Button component
- `CylinderBuilder.tsx`
- `FloatingDock.tsx`
- `Footer.tsx`
- `Navbar.tsx` → Will need modification for auth state
- `Reveal.tsx`
- `SolutionFinder.tsx`

**Action**: Review existing `Button.tsx` in dashboard - may need to reconcile differences or use aliased imports.

#### 1.2 Copy Frontpage Pages
**Source**: `D:\code projects\frontpage\frontpage\pages\`
**Destination**: `Frontend/src/pages/landing/`

Files to copy:
- `Home.tsx`
- `Services.tsx`
- `ServiceDetail.tsx`
- `ProductPage.tsx`
- `OrderPage.tsx`
- `About.tsx`
- `Contact.tsx`
- `LoginPage.tsx` → **CRITICAL**: Will be modified to use dashboard auth

#### 1.3 Copy Supporting Files
- `D:\code projects\frontpage\frontpage\data.ts` → `Frontend/src/data/landingData.ts`
- `D:\code projects\frontpage\frontpage\types.ts` → `Frontend/src/types/landingTypes.ts`
- `D:\code projects\frontpage\frontpage\metadata.json` → `Frontend/src/data/metadata.json` (if exists)

#### 1.4 Dependency Check
**Frontpage dependencies**:
- `react-router-dom` ✅ (already in dashboard)
- `lucide-react` ✅ (already in dashboard)
- `react` ✅ (already in dashboard)
- `react-dom` ✅ (already in dashboard)

**No additional dependencies needed** - all required packages are already installed.

---

### Phase 2: Update LoginPage Integration

#### 2.1 Modify Frontpage LoginPage
**File**: `Frontend/src/pages/landing/LoginPage.tsx`

**Changes Required**:
1. Import dashboard's `useAuth` hook instead of demo alert
2. Replace `alert('Login demo...')` with actual `login(email, password)` call
3. Handle loading states (use `isLoading` from `useAuth`)
4. Handle error states (display error messages)
5. On successful login, redirect to `/dashboard` instead of `/`
6. Keep frontpage design/styling intact
7. Remove demo functionality, keep professional UI

**Code Pattern**:
```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Replace handleLogin function:
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);
  
  try {
    await login(email, password);
    navigate('/dashboard'); // Redirect to dashboard home
  } catch (err) {
    setError('Ongeldige email of wachtwoord');
  } finally {
    setIsLoading(false);
  }
};
```

#### 2.2 Update Navbar Login Button
**File**: `Frontend/src/components/landing/Navbar.tsx`

**Changes Required**:
1. Check if user is authenticated (import `useAuth`)
2. If authenticated: Show "Dashboard" button instead of "Login"
3. If authenticated: Dashboard button links to `/dashboard`
4. If not authenticated: Show "Login" button (links to `/login`)

---

### Phase 3: Routing Configuration

#### 3.1 Update App.tsx
**File**: `Frontend/src/App.tsx`

**Changes Required**:
1. Import all landing page components
2. Create a `PublicLayout` component (Navbar + Footer + FloatingDock)
3. Add public routes before protected routes
4. Keep existing protected routes structure
5. Ensure `/login` is public (not protected)

**New Route Structure**:
```typescript
<Routes>
  {/* Public Routes */}
  <Route element={<PublicLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/services" element={<Services />} />
    <Route path="/services/:slug" element={<ServiceDetail />} />
    <Route path="/products/:id" element={<ProductPage />} />
    <Route path="/bestellen" element={<OrderPage />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
  </Route>
  
  {/* Login (standalone, no layout) */}
  <Route path="/login" element={<LoginPage />} />
  
  {/* Protected Dashboard Routes */}
  <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
    <Route path="/dashboard" element={<DashboardPage />} />
    {/* ... existing protected routes ... */}
  </Route>
</Routes>
```

#### 3.2 Create PublicLayout Component
**File**: `Frontend/src/layouts/PublicLayout.tsx`

**Structure**:
```typescript
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { FloatingDock } from '@/components/landing/FloatingDock';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingDock />
    </div>
  );
};
```

---

### Phase 4: Component Reconciliation

#### 4.1 Button Component Conflict
**Issue**: Both projects have a `Button.tsx` component

**Options**:
- **Option A**: Rename frontpage Button to `LandingButton.tsx` and update imports
- **Option B**: Merge functionality if compatible
- **Option C**: Use existing dashboard Button and adapt frontpage components

**Recommendation**: Option A - Rename to avoid conflicts, keep both if styling differs significantly.

#### 4.2 Path Aliases
**Frontpage uses**: `@` pointing to root
**Dashboard uses**: `@` pointing to `./src`

**Action**: All frontpage imports will need to be updated to use `@/components/landing/...` pattern.

#### 4.3 Styling Compatibility
- Both use Tailwind CSS ✅
- Frontpage may use different color schemes
- Need to ensure no CSS conflicts

**Action**: Review Tailwind config, ensure both color schemes coexist or merge appropriately.

---

### Phase 5: Import Path Updates

#### 5.1 Update All Frontpage Component Imports
**Pattern**: Replace relative imports with alias imports

**Before** (frontpage):
```typescript
import { Button } from '../components/Button';
import { CONTACT_INFO } from '../data';
```

**After** (integrated):
```typescript
import { Button } from '@/components/landing/Button'; // or LandingButton
import { CONTACT_INFO } from '@/data/landingData';
```

#### 5.2 Update Router Imports
**Change**: `HashRouter` → `BrowserRouter` (if found in frontpage components)

**Files to check**:
- All page components
- Navbar component
- Any navigation utilities

---

### Phase 6: Authentication State Management

#### 6.1 Navbar Authentication Awareness
**File**: `Frontend/src/components/landing/Navbar.tsx`

**Implementation**:
```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

const { isAuthenticated, user } = useAuth();

// In render:
{isAuthenticated ? (
  <Button onClick={() => navigate('/dashboard')}>
    Dashboard
  </Button>
) : (
  <Button onClick={() => navigate('/login')}>
    Login
  </Button>
)}
```

#### 6.2 Protected Route Redirect Logic
**Current**: Redirects to `/login` if not authenticated
**Keep**: This behavior is correct

**Enhancement**: After login, redirect to originally requested URL if available (optional improvement).

---

### Phase 7: Testing & Validation

#### 7.1 Public Routes Testing
- [ ] Home page loads correctly
- [ ] Services page displays
- [ ] Service detail pages work
- [ ] Product pages work
- [ ] Order page accessible
- [ ] About page displays
- [ ] Contact page displays
- [ ] Navigation between public pages works

#### 7.2 Authentication Flow Testing
- [ ] Login page displays (frontpage design)
- [ ] Login with valid credentials redirects to `/dashboard`
- [ ] Login with invalid credentials shows error
- [ ] Navbar shows "Dashboard" when authenticated
- [ ] Navbar shows "Login" when not authenticated
- [ ] Logout from dashboard returns to public site
- [ ] Direct access to `/dashboard` without auth redirects to `/login`

#### 7.3 Layout Testing
- [ ] Public pages show Navbar + Footer + FloatingDock
- [ ] Protected pages show Sidebar + Header (no Navbar/Footer)
- [ ] Login page has no layout wrapper
- [ ] Mobile responsiveness maintained

#### 7.4 Styling Testing
- [ ] No CSS conflicts between frontpage and dashboard
- [ ] Dark mode works (if applicable)
- [ ] Tailwind classes render correctly
- [ ] Animations/transitions work

---

## File Organization Summary

```
Frontend/src/
├── components/
│   ├── landing/              ← NEW: Frontpage components
│   │   ├── Button.tsx (or LandingButton.tsx)
│   │   ├── CylinderBuilder.tsx
│   │   ├── FloatingDock.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx        ← MODIFIED: Add auth awareness
│   │   ├── Reveal.tsx
│   │   └── SolutionFinder.tsx
│   ├── common/               ← EXISTING: Dashboard components
│   ├── layout/               ← EXISTING: Dashboard layout
│   └── ...
├── pages/
│   ├── landing/              ← NEW: Frontpage pages
│   │   ├── Home.tsx
│   │   ├── Services.tsx
│   │   ├── ServiceDetail.tsx
│   │   ├── ProductPage.tsx
│   │   ├── OrderPage.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── LoginPage.tsx     ← MODIFIED: Use dashboard auth
│   ├── AccountingPage.tsx    ← EXISTING: Dashboard pages
│   ├── CRMPage.tsx
│   └── ...
├── layouts/
│   ├── MainLayout.tsx        ← EXISTING: Dashboard layout
│   └── PublicLayout.tsx      ← NEW: Frontpage layout
├── data/
│   └── landingData.ts        ← NEW: Frontpage data
├── types/
│   └── landingTypes.ts       ← NEW: Frontpage types
├── App.tsx                   ← MODIFIED: Add public routes
└── ...
```

---

## Potential Issues & Solutions

### Issue 1: Button Component Naming Conflict
**Solution**: Rename frontpage Button to `LandingButton.tsx` or merge if compatible.

### Issue 2: HashRouter vs BrowserRouter
**Solution**: Update all frontpage components to use `BrowserRouter` (already in dashboard).

### Issue 3: Path Alias Differences
**Solution**: Update all frontpage imports to use `@/` alias pointing to `src/`.

### Issue 4: Styling Conflicts
**Solution**: Use CSS scoping or ensure Tailwind config supports both designs.

### Issue 5: Data/Type Imports
**Solution**: Move frontpage data/types to appropriate locations and update imports.

### Issue 6: Image Assets
**Solution**: Ensure image URLs in frontpage data are accessible (may need to move to `public/` folder).

---

## Migration Checklist

### Pre-Migration
- [ ] Backup current codebase
- [ ] Review frontpage codebase structure
- [ ] Identify all dependencies
- [ ] Document any custom configurations

### Phase 1: File Copying
- [ ] Copy frontpage components to `components/landing/`
- [ ] Copy frontpage pages to `pages/landing/`
- [ ] Copy data/types files
- [ ] Resolve Button component conflict

### Phase 2: Login Integration
- [ ] Update LoginPage to use dashboard auth
- [ ] Test login flow
- [ ] Update Navbar for auth awareness

### Phase 3: Routing
- [ ] Create PublicLayout component
- [ ] Update App.tsx with public routes
- [ ] Test route navigation

### Phase 4: Import Updates
- [ ] Update all frontpage component imports
- [ ] Update router imports (HashRouter → BrowserRouter)
- [ ] Fix path aliases

### Phase 5: Testing
- [ ] Test all public routes
- [ ] Test authentication flow
- [ ] Test layout switching
- [ ] Test mobile responsiveness
- [ ] Test styling consistency

### Phase 6: Cleanup
- [ ] Remove unused files
- [ ] Update documentation
- [ ] Verify build process
- [ ] Test production build

---

## Success Criteria

✅ **Public website is accessible** without authentication
✅ **Login page uses dashboard authentication** system
✅ **After login, users are redirected** to `/dashboard`
✅ **Public pages show frontpage layout** (Navbar + Footer)
✅ **Protected pages show dashboard layout** (Sidebar + Header)
✅ **No styling conflicts** between frontpage and dashboard
✅ **All routes work correctly** (public and protected)
✅ **Mobile responsiveness maintained** for both layouts

---

## Notes

- The frontpage uses a more marketing-focused design with animations and modern UI
- The dashboard uses a more functional, data-focused design
- Both should coexist without conflicts
- Consider adding a "Back to Website" link in dashboard header for easy navigation
- Consider adding analytics tracking for public pages (if not already implemented)

---

## Next Steps After Plan Approval

1. Begin Phase 1: Copy files and resolve conflicts
2. Test incrementally after each phase
3. Document any deviations from plan
4. Update this document with actual implementation notes

