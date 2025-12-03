export interface AdTemplate {
  id: string;
  name: string;
  description: string;
  layout: 'banner' | 'between_products' | 'popup';
  previewImage: string;
  width: number;
  height: number;
  textMaxLength?: number;
}

export const adTemplates: AdTemplate[] = [
  {
    id: 'banner-horizontal-1',
    name: 'شريط أفقي - بسيط',
    description: 'شريط تمرير أفقي بسيط مع نص وصورة',
    layout: 'banner',
    previewImage: '/assets/ad-templates/banner-simple.png',
    width: 1200,
    height: 150,
    textMaxLength: 100,
  },
  {
    id: 'banner-horizontal-2',
    name: 'شريط أفقي - متقدم',
    description: 'شريط تمرير أفقي مع عناوين وأسعار',
    layout: 'banner',
    previewImage: '/assets/ad-templates/banner-advanced.png',
    width: 1200,
    height: 200,
    textMaxLength: 150,
  },
  {
    id: 'between-products-1',
    name: 'بين المنتجات - مربع واحد',
    description: 'إعلان بحجم مربع واحد بين صفوف المنتجات',
    layout: 'between_products',
    previewImage: '/assets/ad-templates/between-single.png',
    width: 280,
    height: 300,
    textMaxLength: 80,
  },
  {
    id: 'between-products-2',
    name: 'بين المنتجات - مربعين',
    description: 'إعلان يشغل حجم مربعين بين المنتجات',
    layout: 'between_products',
    previewImage: '/assets/ad-templates/between-double.png',
    width: 580,
    height: 300,
    textMaxLength: 120,
  },
  {
    id: 'between-products-3',
    name: 'بين المنتجات - صف كامل',
    description: 'إعلان يشغل صف كامل من المنتجات',
    layout: 'between_products',
    previewImage: '/assets/ad-templates/between-full.png',
    width: 1200,
    height: 250,
    textMaxLength: 150,
  },
  {
    id: 'popup-1',
    name: 'نافذة منبثقة - بسيطة',
    description: 'نافذة منبثقة صغيرة عند دخول العميل',
    layout: 'popup',
    previewImage: '/assets/ad-templates/popup-simple.png',
    width: 400,
    height: 300,
    textMaxLength: 100,
  },
  {
    id: 'popup-2',
    name: 'نافذة منبثقة - كبيرة',
    description: 'نافذة منبثقة كبيرة مع صورة كاملة',
    layout: 'popup',
    previewImage: '/assets/ad-templates/popup-large.png',
    width: 600,
    height: 500,
    textMaxLength: 150,
  },
];

export interface AdCreation {
  templateId: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  buttonText?: string;
  colors?: {
    background: string;
    text: string;
    button: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PublishedAd {
  id: string;
  templateId: string;
  layout: 'banner' | 'between_products' | 'popup';
  title: string;
  description: string;
  imageUrl?: string | undefined;
  linkUrl?: string | undefined;
  isActive: boolean;
  position?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  views: number;
  clicks: number;
}
