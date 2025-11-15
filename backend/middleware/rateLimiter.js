// Rate limiting middleware
// Simple in-memory rate limiter (for production use Redis-based limiter)

class RateLimiter {
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
  isRateLimited(ip) {
    this.cleanup(ip);

    const requests = this.requests.get(ip) || [];
    return requests.length >= this.maxRequests;
  }

  /**
   * Record a request
   */
  recordRequest(ip) {
    const requests = this.requests.get(ip) || [];
    requests.push(Date.now());
    this.requests.set(ip, requests);
  }

  /**
   * Get remaining requests for IP
   */
  getRemaining(ip) {
    this.cleanup(ip);
    const requests = this.requests.get(ip) || [];
    return Math.max(0, this.maxRequests - requests.length);
  }

  /**
   * Get reset time for IP
   */
  getResetTime(ip) {
    const requests = this.requests.get(ip) || [];
    if (requests.length === 0) return Date.now();
    return requests[0] + this.windowMs;
  }
}

/**
 * Create rate limiter middleware
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Max requests per window
 * @param {string} message - Error message
 */
export const createRateLimiter = (
  windowMs = 15 * 60 * 1000, // 15 minutes
  maxRequests = 100,
  message = 'Te veel verzoeken, probeer het later opnieuw'
) => {
  const limiter = new RateLimiter(windowMs, maxRequests);

  return (req, res, next) => {
    // Get client IP
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    // Check if rate limited
    if (limiter.isRateLimited(ip)) {
      const resetTime = new Date(limiter.getResetTime(ip));

      return res.status(429).json({
        error: message,
        retryAfter: resetTime.toISOString(),
      });
    }

    // Record request
    limiter.recordRequest(ip);

    // Add rate limit info to headers
    const remaining = limiter.getRemaining(ip);
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', limiter.getResetTime(ip));

    next();
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
