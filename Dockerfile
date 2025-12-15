FROM node:18-alpine

# Cài libc-compat để fix lỗi với Prisma
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit || npm ci

# Copy source code
COPY . .

# Generate Prisma Client trong build time
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

