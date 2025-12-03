# نظام إنشاء المتاجر مع رفع الصور - التوثيق الشامل

## 🎯 نظرة عامة

هذا النظام يسمح للتجار الجدد بإنشاء متاجرهم على منصة إشرو من خلال واجهة مستخدم متكاملة، مع رفع صور المنتجات والسلايدرز تلقائياً وإنشاء ملفات المتجر (config.ts, products.ts, Slider.tsx) بدون تدخل يدوي.

## 📋 خطوات العملية

### الخطوات 1-4: بيانات المتجر الأساسية
- اسم المتجر (عربي + إنجليزي)
- الوصف
- الفئات المتعلقة
- الوثائق (السجل التجاري + رخصة الممارسة)
- البريد الإلكتروني
- رقم الهاتف
- كلمة المرور
- اسم صاحب المتجر

### الخطوة 5: إضافة المنتجات مع الصور
**المدخلات المطلوبة:**
- **اسم المنتج** ✅
- **السعر** ✅
- **السعر قبل التخفيض** ✅
- **الوصف** ✅
- **صور المنتج** ✅ (يمكن رفع عدة صور)

**المخرجات التلقائية:**
- معرّف المنتج (ID)
- الألوان الافتراضية: أسود
- الأحجام الافتراضية: S, M, L, XL
- التقييم الافتراضي: 4.5
- العلامات الافتراضية: جديد

### الخطوة 6: إضافة صور السلايدرز
**المدخلات المطلوبة:**
- **صورة السلايدر** ✅ (صورة واحدة لكل بنر)
- **العنوان** ✅
- **الوصف الفرعي** ✅
- **نص الزر** ✅

## 🔄 تدفق البيانات

```
المستخدم (Frontend)
    ↓
CreateStorePage.tsx
    ↓ FormData (JSON + ملفات الصور)
    ↓
POST /api/stores/create-with-images
    ↓
storeImageUpload Middleware (Multer)
    ↓ حفظ الصور في public/assets/[store-slug]/
    ↓
createStoreWithImages Controller
    ↓ معالجة البيانات والملفات
    ↓
storeGeneratorService
    ↓ إنشاء الملفات:
    ├─ config.ts
    ├─ products.ts
    └─ Slider.tsx
    ↓
src/data/stores/[store-slug]/
```

## 📁 هيكل الملفات المُنشأة

```
src/data/stores/[store-slug]/
├── config.ts          # تكوين المتجر (الاسم، الألوان، الأيقونة)
├── products.ts        # قائمة المنتجات مع جميع البيانات
└── Slider.tsx         # مكون السلايدر مع جميع الصور

public/assets/[store-slug]/
├── products/          # صور المنتجات
│   ├── 1234-abc-image1.jpg
│   ├── 1234-def-image2.jpg
│   └── ...
└── sliders/           # صور السلايدرز
    ├── 1234-ghi-banner1.jpg
    ├── 1234-jkl-banner2.jpg
    └── ...
```

## 🔧 تفاصيل التنفيذ

### Frontend (CreateStorePage.tsx)
```typescript
// إضافة صور المنتج
<input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => {
    const files = Array.from(e.target.files || []);
    setCurrentProduct({
      ...currentProduct,
      imageFiles: files,
      images: files.map(f => f.name)
    });
  }}
/>

// إضافة صور السلايدرز
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentSliderImage({
        ...currentSliderImage,
        imageFile: file,
        image: file.name
      });
    }
  }}
/>
```

### Backend (Multer Middleware)
```typescript
// تخزين الصور في المسار الصحيح
destination: async (req, file, cb) => {
  const storeSlug = req.body.storeSlug;
  const imageType = req.body.imageType;
  const uploadPath = path.join(
    __dirname, 
    '../../../public/assets', 
    storeSlug, 
    imageType
  );
  await fsPromises.mkdir(uploadPath, { recursive: true });
  cb(null, uploadPath);
}
```

### Controller (createStoreWithImages)
```typescript
// معالجة الملفات والبيانات
const uploadedFiles = req.files;
const products = JSON.parse(req.body.products);
const sliders = JSON.parse(req.body.sliderImages);

// ربط الملفات بالمنتجات والسلايدرز
products = products.map((product, idx) => ({
  ...product,
  images: product.images || [`/assets/${storeSlug}/products/${uploadedFiles[idx].filename}`]
}));
```

### Service (storeGeneratorService)
```typescript
// إنشاء ملفات TypeScript بناءً على البيانات الفعلية
private async generateProductsFile(storeDir, data) {
  const productsContent = `
    export const ${storeSlug}Products: Product[] = [
      ${data.products.map(product => `{
        id: ${product.id},
        name: "${product.name}",
        images: [${product.images.map(img => `"${img}"`).join(', ')}],
        ...
      }`).join(',\n')}
    ];
  `;
  // حفظ الملف
}
```

## 📊 مثال عملي - متجر جديد

### البيانات المدخلة:
```json
{
  "storeName": "متجر الأزياء الجديد",
  "storeNameEn": "Fashion Store",
  "description": "متجر متخصص في الأزياء والملابس",
  "categories": ["ملابس", "إكسسوارات"],
  "products": [
    {
      "name": "فستان أسود فاخر",
      "price": 250,
      "originalPrice": 350,
      "description": "فستان من الحرير الطبيعي",
      "imageFiles": [File, File] // ملفات الصور المرفوعة
    }
  ],
  "sliderImages": [
    {
      "title": "مجموعة الصيف الجديدة",
      "subtitle": "اكتشفي تشكيلتنا الجديدة",
      "buttonText": "تسوقي الآن",
      "imageFile": File // ملف صورة السلايدر
    }
  ]
}
```

### الملفات المُنشأة تلقائياً:

**config.ts:**
```typescript
export const fashionstoreConfig = {
  storeId: 1731791340000,
  icon: "✨",
  logo: "/assets/stores/fashion-store.webp",
  color: "from-purple-400 to-pink-600",
  name: "متجر الأزياء الجديد",
  description: "متجر متخصص في الأزياء والملابس",
  categories: ["ملابس", "إكسسوارات"]
};
```

**products.ts:**
```typescript
export const fashionstoreProducts: Product[] = [
  {
    id: 1731791340000001,
    storeId: 1731791340000,
    name: "فستان أسود فاخر",
    description: "فستان من الحرير الطبيعي",
    price: 250,
    originalPrice: 350,
    images: ["/assets/fashion-store/products/1234-abc-fustaan.jpg"],
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"],
    colors: [{ name: "أسود", value: "#000000" }],
    rating: 4.5,
    reviews: 0,
    category: "ملابس",
    inStock: true,
    tags: ["جديد"],
    badge: "جديد"
  }
];
```

**Slider.tsx:**
```typescript
export default FashionstoreSlider;
```

## 🚀 الخطوات التالية

1. **تثبيت Multer**: `npm install multer @types/multer`
2. **اختبار API**: استخدام Postman أو cURL
3. **اختبار واجهة المستخدم**: إنشاء متجر جديد كامل
4. **التحقق من الملفات**: تحقق من المجلد الناتج

## 📝 ملاحظات هامة

- ✅ الصور يتم حفظها تلقائياً في المسار الصحيح
- ✅ الملفات تُنشأ بناءً على البيانات الفعلية المدخلة
- ✅ لا يوجد hard-coded data في الملفات المُنشأة
- ✅ يمكن إضافة عدة صور لكل منتج
- ✅ النظام يعالج الأخطاء والاستثناءات بشكل آمن
- ✅ يتم الاحتفاظ بـ localStorage كـ backup

## 🔐 الأمان

- ✅ التحقق من امتدادات الملفات المسموحة
- ✅ تحديد حد أقصى لحجم الملف (5MB)
- ✅ معالجة الأخطاء بشكل آمن
- ✅ إنشاء مسارات فريدة للملفات (timestamp + random)

## 🆘 استكشاف الأخطاء

| الخطأ | الحل |
|------|------|
| `No images uploaded` | تأكد من رفع الصور بشكل صحيح |
| `Invalid JSON format` | تحقق من صيغة البيانات المرسلة |
| `Missing required fields` | تأكد من ملء جميع الحقول المطلوبة |
| `File type not allowed` | استخدم صور بصيغة JPG, PNG, WebP, أو GIF |
| `File size exceeded` | استخدم صور أصغر من 5MB |
