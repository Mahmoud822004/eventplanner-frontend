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

# Create writable cache directory for OpenShift random UID
RUN mkdir -p /opt/nginx/cache && chmod -R 0777 /opt/nginx/cache

# Copy React build
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Replace default temp paths with writable folder
RUN sed -i 's|client_body_temp_path /var/cache/nginx/client_temp;|client_body_temp_path /opt/nginx/cache;|' /etc/nginx/nginx.conf
RUN sed -i 's|proxy_temp_path /var/cache/nginx/proxy_temp;|proxy_temp_path /opt/nginx/cache;|' /etc/nginx/nginx.conf
RUN sed -i 's|fastcgi_temp_path /var/cache/nginx/fastcgi_temp;|fastcgi_temp_path /opt/nginx/cache;|' /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
