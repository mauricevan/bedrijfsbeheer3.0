import React, { useState, useMemo, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { AdminSettings } from "./components/AdminSettings";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import { ALL_MODULES } from "./constants";
import { useAuth } from "./hooks/useAuth";
import {
  ModuleKey,
  InventoryItem,
  InventoryCategory,
  Product,
  Sale,
  WorkOrder,
  Customer,
  Employee,
  Transaction,
  Quote,
  Invoice,
  Task,
  CalendarEvent,
  Notification,
  User,
  Lead,
  Interaction,
  WebshopProduct,
  Email,
  EmailTemplate,
} from "./types";
import {
  MOCK_PRODUCTS,
  MOCK_SALES,
  MOCK_TASKS,
  MOCK_CALENDAR_EVENTS,
  MOCK_NOTIFICATIONS,
  MOCK_LEADS,
  MOCK_INTERACTIONS,
  MOCK_EMAILS,
  MOCK_EMAIL_TEMPLATES,
} from "./data/mockData";

// Import functional pages
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { POS } from "./pages/POS";
import { WorkOrders } from "./pages/WorkOrders";
import { Accounting } from "./pages/Accounting";
import Bookkeeping from "./pages/Bookkeeping";
import { CRM } from "./pages/CRM";
import { HRM } from "./pages/HRM";
import { Reports } from "./pages/Reports";
import { Planning } from "./pages/Planning";
import { Webshop } from "./pages/Webshop";
import { trackNavigation, trackAction } from "./utils/analytics";

// API Services
import { quoteService } from "./services/quoteService";
import { customerService } from "./services/customerService";
import { inventoryService } from "./services/inventoryService";
import { invoiceService } from "./services/invoiceService";
import { workOrderService } from "./services/workOrderService";
import { employeeService } from "./services/employeeService";
import { transactionService } from "./services/transactionService";

// Default all modules to active
const initialModulesState = ALL_MODULES.reduce((acc, module) => {
  acc[module.id] = true;
  return acc;
}, {} as Record<ModuleKey, boolean>);

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isLoading: authLoading, login, logout } = useAuth();

  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeModules, setActiveModules] =
    useState<Record<ModuleKey, boolean>>(initialModulesState);

  // API-backed state (fetched from backend)
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Local state (still using mock data for non-core features)
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [calendarEvents, setCalendarEvents] =
    useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [interactions, setInteractions] =
    useState<Interaction[]>(MOCK_INTERACTIONS);
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(MOCK_EMAIL_TEMPLATES);
  const [webshopProducts, setWebshopProducts] = useState<WebshopProduct[]>([]);

  // Loading states
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Fetch data from backend when logged in
  useEffect(() => {
    if (currentUser) {
      loadAllData();
    }
  }, [currentUser]);

  const loadAllData = async () => {
    setIsLoadingData(true);
    setDataError(null);
    try {
      // Fetch all data in parallel
      const [
        quotesRes,
        customersRes,
        inventoryRes,
        invoicesRes,
        workOrdersRes,
        employeesRes,
        transactionsRes,
      ] = await Promise.all([
        quoteService.getQuotes({ limit: 100 }).catch(() => ({ data: [] })),
        customerService.getCustomers({ limit: 100 }).catch(() => ({ data: [] })),
        inventoryService.getInventory({ limit: 100 }).catch(() => ({ data: [] })),
        invoiceService.getInvoices({ limit: 100 }).catch(() => ({ data: [] })),
        workOrderService.getWorkOrders({ limit: 100 }).catch(() => ({ data: [] })),
        employeeService.getEmployees({ limit: 100 }).catch(() => ({ data: [] })),
        transactionService.getTransactions({ limit: 100 }).catch(() => ({ data: [] })),
      ]);

      setQuotes(quotesRes.data || []);
      setCustomers(customersRes.data || []);
      setInventory(inventoryRes.data || []);
      setInvoices(invoicesRes.data || []);
      setWorkOrders(workOrdersRes.data || []);
      setEmployees(employeesRes.data || []);
      setTransactions(transactionsRes.data?.data || transactionsRes.data || []);

      console.log('✅ Data geladen van backend:', {
        quotes: quotesRes.data?.length,
        customers: customersRes.data?.length,
        inventory: inventoryRes.data?.length,
        invoices: invoicesRes.data?.length,
        workOrders: workOrdersRes.data?.length,
        employees: employeesRes.data?.length,
        transactions: transactionsRes.data?.length,
      });
    } catch (error: any) {
      console.error('❌ Fout bij laden data:', error);
      setDataError(error.message || 'Fout bij laden van gegevens');
    } finally {
      setIsLoadingData(false);
    }
  };

  // IMPORTANT: useMemo must be called unconditionally (before any early returns)
  const visibleModules = useMemo(() => {
    return ALL_MODULES.filter((module) => activeModules[module.id]);
  }, [activeModules]);

  // Handle login
  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await login(credentials.email, credentials.password);
    } catch (error: any) {
      throw error; // Login component will handle the error
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    // Clear all state
    setInventory([]);
    setCustomers([]);
    setEmployees([]);
    setQuotes([]);
    setInvoices([]);
    setWorkOrders([]);
    setTransactions([]);
  };

  // If not logged in, show login screen
  if (!currentUser) {
    return <Login onLogin={handleLogin} isLoading={authLoading} />;
  }

  // Show loading screen while fetching initial data
  if (isLoadingData && inventory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Gegevens laden van backend...</p>
        </div>
      </div>
    );
  }

  // Show error if data loading failed
  if (dataError && inventory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Fout bij laden</h2>
            <p className="text-sm text-gray-600 mb-4">{dataError}</p>
            <p className="text-xs text-gray-500 mb-4">
              Zorg ervoor dat de backend draait op http://localhost:3001
            </p>
            <button
              onClick={loadAllData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              Opnieuw proberen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Navigation handler for unified search
  const handleNavigate = (module: ModuleKey, id: string) => {
    navigate(`/${module}`);
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("highlight-item", { detail: { id, type: module } })
      );
    }, 100);
  };

  const moduleRoutes = {
    [ModuleKey.DASHBOARD]: (
      <Dashboard
        inventory={inventory}
        sales={sales}
        workOrders={workOrders}
        notifications={notifications}
        setNotifications={setNotifications}
        customers={customers}
        onNavigateToAccounting={() => navigate(`/${ModuleKey.ACCOUNTING}`)}
        employees={employees}
        onWorkOrderCreated={async (workOrder) => {
          try {
            const created = await workOrderService.createWorkOrder(workOrder as any);
            setWorkOrders([...workOrders, created]);
          } catch (err) {
            console.error('Fout bij aanmaken werkbon:', err);
          }
        }}
        onQuoteCreated={async (quote) => {
          try {
            const created = await quoteService.createQuote(quote as any);
            setQuotes([...quotes, created]);
          } catch (err) {
            console.error('Fout bij aanmaken offerte:', err);
          }
        }}
      />
    ),
    [ModuleKey.INVENTORY]: (
      <Inventory
        inventory={inventory}
        setInventory={setInventory}
        isAdmin={currentUser.isAdmin}
        webshopProducts={webshopProducts}
        setWebshopProducts={setWebshopProducts}
        categories={categories}
        setCategories={setCategories}
      />
    ),
    [ModuleKey.POS]: (
      <POS
        products={products}
        inventory={inventory}
        setInventory={setInventory}
        sales={sales}
        setSales={setSales}
        setTransactions={setTransactions}
        customers={customers}
        invoices={invoices}
        setInvoices={setInvoices}
        categories={categories}
      />
    ),
    [ModuleKey.WORK_ORDERS]: (
      <WorkOrders
        workOrders={workOrders}
        setWorkOrders={setWorkOrders}
        employees={employees}
        customers={customers}
        inventory={inventory}
        setInventory={setInventory}
        currentUser={currentUser}
        isAdmin={currentUser.isAdmin}
        quotes={quotes}
        setQuotes={setQuotes}
        invoices={invoices}
        setInvoices={setInvoices}
        categories={categories}
      />
    ),
    [ModuleKey.ACCOUNTING]: (
      <Accounting
        quotes={quotes}
        setQuotes={setQuotes}
        invoices={invoices}
        setInvoices={setInvoices}
        customers={customers}
        setCustomers={setCustomers}
        employees={employees}
        inventory={inventory}
        currentUser={currentUser}
        categories={categories}
      />
    ),
    [ModuleKey.BOOKKEEPING]: (
      <Bookkeeping
        transactions={transactions}
        setTransactions={setTransactions}
        invoices={invoices}
        sales={sales}
        isAdmin={currentUser.isAdmin}
      />
    ),
    [ModuleKey.CRM]: (
      <CRM
        customers={customers}
        setCustomers={setCustomers}
        leads={leads}
        setLeads={setLeads}
        interactions={interactions}
        setInteractions={setInteractions}
        quotes={quotes}
        invoices={invoices}
        employees={employees}
        currentUser={currentUser}
      />
    ),
    [ModuleKey.HRM]: (
      <HRM
        employees={employees}
        setEmployees={setEmployees}
        isAdmin={currentUser.isAdmin}
      />
    ),
    [ModuleKey.REPORTS]: (
      <Reports
        sales={sales}
        inventory={inventory}
        workOrders={workOrders}
        customers={customers}
        transactions={transactions}
        invoices={invoices}
        quotes={quotes}
        employees={employees}
      />
    ),
    [ModuleKey.PLANNING]: (
      <Planning
        tasks={tasks}
        setTasks={setTasks}
        calendarEvents={calendarEvents}
        setCalendarEvents={setCalendarEvents}
        workOrders={workOrders}
        setWorkOrders={setWorkOrders}
        employees={employees}
        currentUser={currentUser}
      />
    ),
    [ModuleKey.WEBSHOP]: (
      <Webshop
        webshopProducts={webshopProducts}
        setWebshopProducts={setWebshopProducts}
        inventory={inventory}
        categories={categories}
        isAdmin={currentUser.isAdmin}
      />
    ),
  };

  return (
    <div className="app h-screen flex overflow-hidden bg-gray-50">
      <AnalyticsTracker />

      {/* Sidebar */}
      <Sidebar
        modules={visibleModules}
        currentUser={currentUser}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          onMobileMenuClick={() => setIsMobileSidebarOpen(true)}
          searchData={{
            inventory,
            customers,
            workOrders,
            quotes,
            invoices,
            employees,
          }}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {visibleModules.map((module) => (
              <Route
                key={module.id}
                path={`/${module.id}`}
                element={moduleRoutes[module.id]}
              />
            ))}

            <Route
              path="/settings"
              element={
                <AdminSettings
                  activeModules={activeModules}
                  onToggleModule={(moduleKey) =>
                    setActiveModules((prev) => ({
                      ...prev,
                      [moduleKey]: !prev[moduleKey],
                    }))
                  }
                  isAdmin={currentUser.isAdmin}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
