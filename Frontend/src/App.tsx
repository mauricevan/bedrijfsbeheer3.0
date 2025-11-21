import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/features/auth/hooks/useAuth';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { MainLayout } from '@/layouts/MainLayout';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { InventoryPage } from '@/features/inventory/pages/InventoryPage';
import { POSPage } from '@/features/pos/pages/POSPage';
import { WorkOrdersPage } from '@/features/work-orders/pages/WorkOrdersPage';
import { AccountingPage } from '@/features/accounting/pages/AccountingPage';
import { BookkeepingPage } from '@/features/bookkeeping/pages/BookkeepingPage';
import { WebshopPage } from '@/features/webshop/pages/WebshopPage';
import { CRMPage } from '@/features/crm/pages/CRMPage';
import { HRMPage } from '@/features/hrm/pages/HRMPage';
import { PlanningPage } from '@/features/planning/pages/PlanningPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';

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
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
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
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
