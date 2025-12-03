import { STORES_CONFIG, getStoreConfig, getStoreProducts, getStoreSliders, type StoreConfigProduct, type SliderBanner } from '@/config/storeConfig';
import type { Product } from '@/data/storeProducts';

export interface StoreData {
  config: ReturnType<typeof getStoreConfig>;
  products: Product[];
  sliders: SliderBanner[];
}

export function convertConfigProductToProduct(configProduct: StoreConfigProduct): Product {
  const orderedImages = (configProduct.images || [])
    .map((image, index) => ({
      ...image,
      order: typeof image.order === 'number' ? image.order : index,
    }))
    .sort((a, b) => a.order - b.order)
    .map((img) => img.url);

  return {
    ...configProduct,
    images: orderedImages,
  };
}

export function loadStoreData(storeSlug: string): StoreData | null {
  const config = getStoreConfig(storeSlug);
  
  if (!config) {
    return null;
  }

  const configProducts = getStoreProducts(storeSlug);
  const products = configProducts.map(convertConfigProductToProduct);
  const sliders = getStoreSliders(storeSlug);

  return {
    config,
    products,
    sliders,
  };
}

export function getAllStoresSlugs(): string[] {
  return Object.keys(STORES_CONFIG);
}

export function formatSliderHeight(mobile: number, desktop: number): string {
  return `h-[${mobile}px] md:h-[${desktop}px]`;
}
