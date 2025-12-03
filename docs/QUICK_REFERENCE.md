# 🚀 Quick Reference - Store Creation Verification

## 30-Second Verification

```bash
# Replace "your-store" with your actual store subdomain

# 1. Check image directories
ls -la public/assets/your-store/ | head -10

# 2. Check JSON files
test -f public/assets/your-store/store.json && echo "✅ store.json" || echo "❌ Missing"
test -f public/assets/stores/index.json && echo "✅ index.json" || echo "❌ Missing"

# 3. Check TypeScript files
ls -la src/data/stores/your-store/ | grep -E "\.(ts|tsx)$"

# 4. Verify store in registry
grep -i "your-store" public/assets/stores/index.json && echo "✅ Registered" || echo "❌ Not registered"
```

---

## Command Cheat Sheet

### Using Windows PowerShell

```powershell
# Run verification
.\verify-store-creation.ps1

# Manual checks
Get-ChildItem public/assets/your-store/
Get-Content public/assets/your-store/store.json | ConvertFrom-Json
```

### Using Bash/Linux/Mac

```bash
# Run verification
./verify-store-creation.sh your-store

# Manual checks
tree public/assets/your-store/
cat public/assets/your-store/store.json | jq .
```

### Using Browser Console

```javascript
// Check creation logs
console.log('%c✅ Store Creation Status', 'font-size: 16px; color: green;')

// Check if store data exists
fetch('/assets/stores/index.json').then(r => r.json()).then(d => {
  console.log('Stores:', d.stores.map(s => s.slug))
})

// Check store data
fetch('/assets/your-store/store.json').then(r => r.json()).then(d => {
  console.log('Store:', d)
})
```

---

## What Should Exist After Creation

### ✅ All of These:

```
public/assets/your-store/
├── logo/logo_*.png                    (1+ file)
├── products/product_*_*.jpg          (1+ files)
├── sliders/slider_*.webp             (1+ files)
└── store.json                        (valid JSON)

public/assets/stores/
└── index.json                        (contains your-store)

src/data/stores/your-store/
├── config.ts
├── products.ts
├── sliderData.ts
├── Slider.tsx
└── index.ts
```

---

## Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| Images missing | Verify you uploaded them during creation |
| store.json invalid | Run: `jq . public/assets/your-store/store.json` to see error |
| Not in index.json | Check Backend was running when you created store |
| TypeScript files missing | Can still use store (less critical) |
| Wrong image paths | Check JSON file paths vs actual files |

---

## One-Liner Tests

```bash
# All images exist?
test $(find public/assets/your-store -type f | wc -l) -gt 0 && echo "✅ Images" || echo "❌"

# JSON is valid?
jq . public/assets/your-store/store.json > /dev/null && echo "✅ JSON" || echo "❌"

# TypeScript files exist?
test $(ls src/data/stores/your-store/*.ts* 2>/dev/null | wc -l) -gt 0 && echo "✅ TS" || echo "❌"

# Store registered?
jq '.stores[] | select(.slug == "your-store")' public/assets/stores/index.json > /dev/null && echo "✅ Registered" || echo "❌"
```

---

## Expected Folder Sizes

After creation, expect:

| Folder | Typical Size |
|--------|-------------|
| logo/ | 50-500 KB |
| products/ | 1-10 MB |
| sliders/ | 500-2 MB |
| store.json | 10-100 KB |

---

## Frontend Integration

```typescript
// Your store data is available at:
import { products, config, sliderData } from '@/data/stores/your-store'

// Or from JSON:
fetch('/assets/your-store/store.json').then(r => r.json())
```

---

## Common Paths

```
Your Store Subdomain: amazing-shop

Images:     /assets/amazing-shop/logo/*
            /assets/amazing-shop/products/*
            /assets/amazing-shop/sliders/*

Store Data: /assets/amazing-shop/store.json
            /assets/stores/index.json

TS Files:   src/data/stores/amazing-shop/*
```

---

## Verification Status Codes

| Symbol | Meaning |
|--------|---------|
| ✅ | File/Directory exists and is valid |
| ❌ | Missing or invalid |
| ⚠️  | Exists but may have issues |
| ℹ️  | Informational |

---

## Quick Diagnostic

```bash
echo "=== Store Diagnostic ==="
echo "Store: your-store"
echo "---"
echo -n "Images exist: "
test -d public/assets/your-store && echo "✅" || echo "❌"
echo -n "Store JSON: "
test -f public/assets/your-store/store.json && echo "✅" || echo "❌"
echo -n "Index JSON: "
test -f public/assets/stores/index.json && echo "✅" || echo "❌"
echo -n "TS Files: "
test -d src/data/stores/your-store && echo "✅" || echo "❌"
echo "---"
echo "Image count: $(find public/assets/your-store -type f 2>/dev/null | wc -l)"
```

---

## File Sizes Expected

```bash
# Logo: 100-300 KB typical
ls -lh public/assets/your-store/logo/logo_*

# Product images: 200-500 KB each
ls -lh public/assets/your-store/products/

# Slider images: 300-800 KB each
ls -lh public/assets/your-store/sliders/

# JSON: 10-50 KB
ls -lh public/assets/your-store/store.json
```

---

## Success = All Green

```
✅ Images in 3 directories
✅ store.json is valid
✅ index.json has store entry
✅ 5 TypeScript files exist
✅ No console errors
✅ Store loads in browser
✅ Products display
✅ Slider works
✅ Add to cart functions
✅ Backend logs success
```

---

## Getting Help

If verification fails:

1. Run: `./verify-store-creation.sh your-store` (or .ps1 on Windows)
2. Check Backend logs for errors
3. Verify Backend is running: `curl http://localhost:4000/api/health`
4. Check Browser console (F12) for errors
5. Try creating store again

---

*🎉 Once all checks pass, your store is live and ready for customers!*
