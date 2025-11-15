// Main API router
import express from 'express';
import authRoutes from './auth.js';
import quoteRoutes from './quotes.js';
import customerRoutes from './customers.js';
import inventoryRoutes from './inventory.js';

const router = express.Router();

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/quotes', quoteRoutes);
router.use('/customers', customerRoutes);
router.use('/inventory', inventoryRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;
