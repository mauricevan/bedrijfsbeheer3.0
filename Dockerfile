# ==============================================
# BEDRIJFSBEHEER 3.0 - MULTI-STAGE DOCKERFILE
# ==============================================
# Builds both frontend and backend in a single container
# Optimized for production deployment

# ==============================================
# Stage 1: Frontend Build
# ==============================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Copy package files for frontend dependencies
COPY package*.json ./
COPY prisma ./prisma

# Install ALL dependencies (needed for building frontend)
RUN npm ci

# Copy frontend source files
COPY . .

# Build arguments for frontend configuration
# VITE_API_URL: API endpoint (default: /api for same-origin requests)
# DEPLOY_TARGET: Deployment platform (empty for Render, 'github' for GitHub Pages)
ARG VITE_API_URL=/api
ARG DEPLOY_TARGET=

# Set environment variables for Vite build
ENV VITE_API_URL=${VITE_API_URL}
ENV DEPLOY_TARGET=${DEPLOY_TARGET}

# Build frontend (Vite)
RUN npm run build

# ==============================================
# Stage 2: Backend Build
# ==============================================
FROM node:22-alpine AS backend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install production dependencies only
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# ==============================================
# Stage 3: Production Runtime
# ==============================================
FROM node:22-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy backend dependencies from backend-builder
COPY --from=backend-builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=backend-builder --chown=nodejs:nodejs /app/package*.json ./

# Copy backend source code
COPY --chown=nodejs:nodejs backend ./backend
COPY --chown=nodejs:nodejs prisma ./prisma

# Copy frontend build from frontend-builder
COPY --from=frontend-builder --chown=nodejs:nodejs /app/dist ./dist

# Copy entrypoint script
COPY --chown=nodejs:nodejs docker-entrypoint.sh ./

# Make entrypoint script executable
USER root
RUN chmod +x docker-entrypoint.sh

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose backend port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init and custom entrypoint for proper signal handling and migrations
ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]

# Start backend server (passed as argument to entrypoint script)
CMD ["node", "backend/server.js"]
