// Transaction routes
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { requireAdmin } from '../../middleware/authorize.js';
import * as transactionController from '../../controllers/transactionController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Summary endpoint (before :id to avoid route conflicts)
router.get('/summary', transactionController.getTransactionSummary);

// List & Create
router.get('/', transactionController.listTransactions);
router.post('/', requireAdmin, transactionController.createTransaction);

// Single resource
router.get('/:id', transactionController.getTransaction);
router.put('/:id', requireAdmin, transactionController.updateTransaction);
router.delete('/:id', requireAdmin, transactionController.deleteTransaction);

export default router;
