#!/bin/bash
# Run this ONCE on the server to get your first SSL cert.
# Usage: ./init-ssl.sh your@email.com

set -e

EMAIL="${1:?Usage: ./init-ssl.sh your@email.com}"
DOMAIN="xn--brk-0na.dk"

echo "==> Starting temporary HTTP server for ACME challenge..."

# Start just nginx in HTTP-only mode (needs a temp config without SSL)
mkdir -p certbot/www certbot/conf

# Create a temporary nginx config (HTTP only, no SSL)
cat > nginx/default-init.conf << 'INITCONF'
server {
    listen 80;
    server_name xn--brk-0na.dk www.xn--brk-0na.dk;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'waiting for cert...';
        add_header Content-Type text/plain;
    }
}
INITCONF

# Build the app image first
docker compose build app

# Run a temp nginx container with HTTP-only config
docker run -d --name braek-init-nginx \
  -p 80:80 \
  -v "$(pwd)/nginx/default-init.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  $(docker compose images app -q 2>/dev/null || echo "nginx:alpine")

echo "==> Requesting certificate from Let's Encrypt..."

docker run --rm \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

echo "==> Cleaning up temp container..."
docker stop braek-init-nginx && docker rm braek-init-nginx
rm nginx/default-init.conf

echo "==> Starting full stack with SSL..."
docker compose up -d

echo ""
echo "✅ Done! bræk.dk is live with HTTPS."
