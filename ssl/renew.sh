#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="/var/log/letsencrypt-renew.log"

sudo systemctl stop nginx >> "$LOG_FILE" 2>&1
trap 'sudo systemctl start nginx >> "$LOG_FILE" 2>&1' EXIT
sudo certbot renew --quiet >> "$LOG_FILE" 2>&1

# Install a daily renewal check with:
# 0 3 * * * /absolute/path/to/ssl/renew.sh
