#!/bin/bash
# Automatic SSL Certificate Renewal Script
# Usage: ./renew.sh
# Should be run daily via cron job

set -euo pipefail

# Configuration
DOMAIN=${DOMAIN:-"youtube-os.aiarbitech.com"}
LOG_FILE="/var/log/ssl-renewal.log"
WEBROOT="/var/www/certbot"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${LOG_FILE}"
}

log "Starting SSL certificate renewal check for ${DOMAIN}"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    log "ERROR: certbot is not installed"
    exit 1
fi

# Attempt renewal
# Certbot will only renew if certificate expires within 30 days
if certbot renew \
    --webroot \
    --webroot-path="${WEBROOT}" \
    --quiet \
    --no-random-sleep-on-renew; then
    
    log "Certificate renewal check completed"
    
    # Check if certificate was actually renewed
    if [ -f "/etc/letsencrypt/renewal/${DOMAIN}.conf" ]; then
        # Get certificate expiry date
        CERT_EXPIRY=$(openssl x509 -enddate -noout -in "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" | cut -d= -f2)
        EXPIRY_EPOCH=$(date -d "${CERT_EXPIRY}" +%s)
        CURRENT_EPOCH=$(date +%s)
        DAYS_LEFT=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
        
        log "Certificate for ${DOMAIN} expires in ${DAYS_LEFT} days (${CERT_EXPIRY})"
        
        # Reload Nginx to apply new certificate
        if systemctl is-active --quiet nginx; then
            log "Reloading Nginx to apply new certificate"
            systemctl reload nginx
            log "Nginx reloaded successfully"
        fi
        
        # Send notification if certificate was renewed (less than 29 days left)
        if [ ${DAYS_LEFT} -lt 29 ]; then
            log "Certificate was renewed"
            
            # Send Slack notification if webhook is configured
            if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
                curl -X POST -H 'Content-type: application/json' \
                    --data "{\"text\":\"✅ SSL certificate renewed for ${DOMAIN}\\nExpires in ${DAYS_LEFT} days\"}" \
                    "${SLACK_WEBHOOK_URL}"
                log "Slack notification sent"
            fi
            
            # Send email notification if configured
            if [ -n "${ALERT_EMAIL:-}" ]; then
                echo "SSL certificate for ${DOMAIN} has been renewed. Expires in ${DAYS_LEFT} days." | \
                    mail -s "SSL Certificate Renewed: ${DOMAIN}" "${ALERT_EMAIL}"
                log "Email notification sent to ${ALERT_EMAIL}"
            fi
        fi
    fi
    
    log "Renewal process completed successfully"
    exit 0
else
    log "ERROR: Certificate renewal failed"
    
    # Send alert on failure
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"❌ SSL certificate renewal FAILED for ${DOMAIN}\\nCheck logs: ${LOG_FILE}\"}" \
            "${SLACK_WEBHOOK_URL}"
    fi
    
    if [ -n "${ALERT_EMAIL:-}" ]; then
        echo "SSL certificate renewal failed for ${DOMAIN}. Check logs: ${LOG_FILE}" | \
            mail -s "ALERT: SSL Certificate Renewal Failed" "${ALERT_EMAIL}"
    fi
    
    exit 1
fi
