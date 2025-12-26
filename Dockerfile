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

# Make nginx run as non-root user
RUN chgrp -R 0 /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R g+rwX /var/cache/nginx /var/run /var/log/nginx

# Create writable directories for temp files
RUN mkdir -p /tmp/nginx && chmod -R 777 /tmp/nginx

# Copy React build
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config (this goes to conf.d, not replaces main config)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx config user directive
RUN sed -i '/user  nginx;/d' /etc/nginx/nginx.conf

# Update temp paths to use /tmp
RUN sed -i '1i\
pid /tmp/nginx.pid;\
' /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]