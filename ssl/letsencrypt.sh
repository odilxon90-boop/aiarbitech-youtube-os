#!/usr/bin/env bash
set -euo pipefail

DOMAIN="youtube-os.aiarbitech.com"
EMAIL="${LETSENCRYPT_EMAIL:?Set LETSENCRYPT_EMAIL to the certificate renewal email address.}"

# The standalone challenge requires port 80 to be free while Certbot runs.
sudo systemctl stop nginx
trap 'sudo systemctl start nginx' EXIT

sudo certbot certonly \
  --standalone \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  --domain "$DOMAIN"

echo "Certificate created at /etc/letsencrypt/live/${DOMAIN}/"
