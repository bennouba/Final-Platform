# PowerShell Store Creation Test & Verification Script
# This script tests the complete store creation flow

param(
    [string]$StoreSlug = "test-store-$(Get-Date -Format 'yyyyMMddHHmmss')",
    [string]$StoreName = "Test Store",
    [string]$Action = "full"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = "C:\Users\dataf\Downloads\Eishro-Platform_V7"

# Colors for output
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Blue = "Cyan"

function Write-Success($msg) {
    Write-Host "✅ $msg" -ForegroundColor $Green
}

function Write-Error($msg) {
    Write-Host "❌ $msg" -ForegroundColor $Red
}

function Write-Info($msg) {
    Write-Host "ℹ️  $msg" -ForegroundColor $Blue
}

function Write-Warning($msg) {
    Write-Host "⚠️  $msg" -ForegroundColor $Yellow
}

function Test-FileExists {
    param([string]$Path, [string]$Description)
    
    if (Test-Path $Path) {
        Write-Success "$Description exists: $Path"
        return $true
    } else {
        Write-Error "$Description missing: $Path"
        return $false
    }
}

function Get-FileSize {
    param([string]$Path)
    if (Test-Path $Path) {
        $size = (Get-Item $Path).Length
        return "{0:N0} bytes" -f $size
    }
    return "N/A"
}

function Test-JsonValid {
    param([string]$Path)
    
    if (-not (Test-Path $Path)) {
        Write-Error "JSON file not found: $Path"
        return $false
    }
    
    try {
        $content = Get-Content $Path -Raw
        $json = $content | ConvertFrom-Json
        Write-Success "Valid JSON: $Path"
        return $true
    } catch {
        Write-Error "Invalid JSON in $Path: $_"
        return $false
    }
}

# ============================================================================
# PHASE 1: Pre-Creation Checks
# ============================================================================

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              PHASE 1: PRE-CREATION CHECKS                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Info "Checking project structure..."
$preChecks = @(
    @{Path = "$ProjectRoot\src\data\stores"; Desc = "Stores directory"},
    @{Path = "$ProjectRoot\public\assets"; Desc = "Assets directory"},
    @{Path = "$ProjectRoot\backend\src\services\storeGeneratorService.ts"; Desc = "Store generator service"},
    @{Path = "$ProjectRoot\backend\src\routes\storeController.ts"; Desc = "Store controller"},
    @{Path = "$ProjectRoot\src\pages\CreateStorePage.tsx"; Desc = "Store creation page"}
)

$preChecksPassed = 0
$preChecksTotal = $preChecks.Count

foreach ($check in $preChecks) {
    if (Test-FileExists $check.Path $check.Desc) {
        $preChecksPassed++
    }
}

Write-Host "`nPre-creation checks: $preChecksPassed / $preChecksTotal passed" -ForegroundColor Cyan

# ============================================================================
# PHASE 2: Existing Stores Analysis
# ============================================================================

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           PHASE 2: EXISTING STORES ANALYSIS                  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Info "Analyzing existing stores..."

$storesPath = "$ProjectRoot\src\data\stores"
$existingStores = @()

Get-ChildItem -Path $storesPath -Directory -Exclude "shared" | ForEach-Object {
    $storePath = $_.FullName
    $storeName = $_.Name
    
    Write-Info "Store: $storeName"
    
    $files = @(
        "config.ts",
        "products.ts",
        "Slider.tsx",
        "index.ts",
        "sliderData.ts"
    )
    
    $filesExist = 0
    foreach ($file in $files) {
        $filePath = "$storePath\$file"
        if (Test-Path $filePath) {
            $size = Get-FileSize $filePath
            Write-Success "  ✓ $file ($size)"
            $filesExist++
        } else {
            Write-Error "  ✗ $file missing"
        }
    }
    
    # Check for JSON files
    $jsonPath = "$ProjectRoot\public\assets\$storeName\store.json"
    if (Test-Path $jsonPath) {
        $size = Get-FileSize $jsonPath
        Write-Success "  ✓ store.json ($size)"
    } else {
        Write-Error "  ✗ store.json missing"
    }
    
    # Check for image directories
    $logoDirPath = "$ProjectRoot\public\assets\$storeName\logo"
    $productsDirPath = "$ProjectRoot\public\assets\$storeName\products"
    $slidersDirPath = "$ProjectRoot\public\assets\$storeName\sliders"
    
    $logoDirExists = Test-Path $logoDirPath
    $productsDirExists = Test-Path $productsDirPath
    $slidersDirExists = Test-Path $slidersDirPath
    
    if ($logoDirExists) { Write-Success "  ✓ logo directory exists" } else { Write-Warning "  ⚠ logo directory missing" }
    if ($productsDirExists) { Write-Success "  ✓ products directory exists" } else { Write-Warning "  ⚠ products directory missing" }
    if ($slidersDirExists) { Write-Success "  ✓ sliders directory exists" } else { Write-Warning "  ⚠ sliders directory missing" }
    
    $existingStores += @{
        Name = $storeName
        Path = $storePath
        FilesExist = $filesExist
        TotalFiles = $files.Count
    }
}

Write-Host "`nTotal existing stores: $($existingStores.Count)" -ForegroundColor Cyan

# ============================================================================
# PHASE 3: Store Index Verification
# ============================================================================

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         PHASE 3: STORE INDEX VERIFICATION                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$indexPath = "$ProjectRoot\public\assets\stores\index.json"

if (Test-JsonValid $indexPath) {
    $indexData = Get-Content $indexPath -Raw | ConvertFrom-Json
    Write-Info "Registered stores in index.json:"
    
    foreach ($store in $indexData.stores) {
        Write-Host "  - $($store.slug): $($store.name)" -ForegroundColor Gray
        Write-Host "    Products: $($store.productsCount)" -ForegroundColor Gray
        Write-Host "    Categories: $($store.categories -join ', ')" -ForegroundColor Gray
    }
} else {
    Write-Warning "stores/index.json not found or invalid"
}

# ============================================================================
# PHASE 4: Directory Structure Analysis
# ============================================================================

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         PHASE 4: DIRECTORY STRUCTURE ANALYSIS                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Info "Checking public/assets structure..."
$assetsPath = "$ProjectRoot\public\assets"

Get-ChildItem -Path $assetsPath -Directory | Where-Object { $_.Name -notin @("banks", "brands", "payment", "partners", "shipping", "products", "slider", "stores", "DiscountSlider") } | ForEach-Object {
    $storePath = $_.FullName
    $storeName = $_.Name
    
    $logoCount = @(Get-ChildItem -Path "$storePath\logo" -File -ErrorAction SilentlyContinue).Count
    $productsCount = @(Get-ChildItem -Path "$storePath\products" -File -ErrorAction SilentlyContinue).Count
    $slidersCount = @(Get-ChildItem -Path "$storePath\sliders" -File -ErrorAction SilentlyContinue).Count
    
    Write-Host "  $storeName:" -ForegroundColor Gray
    Write-Host "    Logo files: $logoCount" -ForegroundColor Gray
    Write-Host "    Product files: $productsCount" -ForegroundColor Gray
    Write-Host "    Slider files: $slidersCount" -ForegroundColor Gray
}

# ============================================================================
# PHASE 5: Backend Service Check
# ============================================================================

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         PHASE 5: BACKEND SERVICE ANALYSIS                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Info "Checking storeGeneratorService configuration..."

$serviceFile = "$ProjectRoot\backend\src\services\storeGeneratorService.ts"
$serviceContent = Get-Content $serviceFile -Raw

$checks = @(
    @{Pattern = "generateStoreFiles"; Desc = "generateStoreFiles method"},
    @{Pattern = "generateConfigFile"; Desc = "generateConfigFile method"},
    @{Pattern = "generateProductsFile"; Desc = "generateProductsFile method"},
    @{Pattern = "generateSliderFile"; Desc = "generateSliderFile method"},
    @{Pattern = "generateJSONFiles"; Desc = "generateJSONFiles method"},
    @{Pattern = "updateStoresIndex"; Desc = "updateStoresIndex method"}
)

foreach ($check in $checks) {
    if ($serviceContent -match $check.Pattern) {
        Write-Success "$($check.Desc) found"
    } else {
        Write-Error "$($check.Desc) NOT FOUND"
    }
}

# ============================================================================
# PHASE 6: File Size Analysis
# ============================================================================

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         PHASE 6: FILE SIZE ANALYSIS                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Info "TypeScript files size analysis..."
$storesPath = "$ProjectRoot\src\data\stores"

Get-ChildItem -Path $storesPath -Directory -Exclude "shared" | ForEach-Object {
    $storePath = $_.FullName
    $storeName = $_.Name
    
    $totalSize = 0
    Get-ChildItem -Path $storePath -File -Filter "*.ts" -Include "*.tsx" | ForEach-Object {
        $totalSize += $_.Length
    }
    
    Write-Host "  $storeName: {0:N0} bytes" -f $totalSize -ForegroundColor Gray
}

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                        SUMMARY                               ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Info "Test Store Configuration:"
Write-Host "  Store Slug: $StoreSlug" -ForegroundColor Gray
Write-Host "  Store Name: $StoreName" -ForegroundColor Gray

Write-Info "Expected Structure After Creation:"
@(
    "src/data/stores/$StoreSlug/config.ts",
    "src/data/stores/$StoreSlug/products.ts",
    "src/data/stores/$StoreSlug/Slider.tsx",
    "src/data/stores/$StoreSlug/sliderData.ts",
    "src/data/stores/$StoreSlug/index.ts",
    "public/assets/$StoreSlug/store.json",
    "public/assets/$StoreSlug/logo/",
    "public/assets/$StoreSlug/products/",
    "public/assets/$StoreSlug/sliders/"
) | ForEach-Object {
    Write-Host "  □ $_" -ForegroundColor Gray
}

Write-Host "`n" -ForegroundColor Cyan
Write-Success "Verification complete!"
Write-Info "Manual verification steps:"
Write-Host "1. Start backend: npm start (in backend directory)" -ForegroundColor Gray
Write-Host "2. Start frontend: npm run dev (in root directory)" -ForegroundColor Gray
Write-Host "3. Navigate to store creation page" -ForegroundColor Gray
Write-Host "4. Fill in all steps with test data" -ForegroundColor Gray
Write-Host "5. Click 'Create Store'" -ForegroundColor Gray
Write-Host "6. Verify all files created using this script" -ForegroundColor Gray
Write-Host "`n" -ForegroundColor Cyan
