# Installatie

## Vereisten

**Voor lokale development:**
- Node.js (v18 of hoger)
- npm of yarn
- PostgreSQL 15+ (voor backend met database)

**Voor Docker deployment:**
- Docker Desktop (of Docker Engine)
- Docker Compose

---

## Optie 1: Docker Deployment (Aanbevolen voor Productie)

### Stap 1: Clone project

```bash
git clone <repository-url>
cd bedrijfsbeheer
```

### Stap 2: Configureer environment

```bash
# Kopieer .env.example naar .env
cp .env.example .env

# Bewerk .env en pas aan waar nodig:
# - JWT_SECRET (gebruik een sterke random string)
# - POSTGRES_PASSWORD (gebruik een veilig wachtwoord)
# - HTTPS_ONLY=true (voor productie)
```

### Stap 3: Start met Docker Compose

```bash
# Build en start alle services (PostgreSQL, Redis, App)
docker-compose up --build

# Of in detached mode (achtergrond):
docker-compose up --build -d
```

### Stap 4: Initialiseer database

```bash
# Voer database migraties uit
docker-compose exec app npx prisma migrate deploy

# (Optioneel) Seed met test data
docker-compose exec app node prisma/seed.js
```

### Stap 5: Open applicatie

- Applicatie draait op: `http://localhost:3001`
- Prisma Studio (database GUI): `docker-compose exec app npx prisma studio`

**Docker Services:**
- **app**: Bedrijfsbeheer applicatie (poort 3001)
- **postgres**: PostgreSQL database (poort 5432)
- **redis**: Redis cache (poort 6379)
- **nginx** (optioneel): Reverse proxy voor productie

Voor meer Docker details, zie [DEPLOYMENT.md](../../DEPLOYMENT.md)

---

## Optie 2: Lokale Development

### Stap 1: Clone project

```bash
git clone <repository-url>
cd bedrijfsbeheer
```

### Stap 2: Installeer dependencies

```bash
npm install
```

### Stap 3: Configureer database (Backend)

Zie [DATABASE_SETUP.md](../../DATABASE_SETUP.md) voor gedetailleerde instructies.

**Quick setup:**

```bash
# Installeer PostgreSQL
# macOS:
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# Maak database en user aan
sudo -u postgres psql
```

```sql
CREATE USER bedrijfsbeheer_user WITH PASSWORD 'bedrijfsbeheer_password';
CREATE DATABASE bedrijfsbeheer OWNER bedrijfsbeheer_user;
GRANT ALL PRIVILEGES ON DATABASE bedrijfsbeheer TO bedrijfsbeheer_user;
\q
```

```bash
# Configureer .env
cp .env.example .env
# Pas DATABASE_URL aan indien nodig

# Run migraties
npx prisma migrate dev
```

### Stap 4: Start development servers

**Backend (terminal 1):**

```bash
npm run backend:dev
```

**Frontend (terminal 2):**

```bash
npm run dev
```

### Stap 5: Open applicatie

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`
- **Prisma Studio**: `npx prisma studio` (poort 5555)
- Login met één van de demo accounts (zie [Demo Accounts](./demo-accounts.md))

---

## Build voor productie

### Lokale build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# Start backend in productie mode
NODE_ENV=production node backend/server.js
```

### Docker production build

```bash
# Build production image
docker build -t bedrijfsbeheer:latest .

# Run production container
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e JWT_SECRET=your-secret \
  -e HTTPS_ONLY=true \
  bedrijfsbeheer:latest
```

Zie [DEPLOYMENT.md](../../DEPLOYMENT.md) voor complete deployment guides (AWS, DigitalOcean, Render, etc.)

## Troubleshooting

### Port al in gebruik
Als poort 5173 al in gebruik is, zal Vite automatisch een andere poort kiezen.

### Dependencies installatie mislukt
Probeer de node_modules map te verwijderen en opnieuw te installeren:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
Zorg ervoor dat je Node.js versie 18 of hoger gebruikt:

```bash
node --version
```

## Volgende stappen

- [Quick Start Guide](./quick-start.md) - Begin direct met de applicatie
- [Demo Accounts](./demo-accounts.md) - Inloggegevens voor test accounts
- [Login & Users](./login-users.md) - Meer over het authenticatie systeem
