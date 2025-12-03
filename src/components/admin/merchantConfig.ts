import type { LucideIcon } from "lucide-react";
import { Cpu, Flower2, Gem, Shirt, Sparkles, Heart, Palette, Watch, Coffee, Package } from "lucide-react";

interface SectionNode {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  children?: SectionNode[];
}

interface MerchantProfile {
  id: string;
  name: string;
  tagline: string;
  owner: string;
  plan: string;
  tier: string;
  color: string;
  icon: LucideIcon;
  emblem: string;
  logo?: string;
  stats: {
    orders: number;
    satisfaction: number;
    growth: string;
  };
  disabled?: string[];
}

const MERCHANT_PERMISSIONS_KEY = "eishro:merchant-permissions";
const MERCHANT_PERMISSIONS_EVENT = "eishro-merchant-permissions-updated";

// دالة لجلب المتاجر الديناميكية من localStorage
const getDynamicMerchants = (): MerchantProfile[] => {
  try {
    const stored = localStorage.getItem('eshro_stores');
    if (!stored) return [];

    const stores = JSON.parse(stored);
      const hardcodedSubdomains = new Set(['nawaem', 'sheirine', 'pretty', 'delta-store', 'magna-beauty', 'indeesh']);
      return stores
  .filter((store: any) => !hardcodedSubdomains.has(store.subdomain))
    .map((store: any) => ({
      id: store.id,
      name: store.nameAr,
      tagline: store.description || 'متجر جديد',
      owner: store.email?.split('@')[0] || 'جديد',
      plan: 'Basic',
      tier: 'جديد',
      color: 'from-blue-500 to-cyan-500',
      icon: Shirt,
      emblem: '🛍️',
      logo: store.logo || undefined,
      stats: {
        orders: 0,
        satisfaction: 100,
        growth: '+0%'
      },
      disabled: [] 
    }));
  } catch (error) {

    return [];
  }
};

// دمج المتاجر الثابتة مع الديناميكية (مع إزالة التكرار)
const getAllMerchants = (): MerchantProfile[] => {
  const hardcodedMerchants = merchants;
  const dynamicMerchants = getDynamicMerchants();
  
  const uniqueMap = new Map<string, MerchantProfile>();
  
  hardcodedMerchants.forEach(merchant => {
    uniqueMap.set(merchant.id, merchant);
  });
  
  dynamicMerchants.forEach(merchant => {
    if (!uniqueMap.has(merchant.id)) {
      uniqueMap.set(merchant.id, merchant);
    }
  });
  
  return Array.from(uniqueMap.values());
};

const merchantSections: SectionNode[] = [
  {
    id: "overview-root",
    label: "نظرة عامة",
    description: "عرض سريع لكل مؤشرات المتجر",
    required: true
  },
  {
    id: "orders-group",
    label: "إدارة الطلبات",
    description: "إدارة كافة أنواع الطلبات بزمن حقيقي",
    children: [
      { id: "orders-all", label: "الطلبات" },
      { id: "orders-manual", label: "الطلبات اليدوية" },
      { id: "orders-abandoned", label: "الطلبات المتروكة" },
      { id: "orders-unavailable", label: "الطلبات غير المتوفرة" }
    ]
  },
  {
    id: "catalog-group",
    label: "الكتالوج والمخزون",
    description: "تنسيق المنتجات، التصنيفات، والمخزون",
    children: [
      { id: "catalog-hub", label: "الكتالوج" },
      { id: "catalog-products", label: "المنتجات" },
      { id: "catalog-categories", label: "التصنيفات" },
      { id: "catalog-stock", label: "المخزون" },
      { id: "catalog-stock-adjustments", label: "إدارة تغيير المخزون" },
      { id: "catalog-stock-notifications", label: "إشعارات بالمخزون" }
    ]
  },
  {
    id: "customers-group",
    label: "العملاء والتفاعل",
    description: "إدارة قاعدة البيانات وتجربة العملاء",
    children: [
      { id: "customers-all", label: "العملاء" },
      { id: "customers-groups", label: "مجموعات العملاء" },
      { id: "customers-reviews", label: "التقييمات" },
      { id: "customers-questions", label: "الأسئلة" }
    ]
  },
  {
    id: "marketing-group",
    label: "التسويق والولاء",
    description: "رفع التفاعل والولاء للمتجر",
    children: [
      { id: "marketing-hub", label: "التسويق" },
      { id: "marketing-campaigns", label: "الحملات التسويقية" },
      { id: "marketing-coupons", label: "كوبونات الخصم" },
      { id: "marketing-loyalty", label: "برنامج الولاء" }
    ]
  },
  {
    id: "analytics-group",
    label: "التحليلات والتقارير",
    description: "رصد الأداء عبر تحليلات متقدمة",
    children: [
      { id: "analytics-dashboard", label: "التحليلات" },
      { id: "analytics-live", label: "التحليلات المباشرة" },
      { id: "analytics-sales", label: "تقارير المبيعات" },
      { id: "analytics-stock", label: "تقارير المخزون" },
      { id: "analytics-customers", label: "تقارير العملاء" }
    ]
  },
  {
    id: "finance-group",
    label: "المالية",
    description: "المعاملات المالية والاشتراكات",
    children: [
      { id: "finance-overview", label: "المالية" },
      { id: "finance-subscriptions", label: "إدارة الاشتراك" },
      { id: "finance-wallet", label: "المحفظة" }
    ]
  },
  {
    id: "settings-group",
    label: "الإعدادات والهوية",
    description: "تهيئة هوية المتجر وقنواته الرقمية",
    children: [
      { id: "settings-general", label: "الإعدادات" },
      { id: "settings-store", label: "بيانات المتجر" },
      { id: "settings-pages", label: "الصفحات" },
      { id: "settings-menu", label: "القائمة" },
      { id: "settings-sliders", label: "السلايدرز" },
      { id: "settings-ads", label: "الإعلانات" },
      { id: "settings-services", label: "الخدمات" }
    ]
  },
  {
    id: "logistics-group",
    label: "اللوجستيات",
    description: "التكامل مع خدمات الشحن والتوصيل",
    children: [
      { id: "logistics-overview", label: "اللوجستيات" },
      { id: "logistics-shipments", label: "تتبع عمليات الشحن" },
      { id: "logistics-awb", label: "متابعة بوليصات الشحن" },
      { id: "logistics-bidding", label: "المزايدة على المشوار" }
    ]
  },
  {
    id: "payments-group",
    label: "المدفوعات",
    description: "إدارة المدفوعات والتحويلات البنكية",
    children: [
      { id: "payments-main", label: "المدفوعات" },
      { id: "payments-operations", label: "العمليات" },
      { id: "payments-deposits", label: "الإيداعات" },
      { id: "payments-banks", label: "الحسابات المصرفية" }
    ]
  },
  {
    id: "support-group",
    label: "الدعم وخدمة العملاء",
    description: "ضمان استجابة متكاملة لعملاء المتجر",
    children: [
      { id: "support-customer", label: "خدمة العملاء" },
      { id: "support-technical", label: "الدعم الفني" }
    ]
  },
  {
    id: "logout-root",
    label: "تسجيل خروج",
    description: "خيار دائم الظهور لكل متجر",
    required: true
  }
];

const merchants: MerchantProfile[] = [
  {
    id: "nawaem",
    name: "متجر نواعم",
    tagline: "منتجات الجمال والعناية النسائية",
    owner: "منير",
    plan: "Enterprise",
    tier: "بلاتيني",
    color: "from-rose-500 to-fuchsia-500",
    icon: Sparkles,
    emblem: "🌸",
    logo: "/assets/stores/nawaem.webp",
    stats: { orders: 1280, satisfaction: 97, growth: "+18%" },
    disabled: ["logistics-bidding"]
  },
  {
    id: "sherine",
    name: "متجر شيرين",
    tagline: "أزياء معاصرة بتجربة متكاملة",
    owner: "سالم",
    plan: "Enterprise",
    tier: "ذهبي",
    color: "from-sky-500 to-indigo-500",
    icon: Shirt,
    emblem: "👗",
    logo: "/assets/stores/sheirine.webp",
    stats: { orders: 1124, satisfaction: 94, growth: "+12%" },
    disabled: ["logistics-bidding"]
  },
  {
    id: "pretty",
    name: "متجر بيريتي بيوتي",
    tagline: "علامة تجارية متخصصة في الجمال الطبيعي",
    owner: "كامل",
    plan: "Pro",
    tier: "ذهبي",
    color: "from-emerald-500 to-lime-500",
    icon: Flower2,
    emblem: "💄",
    logo: "/assets/stores/pretty.webp",
    stats: { orders: 980, satisfaction: 92, growth: "+9%" },
    disabled: ["logistics-bidding", "finance-wallet"]
  },
  {
    id: "delta",
    name: "متجر دالتا ستور",
    tagline: "حلول تقنية للأجهزة والإلكترونيات",
    owner: "ماجد",
    plan: "Pro",
    tier: "فضي",
    color: "from-purple-500 to-violet-500",
    icon: Cpu,
    emblem: "💡",
    logo: "/assets/stores/delta-store.webp",
    stats: { orders: 846, satisfaction: 90, growth: "+7%" },
    disabled: ["marketing-loyalty", "logistics-bidding"]
  },
  {
    id: "magna",
    name: "متجر ميجنا",
    tagline: "منتجات العناية الفاخرة والبوتيك",
    owner: "حسن",
    plan: "Pro",
    tier: "فضي",
    color: "from-amber-500 to-orange-500",
    icon: Gem,
    emblem: "🛍️",
    logo: "/assets/stores/magna-beauty.webp",
    stats: { orders: 772, satisfaction: 89, growth: "+6%" },
    disabled: ["analytics-stock", "logistics-bidding"]
  },
  {
    id: "indeesh",
    name: "متجر انديش",
    tagline: "حلول العناية المنزلية والعطور",
    owner: "سالم محمد الأشقر",
    plan: "Enterprise",
    tier: "بلاتيني",
    color: "from-indigo-500 to-purple-500",
    icon: Package,
    emblem: "🧼",
    logo: "/assets/indeesh/logo/1764003949069-2wl3b2-Indeesh.png",
    stats: { orders: 640, satisfaction: 95, growth: "+14%" },
    disabled: []
  }
];

export type { MerchantProfile, SectionNode };
export {
  MERCHANT_PERMISSIONS_EVENT,
  MERCHANT_PERMISSIONS_KEY,
  merchantSections,
  merchants,
  getDynamicMerchants,
  getAllMerchants
};
