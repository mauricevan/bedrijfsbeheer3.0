// Inventory routes
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import * as inventoryController from '../../controllers/inventoryController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', inventoryController.listInventory);
router.post('/', inventoryController.createInventoryItem);
router.get('/:id', inventoryController.getInventoryItem);
router.put('/:id', inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);

export default router;
