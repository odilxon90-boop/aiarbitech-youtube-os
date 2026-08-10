#!/bin/bash
# PostgreSQL Database Restore Script
# Usage: ./restore-db.sh <backup-timestamp> [target-db]
# Restores database from S3 backup

set -euo pipefail

# Check arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 <backup-timestamp> [target-db]"
    echo "Example: $0 20260809_020000 youtube_os_restored"
    exit 1
fi

TIMESTAMP=$1
TARGET_DB=${2:-${DB_NAME:-youtube_os}}
BACKUP_DIR="/tmp/restores"
S3_BUCKET="${BACKUP_BUCKET:-aiarbitech-youtube-os-backups}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
S3_KEY="database/${TIMESTAMP}/backup.sql.gz"
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql.gz"

# Create restore directory
mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting database restore..."
echo "Timestamp: ${TIMESTAMP}"
echo "Target database: ${TARGET_DB}"
echo "Source: s3://${S3_BUCKET}/${S3_KEY}"

# Check if backup exists in S3
if ! aws s3 ls "s3://${S3_BUCKET}/${S3_KEY}" > /dev/null 2>&1; then
    echo "[$(date)] ERROR: Backup not found in S3"
    exit 1
fi

# Download backup from S3
echo "[$(date)] Downloading backup from S3..."
if aws s3 cp "s3://${S3_BUCKET}/${S3_KEY}" "${BACKUP_FILE}"; then
    echo "[$(date)] Backup downloaded successfully"
    echo "File size: $(du -h "${BACKUP_FILE}" | cut -f1)"
    
    # Download and verify checksum
    CHECKSUM_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql.gz.sha256"
    if aws s3 cp "s3://${S3_BUCKET}/${TIMESTAMP}/backup.sql.gz.sha256" "${CHECKSUM_FILE}" 2>/dev/null; then
        EXPECTED_CHECKSUM=$(cut -d' ' -f1 "${CHECKSUM_FILE}")
        ACTUAL_CHECKSUM=$(sha256sum "${BACKUP_FILE}" | cut -d' ' -f1)
        
        if [ "${EXPECTED_CHECKSUM}" != "${ACTUAL_CHECKSUM}" ]; then
            echo "[$(date)] ERROR: Checksum verification failed"
            echo "Expected: ${EXPECTED_CHECKSUM}"
            echo "Actual: ${ACTUAL_CHECKSUM}"
            exit 1
        fi
        echo "[$(date)] Checksum verified successfully"
    fi
    
    # Create target database if it doesn't exist
    echo "[$(date)] Creating target database..."
    PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" \
        -tc "SELECT 1 FROM pg_database WHERE datname = '${TARGET_DB}'" | grep -q 1 || \
    PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" \
        -c "CREATE DATABASE ${TARGET_DB}"
    
    # Terminate existing connections
    echo "[$(date)] Terminating existing connections..."
    PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" \
        -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${TARGET_DB}' AND pid <> pg_backend_pid()" || true
    
    # Restore database
    echo "[$(date)] Restoring database..."
    if gunzip -c "${BACKUP_FILE}" | PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${TARGET_DB}" \
        --verbose \
        --single-transaction; then
        
        echo "[$(date)] Database restored successfully"
        
        # Verify restore
        echo "[$(date)] Verifying restore..."
        TABLE_COUNT=$(PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" \
            -d "${TARGET_DB}" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'")
        
        echo "[$(date)] Tables in restored database: ${TABLE_COUNT}"
        
        if [ "${TABLE_COUNT}" -gt 0 ]; then
            echo "[$(date)] Restore verification successful"
            
            # Cleanup
            rm -f "${BACKUP_FILE}" "${CHECKSUM_FILE}"
            
            # Send success notification
            if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
                curl -X POST -H 'Content-type: application/json' \
                    --data "{\"text\":\"✅ Database restore completed successfully\\nTimestamp: ${TIMESTAMP}\\nTarget: ${TARGET_DB}\\nTables: ${TABLE_COUNT}\"}" \
                    "${SLACK_WEBHOOK_URL}"
            fi
            
            echo "[$(date)] Restore completed successfully"
            exit 0
        else
            echo "[$(date)] ERROR: Restore verification failed - no tables found"
            exit 1
        fi
    else
        echo "[$(date)] ERROR: Failed to restore database"
        exit 1
    fi
else
    echo "[$(date)] ERROR: Failed to download backup from S3"
    exit 1
fi
