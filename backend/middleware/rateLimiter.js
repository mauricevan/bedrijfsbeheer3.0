// Rate limiting middleware
// Supports both in-memory (development) and Redis (production) storage

// ============================================
// IN-MEMORY RATE LIMITER
// ============================================
// Simple in-memory rate limiter
// WARNING: Not suitable for production with multiple server instances
// Use Redis-based limiter for production deployments

class InMemoryRateLimiter {
  constructor(windowMs, maxRequests) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = new Map(); // Map<ip, Array<timestamp>>
  }

  /**
   * Clean up old requests outside the time window
   */
  cleanup(ip) {
    const now = Date.now();
    const requests = this.requests.get(ip) || [];
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    if (validRequests.length > 0) {
      this.requests.set(ip, validRequests);
    } else {
      this.requests.delete(ip);
    }
  }

  /**
   * Check if request should be rate limited
   */
  async isRateLimited(ip) {
    this.cleanup(ip);

    const requests = this.requests.get(ip) || [];
    return requests.length >= this.maxRequests;
  }

  /**
   * Record a request
   */
  async recordRequest(ip) {
    const requests = this.requests.get(ip) || [];
    requests.push(Date.now());
    this.requests.set(ip, requests);
  }

  /**
   * Get remaining requests for IP
   */
  async getRemaining(ip) {
    this.cleanup(ip);
    const requests = this.requests.get(ip) || [];
    return Math.max(0, this.maxRequests - requests.length);
  }

  /**
   * Get reset time for IP
   */
  async getResetTime(ip) {
    const requests = this.requests.get(ip) || [];
    if (requests.length === 0) return Date.now();
    return requests[0] + this.windowMs;
  }
}

// ============================================
// REDIS RATE LIMITER
// ============================================
// Redis-based rate limiter for production deployments
// Supports multiple server instances and persistent storage

class RedisRateLimiter {
  constructor(redisClient, windowMs, maxRequests) {
    this.redis = redisClient;
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.windowSeconds = Math.ceil(windowMs / 1000);
  }

  /**
   * Get Redis key for IP
   */
  getKey(ip) {
    return `ratelimit:${ip}`;
  }

  /**
   * Check if request should be rate limited
   */
  async isRateLimited(ip) {
    try {
      const key = this.getKey(ip);
      const count = await this.redis.get(key);
      return count !== null && parseInt(count, 10) >= this.maxRequests;
    } catch (error) {
      console.error('Redis rate limit check failed:', error.message);
      // Fail open - allow request if Redis fails
      return false;
    }
  }

  /**
   * Record a request
   */
  async recordRequest(ip) {
    try {
      const key = this.getKey(ip);
      const count = await this.redis.incr(key);

      // Set expiry only on first request
      if (count === 1) {
        await this.redis.expire(key, this.windowSeconds);
      }
    } catch (error) {
      console.error('Redis rate limit record failed:', error.message);
      // Continue even if Redis fails
    }
  }

  /**
   * Get remaining requests for IP
   */
  async getRemaining(ip) {
    try {
      const key = this.getKey(ip);
      const count = await this.redis.get(key);
      const currentCount = count ? parseInt(count, 10) : 0;
      return Math.max(0, this.maxRequests - currentCount);
    } catch (error) {
      console.error('Redis get remaining failed:', error.message);
      return this.maxRequests; // Return max if Redis fails
    }
  }

  /**
   * Get reset time for IP
   */
  async getResetTime(ip) {
    try {
      const key = this.getKey(ip);
      const ttl = await this.redis.ttl(key);

      if (ttl > 0) {
        return Date.now() + (ttl * 1000);
      }
      return Date.now() + this.windowMs;
    } catch (error) {
      console.error('Redis get reset time failed:', error.message);
      return Date.now() + this.windowMs;
    }
  }
}

// ============================================
// REDIS CLIENT SETUP
// ============================================
let redisClient = null;
let redisAvailable = false;

/**
 * Initialize Redis client if REDIS_URL is provided
 */
async function initRedis() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log('ℹ️  No REDIS_URL configured - using in-memory rate limiting');
    console.log('   For production deployments, set REDIS_URL for distributed rate limiting');
    return null;
  }

  try {
    // Dynamically import Redis (only if needed)
    const { createClient } = await import('redis');

    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('❌ Redis connection failed after 10 retries - falling back to in-memory');
            redisAvailable = false;
            return new Error('Max retries reached');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
      redisAvailable = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected - using distributed rate limiting');
      redisAvailable = true;
    });

    redisClient.on('disconnect', () => {
      console.warn('⚠️  Redis disconnected - falling back to in-memory rate limiting');
      redisAvailable = false;
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.warn('⚠️  Redis initialization failed:', error.message);
    console.log('   Falling back to in-memory rate limiting');
    console.log('   To use Redis: npm install redis');
    return null;
  }
}

// Initialize Redis on module load (don't block startup)
initRedis().catch((err) => {
  console.warn('Redis initialization error:', err.message);
});

// ============================================
// RATE LIMITER MIDDLEWARE
// ============================================

/**
 * Create rate limiter middleware
 * Automatically uses Redis if available, falls back to in-memory
 *
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Max requests per window
 * @param {string} message - Error message
 * @returns {Function} Express middleware
 */
export const createRateLimiter = (
  windowMs = 15 * 60 * 1000, // 15 minutes
  maxRequests = 100,
  message = 'Te veel verzoeken, probeer het later opnieuw'
) => {
  // Create both limiters (Redis and in-memory fallback)
  let redisLimiter = null;
  const memoryLimiter = new InMemoryRateLimiter(windowMs, maxRequests);

  // Try to create Redis limiter if client is available
  if (redisClient && redisAvailable) {
    redisLimiter = new RedisRateLimiter(redisClient, windowMs, maxRequests);
  }

  return async (req, res, next) => {
    try {
      // Get client IP
      const ip = req.ip || req.connection.remoteAddress || 'unknown';

      // Choose limiter (prefer Redis if available)
      const limiter = (redisClient && redisAvailable && redisLimiter)
        ? redisLimiter
        : memoryLimiter;

      // Check if rate limited
      const isLimited = await limiter.isRateLimited(ip);

      if (isLimited) {
        const resetTime = new Date(await limiter.getResetTime(ip));

        return res.status(429).json({
          error: message,
          retryAfter: resetTime.toISOString(),
        });
      }

      // Record request
      await limiter.recordRequest(ip);

      // Add rate limit info to headers
      const remaining = await limiter.getRemaining(ip);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', await limiter.getResetTime(ip));

      next();
    } catch (error) {
      // If rate limiting fails, log error but allow request
      console.error('Rate limiter error:', error.message);
      next();
    }
  };
};

// Predefined rate limiters
export const strictRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  50, // 50 requests
  'Te veel verzoeken. Limiet: 50 per 15 minuten'
);

export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 login attempts
  'Te veel login pogingen. Probeer het over 15 minuten opnieuw'
);

export const apiRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'API limiet bereikt. Limiet: 100 requests per 15 minuten'
);

export const createActionRateLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // 10 creates per minute
  'Te veel create acties. Limiet: 10 per minuut'
);
