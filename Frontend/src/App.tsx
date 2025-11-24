import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/features/auth/hooks/useAuth';
import { MainLayout } from '@/layouts/MainLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Landing pages (public)
import { Home } from '@/pages/landing/Home';
import { Services } from '@/pages/landing/Services';
import { ServiceDetail } from '@/pages/landing/ServiceDetail';
import { ProductPage } from '@/pages/landing/ProductPage';
import { OrderPage } from '@/pages/landing/OrderPage';
import { About } from '@/pages/landing/About';
import { Contact } from '@/pages/landing/Contact';
import { LoginPage } from '@/pages/landing/LoginPage';

// Lazy load all route components for code splitting
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const InventoryPage = lazy(() => import('@/features/inventory/pages/InventoryPage').then(m => ({ default: m.InventoryPage })));
const POSPage = lazy(() => import('@/features/pos/pages/POSPage').then(m => ({ default: m.POSPage })));
const WorkOrdersPage = lazy(() => import('@/features/work-orders/pages/WorkOrdersPage').then(m => ({ default: m.WorkOrdersPage })));
const AccountingPage = lazy(() => import('@/features/accounting/pages/AccountingPage').then(m => ({ default: m.AccountingPage })));
const BookkeepingPage = lazy(() => import('@/features/bookkeeping/pages/BookkeepingPage').then(m => ({ default: m.BookkeepingPage })));
const WebshopPage = lazy(() => import('@/features/webshop/pages/WebshopPage').then(m => ({ default: m.WebshopPage })));
const CRMPage = lazy(() => import('@/features/crm/pages/CRMPage').then(m => ({ default: m.CRMPage })));
const HRMPage = lazy(() => import('@/features/hrm/pages/HRMPage').then(m => ({ default: m.HRMPage })));
const PlanningPage = lazy(() => import('@/features/planning/pages/PlanningPage').then(m => ({ default: m.PlanningPage })));
const ReportsPage = lazy(() => import('@/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <>
      {user && (
        <AnalyticsTracker
          userId={user.id || 'anonymous'}
          userRole={user.role || 'user'}
        />
      )}
      {children}
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

const AppContent: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="pos" element={<POSPage />} />
          <Route path="work-orders" element={<WorkOrdersPage />} />
          <Route path="accounting" element={<AccountingPage />} />
          <Route path="bookkeeping" element={<BookkeepingPage />} />
          <Route path="webshop" element={<WebshopPage />} />
          <Route path="crm" element={<CRMPage />} />
          <Route path="hrm" element={<HRMPage />} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Redirect old dashboard routes */}
        <Route path="/inventory" element={<Navigate to="/dashboard/inventory" replace />} />
        <Route path="/pos" element={<Navigate to="/dashboard/pos" replace />} />
        <Route path="/work-orders" element={<Navigate to="/dashboard/work-orders" replace />} />
        <Route path="/accounting" element={<Navigate to="/dashboard/accounting" replace />} />
        <Route path="/bookkeeping" element={<Navigate to="/dashboard/bookkeeping" replace />} />
        <Route path="/webshop" element={<Navigate to="/dashboard/webshop" replace />} />
        <Route path="/crm" element={<Navigate to="/dashboard/crm" replace />} />
        <Route path="/hrm" element={<Navigate to="/dashboard/hrm" replace />} />
        <Route path="/planning" element={<Navigate to="/dashboard/planning" replace />} />
        <Route path="/reports" element={<Navigate to="/dashboard/reports" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter basename="/bedrijfsbeheer">
              <AppContent />
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
