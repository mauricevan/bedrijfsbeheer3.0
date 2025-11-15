// Customer routes
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import * as customerController from '../../controllers/customerController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', customerController.listCustomers);
router.post('/', customerController.createCustomer);
router.get('/:id', customerController.getCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
