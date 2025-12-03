// منتجات متجر نواعم - منتجات فريدة وحصرية
import type { Product } from './storeProducts';

// منتجات متجر نواعم (nawaem.ly) - storeId: 20
export const nawaemProducts: any[] = [
  // المنتجات العادية (12 منتج)
  {
    id: 1001, storeId: 1, name: "فستان سهرة ذهبي راقي", description: "فستان سهرة فاخر باللون الذهبي مع تطريز يدوي مميز، مناسب للمناسبات الخاصة",
    price: 450, originalPrice: 530, images: ["/assets/nawaem/dress1.jpg"], 
    sizes: ["S", "M", "L", "XL"], availableSizes: ["S", "M", "L", "XL"], 
    colors: [
      {name: "ذهبي", value: "#F59E0B"}, 
      {name: "فضي", value: "#9CA3AF"}, 
      {name: "وردي ذهبي", value: "#F472B6"}
    ],
    rating: 4.9, reviews: 32, views: 245, likes: 156, orders: 28, category: "فساتين سهرة",
    inStock: true, isAvailable: true, tags: ["مميزة"], badge: "مميزة"
  },
  {
    id: 1002, storeId: 1, name: "فستان ماكسي عصري", description: "فستان ماكسي أنيق بأكمام طويلة وتصميم عصري مريح للاستخدام اليومي",
    price: 285, originalPrice: 385, images: ["/assets/nawaem/dress2.jpg"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["M", "L", "XL"],
    colors: [{name: "كحلي", value: "#1E3A8A"}, {name: "بني", value: "#8B4513"}, {name: "أخضر", value: "#16A34A"}],
    rating: 4.7, reviews: 28, views: 189, likes: 89, orders: 22, category: "فساتين يومية",
    inStock: true, isAvailable: true, tags: ["تخفيضات"], badge: "تخفيضات"
  },
  {
    id: 1003, storeId: 1, name: "فستان أبيض وأسود راقي", description: "فستان راقي بتصميم كلاسيكي باللونين الأبيض والأسود، مثالي للمكتب والخروج",
    price: 380, originalPrice: 425, images: ["/assets/nawaem/dress3.jpg"],
    sizes: ["S", "M", "L"], availableSizes: ["S", "M", "L"],
    colors: [{name: "أبيض وأسود", value: "#000000"}],
    rating: 4.8, reviews: 24, views: 198, likes: 112, orders: 19, category: "فساتين رسمية",
    inStock: true, isAvailable: true, tags: ["أكثر مشاهدة"], badge: "أكثر مشاهدة"
  },
  {
    id: 1004, storeId: 1, name: "فستان صيفي أنيق", description: "فستان صيفي خفيف ومريح بألوان هادئة وتصميم أنثوي راقي",
    price: 195, originalPrice: 295, images: ["/assets/nawaem/dress4.jpg"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["S", "M", "L"],
    colors: [{name: "أزرق فاتح", value: "#60A5FA"}, {name: "وردي فاتح", value: "#F9A8D4"}, {name: "أخضر فاتح", value: "#86EFAC"}],
    rating: 4.6, reviews: 21, views: 167, likes: 78, orders: 16, category: "فساتين صيفية",
    inStock: true, isAvailable: true, tags: ["تخفيضات"], badge: "تخفيضات" 
  },
  {
    id: 1005, storeId: 1, name: "فستان مناسبات مميز", description: "فستان راقي للمناسبات الخاصة بتصميم أنيق ولمسات ذهبية فاخرة",
    price: 400, originalPrice: 465, images: ["/assets/nawaem/dress5.jpg"],
    sizes: ["S", "M", "L"], availableSizes: ["M", "L"],
    colors: [{name: "أسود ذهبي", value: "#000000"}, {name: "كحلي ذهبي", value: "#1E3A8A"}],
    rating: 4.9, reviews: 18, views: 134, likes: 95, orders: 14, category: "فساتين مناسبات",
    inStock: true, isAvailable: true, tags: ["أكثر طلباً"], badge: "أكثر طلباً"
  },
  {
    id: 1006, storeId: 1, name: "عباءة كاشمير فاخرة", description: "عباءة من الكاشمير الطبيعي بتصميم عصري وخامة فائقة النعومة",
    price: 590, originalPrice: 675, images: ["/assets/nawaem/abaya1.jpg"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["S", "M", "L", "XL"],
    colors: [{name: "بيج", value: "#D4A574"}, {name: "رمادي", value: "#6B7280"}, {name: "كحلي", value: "#1E3A8A"}],
    rating: 4.8, reviews: 26, views: 221, likes: 134, orders: 21, category: "عبايات فاخرة",
    inStock: true, isAvailable: true, tags: ["أكثر مشاهدة"], badge: "أكثر مشاهدة"
  },
  {
    id: 1007, storeId: 1, name: "عباءة دبي الأصلية", description: "عباءة أصلية من دبي بتصميم راقي وخامة عالية الجودة",
    price: 520, originalPrice: 545, images: ["/assets/nawaem/abaya2.jpg"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["M", "L", "XL"],
    colors: [{name: "أسود", value: "#000000"}, {name: "كحلي", value: "#1E3A8A"}, {name: "بني", value: "#8B4513"}],
    rating: 4.7, reviews: 31, views: 256, likes: 145, orders: 25, category: "عبايات أصلية",
    inStock: true, isAvailable: true, tags: ["أكثر مبيعاً"], badge: "أكثر مبيعاً"
  },
  {
    id: 1008, storeId: 1, name: "عباءة حرير طبيعي", description: "عباءة من الحرير الطبيعي بتصميم انسيابي أنيق ولمعة طبيعية مميزة",
    price: 580, originalPrice: 595, images: ["/assets/nawaem/abaya3.jpg"],
    sizes: ["S", "M", "L"], availableSizes: ["S", "M", "L"],
    colors: [{name: "أخضر زيتوني", value: "#65A30D"}, {name: "بني ذهبي", value: "#A16207"}],
    rating: 4.9, reviews: 19, views: 187, likes: 102, orders: 17, category: "عبايات حريرية",
    inStock: true, isAvailable: true, tags: ["مميزة"], badge: "مميزة"
  },
  {
    id: 1009, storeId: 1, name: "حجاب حرير مطرز", description: "حجاب من الحرير الطبيعي مع تطريز يدوي راقي وألوان متدرجة جميلة",
    price: 110, originalPrice: 125, images: ["/assets/nawaem/hijab1.jpg"],
    sizes: ["110x110"], availableSizes: ["110x110"],
    colors: [{name: "زهري متدرج", value: "#F9A8D4"}, {name: "أزرق متدرج", value: "#93C5FD"}, {name: "أخضر متدرج", value: "#86EFAC"}],
    rating: 4.6, reviews: 45, views: 312, likes: 198, orders: 38, category: "حجاب حريري",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد"
  },
  {
    id: 1010, storeId: 1, name: "حجاب شيفون راقي", description: "حجاب من الشيفون الفاخر بملمس ناعم وألوان أنيقة مناسبة لجميع المناسبات",
    price: 65, originalPrice: 85, images: ["/assets/nawaem/hijab2.jpg"],
    sizes: ["100x180"], availableSizes: ["100x180"],
    colors: [{name: "كريمي", value: "#FEF3C7"}, {name: "وردي فاتح", value: "#FECACA"}, {name: "أزرق باستيل", value: "#DBEAFE"}],
    rating: 4.5, reviews: 52, views: 398, likes: 234, orders: 47, category: "حجاب شيفون",
    inStock: true, isAvailable: true, tags: ["أكثر مشاهدة"], badge: "أكثر مشاهدة"
  },
  {
    id: 1011, storeId: 1, name: "حقيبة يد جلد طبيعي", description: "حقيبة يد فاخرة من الجلد الطبيعي بتصميم عصري وجودة عالية",
    price: 310, originalPrice: 345, images: ["/assets/nawaem/bag1.jpg"],
    sizes: ["متوسط"], availableSizes: ["متوسط"],
    colors: [{name: "بيج", value: "#D4A574"}, {name: "أسود", value: "#000000"}, {name: "بني", value: "#8B4513"}],
    rating: 4.7, reviews: 33, views: 245, likes: 123, orders: 26, category: "حقائب جلدية",
    inStock: true, isAvailable: true, tags: ["مميزة"], badge: "مميزة"
  },
  {
    id: 1012, storeId: 1, name: "حقيبة كتف أنيقة", description: "حقيبة كتف عملية وأنيقة بتصميم عصري مناسبة للاستخدام اليومي",
    price: 195, originalPrice: 275, images: ["/assets/nawaem/bag2.jpg"],
    sizes: ["كبير"], availableSizes: ["كبير"],
    colors: [{name: "كريمي", value: "#FEF3C7"}, {name: "ذهبي", value: "#F59E0B"}],
    rating: 4.6, reviews: 29, views: 198, likes: 89, orders: 23, category: "حقائب كتف",
    inStock: true, isAvailable: true, tags: ["أكثر مبيعاً"], badge: "أكثر مبيعاً"
  },

  // المنتجات المخفضة (3 منتجات)
  {
    id: 1013, storeId: 1, name: "حقيبة يد كلاسيكية", description: "حقيبة يد كلاسيكية بتصميم راقي ومقابض قوية، مثالية للمناسبات الرسمية",
    price: 245, originalPrice: 325, images: ["/assets/nawaem/bag3.jpg", "/assets/nawaem/bag3-green.jpg", "/assets/nawaem/bag3-black.jpg"],
    sizes: ["متوسط"], availableSizes: ["متوسط"],
    colors: [
      {name: "أخضر", value: "#16A34A"}, 
      {name: "أسود", value: "#000000"}
    ],
    rating: 4.5, reviews: 24, views: 167, likes: 67, orders: 18, category: "حقائب كلاسيكية",
    inStock: true, isAvailable: true, tags: ["تخفيضات"], badge: "تخفيضات"
  },
  {
    id: 1014, storeId: 1, name: "حقيبة مبطنة فاخرة", description: "حقيبة فاخرة مبطنة بتصميم مميز وسلسلة ذهبية أنيقة",
    price: 195, originalPrice: 285, images: ["/assets/nawaem/bag4.jpg"],
    sizes: ["صغير"], availableSizes: ["صغير"],
    colors: [{name: "وردي فاتح", value: "#FECACA"}, {name: "أبيض", value: "#FFFFFF"}],
    rating: 4.4, reviews: 18, views: 134, likes: 56, orders: 14, category: "حقائب مبطنة",
    inStock: true, isAvailable: true, tags: ["تخفيضات"], badge: "تخفيضات"
  },
  {
    id: 1015, storeId: 1, name: "حقيبة سلسلة ذهبية", description: "حقيبة أنيقة بسلسلة ذهبية وتصميم عصري، مناسبة للسهرات والمناسبات",
    price: 0, originalPrice: 0, images: ["/assets/nawaem/bag5.jpg", "/assets/nawaem/bag5-green.jpg", "/assets/nawaem/bag5-black.jpg"],
    sizes: ["صغير"], availableSizes: ["صغير"],
    colors: [
      {name: "أخضر", value: "#16A34A"}, 
      {name: "أسود", value: "#000000"}
    ],
    rating: 4.3, reviews: 15, views: 112, likes: 45, orders: 11, category: "حقائب سهرة",
    inStock: false, isAvailable: false, tags: ["غير متوفر"], badge: "غير متوفر"
  },

  // المنتجات الجديدة (7 منتجات)
  {
    id: 1016, storeId: 1, name: "فستان طفلة راقي", description: "فستان أنيق للطفلات بتصميم راقي وخامة مريحة، مناسب للمناسبات الخاصة",
    price: 165, originalPrice: 185, images: ["/assets/nawaem/kids1.jpg"],
    sizes: ["2-3", "4-5", "6-7", "8-9"], availableSizes: ["2-3", "4-5", "6-7", "8-9"],
    colors: [{name: "وردي", value: "#F9A8D4"}, {name: "أزرق فاتح", value: "#93C5FD"}],
    rating: 4.8, reviews: 22, views: 189, likes: 134, orders: 20, category: "ملابس أطفال",
    inStock: true, isAvailable: true, tags: ["أكثر طلباً"], badge: "أكثر طلباً"
  },
  {
    id: 1017, storeId: 1, name: "عباءة طفلة عصرية", description: "عباءة عصرية للطفلات بتصميم مريح وألوان جميلة",
    price: 98, originalPrice: 125, images: ["/assets/nawaem/kids2.jpg"],
    sizes: ["4-5", "6-7", "8-9", "10-11"], availableSizes: ["4-5", "6-7", "8-9", "10-11"],
    colors: [{name: "زهري", value: "#F472B6"}, {name: "بنفسجي", value: "#A855F7"}],
    rating: 4.6, reviews: 18, views: 145, likes: 89, orders: 16, category: "عبايات أطفال",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد"
  },
  {
    id: 1018, storeId: 1, name: "فستان طفلة للعيد", description: "فستان خاص للعيد بتصميم احتفالي وألوان مبهجة",
    price: 155, originalPrice: 165, images: ["/assets/nawaem/kids3.jpg"],
    sizes: ["2-3", "4-5", "6-7"], availableSizes: ["2-3", "4-5", "6-7"],
    colors: [{name: "ذهبي", value: "#F59E0B"}, {name: "وردي ذهبي", value: "#F472B6"}],
    rating: 4.9, reviews: 25, views: 198, likes: 156, orders: 23, category: "ملابس عيد",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد"
  },
  {
    id: 1019, storeId: 1, name: "طقم طفلة كاجوال", description: "طقم كاجوال للطفلات مكون من بلوزة وبنطلون بتصميم عملي ومريح",
    price: 85, originalPrice: 95, images: ["/assets/nawaem/kids4.jpg"],
    sizes: ["2-3", "4-5", "6-7", "8-9"], availableSizes: ["2-3", "4-5", "6-7", "8-9"],
    colors: [{name: "وردي وأبيض", value: "#F9A8D4"}, {name: "أزرق وأبيض", value: "#93C5FD"}],
    rating: 4.5, reviews: 16, views: 123, likes: 67, orders: 14, category: "ملابس كاجوال",
    inStock: true, isAvailable: true, tags: ["أكثر طلباً"], badge: "أكثر طلباً"
  },
  {
    id: 1020, storeId: 1, name: "فستان طفلة أزرق", description: "فستان أنيق باللون الأزرق الفاتح بتصميم أنثوي راقي للطفلات",
    price: 125, originalPrice: 145, images: ["/assets/nawaem/kids5.jpg"],
    sizes: ["4-5", "6-7", "8-9"], availableSizes: ["4-5", "6-7", "8-9"],
    colors: [{name: "أزرق فاتح", value: "#93C5FD"}, {name: "أبيض", value: "#FFFFFF"}],
    rating: 4.7, reviews: 19, views: 156, likes: 92, orders: 17, category: "فساتين أطفال",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد"
  },
  {
    id: 1021, storeId: 1, name: "طقم حجاب للطفلات", description: "طقم حجاب مخصص للطفلات بألوان جميلة وتصميم مريح",
    price: 65, originalPrice: 75, images: ["/assets/nawaem/kids6.jpg"],
    sizes: ["4-5", "6-7", "8-9", "10-11"], availableSizes: ["4-5", "6-7", "8-9", "10-11"],
    colors: [{name: "وردي", value: "#F9A8D4"}, {name: "أزرق", value: "#93C5FD"}, {name: "أخضر", value: "#86EFAC"}],
    rating: 4.4, reviews: 21, views: 167, likes: 78, orders: 18, category: "حجاب أطفال",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد"
  },
  {
    id: 1022, storeId: 1, name: "فستان طفلة فاخر", description: "فستان فاخر للطفلات بتطريز يدوي وتصميم راقي للمناسبات الخاصة",
    price: 0, originalPrice: 0, images: ["/assets/nawaem/kids5.jpg"],
    sizes: ["2-3", "4-5", "6-7"], availableSizes: ["2-3", "4-5", "6-7"],
    colors: [{name: "أخضر فاتح", value: "#86EFAC"}, {name: "كريمي", value: "#FEF3C7"}],
    rating: 4.8, reviews: 14, views: 134, likes: 89, orders: 12, category: "فساتين فاخرة",
    inStock: false, isAvailable: false, tags: ["جديد", "غير متوفر"], badge: "غير متوفر"
  },
  {
    id: 1023, storeId: 1, name: "حذاء نسائي أنيق", description: "حذاء نسائي أنيق",
    price: 125, originalPrice: 135, images: ["/assets/nawaem/heels-pink-1.jpg", "/assets/nawaem/heels-elegant-1.jpg"],
    sizes: ["4-5", "6-7", "8-9", "10-11"], availableSizes: ["4-5", "6-7", "8-9", "10-11"],
    colors: [{name: "أبيض", value: "#ffffffff"}, {name: "أسود", value: "#020202ff"}],
    rating: 4.0, reviews: 31, views: 66, likes: 120, orders: 84, category: "أحذية نسائية",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد"
  },
  {
      id: 1024,
      storeId: 1,
      name: "بدلة تريكو أنيقة",
      description: "بدلة تريكو أنيقة",
      price: 195,
      originalPrice: 250,
      images: ["/assets/nawaem/triko1.webp", "/assets/nawaem/triko2.webp", "/assets/nawaem/triko3.webp", "/assets/nawaem/triko4.webp", "/assets/nawaem/triko5.webp"],
      sizes: ["S", "M", "L", "XL"],
      availableSizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "أزرق", value: "#12335fef" },
        { name: "رمادي", value: "#7d818bff" }
      ],
      rating: 4.8,
      reviews: 95,
      views: 245,
      likes: 89,
      orders: 32,
      category: "بدلة تريكو أنيقة",
      inStock: true,
      isAvailable: true,
      tags: ["جديد"],
      badge: "جديد",
  }
];

// إضافة متجر نواعم إلى أيقونات وألوان المتاجر
export const nawaemStoreConfig = {
  storeId: 1,
  icon: "👑", // تاج للدلالة على الفخامة
  color: "from-amber-400 to-yellow-600", // ألوان ذهبية مناسبة للهوية
  name: "نواعم",
  description: "متجر نواعم للأزياء النسائية والأطفال الراقية",
  categories: [
    "فساتين سهرة",
    "فساتين يومية", 
    "فساتين رسمية",
    "عبايات فاخرة",
    "حجاب حريري",
    "حقائب جلدية",
    "ملابس أطفال"
  ]
};
