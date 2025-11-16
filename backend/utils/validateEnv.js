// Environment Variable Validation
// Validates required environment variables at startup

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required variable is missing
 */
export const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Required in all environments
  const required = [
    'DATABASE_URL',
  ];

  // Required only in production
  const productionOnly = [
    'JWT_SECRET',
    'CORS_ORIGIN',
  ];

  // Recommended but optional
  const recommended = [
    'PORT',
    'JWT_EXPIRY',
  ];

  const missing = [];
  const warnings = [];

  // Check required variables
  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Check production-only requirements
  if (isProduction) {
    for (const varName of productionOnly) {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    }
  }

  // Check recommended variables
  for (const varName of recommended) {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  }

  // Throw error if any required variables are missing
  if (missing.length > 0) {
    const errorMessage = [
      '🚨 ENVIRONMENT VALIDATION FAILED',
      '',
      'Missing required environment variables:',
      ...missing.map(v => `  - ${v}`),
      '',
      'Please create a .env file with all required variables.',
      'See .env.example for reference.',
      '',
    ].join('\n');

    throw new Error(errorMessage);
  }

  // Log warnings for recommended variables
  if (warnings.length > 0) {
    console.warn('⚠️  Missing recommended environment variables:');
    warnings.forEach(v => console.warn(`   - ${v} (using default)`));
    console.warn('');
  }

  // Additional validations
  if (isProduction) {
    // Validate JWT_SECRET is not the default
    if (process.env.JWT_SECRET?.includes('fallback') ||
        process.env.JWT_SECRET?.includes('change-me')) {
      throw new Error(
        '🚨 SECURITY ERROR: JWT_SECRET appears to be a default value. ' +
        'Generate a secure secret with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
      );
    }

    // Validate JWT_SECRET is long enough
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      throw new Error(
        '🚨 SECURITY ERROR: JWT_SECRET must be at least 32 characters long. ' +
        'Generate a secure secret with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
      );
    }

    // Validate DATABASE_URL is PostgreSQL in production
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('postgresql')) {
      console.warn('⚠️  WARNING: Production should use PostgreSQL, not SQLite');
    }

    // Validate CORS_ORIGIN is not localhost in production
    if (process.env.CORS_ORIGIN?.includes('localhost')) {
      console.warn('⚠️  WARNING: CORS_ORIGIN should not be localhost in production');
    }
  }

  // Success message
  console.log('✅ Environment validation passed');
  if (isProduction) {
    console.log('🔒 Production environment detected - all security checks passed');
  }
};

/**
 * Get environment info for logging
 * @returns {Object} Environment information
 */
export const getEnvInfo = () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '3001',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    database: process.env.DATABASE_URL?.includes('postgresql') ? 'PostgreSQL' : 'SQLite',
    jwtConfigured: !!process.env.JWT_SECRET,
    isProduction: process.env.NODE_ENV === 'production',
  };
};
