import type { Product } from '@/data/storeProducts';

interface StoreData {
  id: number;
  storeId: number;
  slug: string;
  name: string;
  nameAr: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  logo: string;
  categories: string[];
  products: Product[];
  sliderImages?: any[];
}

interface StoreIndex {
  slug: string;
  name: string;
  nameAr: string;
  nameEn: string;
  description: string;
  logo: string;
  categories: string[];
  productsCount: number;
  lastUpdated: string;
}

const cachedStores: Map<string, StoreData> = new Map();
let cachedStoreIndex: StoreIndex[] = [];
let cacheInitialized = false;

function getApiBase(): string {
  if (typeof window !== 'undefined' && (window as any).__API_BASE__) {
    return (window as any).__API_BASE__;
  }
  return import.meta.env.VITE_API_URL?.replace('/api', '') || import.meta.env.VITE_MOAMALAT_HASH_ENDPOINT || 'http://localhost:5000';
}

function normalizeImagePaths(data: any, apiBase: string, slug: string, isServedStatic: boolean): any {
  if (!data) return data;
  
  if (Array.isArray(data.products)) {
    data.products = data.products.map((product: any) => ({
      ...product,
      images: Array.isArray(product.images) 
        ? product.images.map((img: string) => {
            if (img && !img.startsWith('http')) {
              return isServedStatic ? img : apiBase + img;
            }
            return img;
          })
        : product.images
    }));
  }
  
  if (Array.isArray(data.sliderImages)) {
    data.sliderImages = data.sliderImages.map((slider: any) => ({
      ...slider,
      image: (slider.image && !slider.image.startsWith('http'))
        ? isServedStatic ? slider.image : apiBase + slider.image
        : slider.image
    }));
  }
  
  if (data.logo && !data.logo.startsWith('http')) {
    data.logo = isServedStatic ? data.logo : apiBase + data.logo;
  }
  
  return data;
}

async function checkIfStoreIsServedStatic(slug: string, apiBase: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiBase}/assets/${slug}/store.json`);
    if (response.ok) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function loadStoreFromLocalStorage(slug: string): StoreData | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const storeFilesKey = `eshro_store_files_${slug}`;
    const storeKey = `store_${slug}`;
    
    let storeFilesData = localStorage.getItem(storeFilesKey);
    
    if (!storeFilesData) {
      const legacyStore = localStorage.getItem(storeKey);
      if (legacyStore) {
        try {
          const legacyParsed = JSON.parse(legacyStore);
          storeFilesData = JSON.stringify({ storeData: legacyParsed });
        } catch {
          return null;
        }
      } else {
        return null;
      }
    }

    const parsed = JSON.parse(storeFilesData);
    if (!parsed.storeData) {
      return null;
    }

    const storeData = parsed.storeData;
    const productsData = localStorage.getItem(`store_products_${slug}`);
    const slidersData = localStorage.getItem(`store_sliders_${slug}`);

    const finalStoreData: StoreData = {
      id: storeData.id || storeData.storeId || 0,
      storeId: storeData.storeId || storeData.id || 0,
      slug: slug,
      name: storeData.name || storeData.storeName || slug,
      nameAr: storeData.nameAr || storeData.storeName || slug,
      nameEn: storeData.nameEn || storeData.storeNameEn || slug,
      description: storeData.description || '',
      icon: storeData.icon || '🏪',
      color: storeData.color || 'from-blue-400 to-blue-600',
      logo: storeData.logo || '/assets/default-store.png',
      categories: storeData.categories || [],
      products: productsData ? JSON.parse(productsData) : storeData.products || [],
      sliderImages: slidersData ? JSON.parse(slidersData) : storeData.sliderImages || []
    };

    return finalStoreData;
  } catch (error) {
    return null;
  }
}

async function initializeCache(): Promise<void> {
  if (cacheInitialized) return;
  
  const apiBase = getApiBase();
  
  try {
    let response = await fetch(`${apiBase}/assets/stores/index.json`);
    if (!response.ok) {
      response = await fetch(`${apiBase}/index.json`);
    }
    if (response.ok) {
      try {
        const json = await response.json();
        if (Array.isArray(json)) {
          cachedStoreIndex = json;
        } else if (json && typeof json === 'object' && Array.isArray((json as any).stores)) {
          cachedStoreIndex = (json as any).stores;
        } else {
          cachedStoreIndex = [];
        }
        cacheInitialized = true;
      } catch (parseError) {
        cachedStoreIndex = [];
        cacheInitialized = true;
      }
    } else {
      cacheInitialized = true;
    }
  } catch (error) {
    cacheInitialized = true;
  }
}

export async function loadStoreBySlug(slug: string): Promise<StoreData | null> {
  await initializeCache();
  
  if (cachedStores.has(slug)) {
    return cachedStores.get(slug) || null;
  }
  
  const apiBase = getApiBase();
  
  try {
    const isServedStatic = await checkIfStoreIsServedStatic(slug, apiBase);
    const response = await fetch(`${apiBase}/assets/${slug}/store.json`);
    if (response.ok) {
      try {
        const storeData: StoreData = await response.json();
        
        if (!storeData || typeof storeData !== 'object') {
          throw new Error('Invalid store data format');
        }
        
        const normalizedStore: StoreData = {
          id: storeData.id || storeData.storeId || 0,
          storeId: storeData.storeId || storeData.id || 0,
          slug: slug,
          name: storeData.name || slug,
          nameAr: storeData.nameAr || slug,
          nameEn: storeData.nameEn || slug,
          description: storeData.description || '',
          icon: storeData.icon || '🏪',
          color: storeData.color || 'from-blue-400 to-blue-600',
          logo: storeData.logo || '/assets/default-store.png',
          categories: Array.isArray(storeData.categories) ? storeData.categories : [],
          products: Array.isArray(storeData.products) ? storeData.products : [],
          sliderImages: Array.isArray(storeData.sliderImages) ? storeData.sliderImages : []
        };
        
        const normalizedWithPaths = normalizeImagePaths(normalizedStore, apiBase, slug, isServedStatic);
        
        cachedStores.set(slug, normalizedWithPaths);
        return normalizedWithPaths;
      } catch (parseError) {
        // Handle parse error silently
      }
    } else if (response.status === 404) {
      // Store not found, will try localStorage fallback
    } else {
      // Other HTTP error, will try localStorage fallback
    }
  } catch (error) {
    // Handle network error silently
  }

  const localStoreData = loadStoreFromLocalStorage(slug);
  if (localStoreData) {
    cachedStores.set(slug, localStoreData);
    return localStoreData;
  }

  return null;
}

export async function getStoreProducts(slug: string): Promise<Product[]> {
  const store = await loadStoreBySlug(slug);
  return store?.products || [];
}

export async function getStoreSliderImages(slug: string): Promise<any[]> {
  const store = await loadStoreBySlug(slug);
  return store?.sliderImages || [];
}

export async function getStoreConfig(slug: string): Promise<any> {
  const store = await loadStoreBySlug(slug);
  if (!store) return null;
  
  return {
    storeId: store.storeId,
    slug: store.slug,
    name: store.name,
    nameAr: store.nameAr,
    nameEn: store.nameEn,
    description: store.description,
    icon: store.icon,
    color: store.color,
    logo: store.logo,
    categories: store.categories
  };
}

export async function getAllStoreProducts(): Promise<Product[]> {
  await initializeCache();
  
  const allProducts: Product[] = [];
  const storeIndexEntries = cachedStoreIndex || [];
  
  for (const storeEntry of storeIndexEntries) {
    try {
      const products = await getStoreProducts(storeEntry.slug);
      allProducts.push(...products);
    } catch (error) {
      // Handle product loading error silently
    }
  }
  
  return allProducts;
}

export function clearStoreCache(): void {
  cachedStores.clear();
  cachedStoreIndex = [];
  cacheInitialized = false;
}
