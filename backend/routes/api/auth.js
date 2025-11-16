// Authentication routes
import express from 'express';
import { register, login, getProfile, logout } from '../../controllers/authController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

// Public routes with strict rate limiting
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);

// Protected routes
router.get('/me', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;
