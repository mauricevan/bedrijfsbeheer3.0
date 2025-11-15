// Employee routes
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { requireAdmin } from '../../middleware/authorize.js';
import * as employeeController from '../../controllers/employeeController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List (all users can view)
router.get('/', employeeController.listEmployees);
router.get('/:id', employeeController.getEmployee);

// Create, update, delete require admin
router.post('/', requireAdmin, employeeController.createEmployee);
router.put('/:id', requireAdmin, employeeController.updateEmployee);
router.delete('/:id', requireAdmin, employeeController.deleteEmployee);

// Terminate employee
router.post('/:id/terminate', requireAdmin, employeeController.terminateEmployee);

export default router;
