// Authentication routes
import express from 'express';
import { register, login, getProfile, logout } from '../../controllers/authController.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;
