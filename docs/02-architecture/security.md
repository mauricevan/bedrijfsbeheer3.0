# Beveiliging & Privacy

## Overzicht

Het Bedrijfsbeheer Dashboard implementeert verschillende beveiligingslagen om gebruikersgegevens en bedrijfsinformatie te beschermen. Dit document beschrijft de huidige beveiligingsmaatregelen, privacy overwegingen en toekomstige verbeteringen.

---

## Authenticatie Systeem

### Login Mechanisme

Het systeem gebruikt een email en wachtwoord gebaseerde authenticatie:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;  // In productie: gehashed met bcrypt/argon2
  role: 'admin' | 'user';
  department?: string;
  avatar?: string;
}
```

#### Login Flow

1. **Gebruiker invoer** - Email en wachtwoord
2. **Validatie** - Controleer of velden niet leeg zijn
3. **Authenticatie** - Vergelijk credentials met database
4. **Sessie creatie** - Stel currentUser state in
5. **Redirect** - Navigeer naar dashboard

```typescript
const handleLogin = (email: string, password: string) => {
  // Zoek gebruiker in database
  const user = users.find(u => u.email === email);

  // Valideer credentials
  if (!user || user.password !== password) {
    setError('Ongeldige inloggegevens');
    return;
  }

  // Stel sessie in
  setCurrentUser(user);
  setIsLoggedIn(true);

  // Redirect naar dashboard
  navigate('/dashboard');
};
```

### Demo Accounts

Het systeem bevat 4 test accounts voor demonstratie doeleinden:

| Naam           | Email             | Rol                 | Admin  | Wachtwoord |
| -------------- | ----------------- | ------------------- | ------ | ---------- |
| Sophie van Dam | sophie@bedrijf.nl | Manager Productie   | ✅ Ja  | 1234       |
| Jan de Vries   | jan@bedrijf.nl    | Productiemedewerker | ❌ Nee | 1234       |
| Maria Jansen   | maria@bedrijf.nl  | Lasser              | ❌ Nee | 1234       |
| Peter Bakker   | peter@bedrijf.nl  | Spuiter             | ❌ Nee | 1234       |

**Let op:** In productie moeten wachtwoorden altijd gehashed worden opgeslagen.

### Quick Login Feature

Voor demo doeleinden zijn er snelle login knoppen beschikbaar:

```typescript
<button onClick={() => handleQuickLogin('sophie@bedrijf.nl')}>
  Login als Admin
</button>
<button onClick={() => handleQuickLogin('jan@bedrijf.nl')}>
  Login als Medewerker
</button>
```

**Veiligheidsoverweging:** Quick login is alleen geschikt voor demo/development omgevingen en moet worden uitgeschakeld in productie.

---

## Rolgebaseerde Toegangscontrole (RBAC)

### Gebruikersrollen

Het systeem kent twee primaire rollen:

#### **Admin** (Manager Productie)

**Rechten:**
- ✅ Volledige toegang tot alle modules
- ✅ Modules in- en uitschakelen
- ✅ Gebruikers beheren
- ✅ Admin instellingen
- ✅ Alle werkorders inzien (van alle medewerkers)
- ✅ Systeem configuratie
- ✅ Klanten en voorraad beheren
- ✅ Offertes en facturen aanmaken/bewerken
- ✅ Rapportages genereren

#### **User** (Medewerker)

**Rechten:**
- ✅ Persoonlijk workboard (alleen eigen taken)
- ✅ Taken van collega's bekijken (read-only)
- ✅ Eigen werkorders bijwerken
- ✅ Uren registreren
- ✅ Materiaalverbruik registreren
- ❌ Geen toegang tot admin settings
- ❌ Geen modules aan/uit schakelen
- ❌ Beperkte CRM toegang
- ❌ Geen HRM toegang

### Role Checking Implementatie

```typescript
// Component level role checking
const AdminSettings: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser || currentUser.role !== 'admin') {
    return <AccessDenied />;
  }

  return <div>{/* Admin content */}</div>;
};

// Conditional rendering
{currentUser?.role === 'admin' && (
  <button onClick={openAdminSettings}>
    Admin Instellingen
  </button>
)}

// Route protection
<Route
  path="/admin"
  element={
    currentUser?.role === 'admin' ? (
      <AdminSettings />
    ) : (
      <Navigate to="/dashboard" />
    )
  }
/>
```

### Module Access Control

Modules kunnen worden in-/uitgeschakeld per rol:

```typescript
interface Module {
  id: string;
  name: string;
  enabled: boolean;
  requiredRole?: 'admin' | 'user';
  icon: React.ComponentType;
  path: string;
}

// Filter modules op basis van rol
const visibleModules = modules.filter(module => {
  if (!module.enabled) return false;
  if (module.requiredRole === 'admin' && currentUser?.role !== 'admin') {
    return false;
  }
  return true;
});
```

---

## Wachtwoord Beveiliging

### ✅ GEÏMPLEMENTEERD (V5.9.0)

Wachtwoorden worden nu gehashed met bcrypt voordat ze worden opgeslagen.

#### Wachtwoord Hashing met bcrypt (`backend/utils/auth.js`)

```javascript
import bcrypt from 'bcrypt';

// Bij registratie - Hash password
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Bij login - Verify password
export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

**Implementatie in authController (`backend/controllers/authController.js`):**

```javascript
import { hashPassword, verifyPassword } from '../utils/auth.js';

// Registratie
export const register = async (req, res) => {
  const { email, password, name } = req.body;

  // ✅ Hash password VOOR opslag
  const passwordHash = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,  // ✅ Gehashed password opslaan
      name,
      isAdmin: false
    }
  });

  // ... token generatie en response
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({ error: 'Ongeldige inloggegevens' });
  }

  // ✅ Verify password met bcrypt
  const validPassword = await verifyPassword(password, user.passwordHash);

  if (!validPassword) {
    return res.status(401).json({ error: 'Ongeldige inloggegevens' });
  }

  // ... token generatie en response
};
```

**Database Schema (`prisma/schema.prisma`):**

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")  // ✅ Gehashed password
  name         String
  isAdmin      Boolean  @default(false) @map("is_admin")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

**Beveiligingsvoordelen:**
- ✅ Wachtwoorden NOOIT in plain text opgeslagen
- ✅ bcrypt salt rounds = 10 (veilig en performant)
- ✅ Rainbow table attacks onmogelijk
- ✅ Database breach levert geen bruikbare wachtwoorden op

### Wachtwoord Requirements (Aanbevolen)

Voor productie implementatie:

- ✅ Minimaal 8 karakters
- ✅ Minimaal 1 hoofdletter
- ✅ Minimaal 1 cijfer
- ✅ Minimaal 1 speciaal karakter
- ✅ Geen veelgebruikte wachtwoorden (password, 123456, etc.)

```typescript
const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
};
```

---

## Sessie Management

### Huidige Implementatie

Sessies worden beheerd via React state:

```typescript
// App.tsx
const [currentUser, setCurrentUser] = useState<User | null>(null);
const [isLoggedIn, setIsLoggedIn] = useState(false);

// Login
const handleLogin = (user: User) => {
  setCurrentUser(user);
  setIsLoggedIn(true);
};

// Logout
const handleLogout = () => {
  setCurrentUser(null);
  setIsLoggedIn(false);
  navigate('/login');
};
```

**Beperking:** State wordt gewist bij page refresh.

### Productie Implementatie ✅ GEÏMPLEMENTEERD (V5.9.0)

#### JWT met HttpOnly Cookies (XSS Bescherming)

**⚠️ Belangrijke Update:** JWT tokens worden nu NIET meer in localStorage opgeslagen (kwetsbaar voor XSS), maar in HttpOnly cookies.

**Backend - Token Generatie (`backend/controllers/authController.js`):**

```javascript
import jwt from 'jsonwebtoken';

// Token generatie bij login/registratie
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Token wordt als HttpOnly cookie gezet
res.cookie('token', token, {
  httpOnly: true,              // ✅ Niet toegankelijk via JavaScript
  secure: process.env.NODE_ENV === 'production', // ✅ Alleen HTTPS in productie
  sameSite: 'strict',          // ✅ CSRF bescherming
  maxAge: 24 * 60 * 60 * 1000  // 24 uur
});

// Response bevat GEEN token meer
res.json({
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin
  }
  // ❌ GEEN token field!
});
```

**Backend - Token Verificatie (`backend/middleware/authenticate.js`):**

```javascript
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    let token = null;

    // ✅ Prioriteit 1: HttpOnly cookie (preferred)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // ✅ Fallback: Authorization header (backward compatibility)
    else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Geen toegang - login vereist' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Ongeldige token' });
  }
};
```

**Frontend - API Client (`utils/api/apiClient.ts`):**

```typescript
// ✅ Belangrijk: credentials: 'include' stuurt cookies mee
async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: this.getHeaders(),
    credentials: 'include', // ✅ Stuurt HttpOnly cookies mee
  });
  return this.handleResponse<T>(response);
}

// Hetzelfde voor post, put, delete...
```

**Voordelen van HttpOnly Cookies:**
- ✅ XSS-proof: JavaScript kan token niet lezen
- ✅ Automatisch meegestuurd met requests
- ✅ CSRF bescherming via SameSite=strict
- ✅ Veilige opslag in browser

#### Refresh Tokens

Voor langere sessies:

```typescript
interface TokenPair {
  accessToken: string;  // Kort leven (15min)
  refreshToken: string; // Lang leven (7 dagen)
}

// Refresh access token
const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  const { accessToken } = await response.json();
  return accessToken;
};
```

### Secure Logout

```typescript
const handleLogout = async () => {
  try {
    // 1. Clear local state
    setCurrentUser(null);
    setIsLoggedIn(false);

    // 2. Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    // 3. Clear sessionStorage
    sessionStorage.clear();

    // 4. Invalidate token server-side (toekomstig)
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // 5. Redirect to login
    navigate('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

---

## Data Opslag Beveiliging

### Huidige Implementatie

**In-Memory Opslag:**

```typescript
// State in App.tsx - verloren bij refresh
const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
const [customers, setCustomers] = useState<Customer[]>([]);
```

**Voordelen:**
- ✅ Geen persistence = geen data lekkage risico
- ✅ Ideaal voor demo/development
- ✅ Snelle prototyping

**Nadelen:**
- ❌ Data verloren bij refresh
- ❌ Geen echte persistentie
- ❌ Niet geschikt voor productie

### Productie Implementatie (Toekomstig)

#### Backend Database

```typescript
// PostgreSQL, MongoDB, of andere database
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

// Secure connection
const pool = new Pool({
  ...databaseConfig,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/ca-certificate.crt').toString()
  }
});
```

#### API Security

```typescript
// Secure API endpoints
app.post('/api/inventory', authenticate, authorize(['admin']), async (req, res) => {
  // Valideer input
  const { error } = validateInventoryItem(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Sanitize input
  const sanitizedData = sanitizeInput(req.body);

  // Bewaar in database
  const item = await db.inventory.create(sanitizedData);

  res.json(item);
});
```

---

## Privacy & AVG/GDPR Compliance

### Huidige Status

🔄 **In voorbereiding** - Basis privacy principes worden toegepast:

- ✅ Minimale data collectie
- ✅ Data alleen voor demo doeleinden
- ✅ Geen externe data sharing
- ✅ In-memory opslag (geen permanente opslag)

### Toekomstige AVG/GDPR Features

#### 1. Data Minimalisatie

```typescript
// Verzamel alleen noodzakelijke data
interface CustomerMinimal {
  name: string;        // Noodzakelijk
  email: string;       // Noodzakelijk
  phone?: string;      // Optioneel
  // Vermijd: geboortedatum, BSN, etc. tenzij noodzakelijk
}
```

#### 2. Toestemming Management

```typescript
interface ConsentSettings {
  marketing: boolean;
  analytics: boolean;
  thirdParty: boolean;
  timestamp: Date;
}

const ConsentBanner = () => {
  const [consent, setConsent] = useState<ConsentSettings>({
    marketing: false,
    analytics: false,
    thirdParty: false,
    timestamp: new Date()
  });

  return (
    <div>
      <h3>Cookie Instellingen</h3>
      <label>
        <input
          type="checkbox"
          checked={consent.marketing}
          onChange={(e) => setConsent({
            ...consent,
            marketing: e.target.checked
          })}
        />
        Marketing cookies
      </label>
      {/* Meer opties... */}
    </div>
  );
};
```

#### 3. Recht op Vergetelheid

```typescript
// Implementeer data verwijdering
const deleteUserData = async (userId: string) => {
  // 1. Verwijder persoonlijke data
  await db.users.delete(userId);

  // 2. Anonymiseer gerelateerde data
  await db.orders.updateMany(
    { userId },
    { userId: 'DELETED_USER', customerName: 'Verwijderd' }
  );

  // 3. Log de verwijdering
  await db.auditLog.create({
    action: 'USER_DATA_DELETED',
    userId,
    timestamp: new Date()
  });
};
```

#### 4. Data Portabiliteit

```typescript
// Export gebruikersdata in machine-readable format
const exportUserData = async (userId: string): Promise<any> => {
  const userData = await db.users.findOne(userId);
  const orders = await db.orders.findMany({ userId });
  const invoices = await db.invoices.findMany({ userId });

  return {
    user: userData,
    orders,
    invoices,
    exportDate: new Date(),
    format: 'JSON'
  };
};
```

#### 5. Privacy Policy

```typescript
const PrivacyPolicy = () => {
  return (
    <div>
      <h1>Privacyverklaring</h1>
      <section>
        <h2>Welke gegevens verzamelen wij?</h2>
        <ul>
          <li>Naam en contactgegevens</li>
          <li>Bedrijfsinformatie</li>
          <li>Transactiegegevens</li>
        </ul>
      </section>
      <section>
        <h2>Hoe gebruiken wij uw gegevens?</h2>
        {/* ... */}
      </section>
      <section>
        <h2>Uw rechten</h2>
        <ul>
          <li>Recht op inzage</li>
          <li>Recht op correctie</li>
          <li>Recht op verwijdering</li>
          <li>Recht op dataportabiliteit</li>
        </ul>
      </section>
    </div>
  );
};
```

---

## Audit Trail & Logging

### ✅ GEÏMPLEMENTEERD (V5.9.0)

#### Audit Log Structuur (`backend/utils/audit.js`)

```javascript
import { prisma } from './prisma.js';
import logger from './logger.js';

// Audit log functie
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
        action,        // create, update, delete, login, logout
        resource,      // users, quotes, invoices, customers, etc.
        resourceId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
      },
    });

    logger.info(`Audit: ${action} ${resource} ${resourceId} by ${userName || userId}`);
  } catch (error) {
    logger.error('Failed to create audit log', { error });
  }
};

// Audit middleware - Automatisch logging
export const auditMiddleware = (req, res, next) => {
  // Store original req.user for audit trail
  if (req.user && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    req.audit = {
      userId: req.user.userId,
      userName: req.user.name || req.user.email,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
    };
  }
  next();
};
```

**Prisma Schema (`prisma/schema.prisma`):**

```prisma
model AuditLog {
  id          String   @id @default(uuid())
  userId      String?  @map("user_id")
  userName    String?  @map("user_name")
  action      String   // create, update, delete, login, logout
  resource    String   // users, quotes, invoices, customers, etc.
  resourceId  String   @map("resource_id")
  changes     String?  @db.Text  // JSON string of changes
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([resource])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}
```

**Gebruik in Controllers:**

```javascript
// Voorbeeld: Customer update
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const oldCustomer = await prisma.customer.findUnique({ where: { id } });

  const updatedCustomer = await prisma.customer.update({
    where: { id },
    data: updates
  });

  // ✅ Log de wijziging
  await logAudit({
    userId: req.user.userId,
    userName: req.user.name,
    action: 'update',
    resource: 'customers',
    resourceId: id,
    changes: {
      old: oldCustomer,
      new: updatedCustomer
    },
    ipAddress: req.audit.ipAddress,
    userAgent: req.audit.userAgent
  });

  res.json(updatedCustomer);
};
```

#### Gelogde Acties

De volgende acties worden automatisch gelogd:

- ✅ User login/logout
- ✅ Data wijzigingen (create, update, delete)
- ✅ Failed login attempts
- ✅ Permission changes
- ✅ Exports van data
- ✅ Admin acties

#### Winston Structured Logging

Naast audit logs hebben we ook Winston voor algemene logging:

```javascript
import logger from './backend/utils/logger.js';

// In productie: JSON format naar files
logger.info('User logged in', { userId: user.id, email: user.email });
logger.error('Database error', { error, query });
logger.warn('High memory usage', { usage: process.memoryUsage() });

// Logs worden opgeslagen in:
// - logs/combined.log (alle logs)
// - logs/error.log (alleen errors)
```

**Features:**
- ✅ Structured JSON logs voor productie
- ✅ Colorized console logs voor development
- ✅ Separate error.log en combined.log files
- ✅ Timestamp op alle logs
- ✅ Morgan integration voor HTTP request logging

---

## Beveiligingsmaatregelen - Checklist

### ✅ Geïmplementeerd (V5.9.0)

**Authenticatie & Autorisatie:**
- ✅ Email/password authenticatie
- ✅ Role-based access control (RBAC)
- ✅ Wachtwoord hashing met bcrypt (salt rounds = 10)
- ✅ JWT token authenticatie
- ✅ HttpOnly cookies (XSS bescherming)
- ✅ SameSite=strict cookies (CSRF bescherming)
- ✅ Secure logout functionaliteit

**Security Headers & Protocols:**
- ✅ HTTPS enforcement (HTTPS_ONLY environment variable)
- ✅ HSTS headers (1 jaar max-age, preload support)
- ✅ Content Security Policy (CSP)
- ✅ Helmet security headers (X-Frame-Options, X-Content-Type-Options, etc.)

**Attack Prevention:**
- ✅ Rate limiting - Global (100 req/15min)
- ✅ Rate limiting - Auth endpoints (5 attempts/15min) - Brute force protection
- ✅ XSS prevention - DOMPurify input sanitization
- ✅ SQL injection prevention - Prisma ORM parameterized queries
- ✅ Input validation & sanitization - Middleware layer
- ✅ Secure session cookies - HttpOnly, Secure, SameSite

**Monitoring & Compliance:**
- ✅ Audit trail / logboek functionaliteit - AuditLog model
- ✅ Winston structured logging - JSON logs in productie
- ✅ Morgan HTTP request logging
- ✅ Error logging met stack traces
- ✅ Trust proxy configuratie voor correct IP tracking

**Development & Infrastructure:**
- ✅ TypeScript type safety
- ✅ Docker containerization met non-root user
- ✅ Environment-based configuratie (.env)
- ✅ PostgreSQL database met Prisma ORM
- ✅ Health check endpoint
- ✅ Graceful shutdown support

### 🔄 In Ontwikkeling

- 🔄 AVG/GDPR compliance voorbereidingen
- 🔄 Wachtwoord strength validatie in UI
- 🔄 Password reset functionaliteit (email flow)
- 🔄 Email verificatie bij registratie
- 🔄 Account lockout na herhaalde foute logins

### 📋 Toekomstige Verbeteringen

**Geavanceerde Authenticatie:**
- 📋 Refresh token mechanisme
- 📋 Two-factor authentication (2FA)
- 📋 OAuth2/OpenID Connect support
- 📋 Biometric authentication support

**Security Testing:**
- 📋 Regular security audits
- 📋 Penetration testing
- 📋 Dependency vulnerability scanning (npm audit automation)
- 📋 OWASP ZAP automated scans

**Compliance & Privacy:**
- 📋 Volledige AVG/GDPR compliance (data export, verwijdering, toestemming)
- 📋 Privacy policy generator
- 📋 Cookie consent management
- 📋 Data encryption at rest
- 📋 PCI DSS compliance (indien betaling features worden toegevoegd)

**Monitoring & Alerting:**
- 📋 Security event alerting (Sentry, CloudWatch, etc.)
- 📋 Real-time intrusion detection
- 📋 Automated backup & disaster recovery
- 📋 Security metrics dashboard

---

## Security Best Practices

### Input Validatie

```typescript
import validator from 'validator';

// Valideer email
const isValidEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

// Sanitize input
const sanitizeInput = (input: string): string => {
  return validator.escape(input);
};

// Valideer en sanitize form data
const validateFormData = (data: any): boolean => {
  if (!isValidEmail(data.email)) {
    throw new Error('Invalid email');
  }

  data.name = sanitizeInput(data.name);
  data.company = sanitizeInput(data.company);

  return true;
};
```

### XSS Prevention

```typescript
// React's JSX automatisch escapet, maar let op:

// ❌ GEVAARLIJK - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ VEILIG - Gebruik JSX
<div>{userInput}</div>

// Of gebruik DOMPurify voor HTML content
import DOMPurify from 'dompurify';

const SafeHTML = ({ html }: { html: string }) => {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};
```

### CSRF Protection

```typescript
// Generate CSRF token
const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Include in forms
<form>
  <input type="hidden" name="csrfToken" value={csrfToken} />
  {/* andere velden */}
</form>

// Validate on server
const validateCSRF = (token: string, sessionToken: string): boolean => {
  return token === sessionToken;
};
```

---

## Gerelateerde Documentatie

- [Technische Stack](./technical-stack.md) - Gebruikte beveiligingstechnologieën
- [Authentication Guide](../04-features/authentication.md) - Gedetailleerde authenticatie guide
- [User Management](../03-modules/hrm.md) - Gebruikers en rechten beheer
- [API Security](../05-api/security.md) - API beveiligingsmaatregelen (toekomstig)
- [Deployment Guide](../01-getting-started/deployment.md) - Veilig deployen in productie
