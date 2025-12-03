#!/bin/bash

# Store Creation Verification Script
# This script verifies that all required files and directories are created after store creation

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Store subdomain (change this to your store's subdomain)
STORE_SUBDOMAIN="${1:-.}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        Store Creation Verification Script                 ║${NC}"
echo -e "${BLUE}║   التحقق من عملية إنشاء المتجر - Eishro Platform         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if file/directory exists
check_path() {
    local path="$1"
    local name="$2"
    
    if [ -e "$path" ]; then
        echo -e "${GREEN}✅${NC} $name"
        return 0
    else
        echo -e "${RED}❌${NC} $name"
        return 1
    fi
}

# Function to count files in directory
count_files() {
    local dir="$1"
    if [ -d "$dir" ]; then
        find "$dir" -type f | wc -l
    else
        echo "0"
    fi
}

# Function to validate JSON file
validate_json() {
    local file="$1"
    local name="$2"
    
    if [ -f "$file" ]; then
        if jq . "$file" > /dev/null 2>&1; then
            echo -e "${GREEN}✅${NC} $name (valid JSON)"
            return 0
        else
            echo -e "${RED}❌${NC} $name (invalid JSON)"
            return 1
        fi
    else
        echo -e "${RED}❌${NC} $name (file not found)"
        return 1
    fi
}

echo -e "${YELLOW}1️⃣  Checking Image Directories...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_path "public/assets" "📁 public/assets directory"
check_path "public/assets/stores" "📁 public/assets/stores directory"

echo ""
echo -e "${YELLOW}2️⃣  Checking Store Assets...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$STORE_SUBDOMAIN" != "." ]; then
    STORE_PATH="public/assets/$STORE_SUBDOMAIN"
    
    check_path "$STORE_PATH" "📁 Store directory: $STORE_PATH"
    check_path "$STORE_PATH/logo" "📁 Logo directory"
    check_path "$STORE_PATH/products" "📁 Products directory"
    check_path "$STORE_PATH/sliders" "📁 Sliders directory"
    
    echo ""
    echo "   File Counts:"
    logo_count=$(count_files "$STORE_PATH/logo")
    products_count=$(count_files "$STORE_PATH/products")
    sliders_count=$(count_files "$STORE_PATH/sliders")
    
    echo -e "   - Logo files: ${BLUE}$logo_count${NC}"
    echo -e "   - Product images: ${BLUE}$products_count${NC}"
    echo -e "   - Slider images: ${BLUE}$sliders_count${NC}"
else
    echo -e "${YELLOW}ℹ️  Usage: ./verify-store-creation.sh [store-subdomain]${NC}"
    echo -e "${YELLOW}   Or check multiple stores:${NC}"
    echo ""
    
    if [ -d "public/assets" ]; then
        echo "   Available stores:"
        for dir in public/assets/*/; do
            if [ "$(basename "$dir")" != "stores" ]; then
                echo -e "   - $(basename "$dir")"
            fi
        done
    fi
fi

echo ""
echo -e "${YELLOW}3️⃣  Checking JSON Files...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

validate_json "public/assets/stores/index.json" "📄 Stores Index (index.json)"

if [ "$STORE_SUBDOMAIN" != "." ]; then
    validate_json "public/assets/$STORE_SUBDOMAIN/store.json" "📄 Store Data (store.json)"
    
    echo ""
    echo -e "${YELLOW}4️⃣  Checking TypeScript Files...${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    TS_PATH="src/data/stores/$STORE_SUBDOMAIN"
    
    check_path "$TS_PATH" "📁 TypeScript store directory"
    check_path "$TS_PATH/config.ts" "📄 config.ts"
    check_path "$TS_PATH/products.ts" "📄 products.ts"
    check_path "$TS_PATH/sliderData.ts" "📄 sliderData.ts"
    check_path "$TS_PATH/Slider.tsx" "📄 Slider.tsx"
    check_path "$TS_PATH/index.ts" "📄 index.ts"
    
    echo ""
    echo -e "${YELLOW}5️⃣  Analyzing Store Data...${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -f "public/assets/$STORE_SUBDOMAIN/store.json" ]; then
        echo "Store Information:"
        jq -r '.nameAr, .nameEn, .description' "public/assets/$STORE_SUBDOMAIN/store.json" | head -3 | while read line; do
            echo -e "  • $line"
        done
        
        echo ""
        echo "Data Summary:"
        echo -e "  • Store ID: $(jq -r '.storeId' "public/assets/$STORE_SUBDOMAIN/store.json")"
        echo -e "  • Products: $(jq '.products | length' "public/assets/$STORE_SUBDOMAIN/store.json")"
        echo -e "  • Slider Images: $(jq '.sliderImages | length' "public/assets/$STORE_SUBDOMAIN/store.json")"
        echo -e "  • Status: $(jq -r '.status' "public/assets/$STORE_SUBDOMAIN/store.json")"
        echo -e "  • Created: $(jq -r '.createdAt' "public/assets/$STORE_SUBDOMAIN/store.json")"
    fi
    
    echo ""
    echo -e "${YELLOW}6️⃣  Checking Index Registration...${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if jq ".stores[] | select(.slug == \"$STORE_SUBDOMAIN\")" "public/assets/stores/index.json" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} Store is registered in index.json"
        jq ".stores[] | select(.slug == \"$STORE_SUBDOMAIN\") | {name, productsCount, lastUpdated}" "public/assets/stores/index.json"
    else
        echo -e "${RED}❌${NC} Store is NOT registered in index.json"
    fi
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  Verification Complete                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
