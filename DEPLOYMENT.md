# 🚀 Bedrijfsbeheer 3.0 - Deployment Guide

Complete guide for deploying Bedrijfsbeheer 3.0 to production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Docker Deployment](#docker-deployment)
- [Manual Deployment](#manual-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Security Checklist](#security-checklist)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before deploying to production, ensure you have:

- **Node.js** 18+ or 22+ (LTS recommended)
- **PostgreSQL** 14+ database instance
- **Redis** (optional, but recommended for multi-instance deployments)
- **SSL Certificate** for HTTPS
- **Domain name** configured with DNS

---

## 🔐 Environment Setup

### 1. Create Production Environment File

Copy `.env.example` to `.env` and update all values:

```bash
cp .env.example .env
```

### 2. Required Environment Variables

**CRITICAL - Must be set:**

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
CORS_ORIGIN=https://your-domain.com
HTTPS_ONLY=true
```

**Recommended:**

```bash
REDIS_URL=redis://:password@redis-host:6379/0
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
LOG_LEVEL=info
```

### 3. Generate Secrets

Generate a strong JWT secret (64+ characters):

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE bedrijfsbeheer;
CREATE USER bedrijfsbeheer WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bedrijfsbeheer TO bedrijfsbeheer;
\q
```

### Option 2: Cloud PostgreSQL

**Recommended providers:**
- AWS RDS PostgreSQL
- Google Cloud SQL
- Azure Database for PostgreSQL
- DigitalOcean Managed Databases
- Supabase (includes free tier)

### Run Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Run migrations (production)
npm run db:deploy

# Verify migration
npx prisma migrate status
```

### Create Initial Admin User

```bash
# Connect to database
psql $DATABASE_URL

# Create admin user (update password hash)
INSERT INTO users (id, email, password_hash, name, is_admin, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@yourdomain.com',
  '$2b$10$YourBcryptHashHere',  -- Replace with actual hash
  'Admin User',
  true,
  NOW(),
  NOW()
);
```

**Generate password hash:**

```bash
node -e "console.log(require('bcrypt').hashSync('YourStrongPassword', 10))"
```

---

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# 1. Create .env file with production values
cp .env.example .env
# Edit .env and set all variables

# 2. Build and start all services
docker-compose up -d

# 3. Run database migrations
docker-compose exec app npx prisma migrate deploy

# 4. Check logs
docker-compose logs -f app

# 5. Access application
# Backend: http://localhost:3001/api
# Frontend: Served via nginx or CDN
```

### Production Docker Deployment

```bash
# Build production image
docker build -t bedrijfsbeheer:latest .

# Run with production config
docker run -d \
  --name bedrijfsbeheer-app \
  --restart unless-stopped \
  -p 3001:3001 \
  --env-file .env \
  -v $(pwd)/logs:/app/logs \
  bedrijfsbeheer:latest

# Check health
docker ps
docker logs bedrijfsbeheer-app
curl http://localhost:3001/api/health
```

### Docker Compose Production

```bash
# Use production profile
docker-compose --profile production up -d

# This includes:
# - PostgreSQL database
# - Redis for rate limiting
# - Application server
# - Nginx reverse proxy
```

---

## 🔧 Manual Deployment

### 1. Install Dependencies

```bash
# Install production dependencies only
npm ci --only=production

# Generate Prisma client
npm run db:generate
```

### 2. Build Frontend

```bash
# Build Vite frontend
npm run build

# Output will be in dist/
```

### 3. Setup Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start backend/server.js --name bedrijfsbeheer-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Monitor application
pm2 monit
pm2 logs bedrijfsbeheer-api
```

### 4. Setup Nginx Reverse Proxy

Create `/etc/nginx/sites-available/bedrijfsbeheer`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend (static files)
    location / {
        root /var/www/bedrijfsbeheer/dist;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/bedrijfsbeheer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## ☁️ Cloud Platforms

### AWS Deployment

**Services Used:**
- **EC2** or **ECS** for application
- **RDS PostgreSQL** for database
- **ElastiCache Redis** for caching
- **S3** for static assets
- **CloudFront** for CDN
- **Route 53** for DNS
- **ALB** for load balancing
- **CloudWatch** for monitoring

**Quick Deploy:**

```bash
# Install AWS CLI
aws configure

# Deploy using Docker
aws ecr create-repository --repository-name bedrijfsbeheer
docker tag bedrijfsbeheer:latest <account-id>.dkr.ecr.<region>.amazonaws.com/bedrijfsbeheer:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/bedrijfsbeheer:latest

# Create ECS service (see AWS docs)
```

### DigitalOcean Deployment

```bash
# Install doctl
doctl auth init

# Create app
doctl apps create --spec app.yaml

# Monitor deployment
doctl apps list
doctl apps logs <app-id>
```

### Vercel/Netlify (Frontend Only)

```bash
# Build frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or Netlify
netlify deploy --prod --dir=dist
```

**Note:** Backend must be deployed separately to a Node.js hosting provider.

---

## 🔒 Security Checklist

Before going live, verify all items:

### Critical
- [ ] `NODE_ENV=production` is set
- [ ] `JWT_SECRET` is a strong random string (64+ chars)
- [ ] `DATABASE_URL` points to production database
- [ ] `CORS_ORIGIN` is set to production domain (HTTPS)
- [ ] `HTTPS_ONLY=true` is enabled
- [ ] SSL certificate is installed and valid
- [ ] Default demo passwords are changed
- [ ] Database backup strategy is configured
- [ ] Firewall rules are configured (only ports 80, 443 open)

### High Priority
- [ ] Redis is configured for rate limiting
- [ ] Audit logging is enabled (automatic)
- [ ] Input sanitization is active (automatic)
- [ ] HttpOnly cookies are enabled (automatic)
- [ ] Rate limiting is working (test login attempts)
- [ ] Error messages don't expose sensitive info
- [ ] SMTP credentials are secure (use app passwords)

### Recommended
- [ ] Enable 2FA for admin accounts (future feature)
- [ ] Setup monitoring (Sentry, CloudWatch, etc.)
- [ ] Configure log rotation
- [ ] Setup automated database backups
- [ ] Run security audit: `npm audit`
- [ ] Test disaster recovery procedure
- [ ] Document incident response plan

---

## 📊 Monitoring & Logging

### Application Logs

Logs are stored in `/app/logs/` directory:
- `error.log` - Error-level logs
- `combined.log` - All logs

**View logs:**

```bash
# Docker
docker-compose logs -f app

# PM2
pm2 logs bedrijfsbeheer-api

# Direct
tail -f logs/combined.log
tail -f logs/error.log
```

### Health Checks

```bash
# API health check
curl https://yourdomain.com/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-11-16T...",
  "database": "connected"
}
```

### Monitoring Tools

**Recommended:**
- **Sentry** - Error tracking and performance monitoring
- **DataDog** - Full-stack monitoring
- **New Relic** - Application performance monitoring
- **CloudWatch** - AWS-specific monitoring
- **Prometheus + Grafana** - Self-hosted monitoring

**Setup Sentry:**

```bash
npm install @sentry/node

# Add to backend/server.js
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: 'your-dsn-here' });
```

---

## 🐛 Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs app
pm2 logs bedrijfsbeheer-api

# Verify environment
node -e "console.log(process.env.DATABASE_URL)"

# Test database connection
npx prisma db pull

# Check port availability
sudo netstat -tulpn | grep 3001
```

### Database Connection Errors

```bash
# Test PostgreSQL connection
psql $DATABASE_URL

# Check migrations
npx prisma migrate status

# Reset database (WARNING: deletes data)
npx prisma migrate reset --force
```

### Rate Limiting Not Working

```bash
# Check Redis connection
redis-cli -u $REDIS_URL ping

# Test rate limiting
for i in {1..10}; do curl -X POST https://yourdomain.com/api/auth/login; done
# Should return 429 after 5 attempts
```

### HTTPS Redirect Loop

```bash
# Check HTTPS_ONLY setting
echo $HTTPS_ONLY

# Verify proxy headers
curl -I https://yourdomain.com

# Check Nginx configuration
sudo nginx -t
```

### High Memory Usage

```bash
# Check container stats
docker stats bedrijfsbeheer-app

# Increase memory limit in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 1G
```

---

## 📞 Support

For issues or questions:
- Check the [README.md](./README.md)
- Review [backend/README.md](./backend/README.md)
- Check [docs/02-architecture/security.md](./docs/02-architecture/security.md)
- Create an issue on GitHub

---

## 📝 License

See [LICENSE](./LICENSE) file for details.
