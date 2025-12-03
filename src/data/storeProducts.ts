// Store products data module for EISHRO platform
// المنتجات التجريبية الشاملة لجميع المتاجر

export interface Product {
  id: number;
  storeId: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  sizes: string[];
  availableSizes: string[];
  colors: Array<{ name: string; value: string }>;
  rating: number;
  reviews: number;
  views: number;
  likes: number;
  orders: number;
  category: string;
  inStock: boolean;
  isAvailable: boolean;
  tags: string[];
  badge?: string;
  quantity: number;
  expiryDate?: string;
  endDate?: string;
}

const MAGNA_STORE_ID = 5;

// magnaBeautyProducts: Product data for Magna Beauty store
// منتجات ماجنا بيوتي (magna-beauty)
const magnaBeautyProducts: Product[] = [
  {
    id: 4001, storeId: MAGNA_STORE_ID, name: "PINK PUFF", description: "PINK PUFF",
    price: 10, originalPrice: 12, images: ["public/assets/magne-beauty/pink-puff.webp","/assets/magne-beauty/pink-puff1.webp","/assets/magne-beauty/pink-puff2.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "وردي", value: "#e2ababff"}, {name: "بيج", value: "#DEB887"}, {name: "أسود", value: "#0e0d0dff"}],
    rating: 4.9, reviews: 70, views: 298, likes: 300, orders: 200, category: "مكياج",
    inStock: true, isAvailable: true, tags: ["مميزة"], badge: "مميزة", quantity: 15,
    expiryDate: "2026-06-15", endDate: "2027-06-15"
  },
  {
    id: 4002, storeId: MAGNA_STORE_ID, name: "blush-brush", description: "blush-brush",
    price: 25, originalPrice: 45, images: ["public/assets/magne-beauty/blush-brush1.webp","/assets/magne-beauty/blush-brush2.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "وردي", value: "#ffc6c6ff"}],
    rating: 4.9, reviews: 88, views: 456, likes: 500, orders: 300, category: "مكياج",
    inStock: true, isAvailable: true, tags: ["أكثر طلباً"], badge: "أكثر طلباً", quantity: 20,
    expiryDate: "2027-03-20", endDate: "2028-03-20"
  },
  {
    id: 4003, storeId: MAGNA_STORE_ID, name: "shader-brush", description: "shader-brush",
    price: 15, originalPrice: 30, images: ["public/assets/magne-beauty/shader-brush.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "بني", value: "#8B4513"}],
    rating: 4.8, reviews: 70, views: 312, likes: 460, orders: 214, category: "مكياج",
    inStock: true, isAvailable: true, tags: ["أكثر مبيعاً"], badge: "أكثر مبيعاً", quantity: 12,
    expiryDate: "2026-09-10", endDate: "2027-09-10"
  },
  {
    id: 4004, storeId: MAGNA_STORE_ID, name: "foundation-brush", description: "foundation-brush",
    price: 25, originalPrice: 40, images: ["public/assets/magne-beauty/foundation-brush.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "ألوان دافئة", value: "#e6cab6ff"}],
    rating: 4.9, reviews: 44, views: 240, likes: 260, orders: 180, category: "مكياج",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد", quantity: 8,
    expiryDate: "2026-12-05", endDate: "2027-12-05"
  },
  {
    id: 4005, storeId: MAGNA_STORE_ID, name: "fan-brush", description: "fan-brush",
    price: 25, originalPrice: 40, images: ["public/assets/magne-beauty/fan-brush.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "طبيعي", value: "#F5F5DC"}],
    rating: 4.7, reviews: 52, views: 367, likes: 145, orders: 38, category: "عناية بالبشرة",
    inStock: true, isAvailable: true, tags: ["أكثر مشاهدة"], badge: "أكثر مشاهدة", quantity: 18,
    expiryDate: "2026-08-22", endDate: "2027-08-22"
  },
  {
    id: 4006, storeId: MAGNA_STORE_ID, name: "eye-contour", description: "eye-contour",
    price: 15, originalPrice: 25, images: ["public/assets/magne-beauty/eye-contour.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "طبيعي", value: "#FFF8DC"}],
    rating: 4.8, reviews: 28, views: 234, likes: 98, orders: 21, category: "عناية بالبشرة",
    inStock: true, isAvailable: true, tags: ["تخفيضات"], badge: "تخفيضات", quantity: 10,
    expiryDate: "2026-11-30", endDate: "2027-11-30"
  },
  {
    id: 4007, storeId: MAGNA_STORE_ID, name: "eyebrow-brush", description: "eyebrow-brush",
    price: 25, originalPrice: 40, images: ["public/assets/magne-beauty/eyebrow-brush.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "طبيعي", value: "#F0F8FF"}],
    rating: 4.5, reviews: 39, views: 287, likes: 112, orders: 70, category: "عناية بالبشرة",
    inStock: true, isAvailable: true, tags: ["مميزة"], badge: "مميزة", quantity: 14,
    expiryDate: "2026-07-18", endDate: "2027-07-18"
  },
  {
    id: 4008, storeId: MAGNA_STORE_ID, name: "eyeliner-brush", description: "eyeliner-brush",
    price: 25, originalPrice: 40, images: ["public/assets/magne-beauty/eyeliner-brush.webp"],
    sizes: ["واحدة"], availableSizes: ["واحدة"],
    colors: [{name: "طبيعي", value: "#F0F8FF"}],
    rating: 4.9, reviews: 19, views: 167, likes: 89, orders: 44, category: "عطور",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد", quantity: 9,
    expiryDate: "2026-10-12", endDate: "2027-10-12"
  },
  {
    id: 4009, storeId: MAGNA_STORE_ID, name: "POSE", description: "POSE",
    price: 25, originalPrice: 40, images: ["public/assets/magne-beauty/pose.webp"],
    sizes: ["واحدة"], availableSizes: ["واحدة"],
    colors: [{name: "طبيعي", value: "#F5E6D3"}],
    rating: 4.6, reviews: 33, views: 245, likes: 87, orders: 45, category: "عناية بالبشرة",
    inStock: true, isAvailable: true, tags: ["مميزة"], badge: "مميزة", quantity: 11,
    expiryDate: "2026-05-25", endDate: "2027-05-25"
  },
  {
    id: 4010, storeId: MAGNA_STORE_ID, name: "ANGEL", description: "ANGEL",
    price: 25, originalPrice: 40, images: ["public/assets/magne-beauty/angel.webp"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "فاتح", value: "#FFEAA7"}],
    rating: 4.7, reviews: 26, views: 198, likes: 76, orders: 54, category: "مكياج",
    inStock: true, isAvailable: true, tags: ["أكثر طلباً"], badge: "أكثر طلباً", quantity: 16,
    expiryDate: "2026-04-10", endDate: "2027-04-10"
  },
  {
    id: 4011, storeId: MAGNA_STORE_ID, name: "GEM", description: "GEM",
    price: 25, originalPrice: 40, images: ["public/assets/magne-beauty/gem.webp"],
    sizes: ["واحدة"], availableSizes: ["واحدة"],
    colors: [{name: "طبيعي", value: "#F5E6D3"}],
    rating: 4.9, reviews: 37, views: 245, likes: 67, orders: 69, category: "عناية بالبشرة",
    inStock: true, isAvailable: true, tags: ["أكثر إعجاباً"], badge: "أكثر إعجاباً", quantity: 22,
    expiryDate: "2027-01-08", endDate: "2028-01-08"
  },
  {
    id: 4012, storeId: MAGNA_STORE_ID, name: "ICY1", description: "ICY1",
    price: 75, originalPrice: 95, images: ["public/assets/magne-beauty/icy1.webp"],
    sizes: ["واحدة"], availableSizes: ["واحدة"],
    colors: [{name: "طبيعي", value: "#F5E6D3"}],
    rating: 4.9, reviews: 12, views: 130, likes: 55, orders: 102, category: "عناية بالبشرة",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد", quantity: 7,
    expiryDate: "2026-02-14", endDate: "2027-02-14"
  },
  {
    id: 4013, storeId: MAGNA_STORE_ID, name: "TOPAZ", description: "TOPAZ",
    price: 75, originalPrice: 95, images: ["public/assets/magne-beauty/topaz1.webp","/assets/magne-beauty/topaz2.webp"],
    sizes: ["واحدة"], availableSizes: ["واحدة"],
    colors: [{name: "طبيعي", value: "#F5E6D3"}],
    rating: 4.7, reviews: 48, views: 600, likes: 355, orders: 250, category: "عناية بالبشرة",
    inStock: true, isAvailable: true, tags: ["مميزة"], badge: "مميزة", quantity: 25,
    expiryDate: "2027-06-30", endDate: "2028-06-30"
  }
];

// mkanekProducts: Product data for Mkanek store
// منتجات مكانك (mkanek.ly)
const mkanekProducts: Product[] = [
  {
    id: 401, storeId: 6, name: "أريكة ثلاثية جلدية فاخرة", description: "أريكة ثلاثية من الجلد الطبيعي بتصميم عصري ومريح",
    price: 2450, originalPrice: 2850, images: ["/assets/products/mkanek/sofa1.jpg"],
    sizes: ["كبير"], availableSizes: ["كبير"],
    colors: [{name: "بني", value: "#8B4513"}, {name: "أسود", value: "#000000"}, {name: "رمادي", value: "#6B7280"}],
    rating: 4.8, reviews: 15, views: 245, likes: 89, orders: 8, category: "أثاث",
    inStock: true, isAvailable: true, tags: ["مميزة"], badge: "مميزة", quantity: 3,
    expiryDate: "2028-12-15", endDate: "2030-12-15"
  },
  {
    id: 402, storeId: 6, name: "طاولة طعام خشبية للثمانية", description: "طاولة طعام من الخشب الطبيعي تتسع لثمانية أشخاص",
    price: 1850, originalPrice: 2100, images: ["/assets/products/mkanek/dining-table1.jpg"],
    sizes: ["كبير"], availableSizes: ["كبير"],
    colors: [{name: "بني فاتح", value: "#D2691E"}, {name: "بني داكن", value: "#8B4513"}],
    rating: 4.7, reviews: 12, views: 198, likes: 67, orders: 6, category: "أثاث",
    inStock: true, isAvailable: true, tags: ["أكثر طلباً"], badge: "أكثر طلباً", quantity: 2,
    expiryDate: "2028-06-20", endDate: "2030-06-20"
  },
  {
    id: 403, storeId: 6, name: "مكتبة جدارية عصرية", description: "مكتبة جدارية بتصميم عصري وأرفف متعددة",
    price: 950, originalPrice: 1100, images: ["/assets/products/mkanek/bookshelf1.jpg"],
    sizes: ["متوسط", "كبير"], availableSizes: ["متوسط", "كبير"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "بني", value: "#8B4513"}],
    rating: 4.6, reviews: 18, views: 167, likes: 78, orders: 9, category: "ديكور",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 5,
    expiryDate: "2028-09-10", endDate: "2030-09-10"
  },
  {
    id: 404, storeId: 6, name: "سرير ملكي مع كومودين", description: "سرير ملكي فاخر مع كومودين جانبي متناسق",
    price: 3200, originalPrice: 3650, images: ["/assets/products/mkanek/bedroom-set1.jpg"],
    sizes: ["ملكي"], availableSizes: ["ملكي"],
    colors: [{name: "أبيض كلاسيكي", value: "#FFFFFF"}, {name: "بني داكن", value: "#8B4513"}],
    rating: 4.9, reviews: 8, views: 156, likes: 92, orders: 4, category: "أثاث",
    inStock: true, isAvailable: true, tags: ["أكثر إعجاباً"], badge: "أكثر إعجاباً", quantity: 1,
    expiryDate: "2029-03-15", endDate: "2031-03-15"
  },
  {
    id: 405, storeId: 6, name: "خزانة ملابس كبيرة بمرآة", description: "خزانة ملابس واسعة بأبواب منزلقة ومرآة كاملة",
    price: 2100, originalPrice: 2400, images: ["/assets/products/mkanek/wardrobe1.jpg"],
    sizes: ["كبير"], availableSizes: ["كبير"],
    colors: [{name: "أبيض لامع", value: "#FFFFFF"}, {name: "رمادي", value: "#6B7280"}],
    rating: 4.5, reviews: 14, views: 189, likes: 85, orders: 7, category: "أثاث",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 4,
    expiryDate: "2028-11-22", endDate: "2030-11-22"
  },
  {
    id: 406, storeId: 6, name: "كرسي مكتب مريح وأنيق", description: "كرسي مكتب بتصميم مريح وعجلات سلسة",
    price: 485, originalPrice: 550, images: ["/assets/products/mkanek/office-chair1.jpg"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "أسود", value: "#000000"}, {name: "رمادي", value: "#6B7280"}, {name: "بني", value: "#8B4513"}],
    rating: 4.4, reviews: 23, views: 234, likes: 134, orders: 15, category: "أثاث",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد", quantity: 8,
    expiryDate: "2028-05-08", endDate: "2030-05-08"
  },
  {
    id: 407, storeId: 6, name: "طاولة قهوة زجاجية", description: "طاولة قهوة أنيقة بسطح زجاجي وقاعدة معدنية",
    price: 650, originalPrice: 750, images: ["/assets/products/mkanek/coffee-table1.jpg"],
    sizes: ["متوسط"], availableSizes: ["متوسط"],
    colors: [{name: "زجاج شفاف", value: "#F0F8FF"}, {name: "زجاج مدخن", value: "#696969"}],
    rating: 4.6, reviews: 19, views: 178, likes: 95, orders: 11, category: "ديكور",
    inStock: true, isAvailable: true, tags: ["تخفيضات"], badge: "تخفيضات", quantity: 6,
    expiryDate: "2028-08-17", endDate: "2030-08-17"
  },
  {
    id: 408, storeId: 6, name: "وحدة تلفزيون عصرية", description: "وحدة تلفزيون بتصميم عصري وأدراج تخزين",
    price: 1250, originalPrice: 1450, images: ["/assets/products/mkanek/tv-unit1.jpg"],
    sizes: ["كبير"], availableSizes: ["كبير"],
    colors: [{name: "أبيض وبني", value: "#8B4513"}, {name: "أسود", value: "#000000"}],
    rating: 4.7, reviews: 16, views: 198, likes: 87, orders: 9, category: "أثاث",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 2,
    expiryDate: "2029-01-25", endDate: "2031-01-25"
  },
  {
    id: 409, storeId: 6, name: "مجموعة كراسي طعام 6 قطع", description: "مجموعة من 6 كراسي طعام بتصميم متناسق",
    price: 1450, originalPrice: 1650, images: ["/assets/products/mkanek/dining-chairs1.jpg"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "بني فاتح", value: "#D2691E"}, {name: "كريمي", value: "#FEF3C7"}],
    rating: 4.5, reviews: 13, views: 145, likes: 73, orders: 7, category: "أثاث",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 3,
    expiryDate: "2028-10-12", endDate: "2030-10-12"
  },
  {
    id: 410, storeId: 6, name: "مرآة ديكور دائرية كبيرة", description: "مرآة ديكور دائرية بإطار ذهبي أنيق",
    price: 385, originalPrice: 450, images: ["/assets/products/mkanek/mirror1.jpg"],
    sizes: ["كبير"], availableSizes: ["كبير"],
    colors: [{name: "ذهبي", value: "#F59E0B"}, {name: "فضي", value: "#C0C0C0"}],
    rating: 4.8, reviews: 21, views: 189, likes: 112, orders: 14, category: "ديكور",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 12,
    expiryDate: "2029-04-05", endDate: "2031-04-05"
  },
  {
    id: 411, storeId: 6, name: "لوحة جدارية فنية", description: "لوحة جدارية بتصميم فني معاصر وألوان جذابة",
    price: 295, originalPrice: 340, images: ["/assets/products/mkanek/wall-art1.jpg"],
    sizes: ["متوسط", "كبير"], availableSizes: ["متوسط"],
    colors: [{name: "متعدد الألوان", value: "#EC4899"}],
    rating: 4.3, reviews: 17, views: 134, likes: 68, orders: 8, category: "ديكور",
    inStock: true, isAvailable: true, tags: ["تخفيضات"], badge: "تخفيضات", quantity: 9,
    expiryDate: "2029-07-18", endDate: "2031-07-18"
  },
  {
    id: 412, storeId: 6, name: "خزانة أحذية عملية", description: "خزانة أحذية بتصميم عملي وأرفف متعددة",
    price: 450, originalPrice: 520, images: ["/assets/products/mkanek/shoe-cabinet1.jpg"],
    sizes: ["متوسط"], availableSizes: ["متوسط"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "بني", value: "#8B4513"}],
    rating: 4.4, reviews: 25, views: 201, likes: 89, orders: 16, category: "أدوات منزلية",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 7,
    expiryDate: "2028-12-30", endDate: "2030-12-30"
  },
  {
    id: 413, storeId: 6, name: "كنبة استرخاء مع عثمانية", description: "كنبة استرخاء مريحة مع عثمانية منفصلة",
    price: 1850, originalPrice: 2100, images: ["/assets/products/mkanek/recliner1.jpg"],
    sizes: ["كبير"], availableSizes: [],
    colors: [{name: "رمادي", value: "#6B7280"}, {name: "بيج", value: "#D4A574"}],
    rating: 4.7, reviews: 9, views: 123, likes: 67, orders: 4, category: "أثاث",
    inStock: false, isAvailable: false, tags: ["غير متوفر"], badge: "غير متوفر", quantity: 0,
    expiryDate: "2028-09-14", endDate: "2030-09-14"
  },
  {
    id: 414, storeId: 6, name: "طاولة جانبية صغيرة", description: "طاولة جانبية صغيرة مناسبة بجانب الأريكة",
    price: 285, originalPrice: 320, images: ["/assets/products/mkanek/side-table1.jpg"],
    sizes: ["صغير"], availableSizes: ["صغير"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "أسود", value: "#000000"}],
    rating: 4.2, reviews: 20, views: 156, likes: 74, orders: 12, category: "ديكور",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 10,
    expiryDate: "2029-02-11", endDate: "2031-02-11"
  },
  {
    id: 415, storeId: 6, name: "رف كتب معلق على الحائط", description: "رف كتب أنيق يعلق على الحائط لتوفير المساحة",
    price: 195, originalPrice: 230, images: ["/assets/products/mkanek/wall-shelf1.jpg"],
    sizes: ["متوسط"], availableSizes: ["متوسط"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "بني", value: "#8B4513"}],
    rating: 4.5, reviews: 28, views: 187, likes: 93, orders: 18, category: "ديكور",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد", quantity: 15,
    expiryDate: "2029-05-07", endDate: "2031-05-07"
  },
  {
    id: 416, storeId: 6, name: "سجادة فاخرة كبيرة", description: "سجادة فاخرة بنقوش تقليدية وألوان راقية",
    price: 950, originalPrice: 1100, images: ["/assets/products/mkanek/carpet1.jpg"],
    sizes: ["كبير"], availableSizes: ["كبير"],
    colors: [{name: "أحمر تقليدي", value: "#DC2626"}, {name: "أزرق داكن", value: "#1E40AF"}],
    rating: 4.6, reviews: 11, views: 134, likes: 78, orders: 6, category: "ديكور",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 4,
    expiryDate: "2029-08-19", endDate: "2031-08-19"
  },
  {
    id: 417, storeId: 6, name: "مصباح أرضي عصري", description: "مصباح أرضي بتصميم عصري وإضاءة هادئة",
    price: 385, originalPrice: 440, images: ["/assets/products/mkanek/floor-lamp1.jpg"],
    sizes: ["متوسط"], availableSizes: ["متوسط"],
    colors: [{name: "أسود مع ذهبي", value: "#000000"}, {name: "أبيض", value: "#FFFFFF"}],
    rating: 4.4, reviews: 15, views: 145, likes: 67, orders: 9, category: "ديكور",
    inStock: true, isAvailable: true, tags: ["تخفيضات"], badge: "تخفيضات", quantity: 11,
    expiryDate: "2028-07-23", endDate: "2030-07-23"
  },
  {
    id: 418, storeId: 6, name: "وسائد ديكور ملونة - طقم 4 قطع", description: "طقم من 4 وسائد ديكور بألوان منسقة",
    price: 185, originalPrice: 220, images: ["/assets/products/mkanek/cushions1.jpg"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "ألوان دافئة", value: "#F59E0B"}, {name: "ألوان باردة", value: "#3B82F6"}],
    rating: 4.3, reviews: 32, views: 245, likes: 134, orders: 23, category: "ديكور",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 20,
    expiryDate: "2029-10-09", endDate: "2031-10-09"
  },
  {
    id: 419, storeId: 6, name: "منضدة مكياج بمرآة ومقعد", description: "منضدة مكياج أنيقة مع مرآة ومقعد مبطن",
    price: 1250, originalPrice: 1450, images: ["/assets/products/mkanek/vanity1.jpg"],
    sizes: ["متوسط"], availableSizes: ["متوسط"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "وردي فاتح", value: "#F9A8D4"}],
    rating: 4.8, reviews: 7, views: 98, likes: 56, orders: 3, category: "أثاث",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 2,
    expiryDate: "2028-04-16", endDate: "2030-04-16"
  },
  {
    id: 420, storeId: 6, name: "مكتب كمبيوتر بأدراج", description: "مكتب كمبيوتر عملي مع أدراج تخزين وحاملة CPU",
    price: 850, originalPrice: 950, images: ["/assets/products/mkanek/computer-desk1.jpg"],
    sizes: ["كبير"], availableSizes: ["كبير"],
    colors: [{name: "بني داكن", value: "#8B4513"}, {name: "أبيض", value: "#FFFFFF"}],
    rating: 4.5, reviews: 19, views: 189, likes: 87, orders: 12, category: "أثاث",
    inStock: true, isAvailable: true, tags: [], badge: "", quantity: 6,
    expiryDate: "2028-11-03", endDate: "2030-11-03"
  }
];

// deltaProducts: Product data for Delta Store
// منتجات دلتا ستور
const deltaProducts: Product[] = [
  {
    id: 501, storeId: 4, name: "وشاح حريري أنيق SILV", description: "وشاح حريري فاخر بتصميم أنيق وعصري",
    price: 65, originalPrice: 75, images: ["/assets/delta/silv-scarf.jpg"],
    sizes: ["S", "M", "L", "XL", "2XL"], availableSizes: ["S", "M", "L", "XL"],
    colors: [{name: "بيج", value: "#D4A574"}, {name: "وردي فاتح", value: "#F9A8D4"}, {name: "أزرق سماوي", value: "#87CEEB"}],
    rating: 4.8, reviews: 45, views: 567, likes: 234, orders: 38, category: "أوشحة وحجاب",
    inStock: true, isAvailable: true, tags: ["مميزة", "أكثر مبيعاً"], badge: "أكثر مبيعاً", quantity: 30,
    expiryDate: "2027-09-20", endDate: "2029-09-20"
  },
  {
    id: 502, storeId: 4, name: "حجاب كتان ناعم", description: "حجاب من الكتان الناعم بجودة عالية",
    price: 45, originalPrice: 55, images: ["/assets/delta/cotton-hijab.jpg"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "أسود", value: "#000000"}, {name: "كحلي", value: "#1E3A8A"}, {name: "رمادي", value: "#6B7280"}],
    rating: 4.7, reviews: 32, views: 423, likes: 189, orders: 26, category: "أوشحة وحجاب",
    inStock: true, isAvailable: true, tags: ["جديد"], badge: "جديد", quantity: 25,
    expiryDate: "2027-12-11", endDate: "2029-12-11"
  },
  {
    id: 503, storeId: 4, name: "دبوس حجاب مغناطيسي", description: "دبوس حجاب مغناطيسي آمن وسهل الاستخدام",
    price: 25, originalPrice: 30, images: ["/assets/delta/magnetic-hijab-pin.jpg"],
    sizes: ["صغير", "متوسط"], availableSizes: ["صغير", "متوسط"],
    colors: [{name: "ذهبي", value: "#F59E0B"}, {name: "فضي", value: "#C0C0C0"}, {name: "أسود", value: "#000000"}],
    rating: 4.7, reviews: 38, views: 423, likes: 189, orders: 32, category: "إكسسوارات الحجاب",
    inStock: true, isAvailable: true, tags: ["أكثر طلباً"], badge: "أكثر طلباً", quantity: 50,
    expiryDate: "2028-06-05", endDate: "2030-06-05"
  },
  {
    id: 504, storeId: 4, name: "بلوزة أنيقة بأكمام طويلة", description: "بلوزة نسائية أنيقة بتصميم عصري",
    price: 85, originalPrice: 100, images: ["/assets/delta/elegant-blouse.jpg"],
    sizes: ["S", "M", "L", "XL", "2XL"], availableSizes: ["S", "M", "L", "XL"],
    colors: [{name: "أبيض", value: "#FFFFFF"}, {name: "أسود", value: "#000000"}, {name: "بيج", value: "#D4A574"}],
    rating: 4.7, reviews: 38, views: 423, likes: 189, orders: 32, category: "ملابس نسائية",
    inStock: true, isAvailable: true, tags: ["أكثر طلباً"], badge: "أكثر طلباً", quantity: 35,
    expiryDate: "2027-11-28", endDate: "2029-11-28"
  },
  {
    id: 505, storeId: 4, name: "شال صوفي شتوي", description: "شال صوفي دافئ للأيام الباردة",
    price: 85, originalPrice: 100, images: ["/assets/delta/wool-shawl.jpg"],
    sizes: ["واحد"], availableSizes: ["واحد"],
    colors: [{name: "أحمر", value: "#DC2626"}, {name: "أخضر زمردي", value: "#059669"}, {name: "بنفسجي", value: "#8B5CF6"}],
    rating: 4.9, reviews: 41, views: 389, likes: 167, orders: 33, category: "أوشحة وحجاب",
    inStock: true, isAvailable: true, tags: ["أكثر إعجاباً"], badge: "أكثر إعجاباً", quantity: 18,
    expiryDate: "2028-01-19", endDate: "2030-01-19"
  }
];

// allStoreProducts: Combined array of all store products
// تجميع جميع المنتجات
export const allStoreProducts: Product[] = [
    ...magnaBeautyProducts,
    ...mkanekProducts,
    ...deltaProducts,
];

// getProductsByStore function: Filters products by store ID
// دالة للحصول على منتجات متجر محدد
export const getProductsByStore = (storeId: number): Product[] => {
  return allStoreProducts.filter(product => product.storeId === storeId);
};

// getDiscountedProducts function: Returns products with discounts
// دالة للحصول على المنتجات المخفضة
export const getDiscountedProducts = (storeId?: number): Product[] => {
  const products = storeId 
    ? allStoreProducts.filter(product => product.storeId === storeId)
    : allStoreProducts;
  
  return products.filter(product => product.originalPrice > product.price);
};

// getLatestProducts function: Returns products tagged as "new"
// دالة للحصول على المنتجات الجديدة
export const getLatestProducts = (storeId?: number): Product[] => {
  const products = storeId 
    ? allStoreProducts.filter(product => product.storeId === storeId)
    : allStoreProducts;
  
  return products.filter(product => product.tags.includes("جديد"));
};

// getProductsByTag function: Filters products by tag
// دالة للحصول على المنتجات حسب العلامة
export const getProductsByTag = (tag: string, storeId?: number): Product[] => {
  const products = storeId 
    ? allStoreProducts.filter(product => product.storeId === storeId)
    : allStoreProducts;
  
  return products.filter(product => product.tags.includes(tag));
};
