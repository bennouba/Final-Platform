# Cleanup Duplicate Files Script - Phase 6 Consolidation
# Purpose: Remove 36 identified duplicate/unnecessary files from the project
# Author: Project Management System
# Date: December 5, 2025

# Configuration
$projectRoot = "C:\Users\dataf\Downloads\Eishro-Platform_V7"
$backupDir = "$projectRoot\.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$logFile = "$projectRoot\cleanup-log.txt"

# Initialize logging
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Write-Host $logMessage
    Add-Content -Path $logFile -Value $logMessage
}

# Files to delete (duplicate/unnecessary)
$filesToDelete = @(
    # Badge System Duplicates (9 files)
    "badge-system-test.js",
    "badge-test.js",
    "badge-old.js",
    "badge-backup.js",
    "badge-system-old.js",
    "badge-v1.js",
    "badge-v2.js",
    "badge-store-v1.js",
    "badge-copy.js",
    
    # Test Files Duplicates (5 files)
    "test-cache-busting.js",
    "test-old.js",
    "test-backup.js",
    "test-v1.js",
    "test-migration.js",
    
    # Cleanup/Migration Scripts (8 files)
    "cleanup-db.js",
    "copy-stores.js",
    "update-stores.js",
    "fix-quantities.js",
    "fix-ads.js",
    "create-file.js",
    "clear-indeesh-cache.js",
    "fix_api.js",
    
    # Store Creation Duplicates (4 files)
    "create-store-old.js",
    "create-store-backup.js",
    "indeesh-setup.js",
    "store-setup-old.js",
    
    # Server/Config Duplicates (3 files)
    "server\package.js",
    "server_google\index.js",
    "package.js",
    
    # Utility/Tool Duplicates (2 files)
    "index-Ddlhp8r5.js",
    "resize-images.js"
)

# Directories to check (will be kept but cleaned)
$dirsToReview = @(
    "$projectRoot\docs",
    "$projectRoot\backend\docs"
)

# Start cleanup
Write-Log "========================================="
Write-Log "Starting Cleanup Process"
Write-Log "========================================="
Write-Log "Project Root: $projectRoot"
Write-Log "Backup Location: $backupDir"

# Create backup directory
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Log "Created backup directory"
}

# Counter variables
$deletedCount = 0
$skippedCount = 0
$errorCount = 0

# Process each file
foreach ($file in $filesToDelete) {
    $filePath = "$projectRoot\$file"
    
    if (Test-Path $filePath) {
        try {
            # Create backup
            $backupFile = "$backupDir\$([System.IO.Path]::GetFileName($file))"
            Copy-Item -Path $filePath -Destination $backupFile -Force
            
            # Delete original
            Remove-Item -Path $filePath -Force
            Write-Log "[DELETED] $file (backed up)"
            $deletedCount++
        }
        catch {
            Write-Log "[ERROR] Failed to delete $file - $_"
            $errorCount++
        }
    }
    else {
        Write-Log "[SKIPPED] $file - file not found"
        $skippedCount++
    }
}

# Additional cleanup - empty directories in root
Write-Log ""
Write-Log "Checking for empty directories..."
$emptyDirs = Get-ChildItem -Path $projectRoot -Directory -ErrorAction SilentlyContinue | `
    Where-Object { (Get-ChildItem -Path $_.FullName -ErrorAction SilentlyContinue).Count -eq 0 }

foreach ($dir in $emptyDirs) {
    try {
        Remove-Item -Path $dir.FullName -Force
        Write-Log "[REMOVED] Empty directory: $($dir.Name)"
    }
    catch {
        Write-Log "[NOTICE] Could not remove directory: $($dir.Name) - $_"
    }
}

# Summary
Write-Log ""
Write-Log "========================================="
Write-Log "Cleanup Summary"
Write-Log "========================================="
Write-Log "Files Deleted: $deletedCount"
Write-Log "Files Skipped: $skippedCount"
Write-Log "Errors: $errorCount"
Write-Log "Backup Location: $backupDir"
Write-Log ""
Write-Log "Disk Space Freed: ~2.5 MB (estimated)"
Write-Log "========================================="

# Calculate freed space
$backupSize = (Get-ChildItem -Path $backupDir -Recurse | Measure-Object -Property Length -Sum).Sum
$freedSpace = [Math]::Round($backupSize / 1MB, 2)
Write-Log "Actual Freed Space: $freedSpace MB"

# Final status
if ($errorCount -eq 0) {
    Write-Log "✅ Cleanup completed successfully!"
}
else {
    Write-Log "⚠️ Cleanup completed with $errorCount errors - review log for details"
}

Write-Log ""
Write-Log "All files backed up in: $backupDir"
Write-Log "For restoration, copy files back from backup directory"
