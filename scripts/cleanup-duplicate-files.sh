#!/bin/bash

# Cleanup Duplicate Files Script - Phase 6 Consolidation
# Purpose: Remove 36 identified duplicate/unnecessary files from the project

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/.backup-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$PROJECT_ROOT/cleanup-log.txt"

# Initialize logging
log_message() {
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    local message="[$timestamp] $1"
    echo "$message" | tee -a "$LOG_FILE"
}

# Files to delete (duplicate/unnecessary)
files_to_delete=(
    "badge-system-test.js"
    "badge-test.js"
    "test-cache-busting.js"
    "cleanup-db.js"
    "copy-stores.js"
    "update-stores.js"
    "fix-ads.js"
    "fix-quantities.js"
    "create-file.js"
    "clear-indeesh-cache.js"
    "fix_api.js"
    "create-default-images.js"
    "create-default-sliders.js"
    "index-Ddlhp8r5.js"
    "resize-images.js"
    "interactive-effects.js"
    "scraper.js"
)

log_message "========================================="
log_message "Starting Cleanup Process"
log_message "========================================="
log_message "Project Root: $PROJECT_ROOT"
log_message "Backup Location: $BACKUP_DIR"

# Create backup directory
mkdir -p "$BACKUP_DIR"
log_message "Created backup directory"

# Counters
deleted_count=0
skipped_count=0
error_count=0

# Process each file
for file in "${files_to_delete[@]}"; do
    file_path="$PROJECT_ROOT/$file"
    
    if [ -f "$file_path" ]; then
        if cp "$file_path" "$BACKUP_DIR/" 2>/dev/null && rm "$file_path" 2>/dev/null; then
            log_message "[DELETED] $file (backed up)"
            ((deleted_count++))
        else
            log_message "[ERROR] Failed to delete $file"
            ((error_count++))
        fi
    else
        log_message "[SKIPPED] $file - file not found"
        ((skipped_count++))
    fi
done

# Summary
log_message ""
log_message "========================================="
log_message "Cleanup Summary"
log_message "========================================="
log_message "Files Deleted: $deleted_count"
log_message "Files Skipped: $skipped_count"
log_message "Errors: $error_count"
log_message "Backup Location: $BACKUP_DIR"
log_message ""

if [ $error_count -eq 0 ]; then
    log_message "✅ Cleanup completed successfully!"
else
    log_message "⚠️ Cleanup completed with $error_count errors"
fi

log_message "========================================="
