// Audit logging utility
import prisma from '../config/database.js';
import logger from './logger.js';

/**
 * Log an audit event
 * @param {Object} params - Audit log parameters
 * @param {string} params.userId - User ID who performed the action
 * @param {string} params.userName - User name
 * @param {string} params.action - Action performed (create, update, delete)
 * @param {string} params.resource - Resource type (users, quotes, invoices, etc.)
 * @param {string} params.resourceId - Resource ID
 * @param {Object} params.changes - Changes made (will be JSON stringified)
 * @param {string} params.ipAddress - IP address of requester
 * @param {string} params.userAgent - User agent string
 */
export const logAudit = async ({
  userId,
  userName,
  action,
  resource,
  resourceId,
  changes = null,
  ipAddress = null,
  userAgent = null,
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        userName,
        action,
        resource,
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
      },
    });

    logger.info(`Audit: ${action} ${resource} ${resourceId} by ${userName || userId}`);
  } catch (error) {
    // Don't fail the main operation if audit logging fails
    logger.error('Failed to create audit log:', error);
  }
};

/**
 * Middleware to add audit logging helper to request
 */
export const auditMiddleware = (req, res, next) => {
  // Add audit logging helper to request
  req.audit = (action, resource, resourceId, changes = null) => {
    const userId = req.user?.id || null;
    const userName = req.user?.name || req.user?.email || null;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    return logAudit({
      userId,
      userName,
      action,
      resource,
      resourceId,
      changes,
      ipAddress,
      userAgent,
    });
  };

  next();
};

/**
 * Get audit logs with pagination
 * @param {Object} filters - Filter options
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 */
export const getAuditLogs = async (filters = {}, page = 1, limit = 50) => {
  const where = {};

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.resource) {
    where.resource = filters.resource;
  }

  if (filters.action) {
    where.action = filters.action;
  }

  if (filters.resourceId) {
    where.resourceId = filters.resourceId;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    data: logs.map(log => ({
      ...log,
      changes: log.changes ? JSON.parse(log.changes) : null,
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
