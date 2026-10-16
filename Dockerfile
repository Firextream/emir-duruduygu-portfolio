# syntax=docker/dockerfile:1
# Production image for duruduygu.com (Next.js output: 'standalone').
# Build: docker build -t duruduygu-web .
# Run:   docker run --env-file .env -p 3000:3000 duruduygu-web

FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Content source is read at build time for static pages and again at runtime for ISR.
ARG CONTENT_SOURCE=mock
ARG DIRECTUS_URL=
ARG DIRECTUS_ASSETS_URL=
ARG NEXT_PUBLIC_SITE_URL=https://www.duruduygu.com
ENV CONTENT_SOURCE=$CONTENT_SOURCE \
    DIRECTUS_URL=$DIRECTUS_URL \
    DIRECTUS_ASSETS_URL=$DIRECTUS_ASSETS_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
