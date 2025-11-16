// Bedrijfsbeheer 3.0 Backend Server
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/api/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { validateEnv, getEnvInfo } from './utils/validateEnv.js';
import { sanitizeInput } from './utils/sanitize.js';
import { auditMiddleware } from './utils/audit.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

// Validate environment variables (will throw error if missing required vars)
validateEnv();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const HTTPS_ONLY = process.env.HTTPS_ONLY === 'true' || process.env.NODE_ENV === 'production';

// ============================================
// Middleware
// ============================================

// Trust proxy (required for proper IP detection behind reverse proxy)
app.set('trust proxy', 1);

// Enhanced security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));

// HTTPS enforcement (production only)
if (HTTPS_ONLY) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

// CORS configuration
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true, // Required for cookies
}));

// Cookie parser (for HttpOnly JWT cookies)
app.use(cookieParser());

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization (XSS protection)
app.use(sanitizeInput);

// Audit logging middleware
app.use(auditMiddleware);

// Request logging with Winston
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Rate limiting (apply to all API routes)
app.use('/api', apiRateLimiter);

// ============================================
// Routes
// ============================================

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Bedrijfsbeheer 3.0 API',
    version: '1.0.0',
    status: 'running',
    documentation: 'See backend/README.md',
    endpoints: {
      info: 'GET /api',
      health: 'GET /api/health',
      auth: 'GET/POST /api/auth/*',
      quotes: 'GET/POST/PUT/DELETE /api/quotes',
      invoices: 'GET/POST/PUT/DELETE /api/invoices',
      workOrders: 'GET/POST/PUT/DELETE /api/work-orders',
      customers: 'GET/POST/PUT/DELETE /api/customers',
      inventory: 'GET/POST/PUT/DELETE /api/inventory',
      employees: 'GET/POST/PUT/DELETE /api/employees',
      transactions: 'GET/POST/PUT/DELETE /api/transactions',
    },
    features: {
      authentication: 'JWT tokens',
      authorization: 'Role-based (admin/user)',
      security: 'bcrypt, helmet, CORS',
      rateLimiting: '100 requests per 15 minutes',
      database: 'SQLite (dev) / PostgreSQL (prod)',
    },
  });
});

// ============================================
// Error Handling
// ============================================

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  const envInfo = getEnvInfo();

  logger.info('========================================');
  logger.info(`🚀 Bedrijfsbeheer 3.0 Backend Running`);
  logger.info(`📍 Port: ${envInfo.port}`);
  logger.info(`🌍 Environment: ${envInfo.nodeEnv}`);
  logger.info(`🔗 API: http${HTTPS_ONLY ? 's' : ''}://localhost:${PORT}/api`);
  logger.info(`❤️  Health: http${HTTPS_ONLY ? 's' : ''}://localhost:${PORT}/api/health`);
  logger.info(`📝 CORS: ${envInfo.corsOrigin}`);
  logger.info(`🔒 Rate Limit: 100 req/15min`);
  logger.info(`📊 Database: ${envInfo.database}`);
  logger.info(`🔑 JWT: ${envInfo.jwtConfigured ? 'HttpOnly Cookies (Secure)' : 'Using default (dev only)'}`);
  logger.info(`🔐 HTTPS: ${HTTPS_ONLY ? 'Enforced' : 'Disabled (dev)'}`);
  logger.info(`🛡️  Security: Helmet + HSTS + Input Sanitization`);
  logger.info(`📝 Audit Logging: Enabled`);
  logger.info('========================================');
  logger.info(`📚 Endpoints:`);
  logger.info(`   /api/auth          - Authentication`);
  logger.info(`   /api/quotes        - Offertes`);
  logger.info(`   /api/invoices      - Facturen`);
  logger.info(`   /api/work-orders   - Werkbonnen`);
  logger.info(`   /api/customers     - Klanten`);
  logger.info(`   /api/inventory     - Voorraad`);
  logger.info(`   /api/employees     - Medewerkers`);
  logger.info(`   /api/transactions  - Transacties`);
  logger.info('========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
