// Authentication middleware
import { verifyToken } from '../utils/jwt.js';

/**
 * Authenticate user via JWT token
 * Adds user object to req.user if valid
 */
export const authenticate = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Geen toegang - login vereist',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode token
    const decoded = verifyToken(token);

    // Add user to request
    req.user = decoded; // { id, email, isAdmin }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token verlopen - login opnieuw',
      });
    }
    return res.status(401).json({
      error: 'Ongeldige token',
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for routes that work both with/without auth
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Silently ignore auth errors for optional auth
    next();
  }
};
