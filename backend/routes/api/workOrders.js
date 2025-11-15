// WorkOrder routes
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import * as workOrderController from '../../controllers/workOrderController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List & Create
router.get('/', workOrderController.listWorkOrders);
router.post('/', workOrderController.createWorkOrder);

// Single resource
router.get('/:id', workOrderController.getWorkOrder);
router.put('/:id', workOrderController.updateWorkOrder);
router.delete('/:id', workOrderController.deleteWorkOrder);

// Actions
router.post('/:id/start', workOrderController.startWorkOrder);
router.post('/:id/complete', workOrderController.completeWorkOrder);

export default router;
