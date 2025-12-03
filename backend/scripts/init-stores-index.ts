import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

const publicAssetsPath = path.join(process.cwd(), 'public', 'assets');
const storesDir = path.join(publicAssetsPath, 'stores');
const indexPath = path.join(storesDir, 'index.json');

const DEFAULT_STORES = [
  {
    id: 1,
    slug: 'nawaem',
    name: 'نوايم',
    nameAr: 'نوايم',
    description: 'متجر نوايم',
    logo: '/assets/nawaem/logo.webp',
    categories: [],
    productsCount: 0
  },
  {
    id: 2,
    slug: 'sheirine',
    name: 'شيرين',
    nameAr: 'شيرين',
    description: 'متجر شيرين',
    logo: '/assets/sheirine/logo.webp',
    categories: [],
    productsCount: 0
  },
  {
    id: 3,
    slug: 'delta-store',
    name: 'دلتا',
    nameAr: 'دلتا',
    description: 'متجر دلتا',
    logo: '/assets/delta-store/logo.webp',
    categories: [],
    productsCount: 0
  },
  {
    id: 4,
    slug: 'pretty',
    name: 'بريتي',
    nameAr: 'بريتي',
    description: 'متجر بريتي',
    logo: '/assets/pretty/logo.webp',
    categories: [],
    productsCount: 0
  },
  {
    id: 5,
    slug: 'magna-beauty',
    name: 'ماجنا بيوتي',
    nameAr: 'ماجنا بيوتي',
    description: 'متجر ماجنا بيوتي',
    logo: '/assets/magna-beauty/logo.webp',
    categories: [],
    productsCount: 0
  }
];

async function initializeStoresIndex() {


  try {
    await fsPromises.mkdir(storesDir, { recursive: true });


    const currentTime = new Date().toISOString();
    const indexData = DEFAULT_STORES.map(store => ({
      ...store,
      lastUpdated: currentTime
    }));

    await fsPromises.writeFile(indexPath, JSON.stringify(indexData, null, 2), 'utf-8');




    indexData.forEach(store => {

    });


  } catch (error) {

    process.exit(1);
  }
}

initializeStoresIndex();
