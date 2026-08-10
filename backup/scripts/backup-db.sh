#!/bin/bash
# PostgreSQL Database Backup Script
# Usage: ./backup-db.sh [timestamp]
# Creates compressed database dump and uploads to S3

set -euo pipefail

# Configuration
TIMESTAMP=${1:-$(date +%Y%m%d_%H%M%S)}
BACKUP_DIR="/tmp/backups"
S3_BUCKET="${BACKUP_BUCKET:-aiarbitech-youtube-os-backups}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-youtube_os}"
DB_USER="${DB_USER:-postgres}"
BACKUP_FILE="${BACKUP_DIR}/db_backup_${TIMESTAMP}.sql.gz"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting database backup..."
echo "Database: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
echo "Backup file: ${BACKUP_FILE}"

# Create compressed database dump
if PGPASSWORD="${DB_PASSWORD}" pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    --format=plain \
    --no-owner \
    --no-privileges \
    --verbose | gzip > "${BACKUP_FILE}"; then
    
    echo "[$(date)] Database dump created successfully"
    echo "File size: $(du -h "${BACKUP_FILE}" | cut -f1)"
    
    # Calculate checksum
    CHECKSUM=$(sha256sum "${BACKUP_FILE}" | cut -d' ' -f1)
    echo "${CHECKSUM}  $(basename "${BACKUP_FILE}")" > "${BACKUP_FILE}.sha256"
    echo "Checksum: ${CHECKSUM}"
    
    # Upload to S3
    S3_KEY="database/${TIMESTAMP}/backup.sql.gz"
    echo "[$(date)] Uploading to s3://${S3_BUCKET}/${S3_KEY}..."
    
    if aws s3 cp "${BACKUP_FILE}" "s3://${S3_BUCKET}/${S3_KEY}" \
        --storage-class STANDARD_IA \
        --sse AES256; then
        
        # Upload checksum file
        aws s3 cp "${BACKUP_FILE}.sha256" "s3://${S3_BUCKET}/${TIMESTAMP}/backup.sql.gz.sha256" \
            --sse AES256
        
        echo "[$(date)] Backup uploaded successfully"
        
        # Verify upload
        REMOTE_SIZE=$(aws s3 ls "s3://${S3_BUCKET}/${S3_KEY}" --human-readable | awk '{print $3}')
        LOCAL_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
        
        if [ "${REMOTE_SIZE}" = "${LOCAL_SIZE}" ]; then
            echo "[$(date)] Upload verified successfully"
        else
            echo "[$(date)] WARNING: Size mismatch - Local: ${LOCAL_SIZE}, Remote: ${REMOTE_SIZE}"
            exit 1
        fi
        
        # Cleanup local file
        rm -f "${BACKUP_FILE}" "${BACKUP_FILE}.sha256"
        
        # Send success notification
        if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
            curl -X POST -H 'Content-type: application/json' \
                --data "{\"text\":\"✅ Database backup completed successfully\\nTime: ${TIMESTAMP}\\nSize: ${LOCAL_SIZE}\"}" \
                "${SLACK_WEBHOOK_URL}"
        fi
        
        echo "[$(date)] Backup completed successfully"
        exit 0
    else
        echo "[$(date)] ERROR: Failed to upload backup to S3"
        exit 1
    fi
else
    echo "[$(date)] ERROR: Failed to create database dump"
    
    # Send failure notification
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"❌ Database backup FAILED\\nTime: ${TIMESTAMP}\\nError: See logs\"}" \
            "${SLACK_WEBHOOK_URL}"
    fi
    
    # Send email alert
    if [ -n "${ALERT_EMAIL:-}" ]; then
        echo "Database backup failed at ${TIMESTAMP}" | mail -s "ALERT: Database Backup Failed" "${ALERT_EMAIL}"
    fi
    
    exit 1
fi
