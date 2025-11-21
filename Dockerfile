FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Install deps
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "dev"]
