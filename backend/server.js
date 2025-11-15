// Bedrijfsbeheer 3.0 Backend Server
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/api/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// ============================================
// Middleware
// ============================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
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
  console.log('========================================');
  console.log(`🚀 Bedrijfsbeheer 3.0 Backend Running`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
  console.log(`📝 CORS: ${CORS_ORIGIN}`);
  console.log(`🔒 Rate Limit: 100 req/15min`);
  console.log(`📊 Database: ${process.env.DATABASE_URL.includes('postgresql') ? 'PostgreSQL' : 'SQLite'}`);
  console.log('========================================');
  console.log(`📚 Endpoints:`);
  console.log(`   /api/auth          - Authentication`);
  console.log(`   /api/quotes        - Offertes`);
  console.log(`   /api/invoices      - Facturen`);
  console.log(`   /api/work-orders   - Werkbonnen`);
  console.log(`   /api/customers     - Klanten`);
  console.log(`   /api/inventory     - Voorraad`);
  console.log(`   /api/employees     - Medewerkers`);
  console.log(`   /api/transactions  - Transacties`);
  console.log('========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
