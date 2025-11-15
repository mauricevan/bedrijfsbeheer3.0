// Global error handler middleware
import { Prisma } from '@prisma/client';

/**
 * Global error handling middleware
 * Catches all errors and returns appropriate responses
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Dit record bestaat al',
        field: err.meta?.target,
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Record niet gevonden',
      });
    }
    if (err.code === 'P2003') {
      return res.status(400).json({
        error: 'Kan record niet verwijderen - er zijn gerelateerde records',
      });
    }
  }

  // Validation errors (from Joi)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validatie mislukt',
      details: err.details,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Ongeldige token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token verlopen - log opnieuw in',
    });
  }

  // Default error (500)
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Er is een onverwachte fout opgetreden',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: `Route niet gevonden: ${req.method} ${req.path}`,
  });
};
