# دليل إنشاء المتجر - سير العمل الآمن

# Store Creation Guide - Secure Workflow

## نظرة عامة
يوضح هذا الدليل الخطوات الثمانية المطلوبة لإنشاء متجر جديد بطريقة آمنة وذرية، مع ضمان عدم حدوث تكرار في الأصول ومشاكل في التخزين.

## Overview
This guide outlines the 8 required steps for creating a new store in a secure and atomic manner, ensuring no asset duplication and storage issues.

## الخطوات الثمانية المطلوبة

## The 8 Required Steps

### الخطوة 1: التحقق من صحة البيانات المدخلة
**Step 1: Validate Input Data**

- التحقق من صحة سلاج المتجر (slug validation)
- التحقق من عدم وجود متجر بنفس السلاج
- التحقق من صحة بيانات الشعار والصور
- التحقق من صحة بيانات المنتجات

```typescript
interface StoreCreationInput {
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  logo: File;
  sliderImages: File[];
  products: ProductInput[];
  categories: string[];
}
```

### الخطوة 2: إنشاء مجلد مؤقت للمعالجة
**Step 2: Create Temporary Processing Directory**

- إنشاء مجلد مؤقت بمعرف فريد
- نسخ جميع الأصول إلى المجلد المؤقت
- تجنب الكتابة المباشرة على المجلدات الدائمة

```bash
# مثال على المجلد المؤقت
/tmp/store_creation_1234567890/
├── logo/
├── sliders/
├── products/
└── store.json
```

### الخطوة 3: معالجة الأصول باستخدام البصمة الرقمية
**Step 3: Process Assets with Hash-based Naming**

- حساب البصمة الرقمية (MD5/SHA-256) لكل أصل
- إعادة تسمية الملفات بالبصمة بدلاً من الطابع الزمني
- فحص وجود ملفات مكررة وإزالتها

```typescript
// مثال على إعادة التسمية
// Original: logo_1234567890.png
// Hashed: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.png
```

### الخطوة 4: إنشاء ملف store.json
**Step 4: Create store.json File**

- كتابة ملف store.json بالمسارات المحدثة
- تضمين جميع البيانات المطلوبة
- استخدام المسارات النسبية الصحيحة

```json
{
  "id": "unique_store_id",
  "slug": "store-slug",
  "name": "Store Name",
  "nameAr": "اسم المتجر",
  "logo": "/assets/store-slug/logo/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.webp",
  "sliderImages": [
    {
      "id": "banner1",
      "image": "/assets/store-slug/sliders/banner1.webp",
      "title": "Banner Title",
      "subtitle": "Banner Subtitle"
    }
  ],
  "products": [...],
  "status": "active",
  "createdAt": "2025-11-23T20:39:33.000Z"
}
```

### الخطوة 5: نقل الأصول إلى المجلد الدائم
**Step 5: Move Assets to Permanent Directory**

- نقل الملفات من المجلد المؤقت إلى `/public/assets/{slug}/`
- ضمان عدم الكتابة فوق ملفات موجودة
- استخدام عمليات ذرية (atomic operations)

```bash
# نقل ذري
mv /tmp/store_creation_1234567890 /public/assets/new-store-slug
```

### الخطوة 6: تحديث فهرس المتاجر
**Step 6: Update Stores Index**

- إضافة إدخال المتجر الجديد إلى `/public/assets/stores/index.json`
- تحديث ذري للفهرس
- تضمين معلومات أساسية فقط (slug, name, logo, etc.)

```json
[
  {
    "slug": "new-store-slug",
    "name": "New Store Name",
    "nameAr": "اسم المتجر الجديد",
    "logo": "/assets/new-store-slug/logo/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.webp",
    "categories": ["category1", "category2"],
    "productsCount": 5,
    "lastUpdated": "2025-11-23T20:39:33.000Z"
  }
]
```

### الخطوة 7: التحقق من سلامة البيانات
**Step 7: Validate Data Integrity**

- التحقق من وجود جميع الملفات المشار إليها
- التحقق من صحة ملفات JSON
- التحقق من إمكانية قراءة المتجر من الواجهة الأمامية

```typescript
// فحص شامل
const validationResults = await validateStoreForDisplay(storeData);
if (!validationResults.isValid) {
  throw new Error(`Store validation failed: ${validationResults.issues.join(', ')}`);
}
```

### الخطوة 8: تنظيف الملفات المؤقتة وإرسال الاستجابة
**Step 8: Cleanup Temporary Files and Send Response**

- حذف المجلد المؤقت
- إرسال استجابة ناجحة للواجهة الأمامية
- تسجيل العملية في السجلات

```typescript
// استجابة ناجحة
{
  "success": true,
  "store": {
    "slug": "new-store-slug",
    "name": "New Store Name",
    "message": "Store created successfully"
  },
  "timestamp": "2025-11-23T20:39:33.000Z"
}
```

## معالجة الأخطاء والتعويض

## Error Handling and Compensation

### في حالة فشل أي خطوة:
**If any step fails:**

1. **التراجع عن التغييرات** (Rollback)
   - حذف الملفات المُنشأة جزئياً
   - إزالة الإدخالات من الفهرس
   - حذف المجلد المؤقت

2. **تسجيل الخطأ** (Error Logging)
   - تسجيل تفاصيل الخطأ
   - حفظ حالة العملية للتشخيص
   - إرسال إشعار للمطور

3. **إعادة المحاولة الذكية** (Smart Retry)
   - إعادة المحاولة للعمليات المؤقتة الفشل
   - تجنب إعادة المحاولة للأخطاء الدائمة

## الأمان والأداء

## Security and Performance

### الأمان:
**Security:**
- التحقق من صحة جميع المدخلات
- منع حقن SQL وXSS
- التحقق من أحجام وأنواع الملفات
- استخدام HTTPS للتحميل

### الأداء:
**Performance:**
- معالجة الأصول بالتوازي عند الإمكان
- استخدام streaming للملفات الكبيرة
- تحديد مهلة زمنية للعمليات
- مراقبة استخدام الذاكرة والقرص

## مراقبة وصيانة

## Monitoring and Maintenance

### المقاييس المطلوبة:
**Required Metrics:**
- عدد المتاجر المُنشأة يومياً
- متوسط وقت إنشاء المتجر
- معدل نجاح العمليات
- حجم الأصول المُحملة

### الصيانة الدورية:
**Regular Maintenance:**
- تشغيل سكريبت التنظيف الأسبوعي
- فحص سلامة البيانات شهرياً
- تحديث النسخ الاحتياطية يومياً

## تطبيق الخطوات

## Implementation Steps

### التنفيذ في الكود:
**Code Implementation:**

```typescript
// مثال على التنفيذ الأساسي
async function createStore(input: StoreCreationInput): Promise<StoreCreationResult> {
  const tempDir = await createTempDirectory();
  try {
    // الخطوة 1: التحقق
    await validateInput(input);

    // الخطوة 2: مجلد مؤقت
    await setupTempDirectory(tempDir, input);

    // الخطوة 3: معالجة الأصول
    const processedAssets = await processAssetsWithHash(tempDir);

    // الخطوة 4: إنشاء store.json
    await createStoreJson(tempDir, input, processedAssets);

    // الخطوة 5: النقل للدائم
    await moveToPermanentLocation(tempDir, input.slug);

    // الخطوة 6: تحديث الفهرس
    await updateStoresIndex(input);

    // الخطوة 7: التحقق
    await validateCreatedStore(input.slug);

    // الخطوة 8: التنظيف والاستجابة
    await cleanupTempDirectory(tempDir);

    return {
      success: true,
      store: { slug: input.slug, name: input.name }
    };

  } catch (error) {
    // التعويض في حالة الخطأ
    await rollbackChanges(tempDir, input.slug);
    throw error;
  }
}
```

### التكامل مع الواجهة الأمامية

## Frontend Integration

- إرسال البيانات كـ FormData
- عرض شريط تقدم للخطوات
- معالجة الأخطاء وعرض رسائل واضحة
- إعادة تحميل قائمة المتاجر بعد النجاح

### مثال على الاستخدام:
**Usage Example:**

```typescript
const formData = new FormData();
formData.append('slug', 'new-store');
formData.append('name', 'New Store');
formData.append('logo', logoFile);
formData.append('sliderImages', sliderFiles);

const response = await fetch('/api/stores/create', {
  method: 'POST',
  body: formData
});

if (response.ok) {
  // إعادة تحميل المتاجر
  await loadStores();
  showSuccessMessage('تم إنشاء المتجر بنجاح');
}
```

## الخلاصة

## Summary

يضمن تطبيق هذا الدليل إنشاء متاجر جديدة بطريقة آمنة وموثوقة، مع تجنب جميع المشاكل المذكورة في الوثيقة الأصلية. التركيز على العمليات الذرية والتحقق الشامل يمنع فقدان البيانات وتكرار الأصول.

This guide ensures new stores are created in a secure and reliable manner, avoiding all the issues mentioned in the original document. The focus on atomic operations and comprehensive validation prevents data loss and asset duplication.