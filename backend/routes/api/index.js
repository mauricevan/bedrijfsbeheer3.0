// Main API router
import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './auth.js';
import quoteRoutes from './quotes.js';
import customerRoutes from './customers.js';
import inventoryRoutes from './inventory.js';
import invoiceRoutes from './invoices.js';
import workOrderRoutes from './workOrders.js';
import employeeRoutes from './employees.js';
import transactionRoutes from './transactions.js';

const router = express.Router();
const prisma = new PrismaClient();

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/quotes', quoteRoutes);
router.use('/customers', customerRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/work-orders', workOrderRoutes);
router.use('/employees', employeeRoutes);
router.use('/transactions', transactionRoutes);

// Health check with database connectivity
router.get('/health', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    database: {
      status: 'unknown',
      responseTime: null,
    },
  };

  try {
    // Check database connectivity
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const endTime = Date.now();

    healthCheck.database.status = 'connected';
    healthCheck.database.responseTime = `${endTime - startTime}ms`;

    // Return 200 OK if database is connected
    res.status(200).json(healthCheck);
  } catch (error) {
    // Database connection failed
    healthCheck.status = 'degraded';
    healthCheck.database.status = 'disconnected';
    healthCheck.database.error = error.message;

    // Return 503 Service Unavailable if database is down
    res.status(503).json(healthCheck);
  }
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
