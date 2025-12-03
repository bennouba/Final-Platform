// بيانات شاملة للوحة تحكم التاجر - منصة إشرو
// Merchant Dashboard Data - EISHRO Platform

export interface MerchantStats {
  visits: number;
  orders: number;
  sales: number;
  conversionRate: number;
  currentVisitors: number;
  growth: {
    visits: number;
    orders: number;
    sales: number;
    conversionRate: number;
  };
}

export interface GeographicDistribution {
  city: string;
  percentage: number;
  orders: number;
  customers: number;
}

export interface WeeklySales {
  day: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  image: string;
}

export interface MonthlyProfit {
  month: string;
  revenue: number;
  costs: number;
  profit: number;
}

export interface OrderStatus {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface LivePerformance {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface ActiveVisitor {
  id: string;
  name: string;
  location: string;
  currentPage: string;
  timeSpent: string;
  device: string;
}

export interface LiveActivity {
  id: string;
  type: 'purchase' | 'cart_add' | 'view' | 'search';
  customer: string;
  location: string;
  action: string;
  timestamp: string;
}

export interface AbandonedCart {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalValue: number;
  createdAt: string;
  remindersSent: number;
  suggestedDiscount: number;
}

export interface ManualOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  products: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: string;
  shippingMethod: string;
  status: 'جديد' | 'قيد المعالجة' | 'تم الشحن' | 'تم التسليم' | 'ملغي';
  totalAmount: number;
  createdAt: string;
}

// بيانات تجريبية واقعية للتاجر محمد - متجر شيرين
export const merchantStats: MerchantStats = {
  visits: 800,
  orders: 11,
  sales: 3288.27,
  conversionRate: 1.40,
  currentVisitors: 1,
  growth: {
    visits: 12,
    orders: 3,
    sales: 18,
    conversionRate: 0.2
  }
};

export const geographicDistribution: GeographicDistribution[] = [
  { city: "طرابلس", percentage: 100, orders: 456, customers: 127 },
  { city: "بنغازي", percentage: 0, orders: 89, customers: 37 },
  { city: "مصراتة", percentage: 0, orders: 24, customers: 16 },
  { city: "الزاوية", percentage: 0, orders: 27, customers: 6 },
  { city: "سبها", percentage: 0, orders: 36, customers: 6 },
  { city: "غريان", percentage: 0, orders: 11, customers: 7 },
  { city: "درنة", percentage: 0, orders: 24, customers: 6 },
  { city: "البيضاء", percentage: 0, orders: 27, customers: 6 },
  { city: "سرت", percentage: 0, orders: 36, customers: 6 }
];

export const weeklySales: WeeklySales[] = [
  { day: "السبت", sales: 450, orders: 12 },
  { day: "الأحد", sales: 320, orders: 8 },
  { day: "الاثنين", sales: 680, orders: 15 },
  { day: "الثلاثاء", sales: 890, orders: 22 },
  { day: "الأربعاء", sales: 720, orders: 18 },
  { day: "الخميس", sales: 950, orders: 25 },
  { day: "الجمعة", sales: 1200, orders: 30 }
];

export const topProducts: TopProduct[] = [
  {
    id: "1",
    name: "خاتم بالشكل الهندسي",
    category: "مجوهرات",
    sales: 45,
    revenue: 22500,
    image: "/assets/sheirine/خاتم بالشكل الهندسي.jpg"
  },
  {
    id: "2",
    name: "خاتم زفاف أسلوب 2في1",
    category: "مجوهرات",
    sales: 38,
    revenue: 19000,
    image: "/assets/sheirine/خاتم زفاف أسلوب 2في1.jpg"
  },
  {
    id: "3",
    name: "خاتم فراشة مع لؤلؤة",
    category: "مجوهرات",
    sales: 32,
    revenue: 16000,
    image: "/assets/sheirine/خاتم فراشة مع لؤلؤة.jpg"
  },
  {
    id: "4",
    name: "خاتم فولاذ غير قابل للصدأ",
    category: "مجوهرات",
    sales: 28,
    revenue: 14000,
    image: "/assets/sheirine/خاتم فولاذ غير قابل للصدأ.jpg"
  }
];

export const monthlyProfits = [
  { month: "يناير", revenue: 25000, costs: 15000, profit: 10000 },
  { month: "فبراير", revenue: 28000, costs: 16000, profit: 12000 },
  { month: "مارس", revenue: 32000, costs: 18000, profit: 14000 },
  { month: "أبريل", revenue: 35000, costs: 20000, profit: 15000 },
  { month: "مايو", revenue: 38000, costs: 21000, profit: 17000 },
  { month: "يونيو", revenue: 42000, costs: 23000, profit: 19000 }
];

export const orderStatuses: OrderStatus[] = [
  { status: "مكتملة", count: 987, percentage: 80, color: "bg-green-500" },
  { status: "قيد المعالجة", count: 156, percentage: 12, color: "bg-yellow-500" },
  { status: "ملغية", count: 91, percentage: 8, color: "bg-red-500" }
];

export const livePerformance: LivePerformance[] = [
  { metric: "الأداء", value: 94, unit: "%", trend: "up", change: 5 },
  { metric: "الزوار الحاليين", value: 47, unit: "", trend: "up", change: 12 },
  { metric: "معدل التحويل", value: 1.4, unit: "%", trend: "up", change: 0.2 },
  { metric: "قيمة السلة المتوسطة", value: 299, unit: "د.ل", trend: "up", change: 15 }
];

export const activeVisitors: ActiveVisitor[] = [
  {
    id: "1",
    name: "أحمد محمد",
    location: "طرابلس",
    currentPage: "الصفحة الرئيسية",
    timeSpent: "26 د",
    device: "💻"
  },
  {
    id: "2",
    name: "فاطمة علي",
    location: "بنغازي",
    currentPage: "المنتجات",
    timeSpent: "23 د",
    device: "📱"
  },
  {
    id: "3",
    name: "عمر حسن",
    location: "مصراتة",
    currentPage: "فئة الإلكترونيات",
    timeSpent: "9 د",
    device: "💻"
  }
];

export const liveActivities: LiveActivity[] = [
  {
    id: "1",
    type: "cart_add",
    customer: "عمر",
    location: "طرابلس",
    action: "أضاف منتج للسلة",
    timestamp: "الآن"
  },
  {
    id: "2",
    type: "view",
    customer: "فاطمة",
    location: "بنغازي",
    action: "تتصفح المنتجات",
    timestamp: "الآن"
  },
  {
    id: "3",
    type: "purchase",
    customer: "محمد",
    location: "مصراتة",
    action: "أتم عملية شراء",
    timestamp: "قبل دقيقة"
  }
];

export const abandonedCarts: AbandonedCart[] = [
  {
    id: "1",
    customer: {
      name: "سارة",
      email: "sarah.tripoli@gmail.com",
      phone: "+218945678901"
    },
    items: [
      { name: "حقيبة بحر راقية", quantity: 1, price: 260 },
      { name: "شبشب صيفي جلد", quantity: 1, price: 210 }
    ],
    totalValue: 470,
    createdAt: "15/12/2024 02:30 م",
    remindersSent: 1,
    suggestedDiscount: 10
  },
  {
    id: "2",
    customer: {
      name: "عمر",
      email: "omar.misrata@yahoo.com",
      phone: "+218956789012"
    },
    items: [
      { name: "فستان صيفي بحرزام جلد", quantity: 1, price: 680 }
    ],
    totalValue: 680,
    createdAt: "14/12/2024 10:15 م",
    remindersSent: 2,
    suggestedDiscount: 5
  }
];

export const manualOrders: ManualOrder[] = [
  {
    id: "1",
    orderNumber: "ES2024001234",
    customer: {
      name: "أحمد محمد الليبي",
      email: "ahmed.mohammed@example.com",
      phone: "+218912345678",
      address: "طرابلس - شارع الجمهورية"
    },
    products: [
      { name: "خاتم بالشكل الهندسي", sku: "RING-GEO-001", quantity: 1, price: 500 },
      { name: "خاتم زفاف أسلوب 2في1", sku: "RING-WED-002", quantity: 1, price: 700 }
    ],
    paymentMethod: "تحويل بنكي",
    shippingMethod: "شحن توصيل عادي",
    status: "تم التسليم",
    totalAmount: 1200,
    createdAt: "15/12/2024 12:30 م"
  },
  {
    id: "2",
    orderNumber: "ES2024001233",
    customer: {
      name: "فاطمة سالم بن علي",
      email: "fatima.salem@example.com",
      phone: "+218923456789",
      address: "بنغازي - وسط المدينة"
    },
    products: [
      { name: "خاتم فراشة مع لؤلؤة", sku: "RING-BUT-003", quantity: 1, price: 1800 }
    ],
    paymentMethod: "تقسيط",
    shippingMethod: "شحن وتوصيل سريع",
    status: "قيد المعالجة",
    totalAmount: 1800,
    createdAt: "15/12/2024 11:15 ص"
  }
];

// دوال مساعدة للحصول على البيانات
export const getMerchantOverviewData = () => ({
  stats: merchantStats,
  geographicDistribution,
  weeklySales,
  topProducts,
  monthlyProfits,
  orderStatuses,
  livePerformance,
  activeVisitors,
  liveActivities
});

export const getOrdersData = () => ({
  manualOrders,
  abandonedCarts,
  totalOrders: manualOrders.length,
  completedOrders: manualOrders.filter(order => order.status === "تم التسليم").length,
  processingOrders: manualOrders.filter(order => order.status === "قيد المعالجة").length,
  totalRevenue: manualOrders.reduce((sum, order) => sum + order.totalAmount, 0),
  averageOrderValue: manualOrders.reduce((sum, order) => sum + order.totalAmount, 0) / manualOrders.length
});

export const getAbandonedCartsData = () => ({
  carts: abandonedCarts,
  totalCarts: abandonedCarts.length,
  totalValue: abandonedCarts.reduce((sum, cart) => sum + cart.totalValue, 0),
  needsFollowUp: abandonedCarts.filter(cart => cart.remindersSent === 0).length,
  totalRemindersSent: abandonedCarts.reduce((sum, cart) => sum + cart.remindersSent, 0),
  averageDiscount: abandonedCarts.reduce((sum, cart) => sum + cart.suggestedDiscount, 0) / abandonedCarts.length
});
