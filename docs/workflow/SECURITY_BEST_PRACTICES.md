# Security Best Practices
**Versie:** 1.0.0
**Laatst bijgewerkt:** November 2024
**Bron:** Geëxtraheerd uit bedrijfsbeheer2.0 project

---

## 📋 Inhoudsopgave

1. [Authentication & Authorization](#authentication--authorization)
2. [Password Security](#password-security)
3. [Input Validation](#input-validation)
4. [XSS Prevention](#xss-prevention)
5. [CSRF Protection](#csrf-protection)
6. [Data Storage](#data-storage)

---

## 🔐 Authentication & Authorization

### ⚠️ DEVELOPMENT vs PRODUCTION

**IMPORTANT:** Never use plain text passwords in production!

### ❌ Development/Demo (UNSAFE)

```typescript
// ❌ UNSAFE - Only for development!
interface UserDev {
  id: string;
  email: string;
  password: string;  // Plain text - DANGEROUS!
  role: 'admin' | 'user';
}

const loginDev = (email: string, password: string) => {
  const user = users.find(u => u.email === email);
  if (!user || user.password !== password) {
    return null;
  }
  return user;
};
```

### ✅ Production (SAFE)

```typescript
// ✅ SAFE - Production implementation
import bcrypt from 'bcrypt';

interface User {
  id: string;
  email: string;
  passwordHash: string;      // Hashed password
  passwordSalt: string;       // Unique salt
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

const login = async (email: string, password: string) => {
  try {
    // 1. Find user
    const user = await db.users.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      throw new Error('Invalid credentials');
    }

    // 2. Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      // Log failed attempt
      await logFailedLogin(email);
      throw new Error('Invalid credentials');
    }

    // 3. Generate JWT
    const token = generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // 4. Return token
    return { user, token };

  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
};
```

---

## 🔒 Password Security

### Password Hashing (bcrypt)

```typescript
import bcrypt from 'bcrypt';

// Hash password during registration
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;  // Cost factor (higher = more secure but slower)
  return await bcrypt.hash(password, saltRounds);
};

// Verify password during login
const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Example usage
const handleRegistration = async (email: string, password: string) => {
  // Hash password
  const passwordHash = await hashPassword(password);

  // Store user with hashed password
  const user = await db.users.create({
    email,
    passwordHash,  // Never store plain text!
    createdAt: new Date().toISOString()
  });

  return user;
};
```

### Password Requirements

```typescript
// Validate password strength
const validatePassword = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check against common passwords
  const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
```

---

## 🔐 Input Validation

### Validate All User Input

```typescript
import validator from 'validator';

// Email validation
const isValidEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

// Sanitize input
const sanitizeInput = (input: string): string => {
  return validator.escape(input);
};

// Form validation example
const validateFormData = (data: FormData): {
  valid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  // Email
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  // Name
  if (!data.name) {
    errors.name = 'Name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Sanitize all inputs
  if (data.name) {
    data.name = sanitizeInput(data.name);
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
```

### Server-Side Validation

```typescript
// ✅ GOOD - Validate on server
app.post('/api/users', async (req, res) => {
  // 1. Validate input
  const { valid, errors } = validateFormData(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  // 2. Sanitize
  const sanitizedData = {
    name: sanitizeInput(req.body.name),
    email: sanitizeInput(req.body.email)
  };

  // 3. Process
  const user = await db.users.create(sanitizedData);
  res.json(user);
});

// ❌ BAD - No validation
app.post('/api/users', async (req, res) => {
  const user = await db.users.create(req.body);  // DANGEROUS!
  res.json(user);
});
```

---

## 🛡️ XSS Prevention

### React Auto-Escaping

```tsx
// ✅ SAFE - React automatically escapes
const UserProfile = ({ user }: { user: User }) => {
  return <div>{user.name}</div>;  // Safe, auto-escaped
};

// ❌ DANGEROUS - dangerouslySetInnerHTML
const UserProfile = ({ user }: { user: User }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: user.bio }} />
    // UNSAFE! User could inject <script> tags
  );
};
```

### Sanitize HTML Content

```typescript
import DOMPurify from 'dompurify';

// ✅ SAFE - Sanitize HTML before rendering
const SafeHTML = ({ html }: { html: string }) => {
  const cleanHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });

  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};

// Usage
<SafeHTML html={userGeneratedContent} />
```

### Content Security Policy (CSP)

```typescript
// Set CSP headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:;"
  );
  next();
});
```

---

## 🔐 CSRF Protection

### Generate CSRF Token

```typescript
import crypto from 'crypto';

// Generate token
const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Store in session
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCSRFToken();
  }
  next();
});

// Include in forms
const LoginForm = () => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Get CSRF token from server
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token));
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="csrfToken" value={csrfToken} />
      {/* Other form fields */}
    </form>
  );
};
```

### Validate CSRF Token

```typescript
// Server-side validation
const validateCSRF = (req, res, next) => {
  const token = req.body.csrfToken || req.headers['x-csrf-token'];
  const sessionToken = req.session.csrfToken;

  if (!token || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

// Use in routes
app.post('/api/users', validateCSRF, async (req, res) => {
  // Process request
});
```

---

## 💾 Data Storage Security

### Secure Database Connection

```typescript
// PostgreSQL with SSL
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/ca-certificate.crt').toString()
  }
});
```

### Prevent SQL Injection

```typescript
// ✅ SAFE - Parameterized queries
const getUserByEmail = async (email: string) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// ❌ DANGEROUS - String concatenation
const getUserByEmail = async (email: string) => {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  // VULNERABLE TO SQL INJECTION!
  const result = await pool.query(query);
  return result.rows[0];
};
```

### Encrypt Sensitive Data

```typescript
import crypto from 'crypto';

// Encryption key (store in environment variable!)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const IV_LENGTH = 16;

// Encrypt data
const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Decrypt data
const decrypt = (text: string): string => {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift()!, 'hex');
  const encrypted = Buffer.from(parts.join(':'), 'hex');

  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

// Usage
const sensitiveData = encrypt('Secret information');
const originalData = decrypt(sensitiveData);
```

---

## 🔐 JWT Security

### Generate JWT

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '24h';

// Generate token
const generateJWT = (payload: {
  userId: string;
  email: string;
  role: string;
}): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'your-app-name',
    audience: 'your-app-users'
  });
};

// Verify token
const verifyJWT = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'your-app-name',
      audience: 'your-app-users'
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

### Authenticate Middleware

```typescript
// Middleware to verify JWT
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJWT(token);

    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Use in routes
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ data: 'Protected data', user: req.user });
});
```

---

## 🛡️ Rate Limiting

### Prevent Brute Force Attacks

```typescript
import rateLimit from 'express-rate-limit';

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to login route
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  // Login logic
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,  // 100 requests per 15 minutes
  message: 'Too many requests, please try again later'
});

app.use('/api/', apiLimiter);
```

---

## 🔒 Security Headers

### Helmet.js

```typescript
import helmet from 'helmet';

// Apply security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,  // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true
}));
```

---

## ✅ Security Checklist

### Before Production

```markdown
- [ ] **Authentication**
  - [ ] Passwords hashed with bcrypt (salt rounds >= 10)
  - [ ] JWT tokens with expiration
  - [ ] Refresh token mechanism
  - [ ] Rate limiting on login (max 5 attempts per 15 min)

- [ ] **Input Validation**
  - [ ] Server-side validation for all inputs
  - [ ] Email format validation
  - [ ] SQL injection prevention (parameterized queries)
  - [ ] XSS prevention (sanitize HTML)

- [ ] **Data Protection**
  - [ ] HTTPS enforced
  - [ ] Sensitive data encrypted at rest
  - [ ] Database connections use SSL
  - [ ] Environment variables for secrets

- [ ] **API Security**
  - [ ] CSRF protection
  - [ ] CORS configured properly
  - [ ] Rate limiting on all endpoints
  - [ ] Security headers (Helmet.js)

- [ ] **Session Management**
  - [ ] Secure session cookies (httpOnly, secure, sameSite)
  - [ ] Session timeout (15-30 minutes)
  - [ ] Logout invalidates tokens

- [ ] **Logging & Monitoring**
  - [ ] Failed login attempts logged
  - [ ] Suspicious activity alerts
  - [ ] Audit trail for sensitive operations
```

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

---

## ⚠️ Common Vulnerabilities

### OWASP Top 10

1. **Broken Access Control** - Check permissions on every action
2. **Cryptographic Failures** - Use bcrypt for passwords, encrypt sensitive data
3. **Injection** - Use parameterized queries, sanitize inputs
4. **Insecure Design** - Security-first architecture
5. **Security Misconfiguration** - Secure defaults, update dependencies
6. **Vulnerable Components** - Regular dependency updates (`npm audit`)
7. **Authentication Failures** - Strong passwords, MFA, rate limiting
8. **Data Integrity Failures** - Validate all data, use checksums
9. **Logging Failures** - Log security events, monitor for attacks
10. **SSRF** - Validate and sanitize URLs

---

**Remember: Security is not a feature, it's a requirement!** 🔒
