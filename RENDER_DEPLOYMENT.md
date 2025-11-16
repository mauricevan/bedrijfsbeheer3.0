# 🚀 Render.com Deployment Guide - Bedrijfsbeheer 3.0

## ✅ Pre-Deployment Checklist

Dit project is **volledig geconfigureerd** voor plug-and-play deployment op Render.com.

### Wat is al geconfigureerd:

- ✅ `render.yaml` - Volledige Blueprint configuratie
- ✅ `Dockerfile` - Multi-stage production build
- ✅ `docker-entrypoint.sh` - Automatische database migraties
- ✅ Database schema - PostgreSQL met Prisma
- ✅ Health check endpoint - `/api/health`
- ✅ Security - Helmet, CORS, Rate limiting, HTTPS enforcement
- ✅ Environment variables template - `.env.example`
- ✅ Production-ready backend - Express server met static file serving
- ✅ Branch configuratie - `refactor/accounting-module`

---

## 📋 Deployment Stappen

### Stap 1: Repository naar GitHub pushen

```bash
# Zorg dat alle wijzigingen gecommit zijn
git add .
git commit -m "chore: Ready for Render.com deployment"

# Push naar GitHub
git push origin refactor/accounting-module
```

### Stap 2: Render.com Blueprint Setup

1. Ga naar **https://dashboard.render.com**
2. Klik op **"New +"** → **"Blueprint"**
3. Selecteer **"Connect a repository"**
4. Kies je GitHub repository: `mauricevan/bedrijfsbeheer3.0`
5. Render detecteert automatisch `render.yaml`
6. Klik op **"Apply"**

### Stap 3: Automatische Provisioning

Render.com zal nu automatisch:

- 🗄️ PostgreSQL database aanmaken (`bedrijfsbeheer-db`)
- 🔐 Veilige DATABASE_URL genereren
- 🔑 JWT_SECRET genereren (256-bit random string)
- 🐳 Docker image bouwen (frontend + backend)
- 📦 Database migraties uitvoeren (Prisma migrate deploy)
- 🚀 Web service deployen
- 🌍 HTTPS certificaat activeren (gratis SSL)

**⏱️ Eerste deployment duurt ca. 5-10 minuten**

### Stap 4: CORS Origin Configureren (BELANGRIJK!)

Na de eerste deployment moet je handmatig CORS_ORIGIN instellen:

1. Ga naar je **Web Service** in Render dashboard
2. Klik op **"Environment"** in het linkermenu
3. Zoek de variabele **`CORS_ORIGIN`**
4. Stel de waarde in op je Render URL:
   ```
   https://bedrijfsbeheer.onrender.com
   ```
   (Vervang met jouw daadwerkelijke Render URL)
5. Klik op **"Save Changes"**
6. Render zal automatisch redeployen (ca. 2-3 minuten)

### Stap 5: Verificatie

Test of alles werkt:

**Health Check:**
```
https://jouw-app.onrender.com/api/health
```

Verwachte response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-16T10:30:00.000Z",
  "environment": "production",
  "uptime": 123.45,
  "database": {
    "status": "connected",
    "responseTime": "15ms"
  }
}
```

**Frontend:**
```
https://jouw-app.onrender.com
```

Je zou de login pagina moeten zien.

**API Endpoints:**
```
https://jouw-app.onrender.com/api
```

---

## 🔐 Environment Variables

De volgende environment variables worden automatisch geconfigureerd:

| Variabele | Waarde | Bron |
|-----------|--------|------|
| `NODE_ENV` | `production` | render.yaml |
| `DATABASE_URL` | Auto-generated | Render PostgreSQL |
| `JWT_SECRET` | Auto-generated | Render (256-bit) |
| `JWT_EXPIRY` | `24h` | render.yaml |
| `CORS_ORIGIN` | **HANDMATIG** | Jij moet instellen! |
| `HTTPS_ONLY` | `true` | render.yaml |
| `VITE_API_URL` | `/api` | render.yaml |
| `LOG_LEVEL` | `info` | render.yaml |

---

## 💰 Kosten Overzicht

### Starter Plan (Aanbevolen voor testen):
- **Web Service**: Free tier (750 uur/maand)
  - ⚠️ Spint down na 15 minuten inactiviteit
  - Cold start: 30-60 seconden
- **PostgreSQL**: Free tier (90 dagen gratis)
  - Daarna: **$7/maand**
- **SSL Certificaat**: Gratis
- **Totaal**: $0/maand (eerste 90 dagen), daarna $7/maand

### Standard Plan (Aanbevolen voor productie):
- **Web Service**: $7/maand
  - ✅ Altijd online (geen spin down)
  - ✅ 512 MB RAM
  - ✅ Shared CPU
- **PostgreSQL**: $7/maand
  - ✅ 1 GB opslag
  - ✅ 97 connecties
  - ✅ Automatische backups
- **Totaal**: **$14/maand**

### Professional Plan (Voor schaalbaarheid):
- **Web Service**: $25/maand (1 GB RAM, dedicated CPU)
- **PostgreSQL**: $20/maand (10 GB opslag)
- **Redis** (optioneel): $10/maand
- **Totaal**: $45-55/maand

---

## 🔧 Optionele Configuratie

### Custom Domain

1. Ga naar **Web Service** → **Settings** → **Custom Domain**
2. Klik op **"Add Custom Domain"**
3. Voer je domeinnaam in (bijv. `app.jouwbedrijf.nl`)
4. Configureer DNS CNAME record:
   ```
   Type: CNAME
   Name: app
   Value: jouw-app.onrender.com
   ```
5. Update `CORS_ORIGIN` naar je custom domain:
   ```
   CORS_ORIGIN=https://app.jouwbedrijf.nl
   ```

### Redis (Distributed Rate Limiting)

Voor multi-instance deployments (meerdere web servers):

1. Ga naar Render Dashboard
2. Klik op **"New +"** → **"Redis"**
3. Naam: `bedrijfsbeheer-redis`
4. Plan: Starter ($10/maand)
5. Region: Frankfurt
6. Na aanmaken, kopieer de **Connection String**
7. Voeg toe aan Environment Variables:
   ```
   REDIS_URL=rediss://...
   ```

---

## 📊 Monitoring & Logging

### Logs Bekijken

1. Ga naar **Web Service** in Render dashboard
2. Klik op **"Logs"** tab
3. Real-time logs van je applicatie

**Handige log filters:**
- `error` - Alleen errors
- `health` - Health check requests
- `migration` - Database migraties

### Metrics

1. Ga naar **Web Service** → **Metrics**
2. Bekijk:
   - CPU gebruik
   - Memory gebruik
   - HTTP request rate
   - Response times
   - Error rates

### Database Monitoring

1. Ga naar **PostgreSQL Database** in dashboard
2. Bekijk:
   - Connection count
   - Disk usage
   - Query performance

---

## 🔄 Auto-Deploy

**Auto-deploy is ingeschakeld!**

Elke push naar `refactor/accounting-module` triggert automatisch:
1. 🔨 Nieuwe Docker build
2. 🧪 Health check test
3. 🚀 Zero-downtime deployment (nieuwe versie vervangt oude)

Je kunt auto-deploy uitschakelen in:
**Web Service** → **Settings** → **Auto-Deploy**

---

## 🛠️ Database Beheer

### Migrations Handmatig Uitvoeren

Normaal gesproken worden migraties automatisch uitgevoerd bij deployment.
Als je ze handmatig wilt uitvoeren:

1. Ga naar **Web Service** → **Shell** tab
2. Run:
   ```bash
   npx prisma migrate deploy
   ```

### Prisma Studio (Database Browser)

**Let op:** Prisma Studio werkt niet direct op Render.
Gebruik een PostgreSQL client zoals:
- **TablePlus** (Mac/Windows)
- **DBeaver** (Cross-platform)
- **pgAdmin** (Web-based)

Connection string vind je in:
**PostgreSQL Database** → **Info** → **External Connection String**

### Database Backup

Render maakt automatisch backups van je PostgreSQL database:
- **Free tier**: Geen automatische backups
- **Paid tier**: Dagelijkse backups (7 dagen retained)

**Handmatige backup:**
1. Ga naar **PostgreSQL Database** → **Backups**
2. Klik op **"Create Backup"**

---

## 🚨 Troubleshooting

### Deployment Faalt

**Symptoom:** Build failed / Health check failed

**Oplossingen:**
1. Check logs: **Web Service** → **Logs**
2. Veelvoorkomende oorzaken:
   - ❌ DATABASE_URL niet ingesteld
   - ❌ Migratie fouten
   - ❌ Out of memory (upgrade naar Standard plan)
   - ❌ Port configuratie (moet 3001 zijn)

### Database Connection Errors

**Symptoom:** `Error: P1001: Can't reach database server`

**Oplossingen:**
1. Check of PostgreSQL database draait
2. Verifieer DATABASE_URL in Environment variables
3. Check database IP allowlist (moet leeg zijn voor Render services)

### CORS Errors

**Symptoom:** `Access-Control-Allow-Origin` errors in browser

**Oplossingen:**
1. ✅ Zorg dat CORS_ORIGIN is ingesteld
2. ✅ Gebruik exacte URL (inclusief https://)
3. ✅ Geen trailing slash
4. ✅ Redeploy na wijziging

### Slow Performance / Timeouts

**Symptoom:** Requests duren lang / timeout errors

**Oplossingen:**
1. Check plan: Free tier spint down na 15 min (30-60s cold start)
2. Upgrade naar Standard plan voor always-on service
3. Check database queries (gebruik Prisma query logging)
4. Overweeg Redis caching

### App Spint Down (Free Tier)

**Symptoom:** Eerste request duurt 30-60 seconden

**Oplossing:**
- Dit is normaal voor Free tier
- Upgrade naar Standard plan ($7/maand) voor always-on

---

## 🔐 Security Best Practices

### ✅ Al geïmplementeerd:
- [x] HTTPS enforcement (gratis SSL)
- [x] JWT tokens in HttpOnly cookies
- [x] Bcrypt password hashing
- [x] Helmet.js security headers
- [x] CORS configuratie
- [x] Rate limiting (100 req/15min)
- [x] Input sanitization (XSS protection)
- [x] SQL injection protection (Prisma ORM)
- [x] Audit logging
- [x] Environment variables in Render vault (encrypted)

### 📝 Aanbevelingen:
- [ ] Wijzig standaard demo gebruikers wachtwoorden
- [ ] Stel sterke JWT_SECRET in (wordt auto-gegenereerd)
- [ ] Configureer 2FA voor Render dashboard
- [ ] Stel monitoring/alerting in (bijv. Sentry)
- [ ] Regular security audits
- [ ] Dependency updates (Dependabot)

---

## 📞 Support & Resources

### Render.com Documentatie
- Dashboard: https://dashboard.render.com
- Docs: https://docs.render.com
- Status: https://status.render.com
- Community: https://community.render.com

### Bedrijfsbeheer 3.0
- GitHub: https://github.com/mauricevan/bedrijfsbeheer3.0
- Issues: https://github.com/mauricevan/bedrijfsbeheer3.0/issues

### Handige Links
- Prisma Docs: https://www.prisma.io/docs
- Express.js: https://expressjs.com
- React: https://react.dev

---

## ✨ Klaar voor Deployment!

Je project is **100% plug-and-play** geconfigureerd voor Render.com.

**Quick Start:**
1. Push code naar GitHub
2. Create Blueprint op Render.com
3. Wacht 5-10 minuten
4. Stel CORS_ORIGIN in
5. ✅ Klaar!

**Vragen?** Open een issue op GitHub.

---

**Laatste update:** 16 november 2025
**Versie:** 3.0.0
**Status:** Production Ready 🚀
