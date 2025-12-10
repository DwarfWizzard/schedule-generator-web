FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm ci


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

# FROM node:20-alpine

# WORKDIR /app

# # чтобы работали типы, eslint, dev-сервер, hot reload
# RUN apk add --no-cache libc6-compat

# COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* .npmrc* ./

# RUN \
#   if [ -f yarn.lock ]; then yarn; \
#   elif [ -f package-lock.json ]; then npm install; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install; \
#   else echo "Lockfile not found." && exit 1; \
#   fi

# COPY . .

# ENV NODE_ENV=development

# EXPOSE 3000

# CMD ["npm", "run", "dev"]