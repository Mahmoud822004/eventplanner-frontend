# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build React app
RUN npm run build

# ---- Serve Stage ----
FROM nginx:alpine

# Copy React build
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
