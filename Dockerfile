# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/ ./  
CMD ["npm", "run", "start"]
