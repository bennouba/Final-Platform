import type { Product } from '@/data/storeProducts';

export interface SliderBanner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface ProductImage {
  url: string;
  order: number;
  alt: string;
}

export interface StoreConfigProduct extends Omit<Product, 'images'> {
  images: ProductImage[];
}

export interface StoreConfig {
  slug: string;
  storeId: number;
  name: string;
  description: string;
  logo: string;
  icon: string;
  sliderHeight: {
    mobile: number;
    desktop: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  sliders: SliderBanner[];
  products: StoreConfigProduct[];
}

export const STORES_CONFIG: Record<string, StoreConfig> = {
  nawaem: {
    slug: 'nawaem',
    storeId: 1764116503093,
    name: 'نواعم',
    description: 'أنوثة وجمال وأناقة',
    logo: '/assets/nawaem/logo/logo.webp',
    icon: '👜',
    sliderHeight: {
      mobile: 500,
      desktop: 600,
    },
    colors: {
      primary: 'from-amber-400 to-yellow-500',
      secondary: 'from-amber-300 to-yellow-400',
      accent: 'from-yellow-200 to-amber-200',
    },
    sliders: [
      {
        id: 'banner1',
        image: '/assets/nawaem/bag2.jpg',
        title: 'حقائب فاخرة',
        subtitle: 'تصاميم عصرية حديثة',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner2',
        image: '/assets/nawaem/dress3.jpg',
        title: 'فساتين أنيقة',
        subtitle: 'لكل مناسبة خاصة',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner3',
        image: '/assets/nawaem/gold-jewelry-set-1.jpg',
        title: 'مجوهرات ذهبية',
        subtitle: 'براقة وأنيقة',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner4',
        image: '/assets/nawaem/handbag-beige-1.jpg',
        title: 'حقائب يد فاخرة',
        subtitle: 'أفضل الماركات',
        buttonText: 'تسوق الآن',
      },
    ],
    products: [],
  },

  sheirine: {
    slug: 'sheirine',
    storeId: 1764116503094,
    name: 'شيرين',
    description: 'أزياء نسائية فخمة وعصرية',
    logo: '/assets/sheirine/logo/logo.webp',
    icon: '👗',
    sliderHeight: {
      mobile: 500,
      desktop: 600,
    },
    colors: {
      primary: 'from-pink-400 to-rose-500',
      secondary: 'from-pink-300 to-rose-400',
      accent: 'from-pink-200 to-rose-200',
    },
    sliders: [
      {
        id: 'banner1',
        image: '/assets/sheirine/slider1.jpg',
        title: 'أزياء راقية',
        subtitle: 'للمرأة العصرية',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner2',
        image: '/assets/sheirine/slider2.jpg',
        title: 'تشكيلة جديدة',
        subtitle: 'أحدث الموضات',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner3',
        image: '/assets/sheirine/slider3.jpg',
        title: 'فساتين سهرة',
        subtitle: 'لإطلالة مميزة',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner4',
        image: '/assets/sheirine/slider4.jpg',
        title: 'ملابس يومية',
        subtitle: 'مريحة وأنيقة',
        buttonText: 'تسوق الآن',
      },
    ],
    products: [],
  },

  pretty: {
    slug: 'pretty',
    storeId: 1764116503103,
    name: 'بريتي',
    description: 'متجر الجمال والعناية',
    logo: '/assets/real-stores/pretty/logo.webp',
    icon: '💄',
    sliderHeight: {
      mobile: 500,
      desktop: 600,
    },
    colors: {
      primary: 'from-purple-400 to-pink-500',
      secondary: 'from-purple-300 to-pink-400',
      accent: 'from-purple-200 to-pink-200',
    },
    sliders: [
      {
        id: 'banner1',
        image: '/assets/real-stores/pretty/slider10.webp',
        title: 'منتجات الجمال',
        subtitle: 'رعاية شاملة للبشرة',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner2',
        image: '/assets/real-stores/pretty/slider11.webp',
        title: 'مستحضرات طبيعية',
        subtitle: 'آمنة وفعالة',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner3',
        image: '/assets/real-stores/pretty/slider12.webp',
        title: 'عطور فاخرة',
        subtitle: 'رائحة متميزة',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner4',
        image: '/assets/real-stores/pretty/slider13.webp',
        title: 'منتجات موثوقة',
        subtitle: 'ماركات عالمية',
        buttonText: 'تسوق الآن',
      },
    ],
    products: [],
  },

  'delta-store': {
    slug: 'delta-store',
    storeId: 1764116503104,
    name: 'دلتا ستور',
    description: 'متجر متنوع للعائلة',
    logo: '/assets/delta/logo/logo.webp',
    icon: '🛍️',
    sliderHeight: {
      mobile: 500,
      desktop: 600,
    },
    colors: {
      primary: 'from-blue-400 to-cyan-500',
      secondary: 'from-blue-300 to-cyan-400',
      accent: 'from-blue-200 to-cyan-200',
    },
    sliders: [
      {
        id: 'banner1',
        image: '/assets/delta/slider1.webp',
        title: 'عروض حصرية',
        subtitle: 'تخفيفات كبيرة',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner2',
        image: '/assets/delta/slider2.webp',
        title: 'منتجات متنوعة',
        subtitle: 'لجميع الأذواق',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner3',
        image: '/assets/delta/slider3.webp',
        title: 'جودة مضمونة',
        subtitle: 'منتجات أصلية',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner4',
        image: '/assets/delta/slider4.webp',
        title: 'توصيل سريع',
        subtitle: 'خدمة ممتازة',
        buttonText: 'تسوق الآن',
      },
    ],
    products: [],
  },

  'magna-beauty': {
    slug: 'magna-beauty',
    storeId: 1764116503105,
    name: 'ماغنا بيوتي',
    description: 'منتجات العناية والجمال',
    logo: '/assets/magna-beauty/logo/logo.webp',
    icon: '✨',
    sliderHeight: {
      mobile: 500,
      desktop: 600,
    },
    colors: {
      primary: 'from-purple-500 to-indigo-600',
      secondary: 'from-purple-400 to-indigo-500',
      accent: 'from-purple-300 to-indigo-400',
    },
    sliders: [
      {
        id: 'banner1',
        image: '/assets/magna-beauty/slide1.webp',
        title: 'عناية فاخرة',
        subtitle: 'لبشرة صحية',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner2',
        image: '/assets/magna-beauty/slide2.webp',
        title: 'مستحضرات قسط',
        subtitle: 'للعناية اليومية',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner3',
        image: '/assets/magna-beauty/slide3.webp',
        title: 'ماسكات وسيرم',
        subtitle: 'علاجات فعالة',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner4',
        image: '/assets/magna-beauty/slide4.webp',
        title: 'منتجات طبيعية',
        subtitle: 'بدون مواد كيميائية',
        buttonText: 'تسوق الآن',
      },
    ],
    products: [],
  },

  indeesh: {
    slug: 'indeesh',
    storeId: 1764003949069,
    name: 'انديش',
    description: 'منتجات العناية بالمنزل والعائلة',
    logo: '/assets/indeesh/logo.webp',
    icon: '🏠',
    sliderHeight: {
      mobile: 500,
      desktop: 600,
    },
    colors: {
      primary: 'from-green-400 to-emerald-500',
      secondary: 'from-green-300 to-emerald-400',
      accent: 'from-green-200 to-emerald-200',
    },
    sliders: [
      {
        id: 'banner1',
        image: '/assets/indeesh/sliders/1764003949431-7n5h5h-3.jpg',
        title: 'مرحبا بك في متجر انديش',
        subtitle: 'أفضل العطور والمنظفات والعناية الشخصية',
        buttonText: 'تسوق الآن',
      },
      {
        id: 'banner2',
        image: '/assets/indeesh/sliders/1764003949444-z43zxk-9.jpg',
        title: 'عروض انديش الخاصة',
        subtitle: 'منتجات أصلية بأسعار مميزة',
        buttonText: 'اكتشف العروض',
      },
      {
        id: 'banner3',
        image: '/assets/indeesh/sliders/1764003949446-93ffbn-8.jpg',
        title: 'عروض انديش الخاصة',
        subtitle: 'منتجات أصلية بأسعار مميزة',
        buttonText: 'اكتشف العروض',
      },
      {
        id: 'banner4',
        image: '/assets/indeesh/sliders/1764003949455-gvxg6e-7.jpg',
        title: 'عروض انديش الخاصة',
        subtitle: 'منتجات أصلية بأسعار مميزة',
        buttonText: 'اكتشف العروض',
      },
      {
        id: 'banner5',
        image: '/assets/indeesh/sliders/1764003949480-48hujc-1.jpg',
        title: 'عروض انديش الخاصة',
        subtitle: 'منتجات أصلية بأسعار مميزة',
        buttonText: 'اكتشف العروض',
      },
    ],
    products: [],
  },
};

export function getStoreConfig(slug: string): StoreConfig | null {
  return STORES_CONFIG[slug] || null;
}

export function getSliderHeight(slug: string, isMobile: boolean = false): string {
  const config = getStoreConfig(slug);
  if (!config) return isMobile ? 'h-[500px]' : 'h-[600px]';
  const height = isMobile ? config.sliderHeight.mobile : config.sliderHeight.desktop;
  return `h-[${height}px]`;
}

export function getAllStores(): StoreConfig[] {
  return Object.values(STORES_CONFIG);
}

export function getStoreProducts(slug: string): StoreConfigProduct[] {
  const config = getStoreConfig(slug);
  if (!config) return [];
  return config.products.sort((a, b) => a.id - b.id);
}

export function getStoreSliders(slug: string): SliderBanner[] {
  const config = getStoreConfig(slug);
  if (!config) return [];
  return config.sliders;
}
