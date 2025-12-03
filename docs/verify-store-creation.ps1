# Store Creation Verification Script (PowerShell)
# This script verifies that all required files and directories are created after store creation

param(
    [string]$StoreSubdomain = ""
)

# Store subdomain (change this to your store's subdomain)
if ($StoreSubdomain -eq "") {
    $StoreSubdomain = Read-Host "Please enter store subdomain (e.g., your-store)"
}

# Function to write colored output
function Write-Status {
    param(
        [string]$Message,
        [string]$Status = "info"
    )
    
    $colors = @{
        "success" = "Green"
        "error"   = "Red"
        "warning" = "Yellow"
        "info"    = "Cyan"
    }
    
    Write-Host $Message -ForegroundColor $colors[$Status]
}

# Function to check if path exists
function Check-Path {
    param(
        [string]$Path,
        [string]$Name
    )
    
    if (Test-Path $Path) {
        Write-Status "✅ $Name" "success"
        return $true
    }
    else {
        Write-Status "❌ $Name" "error"
        return $false
    }
}

# Function to validate JSON
function Validate-JSON {
    param(
        [string]$FilePath,
        [string]$Name
    )
    
    if (Test-Path $FilePath) {
        try {
            $content = Get-Content $FilePath | ConvertFrom-Json
            Write-Status "✅ $Name (valid JSON)" "success"
            return $true
        }
        catch {
            Write-Status "❌ $Name (invalid JSON)" "error"
            return $false
        }
    }
    else {
        Write-Status "❌ $Name (file not found)" "error"
        return $false
    }
}

# Function to count files
function Count-Files {
    param(
        [string]$Directory
    )
    
    if (Test-Path $Directory) {
        (Get-ChildItem $Directory -Recurse -File | Measure-Object).Count
    }
    else {
        0
    }
}

# Main verification
Clear-Host

Write-Status "`n╔════════════════════════════════════════════════════════════╗" "info"
Write-Status "║        Store Creation Verification Script                 ║" "info"
Write-Status "║   التحقق من عملية إنشاء المتجر - Eishro Platform         ║" "info"
Write-Status "╚════════════════════════════════════════════════════════════╝" "info"

Write-Status "`n1️⃣  Checking Image Directories..." "warning"
Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "info"

Check-Path "public/assets" "📁 public/assets directory" | Out-Null
Check-Path "public/assets/stores" "📁 public/assets/stores directory" | Out-Null

Write-Status "`n2️⃣  Checking Store Assets..." "warning"
Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "info"

$StorePath = "public/assets/$StoreSubdomain"

if (Test-Path $StorePath) {
    Check-Path $StorePath "📁 Store directory: $StorePath" | Out-Null
    Check-Path "$StorePath/logo" "📁 Logo directory" | Out-Null
    Check-Path "$StorePath/products" "📁 Products directory" | Out-Null
    Check-Path "$StorePath/sliders" "📁 Sliders directory" | Out-Null
    
    Write-Status "`n   File Counts:" "info"
    
    $logoCount = Count-Files "$StorePath/logo"
    $productsCount = Count-Files "$StorePath/products"
    $slidersCount = Count-Files "$StorePath/sliders"
    
    Write-Host "   - Logo files: $logoCount" -ForegroundColor Cyan
    Write-Host "   - Product images: $productsCount" -ForegroundColor Cyan
    Write-Host "   - Slider images: $slidersCount" -ForegroundColor Cyan
}
else {
    Write-Status "   Store directory not found: $StorePath" "error"
    Write-Status "`n   Creating quick inventory of available stores:" "info"
    
    if (Test-Path "public/assets") {
        $stores = Get-ChildItem "public/assets" -Directory | Where-Object { $_.Name -ne "stores" }
        if ($stores.Count -gt 0) {
            Write-Status "   Available stores:" "info"
            foreach ($store in $stores) {
                Write-Host "   - $($store.Name)" -ForegroundColor Cyan
            }
        }
    }
}

Write-Status "`n3️⃣  Checking JSON Files..." "warning"
Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "info"

Validate-JSON "public/assets/stores/index.json" "📄 Stores Index (index.json)" | Out-Null

if (Test-Path "public/assets/$StoreSubdomain/store.json") {
    Validate-JSON "public/assets/$StoreSubdomain/store.json" "📄 Store Data (store.json)" | Out-Null
    
    Write-Status "`n4️⃣  Checking TypeScript Files..." "warning"
    Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "info"
    
    $TsPath = "src/data/stores/$StoreSubdomain"
    
    Check-Path $TsPath "📁 TypeScript store directory" | Out-Null
    Check-Path "$TsPath/config.ts" "📄 config.ts" | Out-Null
    Check-Path "$TsPath/products.ts" "📄 products.ts" | Out-Null
    Check-Path "$TsPath/sliderData.ts" "📄 sliderData.ts" | Out-Null
    Check-Path "$TsPath/Slider.tsx" "📄 Slider.tsx" | Out-Null
    Check-Path "$TsPath/index.ts" "📄 index.ts" | Out-Null
    
    Write-Status "`n5️⃣  Analyzing Store Data..." "warning"
    Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "info"
    
    if (Test-Path "public/assets/$StoreSubdomain/store.json") {
        $storeData = Get-Content "public/assets/$StoreSubdomain/store.json" | ConvertFrom-Json
        
        Write-Host "Store Information:" -ForegroundColor Cyan
        Write-Host "  • Arabic Name: $($storeData.nameAr)" -ForegroundColor Gray
        Write-Host "  • English Name: $($storeData.nameEn)" -ForegroundColor Gray
        Write-Host "  • Description: $($storeData.description)" -ForegroundColor Gray
        
        Write-Status "`nData Summary:" "info"
        Write-Host "  • Store ID: $($storeData.storeId)" -ForegroundColor Gray
        Write-Host "  • Products: $($storeData.products.Count)" -ForegroundColor Gray
        Write-Host "  • Slider Images: $($storeData.sliderImages.Count)" -ForegroundColor Gray
        Write-Host "  • Status: $($storeData.status)" -ForegroundColor Gray
        Write-Host "  • Created: $($storeData.createdAt)" -ForegroundColor Gray
    }
    
    Write-Status "`n6️⃣  Checking Index Registration..." "warning"
    Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "info"
    
    $indexData = Get-Content "public/assets/stores/index.json" | ConvertFrom-Json
    $storeEntry = $indexData.stores | Where-Object { $_.slug -eq $StoreSubdomain }
    
    if ($storeEntry) {
        Write-Status "✅ Store is registered in index.json" "success"
        Write-Host "  • Name: $($storeEntry.name)" -ForegroundColor Gray
        Write-Host "  • Products Count: $($storeEntry.productsCount)" -ForegroundColor Gray
        Write-Host "  • Last Updated: $($storeEntry.lastUpdated)" -ForegroundColor Gray
    }
    else {
        Write-Status "❌ Store is NOT registered in index.json" "error"
    }
}

Write-Status "`n╔════════════════════════════════════════════════════════════╗" "info"
Write-Status "║                  Verification Complete                     ║" "info"
Write-Status "╚════════════════════════════════════════════════════════════╝" "info"

Write-Host ""
