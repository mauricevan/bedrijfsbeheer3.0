# Bedrijfsbeheer 3.0 Backend

REST API backend voor Bedrijfsbeheer Dashboard, gebouwd met Express.js, Prisma en SQLite (development) / PostgreSQL (productie).

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

De server draait op http://localhost:3001

## 📁 Project Structuur

```
backend/
├── config/
│   └── database.js          # Prisma client instantie
├── controllers/
│   ├── authController.js    # Authenticatie (login, register)
│   ├── quoteController.js   # Offertes CRUD
│   ├── customerController.js # Klanten CRUD
│   └── inventoryController.js # Voorraad CRUD
├── middleware/
│   ├── authenticate.js      # JWT verificatie
│   ├── authorize.js         # Role-based access
│   └── errorHandler.js      # Error handling
├── routes/
│   └── api/
│       ├── index.js         # Main router
│       ├── auth.js          # Auth routes
│       ├── quotes.js        # Quote routes
│       ├── customers.js     # Customer routes
│       └── inventory.js     # Inventory routes
├── utils/
│   └── jwt.js               # JWT utilities
└── server.js                # Express app entry point
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register   # Registreer nieuwe gebruiker
POST   /api/auth/login      # Login
GET    /api/auth/me         # Huidige gebruiker (protected)
POST   /api/auth/logout     # Logout (protected)
```

### Quotes (Offertes)

```
GET    /api/quotes          # Lijst alle offertes (protected)
POST   /api/quotes          # Maak nieuwe offerte (protected)
GET    /api/quotes/:id      # Haal offerte op (protected)
PUT    /api/quotes/:id      # Update offerte (protected)
DELETE /api/quotes/:id      # Verwijder offerte (protected)
```

### Customers (Klanten)

```
GET    /api/customers       # Lijst alle klanten (protected)
POST   /api/customers       # Maak nieuwe klant (protected)
GET    /api/customers/:id   # Haal klant op (protected)
PUT    /api/customers/:id   # Update klant (protected)
DELETE /api/customers/:id   # Verwijder klant (protected)
```

### Inventory (Voorraad)

```
GET    /api/inventory       # Lijst alle voorraad (protected)
POST   /api/inventory       # Maak nieuw product (protected)
GET    /api/inventory/:id   # Haal product op (protected)
PUT    /api/inventory/:id   # Update product (protected)
DELETE /api/inventory/:id   # Verwijder product (protected)
```

## 🔐 Authentication

De backend gebruikt JWT tokens voor authenticatie.

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bedrijfsbeheer.nl","password":"admin123456"}'
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@bedrijfsbeheer.nl",
    "name": "Admin User",
    "isAdmin": false
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

## 🗄️ Database

### Development

De backend gebruikt SQLite voor development (gemakkelijk testen, geen aparte database server nodig).

Database file: `dev.db` in project root

### Productie

Voor productie moet je PostgreSQL gebruiken:

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

### Database Commands

```bash
# Maak nieuwe migration
npm run db:migrate

# Deploy migrations (productie)
npm run db:deploy

# Open Prisma Studio (database GUI)
npm run db:studio

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
```

## 🧪 Testing Endpoints

### Health Check

```bash
curl http://localhost:3001/api/health
```

### Registreer Gebruiker

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "Test User"
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
    "city": "Amsterdam"
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
      }
    ],
    "notes": "Test offerte"
  }'
```

## 📚 Database Schema

Zie `prisma/schema.prisma` voor het volledige schema.

Belangrijkste modellen:
- User - Gebruikers met authenticatie
- Customer - Klanten
- Quote - Offertes met items
- Invoice - Facturen met items
- WorkOrder - Werkbonnen
- InventoryItem - Voorraad items
- Employee - Medewerkers
- Transaction - Transacties (boekhouding)

## 🔒 Security Features

- ✅ Bcrypt password hashing
- ✅ JWT token authentication
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling
- ✅ SQL injection protection (Prisma)

## 🚧 TODO

- [ ] Invoice controller implementeren
- [ ] WorkOrder controller implementeren
- [ ] Employee controller implementeren
- [ ] Transaction controller implementeren
- [ ] Input validation middleware (Joi)
- [ ] Rate limiting
- [ ] Email service
- [ ] PDF generation
- [ ] File upload handling
- [ ] Unit tests
- [ ] Integration tests
- [ ] API documentation (Swagger/OpenAPI)

## 📖 Documentatie

- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com/)
- [JWT Docs](https://jwt.io/)

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

Check CORS_ORIGIN in `.env` matches your frontend URL.

## 📝 License

Private - Bedrijfsbeheer Dashboard 3.0
