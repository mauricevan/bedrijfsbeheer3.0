# Database Setup Guide - Bedrijfsbeheer 3.0

**STATUS**: Database schema is bijgewerkt naar PostgreSQL met Decimal types voor financiële precisie.

---

## ✅ Wat is Er Gedaan

### 1. **Prisma Schema Geüpdatet**
- ✅ Provider gewijzigd: `sqlite` → `postgresql`
- ✅ Alle financiële velden geconverteerd: `Float` → `Decimal @db.Decimal(10, 2)`
- ✅ Prisma client gegenereerd met nieuwe schema

### 2. **Geüpdatete Modellen**
De volgende modellen gebruiken nu Decimal types voor bedragen:

- **Quote**: subtotal, vatRate, vatAmount, total
- **QuoteItem**: unitPrice, total
- **Invoice**: subtotal, vatRate, vatAmount, total, amountPaid
- **InvoiceItem**: unitPrice, total
- **InventoryItem**: purchasePrice, sellingPrice
- **Employee**: hourlyRate
- **Transaction**: amount
- **WorkOrderMaterial**: unitPrice

### 3. **Environment Configuratie**
- ✅ `.env` bestand aangemaakt met PostgreSQL configuratie
- ✅ JWT secret gegenereerd
- ✅ Alle environment variabelen ingesteld

---

## 🚀 Database Opzetten (VOLG DEZE STAPPEN)

### **Stap 1: Installeer PostgreSQL**

#### macOS (Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
1. Download PostgreSQL installer van https://www.postgresql.org/download/windows/
2. Run de installer en volg de wizard
3. Onthoud het wachtwoord dat je instelt voor de postgres user

---

### **Stap 2: Maak Database en User Aan**

#### Linux/macOS
```bash
# Log in als postgres user
sudo -u postgres psql

# Of direct (als postgres user configured is):
psql -U postgres
```

#### Windows
```bash
# Open Command Prompt als Administrator
# Navigeer naar PostgreSQL bin directory (bijvoorbeeld):
cd "C:\Program Files\PostgreSQL\15\bin"

# Log in
psql -U postgres
```

#### In PostgreSQL Shell (voor alle platforms):
```sql
-- Maak database user aan
CREATE USER bedrijfsbeheer_user WITH PASSWORD 'bedrijfsbeheer_password';

-- Maak database aan
CREATE DATABASE bedrijfsbeheer OWNER bedrijfsbeheer_user;

-- Geef alle rechten
GRANT ALL PRIVILEGES ON DATABASE bedrijfsbeheer TO bedrijfsbeheer_user;

-- Exit
\q
```

---

### **Stap 3: Update .env Bestand**

Het `.env` bestand is al aangemaakt met standaard credentials. **Update deze als je andere credentials gebruikt:**

```bash
# Open .env
nano .env   # of gebruik je favoriete editor

# Update deze regel als nodig:
DATABASE_URL=postgresql://bedrijfsbeheer_user:bedrijfsbeheer_password@localhost:5432/bedrijfsbeheer?schema=public
```

**Voor productie:**
- Gebruik sterke, unieke wachtwoorden
- Update `JWT_SECRET` met een veilige random string
- Zet `NODE_ENV=production`

---

### **Stap 4: Run Database Migrations**

```bash
# Maak een nieuwe migration aan voor PostgreSQL switch
npx prisma migrate dev --name switch-to-postgresql-with-decimals

# Dit zal:
# 1. Alle tabellen aanmaken in PostgreSQL
# 2. Alle relaties en indexes configureren
# 3. Decimal types correct instellen
```

**Verwachte output:**
```
✔ Database connected
✔ Migrations applied successfully
✔ Generated Prisma Client
```

**Als je errors krijgt:**
- Check of PostgreSQL draait: `psql -U postgres -c "SELECT version();"`
- Check of database bestaat: `psql -U postgres -l | grep bedrijfsbeheer`
- Check DATABASE_URL in .env

---

### **Stap 5: (Optioneel) Seed Data**

Als je test data wilt, maak een seed script:

```bash
# Maak seed file
touch prisma/seed.js
```

**Voorbeeld seed (prisma/seed.js):**
```javascript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@bedrijfsbeheer.nl',
      passwordHash: adminPassword,
      name: 'Admin User',
      isAdmin: true,
    },
  });

  console.log('✓ Admin user created:', admin.email);

  // Create test customer
  const customer = await prisma.customer.create({
    data: {
      name: 'Test Klant BV',
      email: 'klant@test.nl',
      phone: '0612345678',
      city: 'Amsterdam',
      status: 'active',
    },
  });

  console.log('✓ Test customer created:', customer.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run seed:**
```bash
node prisma/seed.js
```

---

### **Stap 6: Test de Database Connectie**

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Dit opent een browser window op http://localhost:5555
# Hier kun je:
# - Alle tabellen zien
# - Data inspecteren
# - Handmatig records toevoegen/bewerken
```

---

## 🧪 Backend Testen

### Start de Backend Server
```bash
npm run backend:dev
```

**Verwachte output:**
```
========================================
🚀 Bedrijfsbeheer 3.0 Backend Running
📍 Port: 3001
🌍 Environment: development
📊 Database: PostgreSQL
========================================
```

### Test API Endpoints

**1. Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Verwacht:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-15T12:00:00.000Z",
  "environment": "development"
}
```

**2. Register User:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.nl",
    "password": "test1234",
    "name": "Test User"
  }'
```

**Verwacht:**
```json
{
  "user": {
    "id": "...",
    "email": "test@test.nl",
    "name": "Test User",
    "isAdmin": false
  },
  "token": "eyJhbGc..."
}
```

**3. Create Quote (met Decimal values!):**
```bash
# Gebruik de token van stap 2
TOKEN="<your-token>"

curl -X POST http://localhost:3001/api/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "customerId": "...",
    "items": [{
      "name": "Test Product",
      "quantity": 2,
      "unitPrice": 99.99
    }]
  }'
```

**Check in Prisma Studio** dat bedragen correct opgeslagen zijn als Decimal!

---

## 🔍 Troubleshooting

### **Error: "P1001: Can't reach database server"**
```bash
# Check PostgreSQL status
# macOS:
brew services list | grep postgresql

# Linux:
sudo systemctl status postgresql

# Start if not running:
# macOS:
brew services start postgresql@15

# Linux:
sudo systemctl start postgresql
```

### **Error: "P1003: Database does not exist"**
```bash
# Login als postgres
psql -U postgres

# Check databases
\l

# Als bedrijfsbeheer niet bestaat:
CREATE DATABASE bedrijfsbeheer OWNER bedrijfsbeheer_user;
```

### **Error: "password authentication failed"**
- Check `.env` DATABASE_URL credentials
- Reset password:
```sql
-- In psql als postgres user:
ALTER USER bedrijfsbeheer_user WITH PASSWORD 'new_password';
```

### **Error: "Migration failed: column type"**
Dit kan gebeuren als je van SQLite naar PostgreSQL gaat. Oplossing:
```bash
# Reset migrations (WAARSCHUWING: verwijdert alle data!)
npx prisma migrate reset

# Of gebruik --create-only en pas migration handmatig aan:
npx prisma migrate dev --create-only --name fix-types
```

---

## 📊 Database Schema Overzicht

### **Tabellen**
- `users` - Gebruikers (auth + profiel)
- `customers` - Klanten (CRM)
- `quotes` + `quote_items` - Offertes
- `invoices` + `invoice_items` - Facturen
- `work_orders` + `work_order_materials` - Werkbonnen
- `inventory_items` - Voorraad
- `employees` - Medewerkers (HRM)
- `transactions` - Transacties (boekhouding)
- `audit_logs` - **NIEUW (V5.9.0)** - Audit trail voor compliance en security

### **Belangrijke Relaties**
- Quote → WorkOrder (1:1)
- Quote → Invoice (via WorkOrder)
- WorkOrder → Invoice (1:1)
- Customer → Quotes/Invoices/WorkOrders (1:N)
- User → Quotes/Invoices/WorkOrders (1:N)
- InventoryItem → QuoteItems/WorkOrderMaterials (1:N)

### **AuditLog Model Details (V5.9.0)**

Het nieuwe AuditLog model tracked alle belangrijke gebruikersacties voor compliance en security:

```prisma
model AuditLog {
  id          String   @id @default(uuid())
  userId      String?  @map("user_id")      // Gebruiker die actie uitvoerde
  userName    String?  @map("user_name")    // Naam voor snelle referentie
  action      String                        // create, update, delete, login, logout
  resource    String                        // users, quotes, invoices, customers, etc.
  resourceId  String   @map("resource_id")  // ID van beïnvloed record
  changes     String?  @db.Text             // JSON string: { old: {...}, new: {...} }
  ipAddress   String?  @map("ip_address")   // IP adres van gebruiker
  userAgent   String?  @map("user_agent")   // Browser/client info
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId])      // Query logs per gebruiker
  @@index([resource])    // Query logs per resource type
  @@index([action])      // Query logs per actie type
  @@index([createdAt])   // Query logs op datum
  @@map("audit_logs")
}
```

**Gebruik:**
- **Compliance**: AVG/GDPR vereisten voor audit trail
- **Security**: Track verdachte activiteiten
- **Debugging**: Wat is er veranderd en door wie?
- **Forensics**: Onderzoek na security incident

---

## 🔒 Security Checklist

- [ ] PostgreSQL alleen toegankelijk via localhost (of specifieke IPs)
- [ ] `.env` toegevoegd aan `.gitignore`
- [ ] Sterke wachtwoorden gebruikt voor database user
- [ ] JWT_SECRET is een veilige random string (min. 32 chars)
- [ ] Database backups ingesteld voor productie
- [ ] SSL/TLS enabled voor productie database connecties

---

## 📝 Next Steps

1. ✅ Database setup voltooid
2. ✅ Migraties uitgevoerd
3. ✅ Backend getest
4. 🔄 Frontend connecteren met backend API
5. 🔄 E2E testing uitvoeren
6. 🔄 Productie deployment voorbereiden

---

**Voor vragen of problemen:**
- Check backend logs: `npm run backend:dev` output
- Check Prisma logs: `DEBUG=prisma:* npm run backend:dev`
- Raadpleeg: https://www.prisma.io/docs/
- Of: `docs/api/backend-setup.md`
