# دليل سريع: إنشاء متجر جديد في منصة إشرو

## 📋 الخطوات الأساسية

### الخطوة 1: تحضير بيانات المتجر
```json
{
  "storeId": 1234567890,
  "storeSlug": "my-store",
  "storeName": "متجري الجديد",
  "storeNameEn": "My Store",
  "description": "وصف متجري",
  "icon": "🛍️",
  "color": "from-blue-400 to-blue-600",
  "categories": ["الملابس", "الأحذية"],
  "products": [
    {
      "id": 1,
      "name": "اسم المنتج",
      "description": "وصف المنتج",
      "price": 100,
      "originalPrice": 150,
      "images": [],
      "colors": [{"name": "أسود", "value": "#000000"}],
      "sizes": ["S", "M", "L"],
      "availableSizes": ["M", "L"],
      "rating": 4.5,
      "reviews": 0,
      "category": "الملابس",
      "inStock": true,
      "tags": ["جديد"]
    }
  ],
  "sliderImages": [
    {
      "id": "slider-1",
      "image": "",
      "title": "عرض خاص",
      "subtitle": "احصل على أفضل الأسعار",
      "buttonText": "اشتري الآن"
    }
  ]
}
```

### الخطوة 2: اختياري - رفع الصور
يمكنك رفع الصور من خلال:
- صور المنتجات
- صور السلايدرز
- شعار المتجر

**الامتدادات المدعومة**: `.jpg`, `.png`, `.webp`, `.gif`, `.avif`

### الخطوة 3: إرسال الطلب للخادم
```bash
POST /api/stores/create-with-images

Content-Type: multipart/form-data

# Fields:
- storeId: 1234567890
- storeSlug: my-store
- storeName: متجري الجديد
- storeNameEn: My Store
- description: وصف متجري
- icon: 🛍️
- color: from-blue-400 to-blue-600
- categories: ["الملابس", "الأحذية"]
- products: [json string]
- sliderImages: [json string]
- productsImageCounts: [1, 1] (عدد الصور لكل منتج)

# Optional Files:
- storeLogo: [image file]
- productImages: [multiple image files]
- sliderImages: [multiple image files]
```

## ✅ علامات النجاح

بعد إنشاء المتجر بنجاح، تحقق من:

### 1. وجود ملفات TypeScript تحت src/data/stores/
```
✅ src/data/stores/my-store/config.ts
✅ src/data/stores/my-store/products.ts
✅ src/data/stores/my-store/Slider.tsx
✅ src/data/stores/my-store/sliderData.ts
✅ src/data/stores/my-store/index.ts
```

### 2. وجود ملفات JSON تحت backend/public/assets/
```
✅ backend/public/assets/my-store/store.json
✅ backend/public/assets/my-store/logo/[images]
✅ backend/public/assets/my-store/products/[images]
✅ backend/public/assets/my-store/sliders/[images]
✅ backend/public/assets/stores/index.json
```

### 3. اختبار في المتصفح
```
✅ http://localhost:5000/assets/my-store/store.json (يجب أن يُرجع JSON)
✅ الصور تظهر بشكل صحيح في الواجهة
✅ الشعار يظهر في صفحة المتجر
```

## 🎯 الصور الافتراضية

إذا لم تقم برفع صور:
- **شعار المتجر**: `/assets/default-store.png`
- **صور المنتجات**: `/assets/default-product.png`
- **صور السلايدرز**: `/assets/default-slider.png`

## ⚠️ الأخطاء الشائعة

### ❌ الخطأ: "Store with name already exists"
**الحل**: استخدم اسماً فريداً واضغط على `storeSlug` مختلفاً

### ❌ الخطأ: "Failed to process uploaded files"
**الحل**: 
- تأكد من نوع الملفات (فقط صور مدعومة)
- تحقق من حجم الملفات (أقل من 10 MB)

### ❌ الخطأ: الصور لا تظهر
**الحل**:
- تحقق من أن الملفات موجودة في `backend/public/assets/<slug>/`
- تأكد من أن الخادم يعمل بشكل صحيح
- تحقق من أن المسارات صحيحة في `store.json`

### ❌ الخطأ: "Unexpected token '<' JSON"
**الحل**: 
- هذا يعني أن الطلب يرجع HTML بدلاً من JSON
- تأكد من أن الملفات قد تم توليدها بشكل صحيح
- تحقق من سجلات الخادم للأخطاء

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من سجلات الخادم (backend logs)
2. قم بفحص ملفات المتجر المولدة
3. اختبر الطلب باستخدام Postman أو curl
4. راجع `STORE_CREATION_SOLUTION.md` للتفاصيل الكاملة

## 🔧 متغيرات البيئة

إذا كان المشروع في مسار مختلف:
```bash
export STORE_BASE_DIR=/path/to/Eishro-Platform_V7
```

## 🎉 مثال كامل

```bash
curl -X POST http://localhost:5000/api/stores/create-with-images \
  -F "storeId=9876543210" \
  -F "storeSlug=fashion-hub" \
  -F "storeName=متجر الموضة" \
  -F "storeNameEn=Fashion Hub" \
  -F "description=أفضل متجر للملابس والأزياء" \
  -F "icon=👗" \
  -F "color=from-pink-400 to-purple-600" \
  -F "categories=[\"ملابس نسائية\",\"ملابس رجالية\"]" \
  -F "products=[{\"id\":1,\"name\":\"فستان أسود\",\"price\":200,...}]" \
  -F "sliderImages=[{\"id\":\"1\",\"title\":\"عرض خاص\",...}]" \
  -F "storeLogo=@/path/to/logo.png" \
  -F "productImages=@/path/to/image1.jpg" \
  -F "productImages=@/path/to/image2.jpg" \
  -F "sliderImages=@/path/to/slider.jpg"
```

---

**تم تحديثه**: نوفمبر 2025
**النسخة**: 1.0 - الحل الشامل لمشكلة الصور والملفات
