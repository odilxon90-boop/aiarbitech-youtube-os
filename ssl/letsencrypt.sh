#!/bin/bash
# Let's Encrypt SSL Certificate Generation Script
# Usage: ./letsencrypt.sh [domain] [email]
# Generates SSL certificate using certbot with Nginx plugin

set -euo pipefail

# Configuration
DOMAIN=${1:-"youtube-os.aiarbitech.com"}
EMAIL=${2:-"admin@aiarbitech.com"}
WEBROOT="/var/www/certbot"
CERT_PATH="/etc/letsencrypt/live/${DOMAIN}"

echo "=========================================="
echo "Let's Encrypt Certificate Generation"
echo "=========================================="
echo "Domain: ${DOMAIN}"
echo "Email: ${EMAIL}"
echo "Certificate path: ${CERT_PATH}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "ERROR: This script must be run as root"
    exit 1
fi

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "Certbot not found. Installing..."
    
    # Detect package manager
    if command -v apt-get &> /dev/null; then
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    elif command -v yum &> /dev/null; then
        yum install -y epel-release
        yum install -y certbot python3-certbot-nginx
    elif command -v dnf &> /dev/null; then
        dnf install -y certbot python3-certbot-nginx
    else
        echo "ERROR: Unsupported package manager. Please install certbot manually."
        exit 1
    fi
fi

# Create webroot directory for HTTP-01 challenge
mkdir -p "${WEBROOT}"

# Check if certificate already exists
if [ -d "${CERT_PATH}" ]; then
    echo "Certificate already exists for ${DOMAIN}"
    echo "To renew, use: ./renew.sh"
    exit 0
fi

# Generate certificate
echo "Generating SSL certificate..."
certbot certonly \
    --webroot \
    --webroot-path="${WEBROOT}" \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    --non-interactive \
    --domains "${DOMAIN}" \
    --rsa-key-size 4096

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "Certificate generated successfully!"
    echo "=========================================="
    echo "Certificate: ${CERT_PATH}/fullchain.pem"
    echo "Private Key: ${CERT_PATH}/privkey.pem"
    echo "Chain: ${CERT_PATH}/chain.pem"
    echo ""
    echo "Next steps:"
    echo "1. Configure Nginx to use the certificate"
    echo "2. Set up automatic renewal: crontab -e"
    echo "   Add: 0 3 * * * /path/to/renew.sh"
    echo "3. Test SSL: https://www.ssllabs.com/ssltest/"
    echo ""
    
    # Set proper permissions
    chmod 600 "${CERT_PATH}/privkey.pem"
    chmod 644 "${CERT_PATH}/fullchain.pem"
    chmod 644 "${CERT_PATH}/chain.pem"
    
    # Reload Nginx if running
    if systemctl is-active --quiet nginx; then
        echo "Reloading Nginx..."
        systemctl reload nginx
    fi
    
    exit 0
else
    echo ""
    echo "ERROR: Certificate generation failed"
    echo "Check certbot logs: /var/log/letsencrypt/letsencrypt.log"
    exit 1
fi
