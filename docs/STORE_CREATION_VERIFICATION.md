# ✅ Store Creation Verification Checklist

## التحقق من عملية إنشاء المتجر

### 📋 قائمة التحقق بعد إنشاء المتجر

بعد إنشاء متجر جديد، تأكد من وجود جميع الملفات والمجلدات التالية:

---

## 1️⃣ **Image Files Structure** 📁

### التحقق من مجلدات الصور:

```
public/assets/
├── [your-subdomain]/
│   ├── logo/
│   │   └── logo_[timestamp].[ext]  ✓ شعار المتجر
│   ├── products/
│   │   ├── product_1_[timestamp].[ext]
│   │   ├── product_2_[timestamp].[ext]
│   │   └── ...
│   └── sliders/
│       ├── slider_1_[timestamp].[ext]
│       ├── slider_2_[timestamp].[ext]
│       └── ...
```

**اختبار التحقق:**
```bash
# Linux/Mac
ls -la public/assets/[your-subdomain]/logo/
ls -la public/assets/[your-subdomain]/products/
ls -la public/assets/[your-subdomain]/sliders/

# Windows PowerShell
Get-ChildItem public/assets/[your-subdomain]/logo/
Get-ChildItem public/assets/[your-subdomain]/products/
Get-ChildItem public/assets/[your-subdomain]/sliders/
```

---

## 2️⃣ **JSON Files - Production Data** 📊

### A. متجر JSON (Store JSON)

**المسار:** `public/assets/[your-subdomain]/store.json`

**الهيكل المتوقع:**
```json
{
  "id": 1234567890,
  "storeId": 1234567890,
  "subdomain": "your-store",
  "storeSlug": "your-store",
  "nameAr": "اسم متجرك",
  "nameEn": "Store Name",
  "description": "وصف المتجر",
  "icon": "🏪",
  "color": "from-purple-400 to-pink-600",
  "logo": "/assets/your-store/logo/logo_timestamp.webp",
  "categories": ["category1", "category2"],
  "products": [
    {
      "id": 1234567001,
      "storeId": 1234567890,
      "name": "منتج 1",
      "description": "وصف المنتج",
      "price": 100,
      "originalPrice": 120,
      "images": ["/assets/your-store/products/product_1_1.jpg"],
      "sizes": ["S", "M", "L"],
      "colors": [{"name": "أسود", "value": "#000000"}],
      "category": "الفئة",
      "inStock": true,
      "tags": ["جديد"]
    }
  ],
  "sliderImages": [
    {
      "id": "banner1",
      "image": "/assets/your-store/sliders/slider_1_timestamp.webp",
      "title": "عنوان الشريط",
      "subtitle": "الوصف",
      "buttonText": "تسوق الآن"
    }
  ],
  "status": "active",
  "createdAt": "2025-11-18T14:30:00.000Z"
}
```

**اختبار التحقق:**
```bash
# Linux/Mac
cat public/assets/[your-subdomain]/store.json | jq .

# Windows PowerShell
Get-Content public/assets/[your-subdomain]/store.json | ConvertFrom-Json
```

### B. متاجر Index (Stores Index)

**المسار:** `public/assets/stores/index.json`

**الهيكل المتوقع:**
```json
{
  "stores": [
    {
      "slug": "your-store",
      "name": "اسم متجرك",
      "description": "وصف المتجر",
      "logo": "/assets/your-store/logo/logo_timestamp.webp",
      "categories": ["category1", "category2"],
      "productsCount": 5,
      "lastUpdated": "2025-11-18T14:30:00.000Z"
    },
    {
      "slug": "another-store",
      "name": "متجر آخر",
      "description": "وصف آخر",
      "logo": "/assets/another-store/logo/logo_timestamp.webp",
      "categories": ["category3"],
      "productsCount": 3,
      "lastUpdated": "2025-11-18T13:20:00.000Z"
    }
  ]
}
```

**اختبار التحقق:**
```bash
# التحقق من وجود متجرك في الفهرس
grep -i "your-store" public/assets/stores/index.json
```

---

## 3️⃣ **TypeScript Files - Development** 💻

### مجلد المتجر في Development

**المسار:** `src/data/stores/[your-subdomain]/`

**الملفات المتوقعة:**

```
src/data/stores/
└── your-store/
    ├── config.ts          ✓ إعدادات المتجر
    ├── products.ts        ✓ المنتجات
    ├── sliderData.ts      ✓ بيانات الشرائح
    ├── Slider.tsx         ✓ مكون الشريط
    └── index.ts           ✓ ملف الفهرس للتصدير
```

**أمثلة الملفات:**

#### `config.ts`
```typescript
export const yourstoreStoreConfig = {
  storeId: 1234567890,
  icon: "🏪",
  logo: "/assets/your-store/logo/logo_timestamp.webp",
  color: "from-purple-400 to-pink-600",
  name: "اسم متجرك",
  description: "وصف المتجر",
  categories: ["category1", "category2"]
};
```

#### `products.ts`
```typescript
import type { Product } from '../../storeProducts';

export const yourstoreProducts: Product[] = [
  {
    id: 1234567001,
    storeId: 1234567890,
    name: "منتج 1",
    description: "وصف المنتج",
    price: 100,
    originalPrice: 120,
    images: ["/assets/your-store/products/product_1_1.jpg"],
    // ... more properties
  }
];
```

#### `index.ts`
```typescript
export { yourstoreProducts as products } from './products';
export { yourstoreStoreConfig as config } from './config';
export { yourstoreSliderData as sliderData } from './sliderData';
export * from './Slider';
```

**اختبار التحقق:**
```bash
# Linux/Mac
ls -la src/data/stores/your-store/

# Windows PowerShell
Get-ChildItem src/data/stores/your-store/
```

---

## 4️⃣ **Complete Verification Steps** 🔍

### الخطوة الأولى: قائمة التحقق الأساسية

```bash
# 1. التحقق من مجلد الصور
echo "1️⃣ Checking image directories..."
ls -la public/assets/your-store/

# 2. التحقق من ملفات JSON
echo "2️⃣ Checking JSON files..."
test -f public/assets/your-store/store.json && echo "✅ store.json exists" || echo "❌ store.json missing"
test -f public/assets/stores/index.json && echo "✅ index.json exists" || echo "❌ index.json missing"

# 3. التحقق من ملفات TypeScript
echo "3️⃣ Checking TypeScript files..."
ls -la src/data/stores/your-store/
```

### الخطوة الثانية: التحقق من محتوى JSON

```bash
# 1. التحقق من صحة store.json
jq . public/assets/your-store/store.json

# 2. التحقق من صحة index.json
jq . public/assets/stores/index.json

# 3. التحقق من وجود متجرك في الفهرس
jq '.stores[] | select(.slug == "your-store")' public/assets/stores/index.json
```

### الخطوة الثالثة: التحقق من الصور

```bash
# 1. عد ملفات الصور
echo "Logo files:"
ls -la public/assets/your-store/logo/ | wc -l

echo "Product images:"
ls -la public/assets/your-store/products/ | wc -l

echo "Slider images:"
ls -la public/assets/your-store/sliders/ | wc -l

# 2. التحقق من أن الصور قابلة للوصول
file public/assets/your-store/logo/*.{jpg,jpeg,png,webp} 2>/dev/null
```

---

## 5️⃣ **Expected Results After Creation** ✨

### عند الانتهاء بنجاح من إنشاء المتجر، يجب أن تجد:

#### ✅ **الملفات المطلوبة:**

- [ ] `public/assets/your-store/logo/logo_*.*` - شعار المتجر
- [ ] `public/assets/your-store/products/product_*.*` - صور المنتجات (حد أدنى 1)
- [ ] `public/assets/your-store/sliders/slider_*.*` - صور الشريط (حد أدنى 1)
- [ ] `public/assets/your-store/store.json` - بيانات المتجر
- [ ] `public/assets/stores/index.json` - فهرس المتاجر (يحتوي على متجرك)
- [ ] `src/data/stores/your-store/config.ts` - ملف الإعدادات
- [ ] `src/data/stores/your-store/products.ts` - ملف المنتجات
- [ ] `src/data/stores/your-store/sliderData.ts` - بيانات الشريط
- [ ] `src/data/stores/your-store/Slider.tsx` - مكون الشريط
- [ ] `src/data/stores/your-store/index.ts` - ملف الفهرس

#### ✅ **البيانات الصحيحة:**

- [ ] جميع الصور تشير إلى المسارات الصحيحة في JSON
- [ ] storeId في store.json يطابق ID المنتجات
- [ ] جميع المنتجات والشرائط موجودة في store.json
- [ ] متجرك مدرج في public/assets/stores/index.json
- [ ] جميع ملفات TypeScript تحتوي على البيانات الصحيحة

---

## 6️⃣ **Troubleshooting** 🔧

### المشكلة: الصور لا تظهر

```bash
# تحقق من المسارات في store.json
jq '.logo, .products[0].images[0]' public/assets/your-store/store.json

# تحقق من وجود الملفات الفعلية
ls -la public/assets/your-store/logo/
ls -la public/assets/your-store/products/
```

### المشكلة: ملفات JSON لا توجد

```bash
# تحقق من أن Backend يعمل
curl http://localhost:4000/api/health

# تحقق من سجلات Backend
# يجب أن ترى: "✅ JSON files generated for production"
```

### المشكلة: ملفات TypeScript لا توجد

```bash
# تحقق من مسار المشروع
pwd

# تحقق من أن src/data/stores موجود
ls -la src/data/stores/

# اعد تشغيل Frontend
npm run dev
```

---

## 7️⃣ **API Response Example** 📡

### عند نجاح إنشاء المتجر:

```json
{
  "success": true,
  "message": "Store created successfully with images",
  "data": {
    "store": {
      "storeSlug": "your-store",
      "storeName": "اسم متجرك",
      "productsCount": 5,
      "slidersCount": 3
    }
  }
}
```

### Browser Console Logs:

```
✅ Store files created successfully for: your-store
✅ TS files generated for development
✅ JSON files generated for production
🎉 Store files generated successfully for: your-store
```

---

## 8️⃣ **Backend Logs Expected** 📋

عند مراجعة سجلات Backend، يجب أن تجد:

```
📁 Created TS store directory: [path]/src/data/stores/your-store
✅ TS files generated for development
✅ JSON files generated for production
🎉 Store files generated successfully for: your-store
✅ Store created successfully on backend
```

---

## ✅ **Final Verification Checklist**

بعد انتهاء الإنشاء:

1. **ملفات الصور:**
   - [ ] شعار المتجر موجود ويصل إليه البرنامج
   - [ ] صور المنتجات موجودة وكاملة
   - [ ] صور الشريط موجودة وكاملة

2. **ملفات JSON:**
   - [ ] `store.json` يحتوي على جميع بيانات المتجر
   - [ ] `index.json` يحتوي على متجرك
   - [ ] جميع المسارات صحيحة ويصل إليها البرنامج

3. **ملفات TypeScript:**
   - [ ] جميع الملفات موجودة في `src/data/stores/[your-subdomain]/`
   - [ ] البيانات متطابقة مع بيانات JSON

4. **التفاعل:**
   - [ ] المتجر يظهر في لوحة التحكم
   - [ ] الصور تحمل بشكل صحيح
   - [ ] المنتجات والشرائط تظهر بشكل صحيح

---

**تم الانتهاء من التحقق الشامل لإنشاء المتجر! 🎉**
