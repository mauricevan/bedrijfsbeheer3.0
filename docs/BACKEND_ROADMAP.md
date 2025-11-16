# Backend Implementation Roadmap - Bedrijfsbeheer 3.0

**Versie:** 1.0.0
**Aangemaakt:** 2025-01-16
**Status:** 🔵 In Progress (20% Complete)
**Timeline:** 2-3 weken

---

## 📋 Executive Summary

### Current Status
- ✅ Backend directory structure created
- ✅ Dependencies installed (Express, Prisma, JWT, bcrypt, etc.)
- ✅ Skeleton code exists (~182 lines in backend/)
- ✅ Docker & docker-compose configured
- 🔵 Prisma schema partially defined
- ⬜ API endpoints not implemented
- ⬜ Authentication not complete
- ⬜ Database not connected

### Goals
1. **Database**: Complete Prisma schema for all 12 modules
2. **Authentication**: JWT-based auth with refresh tokens
3. **API Endpoints**: RESTful APIs for all modules (CRUD operations)
4. **Security**: Input validation, rate limiting, CSRF protection
5. **Testing**: Backend API tests (supertest)
6. **Documentation**: API documentation (Swagger/OpenAPI)

---

## 🎯 Backend Architecture

### Technology Stack

```
Backend Stack:
├── Runtime: Node.js 22+
├── Framework: Express.js 4
├── Database: PostgreSQL 16
├── ORM: Prisma 6
├── Auth: JWT (jsonwebtoken) + bcrypt
├── Validation: Joi
├── Security: Helmet, CORS, express-rate-limit
├── Logging: Winston + Morgan
├── Testing: Jest + Supertest
└── Docs: Swagger/OpenAPI
```

### Architecture Layers

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
└──────────────┬──────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────┐
│      API Layer (Express Routes)     │
├─────────────────────────────────────┤
│    Controllers (Business Logic)     │
├─────────────────────────────────────┤
│      Services (Data Operations)     │
├─────────────────────────────────────┤
│    Repositories (Database Access)   │
├─────────────────────────────────────┤
│       ORM Layer (Prisma Client)     │
├─────────────────────────────────────┤
│      Database (PostgreSQL)          │
└─────────────────────────────────────┘
```

### Project Structure

```
backend/
├── config/
│   ├── database.js         # Prisma client setup
│   ├── jwt.js              # JWT configuration
│   └── logger.js           # Winston logger
├── controllers/
│   ├── authController.js   # Login, register, refresh
│   ├── dashboardController.js
│   ├── inventoryController.js
│   ├── posController.js
│   ├── workOrdersController.js
│   ├── accountingController.js
│   ├── bookkeepingController.js
│   ├── crmController.js
│   ├── hrmController.js
│   ├── planningController.js
│   ├── reportsController.js
│   ├── webshopController.js
│   └── settingsController.js
├── middleware/
│   ├── auth.js             # JWT verification
│   ├── validation.js       # Joi validation
│   ├── errorHandler.js     # Global error handler
│   ├── rateLimiter.js      # Rate limiting
│   └── rbac.js             # Role-based access control
├── routes/
│   ├── auth.js
│   ├── dashboard.js
│   ├── inventory.js
│   ├── pos.js
│   ├── workOrders.js
│   ├── accounting.js
│   ├── bookkeeping.js
│   ├── crm.js
│   ├── hrm.js
│   ├── planning.js
│   ├── reports.js
│   ├── webshop.js
│   └── settings.js
├── services/
│   ├── authService.js
│   ├── dashboardService.js
│   ├── inventoryService.js
│   ├── posService.js
│   ├── workOrdersService.js
│   ├── accountingService.js
│   ├── bookkeepingService.js
│   ├── crmService.js
│   ├── hrmService.js
│   ├── planningService.js
│   ├── reportsService.js
│   ├── webshopService.js
│   └── settingsService.js
├── utils/
│   ├── helpers.js
│   ├── validators.js
│   └── constants.js
├── tests/
│   ├── auth.test.js
│   ├── inventory.test.js
│   └── [other modules].test.js
├── server.js              # Express app entry point
└── README.md              # Backend documentation

prisma/
├── schema.prisma          # Database schema
├── migrations/            # Migration history
└── seed.js                # Database seeding
```

---

## 📊 Implementation Phases

### Phase 1: Foundation (Week 1, Days 1-2)

#### Day 1: Database Schema Design

**Priority: 🔴 CRITICAL**

**Tasks:**
- [ ] Complete Prisma schema for all 12 modules
- [ ] Define all models and relationships
- [ ] Add indexes for performance
- [ ] Add constraints (unique, foreign keys)
- [ ] Setup enums for status fields
- [ ] Add timestamps (createdAt, updatedAt)

**Prisma Schema Structure:**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String   // bcrypt hashed
  firstName     String
  lastName      String
  role          Role     @default(USER)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  workOrders    WorkOrder[]
  crmLeads      CRMLead[]
  planningEvents PlanningEvent[]
  refreshTokens RefreshToken[]

  @@index([email])
}

enum Role {
  ADMIN
  USER
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([token])
  @@index([userId])
}

// ============================================
// INVENTORY MODULE
// ============================================

model Product {
  id              String      @id @default(cuid())
  productId       String      @unique
  name            String
  description     String?
  type            ProductType
  categoryId      String?
  category        Category?   @relation(fields: [categoryId], references: [id])
  quantity        Int         @default(0)
  minStock        Int         @default(10)
  costPrice       Float
  sellingPrice    Float
  margin          Float
  imageUrl        String?
  isActive        Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  posItems        POSItem[]
  workOrderItems  WorkOrderItem[]
  quoteItems      QuoteItem[]
  invoiceItems    InvoiceItem[]
  webshopOrders   WebshopOrderItem[]
  stockMovements  StockMovement[]

  @@index([productId])
  @@index([categoryId])
  @@index([type])
}

enum ProductType {
  PRODUCT
  MATERIAL
  SERVICE
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  color       String    @default("#3b82f6")
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model StockMovement {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  type        MovementType
  quantity    Int
  reference   String?  // Reference to source (POS sale, WorkOrder, etc.)
  notes       String?
  createdAt   DateTime @default(now())

  @@index([productId])
  @@index([createdAt])
}

enum MovementType {
  IN          // Stock addition
  OUT         // Stock reduction
  ADJUSTMENT  // Manual correction
}

// ============================================
// POS MODULE
// ============================================

model POSTransaction {
  id            String     @id @default(cuid())
  transactionId String     @unique
  subtotal      Float
  btw           Float
  discount      Float      @default(0)
  total         Float
  paymentMethod String
  status        POSStatus  @default(COMPLETED)
  items         POSItem[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([transactionId])
  @@index([createdAt])
}

enum POSStatus {
  PENDING
  COMPLETED
  CANCELLED
  REFUNDED
}

model POSItem {
  id            String         @id @default(cuid())
  transactionId String
  transaction   POSTransaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  productId     String
  product       Product        @relation(fields: [productId], references: [id])
  quantity      Int
  price         Float
  total         Float
  createdAt     DateTime       @default(now())

  @@index([transactionId])
  @@index([productId])
}

// ============================================
// WORK ORDERS MODULE
// ============================================

model WorkOrder {
  id          String          @id @default(cuid())
  workOrderId String          @unique
  title       String
  description String?
  status      WorkOrderStatus @default(BACKLOG)
  priority    Priority        @default(MEDIUM)
  assigneeId  String?
  assignee    User?           @relation(fields: [assigneeId], references: [id])
  dueDate     DateTime?
  startDate   DateTime?
  endDate     DateTime?
  items       WorkOrderItem[]
  history     WorkOrderHistory[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  @@index([workOrderId])
  @@index([status])
  @@index([assigneeId])
}

enum WorkOrderStatus {
  BACKLOG
  TODO
  IN_PROGRESS
  REVIEW
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model WorkOrderItem {
  id          String    @id @default(cuid())
  workOrderId String
  workOrder   WorkOrder @relation(fields: [workOrderId], references: [id], onDelete: Cascade)
  productId   String
  product     Product   @relation(fields: [productId], references: [id])
  quantity    Int
  createdAt   DateTime  @default(now())

  @@index([workOrderId])
  @@index([productId])
}

model WorkOrderHistory {
  id          String    @id @default(cuid())
  workOrderId String
  workOrder   WorkOrder @relation(fields: [workOrderId], references: [id], onDelete: Cascade)
  action      String
  changes     Json?
  createdAt   DateTime  @default(now())

  @@index([workOrderId])
}

// ============================================
// ACCOUNTING MODULE
// ============================================

model Quote {
  id            String      @id @default(cuid())
  quoteNumber   String      @unique
  customerId    String?
  customerName  String
  customerEmail String
  subtotal      Float
  btw           Float
  discount      Float       @default(0)
  total         Float
  status        QuoteStatus @default(DRAFT)
  validUntil    DateTime
  notes         String?
  items         QuoteItem[]
  invoice       Invoice?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([quoteNumber])
  @@index([status])
}

enum QuoteStatus {
  DRAFT
  SENT
  ACCEPTED
  REJECTED
  EXPIRED
}

model QuoteItem {
  id          String  @id @default(cuid())
  quoteId     String
  quote       Quote   @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  productId   String?
  product     Product? @relation(fields: [productId], references: [id])
  description String
  quantity    Int
  price       Float
  total       Float
  createdAt   DateTime @default(now())

  @@index([quoteId])
}

model Invoice {
  id            String        @id @default(cuid())
  invoiceNumber String        @unique
  quoteId       String?       @unique
  quote         Quote?        @relation(fields: [quoteId], references: [id])
  customerId    String?
  customerName  String
  customerEmail String
  subtotal      Float
  btw           Float
  discount      Float         @default(0)
  total         Float
  status        InvoiceStatus @default(UNPAID)
  dueDate       DateTime
  paidDate      DateTime?
  notes         String?
  items         InvoiceItem[]
  reminders     InvoiceReminder[]
  transaction   BookkeepingTransaction?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([invoiceNumber])
  @@index([status])
  @@index([dueDate])
}

enum InvoiceStatus {
  UNPAID
  PAID
  OVERDUE
  CANCELLED
}

model InvoiceItem {
  id          String   @id @default(cuid())
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  productId   String?
  product     Product? @relation(fields: [productId], references: [id])
  description String
  quantity    Int
  price       Float
  total       Float
  createdAt   DateTime @default(now())

  @@index([invoiceId])
}

model InvoiceReminder {
  id          String   @id @default(cuid())
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  sentDate    DateTime
  type        ReminderType
  createdAt   DateTime @default(now())

  @@index([invoiceId])
}

enum ReminderType {
  FIRST
  SECOND
  FINAL
}

// ============================================
// BOOKKEEPING MODULE
// ============================================

model BookkeepingTransaction {
  id          String      @id @default(cuid())
  date        DateTime
  description String
  category    String
  amount      Float
  btw         Float
  type        TransactionType
  invoiceId   String?     @unique
  invoice     Invoice?    @relation(fields: [invoiceId], references: [id])
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([date])
  @@index([type])
}

enum TransactionType {
  INCOME
  EXPENSE
}

// ============================================
// CRM MODULE
// ============================================

model CRMLead {
  id          String     @id @default(cuid())
  leadId      String     @unique
  name        String
  email       String
  phone       String?
  company     String?
  stage       CRMStage   @default(NEW_LEAD)
  value       Float?
  assigneeId  String?
  assignee    User?      @relation(fields: [assigneeId], references: [id])
  notes       String?
  source      String?
  priority    Priority   @default(MEDIUM)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([leadId])
  @@index([stage])
  @@index([assigneeId])
}

enum CRMStage {
  NEW_LEAD
  CONTACTED
  QUALIFIED
  PROPOSAL
  NEGOTIATION
  WON
  LOST
}

// ============================================
// HRM MODULE
// ============================================

model Employee {
  id          String   @id @default(cuid())
  employeeId  String   @unique
  firstName   String
  lastName    String
  email       String   @unique
  phone       String?
  position    String
  department  String
  salary      Float?
  startDate   DateTime
  endDate     DateTime?
  isActive    Boolean  @default(true)
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([employeeId])
  @@index([email])
}

// ============================================
// PLANNING MODULE
// ============================================

model PlanningEvent {
  id          String    @id @default(cuid())
  title       String
  description String?
  start       DateTime
  end         DateTime
  type        EventType @default(OTHER)
  userId      String?
  user        User?     @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([start])
  @@index([userId])
}

enum EventType {
  WORK_ORDER
  MEETING
  DEADLINE
  VACATION
  OTHER
}

// ============================================
// WEBSHOP MODULE
// ============================================

model WebshopOrder {
  id            String             @id @default(cuid())
  orderNumber   String             @unique
  customerName  String
  customerEmail String
  customerPhone String?
  subtotal      Float
  shipping      Float              @default(0)
  btw           Float
  total         Float
  status        WebshopStatus      @default(PENDING)
  items         WebshopOrderItem[]
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt

  @@index([orderNumber])
  @@index([status])
}

enum WebshopStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model WebshopOrderItem {
  id        String       @id @default(cuid())
  orderId   String
  order     WebshopOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product      @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
  total     Float
  createdAt DateTime     @default(now())

  @@index([orderId])
  @@index([productId])
}

// ============================================
// SETTINGS MODULE
// ============================================

model Settings {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([key])
}
```

**Deliverables:**
- [ ] Complete schema.prisma file
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify database connection
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Create seed data script

**Time Estimate:** 6-8 hours

---

#### Day 2: Authentication System

**Priority: 🔴 CRITICAL**

**Tasks:**
- [ ] Implement user registration
- [ ] Implement user login
- [ ] JWT token generation
- [ ] Refresh token mechanism
- [ ] Password hashing (bcrypt)
- [ ] JWT middleware
- [ ] RBAC middleware

**Authentication Flow:**

```
┌─────────┐                ┌─────────┐
│ Client  │                │  Server │
└────┬────┘                └────┬────┘
     │                          │
     │ POST /api/auth/register  │
     ├─────────────────────────►│
     │ { email, password, ... } │
     │                          │ Hash password (bcrypt)
     │                          │ Save to database
     │                          │
     │◄─────────────────────────┤
     │ { user, accessToken,     │
     │   refreshToken }         │
     │                          │
     │ POST /api/auth/login     │
     ├─────────────────────────►│
     │ { email, password }      │
     │                          │ Verify password
     │                          │ Generate tokens
     │                          │
     │◄─────────────────────────┤
     │ { user, accessToken,     │
     │   refreshToken }         │
     │                          │
     │ GET /api/dashboard       │
     ├─────────────────────────►│
     │ Authorization: Bearer... │
     │                          │ Verify JWT
     │                          │ Check permissions
     │                          │
     │◄─────────────────────────┤
     │ { data }                 │
```

**Implementation Files:**

```javascript
// backend/services/authService.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class AuthService {
  async register(userData) {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return { user, ...tokens };
  }

  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Remove password from response
    delete user.password;

    return { user, ...tokens };
  }

  async generateTokens(user) {
    // Access token (15 minutes)
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Refresh token (7 days)
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token to database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken) {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid refresh token');
    }

    // Delete old refresh token
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new tokens
    return this.generateTokens(storedToken.user);
  }
}

module.exports = new AuthService();
```

```javascript
// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { auth, isAdmin };
```

```javascript
// backend/controllers/authController.js

const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshTokens(refreshToken);
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
```

**Deliverables:**
- [ ] authService.js implemented
- [ ] authController.js implemented
- [ ] auth middleware implemented
- [ ] RBAC middleware implemented
- [ ] Authentication routes
- [ ] Tests for auth endpoints

**Time Estimate:** 6-8 hours

---

### Phase 2: Core Module APIs (Week 1, Days 3-5)

#### Day 3: Inventory & POS APIs

**Inventory Endpoints:**
- [ ] `GET /api/inventory` - List all products (with filters)
- [ ] `GET /api/inventory/:id` - Get product details
- [ ] `POST /api/inventory` - Create product (admin only)
- [ ] `PUT /api/inventory/:id` - Update product (admin only)
- [ ] `DELETE /api/inventory/:id` - Delete product (admin only)
- [ ] `GET /api/inventory/categories` - List categories
- [ ] `POST /api/inventory/categories` - Create category (admin)
- [ ] `GET /api/inventory/stock-movements` - Stock history

**POS Endpoints:**
- [ ] `GET /api/pos/transactions` - List transactions
- [ ] `GET /api/pos/transactions/:id` - Get transaction
- [ ] `POST /api/pos/transactions` - Create transaction
- [ ] `POST /api/pos/transactions/:id/refund` - Refund transaction (admin)

**Implementation Example:**

```javascript
// backend/services/inventoryService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class InventoryService {
  async getAllProducts(filters = {}) {
    const { search, category, type, inStock } = filters;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { productId: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (type) {
      where.type = type;
    }

    if (inStock) {
      where.quantity = { gt: 0 };
    }

    return prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async createProduct(productData) {
    return prisma.product.create({
      data: productData,
      include: { category: true },
    });
  }

  async updateProduct(id, productData) {
    return prisma.product.update({
      where: { id },
      data: productData,
      include: { category: true },
    });
  }

  async updateStock(productId, quantity, type, reference) {
    // Update product stock
    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: {
          increment: type === 'IN' ? quantity : -quantity,
        },
      },
    });

    // Create stock movement record
    return prisma.stockMovement.create({
      data: {
        productId,
        quantity,
        type,
        reference,
      },
    });
  }
}

module.exports = new InventoryService();
```

**Time Estimate:** 8 hours

---

#### Day 4: WorkOrders & Accounting APIs

**WorkOrders Endpoints:**
- [ ] `GET /api/workorders` - List work orders
- [ ] `GET /api/workorders/:id` - Get work order
- [ ] `POST /api/workorders` - Create work order
- [ ] `PUT /api/workorders/:id` - Update work order
- [ ] `PATCH /api/workorders/:id/status` - Update status
- [ ] `DELETE /api/workorders/:id` - Delete work order (admin)
- [ ] `GET /api/workorders/:id/history` - Get history

**Accounting Endpoints:**
- [ ] `GET /api/accounting/quotes` - List quotes
- [ ] `POST /api/accounting/quotes` - Create quote
- [ ] `PUT /api/accounting/quotes/:id` - Update quote
- [ ] `POST /api/accounting/quotes/:id/convert` - Convert to invoice
- [ ] `GET /api/accounting/invoices` - List invoices
- [ ] `POST /api/accounting/invoices` - Create invoice
- [ ] `PATCH /api/accounting/invoices/:id/pay` - Mark as paid
- [ ] `POST /api/accounting/invoices/:id/remind` - Send reminder

**Time Estimate:** 8 hours

---

#### Day 5: CRM, HRM & Remaining Modules

**CRM Endpoints:**
- [ ] `GET /api/crm/leads` - List leads
- [ ] `POST /api/crm/leads` - Create lead
- [ ] `PUT /api/crm/leads/:id` - Update lead
- [ ] `PATCH /api/crm/leads/:id/stage` - Update stage

**HRM Endpoints:**
- [ ] `GET /api/hrm/employees` - List employees
- [ ] `POST /api/hrm/employees` - Create employee
- [ ] `PUT /api/hrm/employees/:id` - Update employee

**Planning Endpoints:**
- [ ] `GET /api/planning/events` - List events
- [ ] `POST /api/planning/events` - Create event

**Reports Endpoints:**
- [ ] `GET /api/reports/dashboard` - Dashboard data
- [ ] `GET /api/reports/sales` - Sales report
- [ ] `GET /api/reports/inventory` - Inventory report

**Webshop Endpoints:**
- [ ] `GET /api/webshop/orders` - List orders
- [ ] `POST /api/webshop/orders` - Create order

**Settings Endpoints:**
- [ ] `GET /api/settings` - Get settings
- [ ] `PUT /api/settings` - Update settings

**Time Estimate:** 8 hours

---

### Phase 3: Security & Validation (Week 2, Days 1-2)

#### Day 1: Input Validation

**Tasks:**
- [ ] Setup Joi validation schemas
- [ ] Create validation middleware
- [ ] Add validation to all endpoints
- [ ] XSS sanitization (DOMPurify)
- [ ] SQL injection prevention (Prisma handles this)

**Validation Example:**

```javascript
// backend/middleware/validation.js

const Joi = require('joi');

const schemas = {
  product: Joi.object({
    productId: Joi.string().required(),
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().allow(''),
    type: Joi.string().valid('PRODUCT', 'MATERIAL', 'SERVICE').required(),
    categoryId: Joi.string().uuid(),
    quantity: Joi.number().integer().min(0).required(),
    minStock: Joi.number().integer().min(0).default(10),
    costPrice: Joi.number().min(0).required(),
    sellingPrice: Joi.number().min(0).required(),
  }),

  quote: Joi.object({
    customerName: Joi.string().required(),
    customerEmail: Joi.string().email().required(),
    items: Joi.array().items(Joi.object({
      productId: Joi.string().uuid(),
      description: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).required(),
    })).min(1).required(),
    discount: Joi.number().min(0).max(100).default(0),
    validUntil: Joi.date().greater('now').required(),
  }),
};

const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
      return next(new Error(`Schema ${schemaName} not found`));
    }

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message),
      });
    }

    req.validatedBody = value;
    next();
  };
};

module.exports = { validate, schemas };
```

**Time Estimate:** 6 hours

---

#### Day 2: Security Hardening

**Tasks:**
- [ ] Setup Helmet (security headers)
- [ ] Configure CORS properly
- [ ] Rate limiting (express-rate-limit)
- [ ] CSRF protection
- [ ] Setup Winston logging
- [ ] Error handling middleware

**Security Setup:**

```javascript
// backend/server.js

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./config/logger');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', limiter);

// Logging
app.use(morgan('combined', { stream: logger.stream }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
// ... other routes

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.message, { error: err.stack });

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
```

**Time Estimate:** 6 hours

---

### Phase 4: Testing & Documentation (Week 2, Days 3-5)

#### Day 3: Backend Testing

**Tasks:**
- [ ] Setup Jest for backend
- [ ] Write tests for auth endpoints
- [ ] Write tests for inventory endpoints
- [ ] Write tests for critical workflows
- [ ] Integration tests with database

**Test Example:**

```javascript
// backend/tests/auth.test.js

const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Authentication', () => {
  beforeEach(async () => {
    // Clean database
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should not register duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.status).toBe(400);
    });
  });
});
```

**Time Estimate:** 8 hours

---

#### Day 4-5: API Documentation

**Tasks:**
- [ ] Install Swagger/OpenAPI
- [ ] Document all endpoints
- [ ] Add request/response examples
- [ ] Setup Swagger UI
- [ ] Create Postman collection
- [ ] Update backend README

**Swagger Setup:**

```javascript
// backend/swagger.js

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bedrijfsbeheer 3.0 API',
      version: '1.0.0',
      description: 'ERP System API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to API routes
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
```

**Time Estimate:** 10 hours

---

## 🎯 Success Metrics

### Completion Criteria

- [✅] All 12 modules have complete CRUD APIs
- [ ] Authentication working (JWT + refresh tokens)
- [ ] All endpoints validated (Joi)
- [ ] Security headers configured (Helmet)
- [ ] Rate limiting active
- [ ] 80% backend test coverage
- [ ] API documentation complete (Swagger)
- [ ] Database migrations working
- [ ] Production-ready error handling
- [ ] Logging configured (Winston)

---

## 📚 Resources & References

**Documentation:**
- [Prisma Docs](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

**Tools:**
- Postman (API testing)
- Prisma Studio (database GUI)
- Swagger UI (API docs)
- Winston (logging)

---

**Status:** 🔵 IN PROGRESS (20%)
**Last Updated:** 2025-01-16
**Target Completion:** 2025-02-06 (3 weeks)
