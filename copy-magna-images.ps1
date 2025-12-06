$sourceDir = "C:\Users\dataf\Downloads\Eishro-Platform_V7\public\assets\magna-beauty"
$destDir = "C:\Users\dataf\Downloads\Eishro-Platform_V7\backend\public\assets\magna-beauty"

# Create destination directory if it doesn't exist
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Write-Host "Created directory: $destDir"
}

# Get all files except subdirectories (sliders)
$files = Get-ChildItem -Path $sourceDir -File -Recurse | Where-Object { $_.DirectoryName -eq $sourceDir }

# Copy each file
foreach ($file in $files) {
    $destFile = Join-Path -Path $destDir -ChildPath $file.Name
    Copy-Item -Path $file.FullName -Destination $destFile -Force
    Write-Host "Copied: $($file.Name)"
}

Write-Host "All files copied successfully!"
