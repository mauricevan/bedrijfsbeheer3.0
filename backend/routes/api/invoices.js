// Invoice routes
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import * as invoiceController from '../../controllers/invoiceController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List & Create
router.get('/', invoiceController.listInvoices);
router.post('/', invoiceController.createInvoice);

// Single resource
router.get('/:id', invoiceController.getInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

// Mark as paid
router.post('/:id/pay', invoiceController.markAsPaid);

export default router;
