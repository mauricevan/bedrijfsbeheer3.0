// Quote routes
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import * as quoteController from '../../controllers/quoteController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List & Create
router.get('/', quoteController.listQuotes);
router.post('/', quoteController.createQuote);

// Single resource
router.get('/:id', quoteController.getQuote);
router.put('/:id', quoteController.updateQuote);
router.delete('/:id', quoteController.deleteQuote);

export default router;
