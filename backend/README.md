# Bedrijfsbeheer 3.0 Backend

Complete REST API backend voor Bedrijfsbeheer Dashboard, gebouwd met Express.js, Prisma en SQLite (development) / PostgreSQL (productie).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm of yarn

### Installation

```bash
# Install dependencies (already done via root package.json)
npm install

# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run backend:dev
```

De server draait op **http://localhost:3001**

## 📁 Project Structuur

```
backend/
├── config/
│   └── database.js              # Prisma client instantie
├── controllers/
│   ├── authController.js        # Authenticatie (login, register)
│   ├── quoteController.js       # Offertes CRUD
│   ├── invoiceController.js     # Facturen CRUD
│   ├── workOrderController.js   # Werkbonnen CRUD
│   ├── customerController.js    # Klanten CRUD
│   ├── inventoryController.js   # Voorraad CRUD
│   ├── employeeController.js    # Medewerkers CRUD
│   └── transactionController.js # Transacties CRUD
├── middleware/
│   ├── authenticate.js          # JWT verificatie
│   ├── authorize.js             # Role-based access
│   ├── errorHandler.js          # Error handling
│   ├── validate.js              # Joi input validation
│   └── rateLimiter.js           # Rate limiting
├── routes/
│   └── api/
│       ├── index.js             # Main router
│       ├── auth.js              # Auth routes
│       ├── quotes.js            # Quote routes
│       ├── invoices.js          # Invoice routes
│       ├── workOrders.js        # WorkOrder routes
│       ├── customers.js         # Customer routes
│       ├── inventory.js         # Inventory routes
│       ├── employees.js         # Employee routes
│       └── transactions.js      # Transaction routes
├── utils/
│   └── jwt.js                   # JWT utilities
└── server.js                    # Express app entry point
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register   # Registreer nieuwe gebruiker
POST   /api/auth/login      # Login met JWT token
GET    /api/auth/me         # Huidige gebruiker profiel (protected)
POST   /api/auth/logout     # Logout (protected)
```

### Quotes (Offertes)

```
GET    /api/quotes          # Lijst alle offertes (pagination, filters)
POST   /api/quotes          # Maak nieuwe offerte met items
GET    /api/quotes/:id      # Haal specifieke offerte op
PUT    /api/quotes/:id      # Update offerte (status, items)
DELETE /api/quotes/:id      # Verwijder offerte
```

### Invoices (Facturen)

```
GET    /api/invoices        # Lijst alle facturen (pagination, filters)
POST   /api/invoices        # Maak nieuwe factuur met items
GET    /api/invoices/:id    # Haal specifieke factuur op
PUT    /api/invoices/:id    # Update factuur (status, betaling)
DELETE /api/invoices/:id    # Verwijder factuur
POST   /api/invoices/:id/pay  # Markeer factuur als betaald
```

### Work Orders (Werkbonnen)

```
GET    /api/work-orders        # Lijst alle werkbonnen (filters: status, priority)
POST   /api/work-orders        # Maak nieuwe werkbon met materialen
GET    /api/work-orders/:id    # Haal specifieke werkbon op
PUT    /api/work-orders/:id    # Update werkbon (status, uren)
DELETE /api/work-orders/:id    # Verwijder werkbon (admin only)
POST   /api/work-orders/:id/start     # Start werkbon
POST   /api/work-orders/:id/complete  # Voltooi werkbon
```

### Customers (Klanten)

```
GET    /api/customers       # Lijst alle klanten (search, pagination)
POST   /api/customers       # Maak nieuwe klant
GET    /api/customers/:id   # Haal klant op met relaties
PUT    /api/customers/:id   # Update klant
DELETE /api/customers/:id   # Verwijder klant
```

### Inventory (Voorraad)

```
GET    /api/inventory       # Lijst alle voorraad (filters: category, lowStock)
POST   /api/inventory       # Maak nieuw product
GET    /api/inventory/:id   # Haal product op
PUT    /api/inventory/:id   # Update product (voorraad, prijzen)
DELETE /api/inventory/:id   # Verwijder product
```

### Employees (Medewerkers)

```
GET    /api/employees           # Lijst alle medewerkers (filters: role, status)
POST   /api/employees           # Maak nieuwe medewerker (admin only)
GET    /api/employees/:id       # Haal medewerker op
PUT    /api/employees/:id       # Update medewerker (admin only)
DELETE /api/employees/:id       # Verwijder medewerker (admin only)
POST   /api/employees/:id/terminate  # Neem medewerker uit dienst (admin only)
```

### Transactions (Transacties)

```
GET    /api/transactions        # Lijst alle transacties (filters: type, date range)
GET    /api/transactions/summary  # Financiële samenvatting
POST   /api/transactions        # Maak nieuwe transactie (admin only)
GET    /api/transactions/:id    # Haal transactie op
PUT    /api/transactions/:id    # Update transactie (admin only)
DELETE /api/transactions/:id    # Verwijder transactie (admin only)
```

## 🔐 Authentication

De backend gebruikt JWT tokens voor authenticatie.

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bedrijfsbeheer.nl","password":"admin123456"}'
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@bedrijfsbeheer.nl",
    "name": "Admin User",
    "isAdmin": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Requests

Voeg de token toe aan de Authorization header:

```bash
curl http://localhost:3001/api/quotes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛡️ Security & Middleware

### Input Validation

Alle create/update endpoints gebruiken Joi validatie:

```javascript
// Voorbeeld: Create quote validation
{
  customerId: Joi.string().uuid().required(),
  items: Joi.array().items({
    name: Joi.string().max(200).required(),
    quantity: Joi.number().min(1).required(),
    unitPrice: Joi.number().min(0).required()
  }).min(1).required()
}
```

### Rate Limiting

- **API endpoints:** 100 requests per 15 minuten
- **Auth endpoints:** 5 login pogingen per 15 minuten
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Authorization

- **Public:** `/api/auth/register`, `/api/auth/login`
- **Authenticated:** Meeste GET endpoints
- **Admin only:** CREATE/UPDATE/DELETE voor employees, transactions
- **Ownership:** Users kunnen alleen hun eigen resources zien (tenzij admin)

## 🗄️ Database

### Development

De backend gebruikt **SQLite** voor development (gemakkelijk testen, geen aparte database server nodig).

Database file: `dev.db` in project root

### Productie

Voor productie gebruik **PostgreSQL**:

1. Installeer PostgreSQL
2. Update `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/bedrijfsbeheer"
   ```
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run migrations:
   ```bash
   npm run db:migrate
   ```

### Database Schema

**8 Core Models:**
- **User** - Gebruikers met authenticatie
- **Customer** - Klanten met CRM data
- **Quote** + QuoteItem - Offertes met items
- **Invoice** + InvoiceItem - Facturen met items
- **WorkOrder** + WorkOrderMaterial - Werkbonnen met materialen
- **InventoryItem** - Voorraad/producten
- **Employee** - Medewerkers (HRM)
- **Transaction** - Financiële transacties

### Database Commands

```bash
# Maak nieuwe migration
npm run db:migrate

# Deploy migrations (productie)
npm run db:deploy

# Open Prisma Studio (database GUI)
npm run db:studio

# Regenerate Prisma Client
npm run db:generate

# Reset database (DEV ONLY!)
npm run db:reset
```

## ⚙️ Environment Variables

Kopieer `.env.example` naar `.env` en pas aan:

```bash
# Environment
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=bedrijfsbeheer-secret-key-change-in-production-please
JWT_EXPIRY=24h

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing Endpoints

### Health Check

```bash
curl http://localhost:3001/api/health
```

### Registreer Admin Gebruiker

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bedrijf.nl",
    "password": "wachtwoord123",
    "name": "Admin User"
  }'
```

### Maak Klant

```bash
curl -X POST http://localhost:3001/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Bedrijf BV",
    "email": "info@testbedrijf.nl",
    "phone": "06-12345678",
    "city": "Amsterdam",
    "status": "active"
  }'
```

### Maak Offerte

```bash
curl -X POST http://localhost:3001/api/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "customerId": "customer-uuid-here",
    "items": [
      {
        "name": "Dienst A",
        "description": "Beschrijving",
        "quantity": 2,
        "unitPrice": 50.00
      },
      {
        "name": "Product B",
        "quantity": 5,
        "unitPrice": 25.00
      }
    ],
    "notes": "Test offerte"
  }'
```

### Maak Werkbon

```bash
curl -X POST http://localhost:3001/api/work-orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Reparatie Systeem",
    "description": "Systeem onderhoud uitvoeren",
    "customerId": "customer-uuid",
    "priority": "high",
    "estimatedHours": 4
  }'
```

## 📊 Query Parameters

### Pagination

Alle list endpoints ondersteunen paginatie:

```bash
GET /api/quotes?page=1&limit=20
```

### Filters

```bash
# Quotes by status
GET /api/quotes?status=approved

# Work orders by priority
GET /api/work-orders?priority=high&status=in_progress

# Inventory low stock
GET /api/inventory?lowStock=true

# Transactions by date range
GET /api/transactions?startDate=2025-01-01&endDate=2025-12-31&type=income
```

### Search

```bash
# Search customers
GET /api/customers?search=bedrijf

# Search inventory
GET /api/inventory?search=kabel&category=elektronica
```

## 🔒 Security Features

- ✅ **Bcrypt** password hashing (10 rounds)
- ✅ **JWT** token authentication (24h expiry)
- ✅ **Role-based access** control (admin/user)
- ✅ **Helmet** security headers
- ✅ **CORS** protection
- ✅ **Rate limiting** (100 req/15min)
- ✅ **Input validation** (Joi schemas)
- ✅ **SQL injection** protection (Prisma)
- ✅ **Error handling** (geen stack traces in productie)

## 📈 Features

### Implemented ✅

- [x] User authentication & authorization
- [x] JWT token management
- [x] Complete CRUD for all 8 modules
- [x] Input validation with Joi
- [x] Rate limiting
- [x] Pagination & filtering
- [x] Error handling
- [x] Database migrations
- [x] Relationship management
- [x] Admin/user role separation

### Future Enhancements 🚧

- [ ] Email service (nodemailer)
- [ ] PDF generation (quotes/invoices)
- [ ] File upload handling
- [ ] WebSocket notifications
- [ ] Redis caching
- [ ] ElasticSearch
- [ ] Audit logging
- [ ] Unit & integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Docker compose setup

## 🐛 Troubleshooting

### Port already in use

```bash
# Find process on port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Database issues

```bash
# Reset database (DEV ONLY!)
npm run db:reset

# Regenerate Prisma Client
npm run db:generate
```

### CORS errors

Check `CORS_ORIGIN` in `.env` matches your frontend URL (default: `http://localhost:5173`)

### Rate limit errors

Limiet: 100 requests per 15 minuten. Wacht 15 minuten of restart de server (dev only).

## 📚 Tech Stack

- **Express.js** - Web framework
- **Prisma** - ORM & migrations
- **SQLite/PostgreSQL** - Database
- **JWT** - Authentication
- **Joi** - Validation
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin handling
- **Morgan** - Request logging

## 📝 License

Private - Bedrijfsbeheer Dashboard 3.0

---

**Backend Status:** ✅ Complete & Production Ready

All 8 modules fully implemented with authentication, authorization, validation, and rate limiting.
