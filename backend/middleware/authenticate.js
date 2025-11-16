// Authentication middleware
import { verifyToken } from '../utils/jwt.js';

/**
 * Authenticate user via JWT token
 * Supports both HttpOnly cookies (preferred) and Authorization header (backward compatibility)
 * Adds user object to req.user if valid
 */
export const authenticate = (req, res, next) => {
  try {
    let token = null;

    // Try to get token from cookie first (preferred method)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fall back to Authorization header for backward compatibility
    else {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        error: 'Geen toegang - login vereist',
      });
    }

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
 * Supports both HttpOnly cookies and Authorization header
 */
export const optionalAuth = (req, res, next) => {
  try {
    let token = null;

    // Try cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fall back to Authorization header
    else {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Silently ignore auth errors for optional auth
    next();
  }
};
