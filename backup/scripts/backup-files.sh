#!/bin/bash
# Application Files Backup Script
# Usage: ./backup-files.sh [timestamp]
# Creates compressed archive of application files and uploads to S3

set -euo pipefail

# Configuration
TIMESTAMP=${1:-$(date +%Y%m%d_%H%M%S)}
BACKUP_DIR="/tmp/backups"
S3_BUCKET="${BACKUP_BUCKET:-aiarbitech-youtube-os-backups}"
BACKUP_FILE="${BACKUP_DIR}/files_backup_${TIMESTAMP}.tar.gz"

# Directories to backup (relative to project root)
BACKUP_PATHS=(
    "backend/uploads"
    "backend/exports"
    "backend/config"
    "frontend/public/assets"
)

# Exclude patterns
EXCLUDE_PATTERNS=(
    "*.log"
    "*.tmp"
    "node_modules"
    ".env"
    ".env.local"
    "*.key"
    "*.pem"
)

# Create backup directory
mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting files backup..."
echo "Backup file: ${BACKUP_FILE}"

# Build exclude arguments
EXCLUDE_ARGS=""
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    EXCLUDE_ARGS="${EXCLUDE_ARGS} --exclude=${pattern}"
done

# Build include paths
INCLUDE_PATHS=""
for path in "${BACKUP_PATHS[@]}"; do
    if [ -d "${path}" ]; then
        INCLUDE_PATHS="${INCLUDE_PATHS} ${path}"
    else
        echo "[$(date)] WARNING: Directory not found: ${path}"
    fi
done

if [ -z "${INCLUDE_PATHS}" ]; then
    echo "[$(date)] ERROR: No directories found to backup"
    exit 1
fi

echo "[$(date)] Backing up directories: ${INCLUDE_PATHS}"

# Create compressed tar archive
if tar ${EXCLUDE_ARGS} -czf "${BACKUP_FILE}" ${INCLUDE_PATHS} 2>/dev/null; then
    echo "[$(date)] Files archive created successfully"
    echo "File size: $(du -h "${BACKUP_FILE}" | cut -f1)"
    
    # Calculate checksum
    CHECKSUM=$(sha256sum "${BACKUP_FILE}" | cut -d' ' -f1)
    echo "${CHECKSUM}  $(basename "${BACKUP_FILE}")" > "${BACKUP_FILE}.sha256"
    echo "Checksum: ${CHECKSUM}"
    
    # Upload to S3
    S3_KEY="files/${TIMESTAMP}/backup.tar.gz"
    echo "[$(date)] Uploading to s3://${S3_BUCKET}/${S3_KEY}..."
    
    if aws s3 cp "${BACKUP_FILE}" "s3://${S3_BUCKET}/${S3_KEY}" \
        --storage-class STANDARD_IA \
        --sse AES256; then
        
        # Upload checksum file
        aws s3 cp "${BACKUP_FILE}.sha256" "s3://${S3_BUCKET}/files/${TIMESTAMP}/backup.tar.gz.sha256" \
            --sse AES256
        
        echo "[$(date)] Files backup uploaded successfully"
        
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
        
        # Implement retention policy (delete backups older than 30 days)
        echo "[$(date)] Applying retention policy..."
        RETENTION_DATE=$(date -d "30 days ago" +%Y%m%d_000000)
        
        # List and delete old backups
        aws s3 ls "s3://${S3_BUCKET}/files/" | grep "PRE" | awk '{print $2}' | sed 's/\///' | while read -r backup_time; do
            if [ "${backup_time}" \< "${RETENTION_DATE}" ]; then
                echo "[$(date)] Deleting old backup: ${backup_time}"
                aws s3 rm "s3://${S3_BUCKET}/files/${backup_time}/" --recursive
            fi
        done
        
        # Send success notification
        if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
            curl -X POST -H 'Content-type: application/json' \
                --data "{\"text\":\"✅ Files backup completed successfully\\nTime: ${TIMESTAMP}\\nSize: ${LOCAL_SIZE}\"}" \
                "${SLACK_WEBHOOK_URL}"
        fi
        
        echo "[$(date)] Files backup completed successfully"
        exit 0
    else
        echo "[$(date)] ERROR: Failed to upload files backup to S3"
        exit 1
    fi
else
    echo "[$(date)] ERROR: Failed to create files archive"
    
    # Send failure notification
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"❌ Files backup FAILED\\nTime: ${TIMESTAMP}\\nError: See logs\"}" \
            "${SLACK_WEBHOOK_URL}"
    fi
    
    exit 1
fi
