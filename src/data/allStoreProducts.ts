// بيانات شاملة لجميع المنتجات في جميع المتاجر
import type { Product } from './storeProducts';
import { type RealProduct, allRealStoreProducts } from './realStoreProducts';
import { nawaemProducts } from './stores/nawaem/products';
import { nawaemStoreConfig } from './stores/nawaem/config';
import { deltaProducts } from './stores/delta-store/products';
import { deltaStoreConfig } from './stores/delta-store/config';
import { magnaBeautyProducts as importedMagnaBeautyProducts } from './stores/magna-beauty/products';
import { indeeshProducts } from './stores/indeesh/products';
import { calculateBadge } from '@/utils/badgeCalculator';

// أيقونات المتاجر والفئات
export const storeIcons = {
  1: "👑", // نواعم - أزياء راقية
  2: "✨", // شيرين - أزياء
  4: "🛍️", // دلتا ستور - أزياء عائلية
  5: "💄", // ماجنا بيوتي - تجميل  
  6: "🛋️", // مكانك - أثاث
  7: "👟", // كومفي - رياضة
  8: "💎", // مكنون - مجوهرات
  10: "🏺", // تحفة - تراث
  11: "🎨", // برشت بلو - فنون
  17: "⌚", // الركن الليبي - ساعات
};

// ألوان المتاجر
export const storeColors = {
  1: "from-amber-400 to-yellow-600", // نواعم
  2: "from-pink-400 to-purple-600", // شيرين
  5: "from-purple-500 to-violet-600", // ماجنا بيوتي
  6: "from-blue-500 to-indigo-600", // مكانك
  7: "from-green-500 to-emerald-600", // كومفي
  8: "from-yellow-500 to-orange-600", // مكنون
  10: "from-orange-500 to-red-600", // تحفة
  11: "from-cyan-500 to-blue-600", // برشت بلو
  17: "from-gray-500 to-slate-600", // الركن الليبي
};

const MAGNA_BEAUTY_STORE_ID = 5;

// استخدام magnaBeautyProducts المستورد بدلاً من تعريفه محلياً
const magnaBeautyProducts = importedMagnaBeautyProducts;

// منتجات شيرين (sheirine.ly) - storeId: 2
// منتجات متنوعة تشمل: مجوهرات، ملابس أحجام كبيرة، أحذية نسائية، وحقائب
const sheirineProducts: Product[] = [
  // مجوهرات (10 منتجات)
  {
    id: 2001, storeId: 2, name: "خاتم خطوبة أنيق", description: "خاتم خطوبة فاخر مرصع بألماس مصنع",
    price: 185, originalPrice: 230, images: ["/assets/sheirine/engagement-ring-1.jpg"],
    sizes: ["6", "7", "8", "9"], availableSizes: ["7", "8", "9"],
    colors: [
      {name: "فضي", value: "#8f8f8fff"}
    ],
    rating: 4.9, reviews: 120, views: 240, likes: 420, orders: 320, quantity: 10, category: "المجوهرات",
    inStock: true, isAvailable: true, tags: ["أكثر مبيعاً"], badge: "أكثر مبيعاً"
  },
  {
    id: 2002, storeId: 2, name: "طقم مجوهرات ذهبية", description: "طقم مجوهرات ذهبية كامل يتكون من عقد وأقراط وحلق",
    price: 260, originalPrice: 275, images: ["/assets/sheirine/jewelry-set-2.jpg"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "ذهب أصفر", value: "#F59E0B"}, {name: "ذهب أبيض", value: "#F8F8FF"}],
    rating: 4.8, reviews: 32, views: 423, likes: 189, orders: 26, quantity: 10, category: "المجوهرات",
    inStock: true, isAvailable: true, tags: ["مميزة"], badge: "مميزة"
  },
  {
    id: 2003, storeId: 2, name: "سوار ألماس تنس", description: "سوار أنيق فاخر من النحاس والزركونيا",
    price: 175, originalPrice: 235, images: ["/assets/sheirine/jewelry-set-3.jpg"],
    sizes: ["صغير", "متوسط", "كبير"], availableSizes: ["متوسط", "كبير"],
    colors: [{name: "ذهب أبيض", value: "#F8F8FF"}, {name: "ذهب أصفر", value: "#F59E0B"}],
    rating: 4.9, reviews: 28, views: 345, likes: 156, orders: 22, quantity: 10, category: "أساور",
    inStock: true, isAvailable: true, tags: ["مميزة", "أكثر إعجاباً"], badge: "أكثر إعجاباً"
  },
  {
    id: 2004, storeId: 2, name: "عقد لؤلؤ طبيعي", description: "عقد من اللؤلؤ الطبيعي عيار AAA بتصميم كلاسيكي أنيق",
    price: 345, originalPrice: 380, images: ["/assets/sheirine/necklace-loulou.jpg"],
    sizes: ["قصير", "طويل"], availableSizes: ["قصير", "طويل"],
    colors: [{name: "لؤلؤ أبيض", value: "#F8F8FF"}, {name: "لؤلؤ كريمي", value: "#FEF3C7"}],
    rating: 4.7, reviews: 41, views: 389, likes: 167, orders: 33, quantity: 10, category: "عقود",
    inStock: true, isAvailable: true, tags: ["أكثر طلباً"], badge: "أكثر طلباً"
  },
  {
    id: 2005, storeId: 2, name: "أقراط متدلية أنيقة", description: "أقراط متدلية أنيقة",
    price: 260, originalPrice: 325, images: ["/assets/sheirine/SHEIN-VCAY.jpg"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "ذهب أبيض", value: "#F8F8FF"}, {name: "ذهب وردي", value: "#F472B6"}],
    rating: 4.8, reviews: 37, views: 298, likes: 134, orders: 29, quantity: 10, category: "أقراط",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد"
  },
  {
    id: 2006, storeId: 2, name: "خاتم زواج ألماس", description: "خاتم زواج فاخر مرصع بألماس طبيعي بتصميم كلاسيكي",
    price: 380, originalPrice: 435, images: ["/assets/sheirine/ring2.jpg"],
    sizes: ["5", "6", "7", "8", "9"], availableSizes: ["6", "7", "8"],
    colors: [{name: "ذهب أصفر", value: "#F59E0B"}, {name: "ذهب أبيض", value: "#F8F8FF"}],
    rating: 4.9, reviews: 19, views: 267, likes: 145, orders: 16, quantity: 10, category: "خواتم زواج",
    inStock: true, isAvailable: true, tags: ["مميزة"], badge: "مميزة"
  },
  {
    id: 2007, storeId: 2, name: "طقم مطلية بالذهب والفيروز الأزرق", description: "طقم مطلية بالذهب والفيروز الأزرق",
    price: 310, originalPrice: 375, images: ["/assets/sheirine/23.jpeg","/assets/sheirine/24.webp"],
    sizes: ["45cm", "50cm", "55cm"], availableSizes: ["45cm", "50cm"],
    colors: [{name: "ذهب أصفر", value: "#F59E0B"}, {name: "ذهب أبيض", value: "#F8F8FF"}],
    rating: 4.6, reviews: 52, views: 445, likes: 198, orders: 41, quantity: 10, category: "سلاسل",
    inStock: true, isAvailable: true, tags: ["تخفيضات"], badge: "تخفيضات"
  },
  {
    id: 2008, storeId: 2, name: "أقراط متدلية براقة حجر الراين", description: "أقراط متدلية براقة حجر الراين",
    price: 25, originalPrice: 35, images: ["/assets/sheirine/sparkly.jpeg","/assets/sheirine/sparkly2.jpeg"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "ذهب أصفر", value: "#F59E0B"}, {name: "ذهب أبيض", value: "#F8F8FF"}],
    rating: 4.7, reviews: 38, views: 312, likes: 145, orders: 28, quantity: 10, category: "حلق",
    inStock: true, isAvailable: true, tags: ["أكثر إعجاباً"], badge: "أكثر إعجاباً"
  },
  {
    id: 2009, storeId: 2, name: "أقراط نمط عتيق شكل سبيكة", description: "أقراط نمط عتيق شكل سبيكة",
    price: 45, originalPrice: 68, images: ["/assets/sheirine/antique.jpeg","/assets/sheirine/antique2.jpeg"],
    sizes: ["صغير", "متوسط"], availableSizes: ["صغير", "متوسط"],
    colors: [{name: "ذهبي", value: "#f1a014ff"}, {name: "فضي", value: "#C0C0C0"}],
    rating: 4.5, reviews: 29, views: 234, likes: 98, orders: 22, quantity: 10, category: "بروش",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد"
  },
  {
    id: 2010, storeId: 2, name: "علبة مجوهرات مع ساعة", description: "علبة مجوهرات مع ساعة",
    price: 145, originalPrice: 180, images: ["/assets/sheirine/jewelry-box.webp"],
    sizes: ["صغير"], availableSizes: ["صغير"],
    colors: [{name: "فضي", value: "#C0C0C0"}],
    rating: 4.2, reviews: 40, views: 80, likes: 120, orders: 30, quantity: 10, category: "مجوهرات نسائية",
    inStock: true, isAvailable: true, tags: ["أكثر طلباً"], badge: "أكثر طلباً"
  },
  {
    id: 2011, storeId: 2, name: "خاتم فضة عيار 925", description: "خاتم من الفضة الخالصة عيار 925 بتصميم عصري أنيق",
    price: 120, originalPrice: 180, images: ["/assets/sheirine/ring6.jpg"],
    sizes: ["6", "7", "8", "9"], availableSizes: ["7", "8", "9"],
    colors: [{name: "فضي", value: "#C0C0C0"}],
    rating: 4.1, reviews: 34, views: 130, likes: 210, orders: 80, quantity: 10, category: "خواتم فضة",
    inStock: true, isAvailable: true, tags: ["أكثر إعجاباً"], badge: "أكثر إعجاباً"
  },
  {
    id: 2012, storeId: 2, name: "عقد زركون مطلي", description: "عقد زركون مطلي",
    price: 220, originalPrice: 275, images: ["/assets/sheirine/jewelry-set-1.jpg"],
    sizes: ["قصير"], availableSizes: ["قصير"],
    colors: [{name: "أسود", value: "#121213ff"}],
    rating: 4.8, reviews: 50, views: 360, likes: 355, orders: 210, quantity: 10, category: "المجوهرات",
    inStock: true, isAvailable: true, tags: ["تخفيضات"], badge: "تخفيضات"
  },
  {
    id: 1065, storeId: 2, name: "SHEIN SXY زوج من الأقراط الحديثة مصنوعة يدويًا", description: "زوج من الأقراط الحديثة مصنوعة يدويًا",
    price: 0, originalPrice: 0, images: ["/assets/sheirine/SHEIN SXY.jpg"],
    sizes: [], availableSizes: [],
    colors: [],
    rating: 0, reviews: 0, views: 3, likes: 0, orders: 1, category: "أقراط",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },

  // ملابس أحجام كبيرة (10 منتجات)
  {
    id: 2013, storeId: 2, name: "فستان طباعة الأزهار بكم واحد", description: "فستان طباعة الأزهار بكم واحد",
    price: 450, originalPrice: 520, images: ["/assets/sheirine/image1.jpeg","/assets/sheirine/image2.jpg","/assets/sheirine/image3.jpg"],
    sizes: ["SX", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], availableSizes: ["L", "XL", "2XL", "3XL"],
    colors: [{name: "أزرق ملكي", value: "#1b0c50ff"}, {name: "أسود", value: "#0a0a0aff"}, {name: "أخضر", value: "#096d12ff"}],
    rating: 4.7, reviews: 38, views: 423, likes: 189, orders: 32, category: "ملابس للمناسبات أحجام كبيرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2014, storeId: 2, name: "فستان ماكسي كتف واحد فتحة للفخذ حزام ترتر", description: "فستان ماكسي كتف واحد فتحة للفخذ حزام ترتر",
    price: 470, originalPrice: 560, images: ["/assets/sheirine/image4.jpeg"],
    sizes: ["SX", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], availableSizes: ["M", "L", "XL", "2XL"],
    colors: [{name: "أسود", value: "#0c0c0cff"}],
    rating: 4.2, reviews: 60, views: 160, likes: 255, orders: 120, category: "ملابس للمناسبات أحجام كبيرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2015, storeId: 2, name: "سروال بساق واسع من الاسفل", description: "سروال بساق واسع من الاسفل",
    price: 185, originalPrice: 210, images: ["/assets/sheirine/image5.jpg"],
    sizes: ["SX", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], availableSizes: ["L", "XL", "2XL"],
    colors: [{name: "أسود", value: "#000000"}],
    rating: 4.0, reviews: 30, views: 99, likes: 100, orders: 43, category: "ملابس للمناسبات أحجام كبيرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2016, storeId: 2, name: "فستان دانتيل اكمام منتفضة", description: "فستان دانتيل اكمام منتفضة",
    price: 685, originalPrice: 730, images: ["/assets/sheirine/image6.jpg","/assets/sheirine/image7.jpg"],
    sizes: ["SX", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], availableSizes: ["XL", "2XL", "3XL"],
    colors: [{name: "أبيض", value: "#fffbfbff"}],
    rating: 4.9, reviews: 120, views: 130, likes: 240, orders: 87, category: "ملابس للمناسبات أحجام كبيرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2017, storeId: 2, name: " فستان  مكشوف الكتف دانتيل", description: " فستان  مكشوف الكتف دانتيل",
    price: 625, originalPrice: 745, images: ["/assets/sheirine/image8.jpeg"],
    sizes: ["SX", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], availableSizes: ["L", "XL", "2XL", "3XL"],
    colors: [{name: "أزرق ملكي", value: "#130f53ff"}],
    rating: 4.7, reviews: 66, views: 156, likes: 217, orders: 111, category: "ملابس للمناسبات أحجام كبيرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2018, storeId: 2, name: " تنورة خصرعالي فتحة للفخذ بترتر", description: " تنورة خصرعالي فتحة للفخذ بترتر",
    price: 225, originalPrice: 280, images: ["/assets/sheirine/image10.jpeg","/assets/sheirine/image9.jpeg"],
    sizes: ["SX", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], availableSizes: ["M", "L", "XL"],
    colors: [{name: "فضي", value: "#747272ff"}],
    rating: 4.7, reviews: 70, views: 188, likes: 250, orders: 218, category: "ملابس للمناسبات أحجام كبيرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2019, storeId: 2, name: "بلوزة بترتر", description: "بلوزة بترتر",
    price: 520, originalPrice: 620, images: ["/assets/sheirine/image11.jpeg","/assets/sheirine/image12.jpeg","/assets/sheirine/image13.jpeg"],
    sizes: ["SX", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], availableSizes: ["L", "XL", "2XL", "3XL", "4XL"],
    colors: [{name: "ذهبي", value: "#e4d72cb4"}],
    rating: 4.8, reviews: 60, views: 310, likes: 380, orders: 200, category: "ملابس للمناسبات أحجام كبيرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2020, storeId: 2, name: "توب شفاف", description: " توب شفاف",
    price: 285, originalPrice: 340, images: ["/assets/sheirine/image15.jpeg","/assets/sheirine/image14.jpeg"],
    sizes: ["SX", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], availableSizes: ["S", "M", "L", "XL", "2XL"],
    colors: [{name: "أسود", value: "#0f0f0fff"}],
    rating: 4.9, reviews: 145, views: 420, likes: 300, orders: 240, category: "ملابس للمناسبات أحجام كبيرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2021, storeId: 2, name: "فستان بحزام أكمام فانوس حافة مكشكشة", description: "فستان بحزام أكمام فانوس حافة مكشكشة",
    price: 485, originalPrice: 560, images: ["/assets/sheirine/image16.jpeg","/assets/sheirine/image17.jpeg","/assets/sheirine/image18.jpeg","/assets/sheirine/image19.jpeg"],
    sizes: ["SX", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], availableSizes: ["M", "L", "XL", "2XL"],
    colors: [{name: "أزرق فاتح", value: "#60A5FA"}, {name: "وردي", value: "#EC4899"}, {name: "أصفر", value: "#FDE047"}, {name: "بنفسجي", value: "#7a2a99ff"}],
    rating: 4.6, reviews: 60, views: 267, likes: 112, orders: 190, category: "ملابس للمناسبات أحجام كبيرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2022, storeId: 2, name: "فستان ضيق مكشوف الكتف بترتر", description: "فستان ضيق مكشوف الكتف بترتر",
    price: 385, originalPrice: 450, images: ["/assets/sheirine/image20.jpeg","/assets/sheirine/image21.jpeg","/assets/sheirine/image22.jpeg"],
    sizes: ["SX", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], availableSizes: ["L", "XL", "2XL", "3XL"],
    colors: [{name: "أسود", value: "#000000"}, {name: "أخضر", value: "#08741fff"}, {name: "وردي", value: "#e2928fff"}],
    rating: 4.9, reviews: 160, views: 490, likes: 460, orders: 230, category: "ملابس للمناسبات أحجام كبيرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 1023, storeId: 2, name: "فستان ماكسي متدلي", description: "فستان ماكسي احمر, مكشوف الكتف بصدر دانتيل من الامامم",
    price: 0, originalPrice: 0, images: ["/assets/sheirine/image24.jpg", "/assets/sheirine/image23.jpg"],
    sizes: [], availableSizes: [],
    colors: [],
    rating: 0, reviews: 0, views: 0, likes: 0, orders: 0, category: "فساتين فاخرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
    {
    id: 1060, storeId: 2, name: "بلوزة لماعة بالترتر", description: "بلوزة لماعة بالترتر",
    price: 0, originalPrice: 0, images: ["/assets/sheirine/blouze1.jpeg","/assets/sheirine/blouze2.jpeg","/assets/sheirine/blouze3.jpeg"],
    sizes: [], availableSizes: [],
    colors: [],
    rating: 0, reviews: 0, views: 0, likes: 0, orders: 0, category: "فساتين فاخرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },

  // أحذية نسائية (5 منتجات)
  {
    id: 2025, storeId: 2, name: "شبشب نسائي مسطح مع زهرةCUCCOO CHICEST", description: "شبشب نسائي مسطح مع زهرةCUCCOO CHICEST",
    price: 120, originalPrice: 165, images: ["/assets/sheirine/cucco1.png"],
    sizes: ["36", "37", "38", "39", "40", "41", "42"], availableSizes: ["37", "38", "39", "40"],
    colors: [{name: "بني", value: "#8B4513"}],
    rating: 4.8, reviews: 31, views: 267, likes: 250, orders: 216, category: "أحذية نسائية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2026, storeId: 2, name: "حذاء نسائي أنيق للثلوج لشتاء مع فرو قطنية سميكة للدفء", description: "حذاء نسائي أنيق للثلوج لشتاء مع فرو قطنية سميكة للدفء",
    price: 115, originalPrice: 135, images: ["/assets/sheirine/cold-shoes.png"],
    sizes: ["36", "37", "38", "39"], availableSizes: ["36", "37", "38", "39"],
    colors: [{name: "أسود", value: "#000000"}],
    rating: 4.6, reviews: 26, views: 234, likes: 98, orders: 21, category: "أحذية نسائية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2027, storeId: 2, name: "حذاء كاجوال رباط وشاح", description: "حذاء كاجوال رباط وشاح",
    price: 145, originalPrice: 175, images: ["/assets/sheirine/casual-shoes.png"],
    sizes: ["36", "37", "38", "39", "40", "41"], availableSizes: ["37", "38", "39", "40", "41"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "وردي", value: "#EC4899"}, {name: "أسود", value: "#000000"}],
    rating: 4.7, reviews: 29, views: 245, likes: 112, orders: 24, category: "أحذية نسائية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2028, storeId: 2, name: "أحذية كاجوال مسطحة للنساء", description: "أحذية كاجوال مسطحة للنساء",
    price: 175, originalPrice: 225, images: ["/assets/sheirine/flat-casual.png"],
    sizes: ["36", "37", "38", "39", "40", "41", "42"], availableSizes: ["36", "37", "38", "39", "40"],
    colors: [{name: "أزرق ملكي", value: "#0a216bff"}],
    rating: 4.6, reviews: 40, views: 198, likes: 110, orders: 70, category: "أحذية نسائية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2029, storeId: 2, name: "حذاء لوفر مسطح ميتالك", description: "حذاء لوفر مسطح ميتالك",
    price: 320, originalPrice: 380, images: ["/assets/sheirine/loover1.png","/assets/sheirine/loover2.png","/assets/sheirine/loover3.png"],
    sizes: ["36", "37", "38", "39", "40", "41", "42"], availableSizes: ["37", "38", "39", "40", "41"],
    colors: [{name: "أسود", value: "#000000"}, {name: "وردي", value: "#e79c89ff"}, {name: "ذهبي", value: "#ebe049ff"}],
    rating: 4.9, reviews: 40, views: 170, likes: 230, orders: 230, category: "أحذية نسائية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2030, storeId: 2, name: "أحذية قصيرة", description: "أحذية قصيرة مريحة وعصرية",
    price: 225, originalPrice: 255, images: ["/assets/sheirine/short-shoes1.png","/assets/sheirine/short-shoes2.png","/assets/sheirine/short-shoes3.png"],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"], availableSizes: ["37", "38", "39", "40", "41", "42", "43"],
    colors: [{name: "وردي", value: "#f38b8bff"}, {name: "أحمر", value: "#ff2121f8"}, {name: "أسود", value: "#050505ff"}],
    rating: 4.9, reviews: 59, views: 260, likes: 444, orders: 360, category: "أحذية نسائية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  // حقائب (5 منتجات)
  {
    id: 2031, storeId: 2, name: "حقيبة كتف بتعليقة ظبي معدنية", description: "حقيبة كتف بتعليقة ظبي معدنية",
    price: 120, originalPrice: 150, images: ["/assets/sheirine/handbag1.webp","/assets/sheirine/handbag2.jpeg","/assets/sheirine/handbag3.jpeg"],
    sizes: ["صغير", "متوسط", "كبير"], availableSizes: ["متوسط", "كبير"],
    colors: [{name: "بني", value: "#704d0cff"}, {name: "أسود", value: "#070707ff"}, {name: "بيج", value: "#b6ab8cff"}],
    rating: 4.9, reviews: 24, views: 234, likes: 112, orders: 19, category: "حقائب",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2032, storeId: 2, name: "حقيبة قفل أنيقة خفيفة", description: "حقيبة قفل أنيقة خفيفة",
    price: 145, originalPrice: 185, images: ["/assets/sheirine/bag-lock.webp","/assets/sheirine/bag-lock2.webp"],
    sizes: ["صغير", "متوسط"], availableSizes: ["صغير"],
    colors: [{name: "أسود", value: "#000000"},{name: "بني", value: "#c49f6fff"}],
    rating: 4.8, reviews: 31, views: 267, likes: 277, orders: 120, category: "حقائب",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2033, storeId: 2, name: "حقيبة يد صغيرة مع حزام", description: "حقيبة يد صغيرة مع حزام",
    price: 95, originalPrice: 130, images: ["/assets/sheirine/bag-jeans.webp"],
    sizes: ["صغيرة", "متوسطة"], availableSizes: ["صغيرة"],
    colors: [{name: "أزرق", value: "#2f2cc0ff"}],
    rating: 4.8, reviews: 19, views: 189, likes: 87, orders: 15, category: "حقائب",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2034, storeId: 2, name: "حقيبة كروس بتصميم ضفيرة سعة كبيرة", description: "حقيبة كروس بتصميم ضفيرة سعة كبيرة",
    price: 140, originalPrice: 180, images: ["/assets/sheirine/kross-bag.webp"],
    sizes: ["كبيرة"], availableSizes: ["كبيرة"],
    colors: [{name: "أسود", value: "#080808ff"}],
    rating: 4.6, reviews: 26, views: 198, likes: 89, orders: 21, category: "حقائب",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 2035, storeId: 2, name: "حقيبة يد من الكتان مطبوع عليها زهور", description: "حقيبة يد من الكتان مطبوع عليها زهور",
    price: 85, originalPrice: 120, images: ["/assets/sheirine/kotton-bag.webp"],
    sizes: ["متوسط"], availableSizes: ["متوسط"],
    colors: [{name: "بني", value: "#b69665ff"}],
    rating: 4.0, reviews: 33, views: 55, likes: 80, orders: 23, category: "حقائب",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];

// منتجات مكانك (mkanek.ly) - storeId: 6
const mkanekProducts: Product[] = [
  {
    id: 6001, storeId: 6, name: "كنبة من ثلاث مقاعد", description: "كنبة مريحة وأنيقة من القماش عالي الجودة",
    price: 1850, originalPrice: 2100, images: ["/assets/stores/6.webp"],
    sizes: ["3 مقاعد"], availableSizes: ["3 مقاعد"],
    colors: [{name: "رمادي", value: "#6B7280"}, {name: "بيج", value: "#D4A574"}, {name: "أزرق", value: "#3B82F6"}],
    rating: 4.8, reviews: 15, views: 234, likes: 89, orders: 12, category: "أثاث",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 6002, storeId: 6, name: "طاولة قهوة خشبية", description: "طاولة قهوة من الخشب الطبيعي بتصميم عصري",
    price: 485, originalPrice: 560, images: ["/assets/stores/6.webp"],
    sizes: ["120x60"], availableSizes: ["120x60"],
    colors: [{name: "بني فاتح", value: "#D2B48C"}, {name: "بني غامق", value: "#8B4513"}],
    rating: 4.7, reviews: 22, views: 187, likes: 67, orders: 16, category: "أثاث",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 6003, storeId: 6, name: "خزانة ملابس بأبواب منزلقة", description: "خزانة واسعة بتصميم حديث وأبواب منزلقة",
    price: 1350, originalPrice: 1550, images: ["/assets/stores/6.webp"],
    sizes: ["200x180"], availableSizes: ["200x180"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "بني", value: "#8B4513"}],
    rating: 4.9, reviews: 9, views: 156, likes: 54, orders: 7, category: "أثاث",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 6004, storeId: 6, name: "مصباح أرضي LED", description: "مصباح أرضي بإضاءة LED قابلة للتعديل",
    price: 235, originalPrice: 280, images: ["/assets/stores/6.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "أسود", value: "#000000"}, {name: "أبيض", value: "#FFFFFF"}],
    rating: 4.6, reviews: 18, views: 143, likes: 42, orders: 13, category: "ديكور",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 6005, storeId: 6, name: "مرآة حائط دائرية", description: "مرآة دائرية بإطار ذهبي أنيق",
    price: 125, originalPrice: 150, images: ["/assets/stores/6.webp"],
    sizes: ["60cm"], availableSizes: ["60cm"],
    colors: [{name: "ذهبي", value: "#F59E0B"}, {name: "فضي", value: "#9CA3AF"}],
    rating: 4.8, reviews: 25, views: 198, likes: 73, orders: 19, category: "ديكور",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 6006, storeId: 6, name: "كراسي طعام حديثة", description: "مجموعة من 4 كراسي بتصميم حديث ومريح",
    price: 680, originalPrice: 800, images: ["/assets/stores/6.webp"],
    sizes: ["مجموعة 4"], availableSizes: ["مجموعة 4"],
    colors: [{name: "أسود", value: "#000000"}, {name: "رمادي", value: "#6B7280"}],
    rating: 4.7, reviews: 14, views: 167, likes: 58, orders: 11, category: "أثاث",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 6007, storeId: 6, name: "رف كتب متعدد الطوابق", description: "رف كتب من 5 طوابق لتنظيم مثالي",
    price: 385, originalPrice: 450, images: ["/assets/stores/6.webp"],
    sizes: ["180x80"], availableSizes: ["180x80"],
    colors: [{name: "بني", value: "#8B4513"}, {name: "أبيض", value: "#FFFFFF"}],
    rating: 4.5, reviews: 20, views: 178, likes: 45, orders: 15, category: "أثاث",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 6008, storeId: 6, name: "طقم أواني مطبخ", description: "طقم شامل من الأواني غير القابلة للالتصاق",
    price: 285, originalPrice: 340, images: ["/assets/stores/6.webp"],
    sizes: ["طقم 10 قطع"], availableSizes: ["طقم 10 قطع"],
    colors: [{name: "أحمر", value: "#DC2626"}, {name: "أزرق", value: "#3B82F6"}],
    rating: 4.9, reviews: 31, views: 267, likes: 98, orders: 24, category: "أدوات منزلية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 6009, storeId: 6, name: "مكتب عمل مع أدراج", description: "مكتب عملي بأدراج للتخزين وتصميم أنيق",
    price: 750, originalPrice: 890, images: ["/assets/stores/6.webp"],
    sizes: ["120x60"], availableSizes: ["120x60"],
    colors: [{name: "بني", value: "#8B4513"}, {name: "أبيض", value: "#FFFFFF"}],
    rating: 4.8, reviews: 12, views: 134, likes: 47, orders: 9, category: "أثاث",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 6010, storeId: 6, name: "ساعة حائط عصرية", description: "ساعة حائط صامتة بتصميم عصري وأنيق",
    price: 95, originalPrice: 120, images: ["/assets/stores/6.webp"],
    sizes: ["30cm"], availableSizes: ["30cm"],
    colors: [{name: "أسود", value: "#000000"}, {name: "أبيض", value: "#FFFFFF"}, {name: "ذهبي", value: "#F59E0B"}],
    rating: 4.6, reviews: 28, views: 201, likes: 69, orders: 21, category: "ديكور",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];

// منتجات كومفي (comfy.ly) - storeId: 7
const comfyProducts: Product[] = [
  {
    id: 7001, storeId: 7, name: "بدلة رياضية قطنية", description: "بدلة رياضية مريحة من القطن الخالص",
    price: 185, originalPrice: 220, images: ["/assets/stores/7.webp"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["M", "L", "XL"],
    colors: [{name: "رمادي", value: "#6B7280"}, {name: "أزرق", value: "#3B82F6"}, {name: "أسود", value: "#000000"}],
    rating: 4.7, reviews: 34, views: 298, likes: 123, orders: 28, category: "ملابس رياضية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 7002, storeId: 7, name: "حذاء جري متقدم", description: "حذاء جري مع تقنية امتصاص الصدمات",
    price: 320, originalPrice: 380, images: ["/assets/stores/7.webp"],
    sizes: ["40", "41", "42", "43", "44"], availableSizes: ["41", "42", "43"],
    colors: [{name: "أسود", value: "#000000"}, {name: "أبيض", value: "#FFFFFF"}, {name: "أزرق", value: "#3B82F6"}],
    rating: 4.8, reviews: 29, views: 267, likes: 89, orders: 22, category: "أحذية رياضية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 7003, storeId: 7, name: "شورت رياضي قصير", description: "شورت رياضي مريح بتقنية التهوية",
    price: 75, originalPrice: 95, images: ["/assets/stores/7.webp"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["S", "M", "L", "XL"],
    colors: [{name: "أسود", value: "#000000"}, {name: "أزرق", value: "#3B82F6"}, {name: "رمادي", value: "#6B7280"}],
    rating: 4.5, reviews: 41, views: 345, likes: 134, orders: 35, category: "ملابس رياضية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 7004, storeId: 7, name: "قميص رياضي بأكمام طويلة", description: "قميص رياضي مضاد للبكتيريا",
    price: 95, originalPrice: 115, images: ["/assets/stores/7.webp"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["M", "L"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "أحمر", value: "#DC2626"}],
    rating: 4.6, reviews: 18, views: 189, likes: 67, orders: 14, category: "ملابس رياضية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 7005, storeId: 7, name: "سراويل يوغا مرنة", description: "سراويل يوغا عالية المرونة للنساء",
    price: 125, originalPrice: 150, images: ["/assets/stores/7.webp"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["S", "M", "L"],
    colors: [{name: "أسود", value: "#000000"}, {name: "رمادي", value: "#6B7280"}, {name: "بنفسجي", value: "#8B5CF6"}],
    rating: 4.9, reviews: 26, views: 234, likes: 98, orders: 19, category: "ملابس مريحة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 7006, storeId: 7, name: "جوارب رياضية قطنية", description: "مجموعة 6 أزواج من الجوارب القطنية",
    price: 45, originalPrice: 60, images: ["/assets/stores/7.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "متنوع", value: "#9CA3AF"}],
    rating: 4.4, reviews: 52, views: 287, likes: 145, orders: 43, category: "إكسسوارات رياضية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 7007, storeId: 7, name: "حقيبة رياضية مقاومة للماء", description: "حقيبة رياضية واسعة ومقاومة للماء",
    price: 155, originalPrice: 185, images: ["/assets/stores/7.webp"],
    sizes: ["متوسط", "كبير"], availableSizes: ["متوسط", "كبير"],
    colors: [{name: "أسود", value: "#000000"}, {name: "أزرق", value: "#3B82F6"}],
    rating: 4.7, reviews: 21, views: 178, likes: 76, orders: 16, category: "إكسسوارات رياضية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 7008, storeId: 7, name: "أساور معصم رياضية", description: "أساور معصم لامتصاص العرق",
    price: 25, originalPrice: 35, images: ["/assets/stores/7.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "أسود", value: "#000000"}, {name: "أحمر", value: "#DC2626"}],
    rating: 4.3, reviews: 37, views: 198, likes: 87, orders: 29, category: "إكسسوارات رياضية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 7009, storeId: 7, name: "طقم تمارين منزلية", description: "طقم كامل لممارسة التمارين في المنزل",
    price: 285, originalPrice: 340, images: ["/assets/stores/7.webp"],
    sizes: ["طقم"], availableSizes: ["طقم"],
    colors: [{name: "متنوع", value: "#6B7280"}],
    rating: 4.8, reviews: 15, views: 156, likes: 54, orders: 11, category: "معدات رياضية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 7010, storeId: 7, name: "بنطال جوغينغ قطني", description: "بنطال جوغينغ مريح للاستخدام اليومي",
    price: 115, originalPrice: 140, images: ["/assets/stores/7.webp"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["S", "M", "L", "XL"],
    colors: [{name: "رمادي", value: "#6B7280"}, {name: "أزرق داكن", value: "#1E40AF"}],
    rating: 4.6, reviews: 33, views: 245, likes: 112, orders: 26, category: "ملابس مريحة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];

// منتجات مكنون (maknoon.ly) - storeId: 8
const maknoonProducts: Product[] = [
  {
    id: 8001, storeId: 8, name: "عقد لؤلؤ طبيعي", description: "عقد من اللؤلؤ الطبيعي بتصميم كلاسيكي أنيق",
    price: 650, originalPrice: 750, images: ["/assets/stores/8.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "أبيض لؤلؤي", value: "#F8F8FF"}, {name: "كريمي", value: "#FEF3C7"}],
    rating: 4.9, reviews: 18, views: 234, likes: 89, orders: 14, category: "مجوهرات",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 8002, storeId: 8, name: "أساور ذهبية مطلية", description: "مجموعة من الأساور الذهبية المطلية بتصاميم متنوعة",
    price: 185, originalPrice: 220, images: ["/assets/stores/8.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "ذهبي", value: "#F59E0B"}, {name: "ذهبي وردي", value: "#F472B6"}],
    rating: 4.7, reviews: 26, views: 198, likes: 67, orders: 19, category: "إكسسوارات",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 8003, storeId: 8, name: "حلق فضي بالأحجار الكريمة", description: "أقراط فضية مرصعة بالأحجار الكريمة",
    price: 285, originalPrice: 340, images: ["/assets/stores/8.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "فضي", value: "#C0C0C0"}, {name: "فضي بأحجار زرقاء", value: "#3B82F6"}],
    rating: 4.8, reviews: 22, views: 167, likes: 78, orders: 16, category: "مجوهرات",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 8004, storeId: 8, name: "علبة مجوهرات مخملية", description: "علبة أنيقة لحفظ المجوهرات مبطنة بالمخمل",
    price: 95, originalPrice: 120, images: ["/assets/stores/8.webp"],
    sizes: ["متوسط", "كبير"], availableSizes: ["متوسط", "كبير"],
    colors: [{name: "أحمر", value: "#DC2626"}, {name: "أزرق", value: "#3B82F6"}, {name: "أسود", value: "#000000"}],
    rating: 4.6, reviews: 31, views: 245, likes: 98, orders: 24, category: "هدايا",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 8005, storeId: 8, name: "خاتم خطوبة مرصع", description: "خاتم خطوبة أنيق مرصع بحجر كريم مميز",
    price: 850, originalPrice: 980, images: ["/assets/stores/8.webp"],
    sizes: ["6", "7", "8", "9"], availableSizes: ["7", "8"],
    colors: [{name: "ذهبي أبيض", value: "#F8F8FF"}, {name: "ذهبي أصفر", value: "#F59E0B"}],
    rating: 4.9, reviews: 12, views: 156, likes: 67, orders: 9, category: "مجوهرات",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];

// منتجات تحفة (tohfa.ly) - storeId: 10  
const tohfaProducts: Product[] = [
  {
    id: 10001, storeId: 10, name: "مبخرة نحاسية تراثية", description: "مبخرة نحاسية منقوشة بزخارف تراثية أصيلة",
    price: 185, originalPrice: 220, images: ["/assets/stores/11.webp"],
    sizes: ["متوسط", "كبير"], availableSizes: ["متوسط", "كبير"],
    colors: [{name: "نحاسي", value: "#B8860B"}, {name: "فضي", value: "#C0C0C0"}],
    rating: 4.8, reviews: 19, views: 178, likes: 54, orders: 14, category: "تحف",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 10002, storeId: 10, name: "صينية تقديم خشبية", description: "صينية تقديم من الخشب المنقوش بتصاميم تراثية",
    price: 125, originalPrice: 150, images: ["/assets/stores/11.webp"],
    sizes: ["صغير", "متوسط", "كبير"], availableSizes: ["متوسط", "كبير"],
    colors: [{name: "بني فاتح", value: "#D2B48C"}, {name: "بني غامق", value: "#8B4513"}],
    rating: 4.7, reviews: 25, views: 201, likes: 67, orders: 18, category: "ديكور",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 10003, storeId: 10, name: "فازة خزفية مزخرفة", description: "فازة من الخزف المزخرف بألوان زاهية",
    price: 95, originalPrice: 115, images: ["/assets/stores/11.webp"],
    sizes: ["صغير", "متوسط"], availableSizes: ["صغير", "متوسط"],
    colors: [{name: "أزرق وأبيض", value: "#3B82F6"}, {name: "أحمر وذهبي", value: "#DC2626"}],
    rating: 4.6, reviews: 28, views: 234, likes: 89, orders: 21, category: "ديكور",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 10004, storeId: 10, name: "طقم فناجين قهوة تراثية", description: "طقم من 6 فناجين قهوة بتصميم تراثي أنيق",
    price: 165, originalPrice: 195, images: ["/assets/stores/11.webp"],
    sizes: ["طقم 6 قطع"], availableSizes: ["طقم 6 قطع"],
    colors: [{name: "ذهبي وأبيض", value: "#F59E0B"}, {name: "أزرق وذهبي", value: "#3B82F6"}],
    rating: 4.9, reviews: 16, views: 167, likes: 76, orders: 12, category: "هدايا تراثية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 10005, storeId: 10, name: "مصحف شريف مزخرف", description: "مصحف شريف بغلاف جلدي مزخرف وحروف ذهبية",
    price: 285, originalPrice: 340, images: ["/assets/stores/11.webp"],
    sizes: ["متوسط"], availableSizes: ["متوسط"],
    colors: [{name: "بني وذهبي", value: "#8B4513"}, {name: "أخضر وذهبي", value: "#10B981"}],
    rating: 4.9, reviews: 23, views: 189, likes: 98, orders: 17, category: "هدايا تراثية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];

// منتجات برشت بلو (brushtblue.ly) - storeId: 11
const brushtblueProducts: Product[] = [
  {
    id: 11001, storeId: 11, name: "طقم فرش رسم احترافي", description: "طقم شامل من فرش الرسم عالية الجودة للمحترفين",
    price: 185, originalPrice: 220, images: ["/assets/stores/12.webp"],
    sizes: ["طقم 12 قطعة", "طقم 24 قطعة"], availableSizes: ["طقم 12 قطعة", "طقم 24 قطعة"],
    colors: [{name: "متنوع", value: "#6B7280"}],
    rating: 4.8, reviews: 34, views: 267, likes: 123, orders: 28, category: "أدوات رسم",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 11002, storeId: 11, name: "ألوان مائية عالية الجودة", description: "مجموعة ألوان مائية احترافية بـ36 لون",
    price: 95, originalPrice: 115, images: ["/assets/stores/12.webp"],
    sizes: ["36 لون"], availableSizes: ["36 لون"],
    colors: [{name: "متنوع", value: "#EC4899"}],
    rating: 4.7, reviews: 41, views: 298, likes: 134, orders: 32, category: "أدوات رسم",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 11003, storeId: 11, name: "لوحة رسم خشبية", description: "لوحة رسم من الخشب الطبيعي بأحجام متنوعة",
    price: 65, originalPrice: 80, images: ["/assets/stores/12.webp"],
    sizes: ["30x40", "50x70"], availableSizes: ["30x40", "50x70"],
    colors: [{name: "طبيعي", value: "#D2B48C"}],
    rating: 4.6, reviews: 28, views: 198, likes: 87, orders: 22, category: "أدوات رسم",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 11004, storeId: 11, name: "أقلام رصاص للرسم", description: "مجموعة أقلام رصاص بدرجات مختلفة للرسم",
    price: 45, originalPrice: 55, images: ["/assets/stores/12.webp"],
    sizes: ["مجموعة 12 قلم"], availableSizes: ["مجموعة 12 قلم"],
    colors: [{name: "رمادي", value: "#6B7280"}],
    rating: 4.5, reviews: 52, views: 334, likes: 145, orders: 43, category: "قرطاسية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 11005, storeId: 11, name: "ألوان أكريليك احترافية", description: "مجموعة ألوان أكريليك عالية الجودة بـ24 لون",
    price: 125, originalPrice: 150, images: ["/assets/stores/12.webp"],
    sizes: ["24 لون"], availableSizes: ["24 لون"],
    colors: [{name: "متنوع", value: "#8B5CF6"}],
    rating: 4.8, reviews: 19, views: 178, likes: 76, orders: 15, category: "أدوات رسم",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];

// منتجات الركن الليبي للساعات (tlcwatches.ly) - storeId: 17
const tlcwatchesProducts: Product[] = [
  {
    id: 17001, storeId: 17, name: "ساعة رجالية كلاسيكية", description: "ساعة رجالية أنيقة بتصميم كلاسيكي وحزام جلدي",
    price: 485, originalPrice: 560, images: ["/assets/stores/18.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "أسود", value: "#000000"}, {name: "بني", value: "#8B4513"}, {name: "أزرق", value: "#1E40AF"}],
    rating: 4.8, reviews: 29, views: 267, likes: 89, orders: 22, category: "ساعات",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 17002, storeId: 17, name: "ساعة ذكية رياضية", description: "ساعة ذكية مقاومة للماء مع مراقبة اللياقة البدنية",
    price: 650, originalPrice: 750, images: ["/assets/stores/18.webp"],
    sizes: ["38mm", "42mm"], availableSizes: ["42mm"],
    colors: [{name: "أسود", value: "#000000"}, {name: "فضي", value: "#C0C0C0"}],
    rating: 4.9, reviews: 18, views: 234, likes: 98, orders: 14, category: "ساعات ذكية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 17003, storeId: 17, name: "محفظة جلدية فاخرة", description: "محفظة رجالية من الجلد الطبيعي بتصميم أنيق",
    price: 185, originalPrice: 220, images: ["/assets/stores/18.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "أسود", value: "#000000"}, {name: "بني", value: "#8B4513"}],
    rating: 4.7, reviews: 26, views: 198, likes: 67, orders: 19, category: "إكسسوارات رجالية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 17004, storeId: 17, name: "خاتم رجالي من الفضة", description: "خاتم رجالي أنيق من الفضة الخالصة",
    price: 225, originalPrice: 270, images: ["/assets/stores/18.webp"],
    sizes: ["8", "9", "10", "11"], availableSizes: ["9", "10"],
    colors: [{name: "فضي", value: "#C0C0C0"}],
    rating: 4.6, reviews: 22, views: 167, likes: 54, orders: 16, category: "إكسسوارات رجالية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 17005, storeId: 17, name: "سلسلة رجالية ذهبية", description: "سلسلة رجالية من الذهب المطلي بتصميم عصري",
    price: 385, originalPrice: 450, images: ["/assets/stores/18.webp"],
    sizes: ["50cm", "60cm"], availableSizes: ["50cm", "60cm"],
    colors: [{name: "ذهبي", value: "#F59E0B"}],
    rating: 4.8, reviews: 15, views: 145, likes: 67, orders: 11, category: "إكسسوارات رجالية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];

// منتجات أونباسو (unpasso.ly) - storeId: 13
const unpassoProducts: Product[] = [
  {
    id: 13001, storeId: 13, name: "حذاء رياضي مريح", description: "حذاء رياضي عالي الجودة مع نعل مضاد للانزلاق",
    price: 165, originalPrice: 195, images: ["/assets/stores/14.webp"],
    sizes: ["40", "41", "42", "43", "44"], availableSizes: ["41", "42", "43"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "أسود", value: "#000000"}, {name: "أزرق", value: "#3B82F6"}],
    rating: 4.7, reviews: 28, views: 234, likes: 89, orders: 21, category: "أحذية رياضية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 13002, storeId: 13, name: "صنادل جلدية عادية", description: "صنادل من الجلد الطبيعي بتصميم كلاسيكي",
    price: 95, originalPrice: 120, images: ["/assets/stores/14.webp"],
    sizes: ["38", "39", "40", "41", "42"], availableSizes: ["39", "40", "41"],
    colors: [{name: "بني", value: "#8B4513"}, {name: "أسود", value: "#000000"}],
    rating: 4.6, reviews: 34, views: 198, likes: 67, orders: 26, category: "صنادل",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 13003, storeId: 13, name: "أحذية نسائية عالية الكعب", description: "أحذية عالية الكعب مع تصميم أنيق ومريح",
    price: 285, originalPrice: 340, images: ["/assets/stores/14.webp"],
    sizes: ["36", "37", "38", "39", "40"], availableSizes: ["37", "38", "39"],
    colors: [{name: "أسود", value: "#000000"}, {name: "بني", value: "#8B4513"}, {name: "أحمر", value: "#DC2626"}],
    rating: 4.8, reviews: 19, views: 167, likes: 54, orders: 15, category: "أحذية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 13004, storeId: 13, name: "حذاء رجالي رسمي", description: "حذاء رجالي من الجلد للمناسبات الرسمية",
    price: 385, originalPrice: 450, images: ["/assets/stores/14.webp"],
    sizes: ["40", "41", "42", "43", "44", "45"], availableSizes: ["42", "43", "44"],
    colors: [{name: "أسود", value: "#000000"}, {name: "بني", value: "#8B4513"}],
    rating: 4.9, reviews: 16, views: 145, likes: 67, orders: 12, category: "أحذية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 13005, storeId: 13, name: "شباشب نسائية عصرية", description: "شباشب نسائية مريحة بتصميم عصري",
    price: 125, originalPrice: 150, images: ["/assets/stores/14.webp"],
    sizes: ["36", "37", "38", "39", "40"], availableSizes: ["37", "38", "39", "40"],
    colors: [{name: "وردي", value: "#EC4899"}, {name: "أبيض", value: "#FFFFFF"}, {name: "ذهبي", value: "#F59E0B"}],
    rating: 4.5, reviews: 31, views: 256, likes: 98, orders: 24, category: "شباشب",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];

// منتجات إيلول (eylul.ly) - storeId: 18
const eylulProducts: Product[] = [
  {
    id: 18001, storeId: 18, name: "فستان تركي مطرز", description: "فستان تركي أنيق بتطريز يدوي مميز",
    price: 285, originalPrice: 340, images: ["/assets/stores/19.webp"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["M", "L", "XL"],
    colors: [{name: "أزرق تركي", value: "#1E40AF"}, {name: "أحمر عتيق", value: "#DC2626"}],
    rating: 4.8, reviews: 22, views: 198, likes: 76, orders: 17, category: "أزياء تركية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 18002, storeId: 18, name: "عباية تركية فاخرة", description: "عباية تركية من أجود الخامات بتصميم راقي",
    price: 385, originalPrice: 450, images: ["/assets/stores/19.webp"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["S", "M", "L"],
    colors: [{name: "أسود", value: "#000000"}, {name: "بني غامق", value: "#8B4513"}, {name: "أزرق داكن", value: "#1E3A8A"}],
    rating: 4.9, reviews: 18, views: 167, likes: 89, orders: 14, category: "أزياء تركية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 18003, storeId: 18, name: "بلوزة قطنية عصرية", description: "بلوزة قطنية تركية بقصة عصرية أنيقة",
    price: 125, originalPrice: 150, images: ["/assets/stores/19.webp"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["M", "L", "XL"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "وردي فاتح", value: "#F9A8D4"}],
    rating: 4.6, reviews: 29, views: 234, likes: 98, orders: 23, category: "ملابس نسائية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 18004, storeId: 18, name: "طقم محجبات تركية", description: "مجموعة محجبات تركية فاخرة بتصاميم متنوعة",
    price: 185, originalPrice: 220, images: ["/assets/stores/19.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "متنوع", value: "#8B5CF6"}],
    rating: 4.7, reviews: 33, views: 267, likes: 123, orders: 28, category: "محجبات",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 18005, storeId: 18, name: "جاكيت تركي شتوي", description: "جاكيت شتوي تركي عالي الجودة مناسب للطقس البارد",
    price: 450, originalPrice: 520, images: ["/assets/stores/19.webp"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["M", "L"],
    colors: [{name: "رمادي غامق", value: "#374151"}, {name: "أسود", value: "#000000"}],
    rating: 4.8, reviews: 15, views: 145, likes: 67, orders: 11, category: "ملابس نسائية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];

// منتجات كوزيت بوتيك (cozetboutique.ly) - storeId: 19
const cozetboutiqueProducts: Product[] = [
  {
    id: 19001, storeId: 19, name: "حقيبة يد فاخرة", description: "حقيبة يد من الجلد الطبيعي بتصميم عصري فاخر",
    price: 485, originalPrice: 560, images: ["/assets/stores/20.webp"],
    sizes: ["صغير", "متوسط", "كبير"], availableSizes: ["متوسط", "كبير"],
    colors: [{name: "أسود", value: "#000000"}, {name: "بيج", value: "#D4A574"}, {name: "بني", value: "#8B4513"}],
    rating: 4.9, reviews: 16, views: 178, likes: 89, orders: 12, category: "حقائب مميزة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 19002, storeId: 19, name: "إكسسوار شعر ذهبي", description: "مجموعة إكسسوارات شعر أنيقة مطلية بالذهب",
    price: 125, originalPrice: 150, images: ["/assets/stores/20.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "ذهبي", value: "#F59E0B"}, {name: "فضي", value: "#C0C0C0"}],
    rating: 4.7, reviews: 28, views: 234, likes: 123, orders: 21, category: "إكسسوارات فاخرة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 19003, storeId: 19, name: "فستان سهرة فاخر", description: "فستان سهرة فاخر من أجود الأقمشة للمناسبات الخاصة",
    price: 650, originalPrice: 750, images: ["/assets/stores/20.webp"],
    sizes: ["S", "M", "L", "XL"], availableSizes: ["M", "L"],
    colors: [{name: "أحمر عميق", value: "#7F1D1D"}, {name: "أزرق ملكي", value: "#1E3A8A"}, {name: "أسود", value: "#000000"}],
    rating: 4.9, reviews: 13, views: 145, likes: 67, orders: 10, category: "أزياء راقية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 19004, storeId: 19, name: "عقد لؤلؤ طبيعي مطعم", description: "عقد من اللؤلؤ الطبيعي المطعم بالأحجار الكريمة",
    price: 850, originalPrice: 980, images: ["/assets/stores/20.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "لؤلؤي طبيعي", value: "#FEF3C7"}],
    rating: 4.9, reviews: 11, views: 134, likes: 54, orders: 8, category: "مجوهرات",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 19005, storeId: 19, name: "شنطة سفر أنيقة", description: "شنطة سفر أنيقة من الجلد مع تفاصيل معدنية فاخرة",
    price: 385, originalPrice: 450, images: ["/assets/stores/20.webp"],
    sizes: ["متوسط", "كبير"], availableSizes: ["متوسط", "كبير"],
    colors: [{name: "بني غامق", value: "#8B4513"}, {name: "أسود", value: "#000000"}],
    rating: 4.8, reviews: 24, views: 198, likes: 89, orders: 18, category: "حقائب مميزة",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];

// منتجات الوردة البيضاء (alwardaalbayda.ly) - storeId: 16
const alwardaalbaydaProducts: Product[] = [
  {
    id: 16001, storeId: 16, name: "عطر ورد طبيعي فاخر", description: "عطر فاخر من الورد الطبيعي بعبير قوي ويدوم طويلاً",
    price: 285, originalPrice: 340, images: ["/assets/stores/17.webp"],
    sizes: ["50ml", "100ml"], availableSizes: ["50ml", "100ml"],
    colors: [{name: "وردي فاتح", value: "#F9A8D4"}],
    rating: 4.8, reviews: 31, views: 267, likes: 123, orders: 24, category: "عطور",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 16002, storeId: 16, name: "باقة ورود طبيعية", description: "باقة ورود حمراء طبيعية محفوظة بعناية لتدوم طويلاً",
    price: 125, originalPrice: 150, images: ["/assets/stores/17.webp"],
    sizes: ["12 وردة", "24 وردة"], availableSizes: ["12 وردة", "24 وردة"],
    colors: [{name: "أحمر", value: "#DC2626"}, {name: "وردي", value: "#EC4899"}, {name: "أبيض", value: "#FFFFFF"}],
    rating: 4.9, reviews: 42, views: 356, likes: 167, orders: 35, category: "ورود",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 16003, storeId: 16, name: "زيت ورد عضوي خالص", description: "زيت ورد عضوي خالص 100% للعناية بالبشرة والشعر",
    price: 185, originalPrice: 220, images: ["/assets/stores/17.webp"],
    sizes: ["30ml", "50ml"], availableSizes: ["30ml", "50ml"],
    colors: [{name: "طبيعي", value: "#FEF3C7"}],
    rating: 4.7, reviews: 26, views: 198, likes: 89, orders: 19, category: "زيوت طبيعية",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 16004, storeId: 16, name: "شموع عطرية بالورد", description: "مجموعة شموع عطرية بعبير الورد لأجواء رومانسية",
    price: 95, originalPrice: 120, images: ["/assets/stores/17.webp"],
    sizes: ["3 قطع", "6 قطع"], availableSizes: ["3 قطع", "6 قطع"],
    colors: [{name: "وردي", value: "#EC4899"}, {name: "أبيض", value: "#FFFFFF"}],
    rating: 4.6, reviews: 34, views: 245, likes: 112, orders: 27, category: "شموع",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  },
  {
    id: 16005, storeId: 16, name: "عطر عود وورد فاخر", description: "عطر فاخر يجمع بين عبير العود والورد لعبير مميز يدوم طويلاً",
    price: 385, originalPrice: 450, images: ["/assets/stores/17.webp"],
    sizes: ["50ml", "100ml"], availableSizes: ["100ml"],
    colors: [{name: "ذهبي غامق", value: "#A16207"}],
    rating: 4.9, reviews: 18, views: 156, likes: 76, orders: 14, category: "عطور",
    quantity: 10, inStock: true, isAvailable: true, tags: []
  }
];


const applyAutoBadges = (products: Product[]): Product[] => {
  return products.map(product => {
    const badge = calculateBadge(product);
    return {
      ...product,
      badge,
      tags: product.tags ? [...new Set([...product.tags, badge])] : [badge]
    };
  });
};

// تصدير المنتجات الشاملة - استخدام المنتجات الحقيقية للمتاجر الخمسة
export const allStoreProducts: Product[] = applyAutoBadges([
  ...indeeshProducts, // منتجات انديش - المتجر الآلي الجديد
  ...nawaemProducts, // منتجات نواعم الفريدة والحصرية
  ...sheirineProducts, // منتجات شيرين الفريدة والحصرية
  ...deltaProducts, // منتجات دلتا ستور الفريدة والحصرية
  ...magnaBeautyProducts, // منتجات ماجنا بيوتي الفريدة والحصرية
  ...allRealStoreProducts.map((p: RealProduct) => ({ ...p, quantity: p.quantity || 0 })) as Product[], // المنتجات الحقيقية للمتاجر الخمسة
  ...mkanekProducts,
  ...comfyProducts,
  ...maknoonProducts,
  ...tohfaProducts,
  ...brushtblueProducts,
  ...tlcwatchesProducts,
  ...unpassoProducts,
  ...eylulProducts,
  ...cozetboutiqueProducts,
  ...alwardaalbaydaProducts
]);

// دالة للحصول على منتجات متجر معين
export const getStoreProducts = (storeId: number): Product[] => {
  return allStoreProducts.filter(product => product.storeId === storeId);
};

// دالة للحصول على المنتجات المخفضة
export const getDiscountedProducts = (storeId?: number): Product[] => {
  const products = storeId 
    ? allStoreProducts.filter(p => p.storeId === storeId)
    : allStoreProducts;
  
  return products.filter(product => product.originalPrice > product.price);
};

// دالة للحصول على المنتجات الجديدة
export const getNewProducts = (storeId?: number): Product[] => {
  const products = storeId 
    ? allStoreProducts.filter(p => p.storeId === storeId)
    : allStoreProducts;
  
  return products.filter(product => product.tags.includes('جديد'));
};
