# دليل سريع: إضافة متجر جديد

## 3 خطوات فقط!

### الخطوة 1️⃣: فتح `src/config/storeConfig.ts`

### الخطوة 2️⃣: أضف المتجر الجديد قبل القوس الأخير

```typescript
export const STORES_CONFIG: Record<string, StoreConfig> = {
  // متاجر موجودة...
  
  // 🆕 أضف هنا:
  your_store_slug: {
    slug: 'your_store_slug',
    storeId: YOUR_STORE_ID,
    name: 'اسم متجرك',
    description: 'وصف المتجر',
    logo: '/assets/your_store_slug/logo/logo.webp',
    icon: '🎯',
    sliderHeight: {
      mobile: 600,
      desktop: 800,
    },
    colors: {
      primary: '#FF6B35',        // اللون الأساسي
      secondary: '#F7931E',      // اللون الثانوي
      accent: '#FFB84D',         // لون التمييز
    },
    sliders: [
      {
        id: 'banner1',
        image: '/assets/your_store_slug/sliders/slider1.webp',
        title: 'عنوان السلايدر',
        subtitle: 'الوصف الفرعي',
        buttonText: 'تسوق الآن',
      },
      // أضف سلايدرات أكثر حسب الحاجة...
    ],
    products: [
      {
        id: 1234567890001,
        storeId: YOUR_STORE_ID,
        name: 'اسم المنتج',
        description: 'وصف المنتج',
        price: 100,
        originalPrice: 120,
        images: [
          { url: '/assets/your_store_slug/products/product1-img1.jpeg', order: 1, alt: 'الصورة الأولى' },
          { url: '/assets/your_store_slug/products/product1-img2.jpeg', order: 2, alt: 'الصورة الثانية' },
          { url: '/assets/your_store_slug/products/product1-img3.jpeg', order: 3, alt: 'الصورة الثالثة' },
        ],
        sizes: ['واحد'],
        availableSizes: ['واحد'],
        colors: [{ name: 'أسود', value: '#000000' }],
        rating: 4.5,
        reviews: 0,
        views: 0,
        likes: 0,
        orders: 0,
        category: 'category_name',
        inStock: true,
        isAvailable: true,
        tags: ['جديد'],
        badge: 'جديد',
        quantity: 10,
      },
      // أضف منتجات أكثر حسب الحاجة...
    ],
  },
};
```

### الخطوة 3️⃣: رفع الصور إلى المجلد الصحيح

```
/public/assets/your_store_slug/
├── logo/
│   └── logo.webp                  # 🖼️ شعار المتجر
├── sliders/
│   ├── slider1.webp
│   ├── slider2.webp
│   └── slider3.webp               # 🎪 صور السلايدرات
└── products/
    ├── product1-img1.jpeg         # 🛍️ صور المنتجات
    ├── product1-img2.jpeg
    ├── product1-img3.jpeg
    ├── product2-img1.jpeg
    └── ...
```

---

## ⚙️ إعدادات مهمة

| الحقل | الوصف |
|------|-------|
| `slug` | معرف فريد للمتجر (بدون مسافات) |
| `storeId` | رقم فريد للمتجر |
| `sliderHeight.mobile` | ارتفاع السلايدر على الموبايل (px) |
| `sliderHeight.desktop` | ارتفاع السلايدر على الديسكتوب (px) |
| `colors.primary` | اللون الأساسي (16 بت hex) |
| `images[].order` | ترتيب الصورة (1, 2, 3...) |

---

## 📝 ملاحظات مهمة

✅ **يجب أن تكون:**
- أسماء الملفات بدون مسافات
- معرف `slug` بدون أحرف خاصة
- الصور بصيغة: `.webp` للسلايدرات و `.jpeg` للمنتجات

❌ **تجنب:**
- نسخ ملفات `Slider.tsx` أو `products.ts` - لا توجد حاجة!
- إضافة imports يدوية في `ModernStorePage.tsx` - النظام يفعلها تلقائياً!
- تغيير ارتفاع السلايدر - استخدم الموحد (600/800 px)

---

## 🚀 مثال سريع

### إضافة متجر "كتب وقرطاسية"

```typescript
books_stationery: {
  slug: 'books_stationery',
  storeId: 1764116503200,
  name: 'كتب وقرطاسية',
  description: 'أفضل الكتب والمستلزمات المدرسية',
  logo: '/assets/books_stationery/logo/logo.webp',
  icon: '📚',
  sliderHeight: { mobile: 600, desktop: 800 },
  colors: {
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    accent: '#93C5FD',
  },
  sliders: [
    {
      id: 'banner1',
      image: '/assets/books_stationery/sliders/slider1.webp',
      title: 'أفضل المراجع الدراسية',
      subtitle: 'جودة عالية وأسعار منخفضة',
      buttonText: 'اكتشف المزيد',
    },
  ],
  products: [
    {
      id: 1764116503200001,
      storeId: 1764116503200,
      name: 'دفتر جودة عالية 100 ورقة',
      description: 'دفتر مميز بجودة ممتازة',
      price: 15,
      originalPrice: 20,
      images: [
        { url: '/assets/books_stationery/products/notebook-1.jpeg', order: 1, alt: 'المنظر الأمامي' },
        { url: '/assets/books_stationery/products/notebook-2.jpeg', order: 2, alt: 'المنظر الخلفي' },
      ],
      sizes: ['واحد'],
      availableSizes: ['واحد'],
      colors: [{ name: 'أزرق', value: '#3B82F6' }],
      rating: 4.8,
      reviews: 45,
      views: 200,
      likes: 120,
      orders: 50,
      category: 'stationery',
      inStock: true,
      isAvailable: true,
      tags: ['جديد', 'أكثر مبيعاً'],
      badge: 'أكثر مبيعاً',
      quantity: 50,
    },
  ],
},
```

---

## ✨ هذا كل شيء!

النظام سيتعرف على المتجر الجديد **تلقائياً** عند الوصول إليه في الموقع.

لا حاجة لأي خطوات إضافية! 🎉
