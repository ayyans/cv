# syntax=docker/dockerfile:1.7
# Multi-stage Dockerfile for Next.js 15 with `output: "standalone"`.
# Final image is ~150 MB and runs as a non-root user on Alpine.

# ── 1. Install dependencies with pnpm ────────────────────────────────
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app

# Copy only the manifest first so this layer is cached across code changes.
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --frozen-lockfile

# ── 2. Build the Next.js app ─────────────────────────────────────────
FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# ── 3. Runtime image (lean, non-root) ─────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Standalone output: minimal server.js + required node_modules subset.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
