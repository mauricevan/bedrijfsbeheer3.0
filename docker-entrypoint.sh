#!/bin/sh
# ==============================================
# BEDRIJFSBEHEER 3.0 - DOCKER ENTRYPOINT
# ==============================================
# Runs database migrations before starting the server
# Ensures database schema is always up-to-date

set -e

echo "========================================="
echo "🚀 Bedrijfsbeheer 3.0 - Starting..."
echo "========================================="

# Wait for database to be ready (optional, helps with docker-compose)
if [ -n "$DATABASE_URL" ]; then
  echo "📊 Database URL configured"
else
  echo "⚠️  WARNING: DATABASE_URL not set"
fi

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Check migration status
if [ $? -eq 0 ]; then
  echo "✅ Database migrations completed successfully"
else
  echo "❌ Database migrations failed!"
  exit 1
fi

echo "========================================="
echo "🎯 Starting Node.js server..."
echo "========================================="

# Execute the main command (start server)
exec "$@"
