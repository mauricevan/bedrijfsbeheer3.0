// Main API router
import express from 'express';
import authRoutes from './auth.js';
import quoteRoutes from './quotes.js';
import customerRoutes from './customers.js';
import inventoryRoutes from './inventory.js';
import invoiceRoutes from './invoices.js';
import workOrderRoutes from './workOrders.js';
import employeeRoutes from './employees.js';
import transactionRoutes from './transactions.js';

const router = express.Router();

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/quotes', quoteRoutes);
router.use('/customers', customerRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/work-orders', workOrderRoutes);
router.use('/employees', employeeRoutes);
router.use('/transactions', transactionRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Bedrijfsbeheer 3.0 API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      quotes: '/api/quotes',
      invoices: '/api/invoices',
      workOrders: '/api/work-orders',
      customers: '/api/customers',
      inventory: '/api/inventory',
      employees: '/api/employees',
      transactions: '/api/transactions',
      health: '/api/health',
    },
  });
});

export default router;
