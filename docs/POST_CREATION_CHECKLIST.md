# ✅ Post Store Creation Checklist

## تم إنشاء المتجر - Store Creation Complete!

بعد انتهاء عملية إنشاء المتجر، تأكد من وجود جميع الملفات والبيانات التالية:

---

## 🎯 Immediate Actions After Creation

### 1. **Run Verification** (Choose your OS)

**Windows (PowerShell):**
```powershell
.\verify-store-creation.ps1
# Enter your store subdomain when prompted
```

**Linux/Mac/Git Bash:**
```bash
chmod +x verify-store-creation.sh
./verify-store-creation.sh your-store-name
```

**Browser Console:**
```javascript
// Open F12 → Console
// Create store from UI and check logs
// Look for: "✅ Store files created successfully"
```

---

## 📂 File Structure Verification

### Directory Tree (Should Match)

```
your-store/
├── 📁 public/assets/your-store/
│   ├── 📁 logo/ → Contains: logo_*.{jpg|png|webp}
│   ├── 📁 products/ → Contains: product_*_*.{jpg|png|webp}
│   ├── 📁 sliders/ → Contains: slider_*_*.{jpg|png|webp}
│   └── 📄 store.json → Complete store data
│
├── 📁 public/assets/stores/
│   └── 📄 index.json → Registry of all stores
│
└── 📁 src/data/stores/your-store/
    ├── 📄 config.ts
    ├── 📄 products.ts
    ├── 📄 sliderData.ts
    ├── 📄 Slider.tsx
    └── 📄 index.ts
```

---

## ✅ Final Verification Checklist

### Image Assets (Required)

- [ ] **Logo Directory**
  ```bash
  test -d public/assets/your-store/logo && echo "✅ Logo dir exists"
  ls -la public/assets/your-store/logo | wc -l  # Should show ≥ 2 (header + file)
  ```

- [ ] **Product Images**
  ```bash
  test -d public/assets/your-store/products && echo "✅ Products dir exists"
  ls -la public/assets/your-store/products | wc -l  # Should show ≥ 2
  ```

- [ ] **Slider Images**
  ```bash
  test -d public/assets/your-store/sliders && echo "✅ Sliders dir exists"
  ls -la public/assets/your-store/sliders | wc -l  # Should show ≥ 2
  ```

### JSON Files (Critical)

- [ ] **Store JSON**
  ```bash
  test -f public/assets/your-store/store.json && echo "✅ store.json exists"
  jq . public/assets/your-store/store.json > /dev/null && echo "✅ Valid JSON"
  ```

- [ ] **Index JSON**
  ```bash
  test -f public/assets/stores/index.json && echo "✅ index.json exists"
  jq '.stores[] | select(.slug == "your-store")' public/assets/stores/index.json && echo "✅ Store registered"
  ```

### TypeScript Files (Development)

- [ ] **config.ts**
  ```bash
  test -f src/data/stores/your-store/config.ts && echo "✅ config.ts exists"
  ```

- [ ] **products.ts**
  ```bash
  test -f src/data/stores/your-store/products.ts && echo "✅ products.ts exists"
  ```

- [ ] **sliderData.ts**
  ```bash
  test -f src/data/stores/your-store/sliderData.ts && echo "✅ sliderData.ts exists"
  ```

- [ ] **Slider.tsx**
  ```bash
  test -f src/data/stores/your-store/Slider.tsx && echo "✅ Slider.tsx exists"
  ```

- [ ] **index.ts**
  ```bash
  test -f src/data/stores/your-store/index.ts && echo "✅ index.ts exists"
  ```

---

## 🔍 Data Validation

### Check Store Metadata

```bash
# Extract and display key info
jq '{
  id: .storeId,
  name: .nameAr,
  products: (.products | length),
  sliders: (.sliderImages | length),
  status: .status,
  created: .createdAt
}' public/assets/your-store/store.json
```

**Expected Output:**
```json
{
  "id": 1234567890,
  "name": "اسم متجرك",
  "products": 5,
  "sliders": 3,
  "status": "active",
  "created": "2025-11-18T14:30:00.000Z"
}
```

---

## 🔗 Image Path Validation

### Verify All Image References

```bash
# Check all product images exist
echo "Checking product image paths..."
jq -r '.products[].images[]' public/assets/your-store/store.json | while read img; do
  test -f "public${img}" && echo "✅ $img" || echo "❌ Missing: $img"
done

# Check slider images exist
echo "Checking slider image paths..."
jq -r '.sliderImages[].image' public/assets/your-store/store.json | while read img; do
  test -f "public${img}" && echo "✅ $img" || echo "❌ Missing: $img"
done

# Check logo exists
echo "Checking logo..."
jq -r '.logo' public/assets/your-store/store.json | while read img; do
  test -f "public${img}" && echo "✅ $img" || echo "❌ Missing: $img"
done
```

---

## 🌐 Browser Verification

### Test Store Loading

1. **Open Developer Tools** (F12)
2. **Go to Network Tab**
3. **Navigate to Store Page**
4. **Check Requests:**
   - [ ] `store.json` loads successfully (200 OK)
   - [ ] Logo image loads (200 OK)
   - [ ] Product images load (200 OK)
   - [ ] Slider images load (200 OK)

### Check Console Logs

1. **Open Console Tab** (F12 → Console)
2. **Look for Success Messages:**
   ```
   ✅ Store files created successfully for: your-store
   ✅ API store created: {...}
   ✅ Store created successfully on backend
   ```
3. **No Error Messages** (red ❌ entries)

---

## 📊 Backend Verification

### Check Backend Logs

Look for these success messages in terminal where backend runs:

```
📁 Created TS store directory: .../src/data/stores/your-store
✅ TS files generated for development
✅ JSON files generated for production
🎉 Store files generated successfully for: your-store
✅ Store with images created successfully for: your-store
```

### Database Check

```bash
# Check if store exists (if using database)
# Connect to your database and run:
SELECT * FROM stores WHERE slug = 'your-store';
# Should return 1 row
```

---

## 🚀 Frontend Functionality Test

### Store Visibility

- [ ] Store appears in **Store List**
- [ ] Store can be **clicked/opened**
- [ ] Store **logo displays**
- [ ] Store **products load**
- [ ] **Slider animates** correctly
- [ ] **Add to cart works**

### Navigation

- [ ] Can **navigate to products**
- [ ] Product **images display**
- [ ] Can **add product to cart**
- [ ] Cart **updates correctly**

---

## 📱 Responsive Design Check

Test on different screen sizes:

- [ ] ✅ Mobile (375px)
- [ ] ✅ Tablet (768px)
- [ ] ✅ Desktop (1024px+)

---

## 🔐 Security Checks

- [ ] No sensitive data in JSON files
- [ ] No API keys visible
- [ ] Image paths don't expose system paths
- [ ] Store data is properly isolated
- [ ] No SQL injection vulnerabilities

---

## ⚠️ Common Issues & Quick Fixes

### Issue: Images Not Showing

**Check:**
```bash
# 1. Files exist?
ls -la public/assets/your-store/logo/

# 2. Permissions correct?
chmod 644 public/assets/your-store/logo/*

# 3. Paths in JSON are correct?
jq '.logo' public/assets/your-store/store.json
```

### Issue: Store Not in List

**Check:**
```bash
# 1. Store in index.json?
grep "your-store" public/assets/stores/index.json

# 2. JSON is valid?
jq . public/assets/stores/index.json

# 3. Store name matches?
jq '.stores[] | .slug' public/assets/stores/index.json
```

### Issue: Products Not Loading

**Check:**
```bash
# 1. store.json exists?
test -f public/assets/your-store/store.json && echo "✅"

# 2. Products array populated?
jq '.products | length' public/assets/your-store/store.json

# 3. Product images exist?
jq -r '.products[0].images[0]' public/assets/your-store/store.json | xargs ls -la
```

---

## 📋 Quick Reference Commands

```bash
# Verify everything
./verify-store-creation.sh your-store-name

# Check specific store info
jq . public/assets/your-store/store.json | head -20

# Count files by type
echo "Images:" && find public/assets/your-store -type f | wc -l
echo "JSON:" && find public/assets -name "*.json" | wc -l
echo "TS:" && find src/data/stores/your-store -name "*.ts" -o -name "*.tsx" | wc -l

# Export store data (for backup)
cp public/assets/your-store/store.json store-backup-$(date +%s).json

# Check for duplicate stores
jq '.stores | group_by(.slug) | map(select(length > 1))' public/assets/stores/index.json
```

---

## 📞 Troubleshooting Commands

```bash
# Full diagnostic
echo "=== STORE DIAGNOSTIC ===" && \
echo "1. Directory existence:" && \
test -d public/assets/your-store && echo "✅ Store dir" || echo "❌ Missing" && \
echo "2. Image counts:" && \
echo "  Logo: $(ls -1 public/assets/your-store/logo | wc -l)" && \
echo "  Products: $(ls -1 public/assets/your-store/products | wc -l)" && \
echo "  Sliders: $(ls -1 public/assets/your-store/sliders | wc -l)" && \
echo "3. JSON validity:" && \
jq . public/assets/your-store/store.json > /dev/null && echo "✅ Valid" || echo "❌ Invalid" && \
echo "4. Registration:" && \
jq '.stores[] | select(.slug == "your-store")' public/assets/stores/index.json > /dev/null && echo "✅ Registered" || echo "❌ Not found"
```

---

## ✨ Success Indicators

All of these should be ✅:

- ✅ All image directories exist
- ✅ At least 1 logo image exists
- ✅ At least 1 product image exists
- ✅ At least 1 slider image exists
- ✅ store.json is valid JSON
- ✅ index.json contains your store
- ✅ All 5 TypeScript files exist
- ✅ Browser shows no console errors
- ✅ Store loads in UI
- ✅ Products display correctly
- ✅ Images load properly
- ✅ Store is accessible to visitors

---

## 🎉 Store Ready!

Once all checks pass, your store is:

✅ **Fully Created**
✅ **Properly Configured**
✅ **Ready for Business**
✅ **Accessible to Customers**

---

**Congratulations! Your store on Eishro Platform is now live! 🚀**

For support, contact: support@eshro.ly
