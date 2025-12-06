import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stores = ['nawaem', 'delta-store', 'indeesh'];

stores.forEach(store => {
  const src = path.join(__dirname, 'public/assets', store, 'store.json');
  const dst = path.join(__dirname, 'dist/assets', store, 'store.json');
  
  try {
    fs.copyFileSync(src, dst);
    console.log('Copied:', store);
  } catch (error) {
    console.error('Error copying', store, ':', error.message);
  }
});

console.log('All store files copied to dist');
