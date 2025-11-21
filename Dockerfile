# -------- BASE DEPS (install node_modules) --------
    FROM node:22-alpine AS deps
    WORKDIR /app
    
    # Install OS deps if needed (e.g. openssl for some packages)
    RUN apk add --no-cache libc6-compat
    
    COPY package.json package-lock.json* ./
    RUN npm ci
    
    # -------- BUILD STAGE --------
    FROM node:22-alpine AS builder
    WORKDIR /app
    
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    ENV NODE_ENV=production
    
    RUN npm run build
    
    # -------- RUNTIME STAGE --------
    FROM node:22-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=3000
    
    # Next.js needs these at runtime
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY package.json ./
    COPY --from=deps /app/node_modules ./node_modules
    
    EXPOSE 3000
    
    CMD ["npm", "run", "start"]
    