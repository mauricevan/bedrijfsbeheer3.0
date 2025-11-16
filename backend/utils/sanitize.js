// Input sanitization utility
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize a single string value
 * Removes potentially dangerous HTML/JavaScript
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove HTML tags and scripts
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true, // Keep text content
  }).trim();
};

/**
 * Sanitize an object recursively
 * Processes all string values in the object
 */
export const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Middleware to sanitize request body
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

/**
 * Middleware to sanitize query parameters
 */
export const sanitizeQuery = (req, res, next) => {
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  next();
};

/**
 * Middleware to sanitize both body and query
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  next();
};
