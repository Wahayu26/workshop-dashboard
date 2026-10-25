# Multi-stage Dockerfile for NestJS API in PNPM Monorepo
FROM node:22-slim AS builder

RUN npm install -g pnpm@10
WORKDIR /app

# Copy root manifests & code
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Install dependencies & build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bengkelku/shared build
RUN pnpm --filter @bengkelku/api db:generate
RUN pnpm --filter @bengkelku/api build

# Stage 2: Production runner
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY apps/api/prisma ./apps/api/prisma

# Copy node_modules from builder stage (zero redundant downloads, Prisma client included)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
