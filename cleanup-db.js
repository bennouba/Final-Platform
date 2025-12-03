import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
  console.log('🔧 Starting database cleanup...\n');

  // Fix corrupted slider image paths
  const updateSliders = db.prepare(`
    UPDATE store_sliders 
    SET imagePath = '/assets/indeesh/sliders/default-slider-' || id || '.jpg'
    WHERE imagePath LIKE 'data:image%' 
       OR imagePath LIKE 'data:%'
       OR imagePath IS NULL
       OR imagePath = ''
  `);
  const sliderResult = updateSliders.run();
  console.log(`✅ Updated ${sliderResult.changes} slider records`);

  // Delete invalid ads with wrong placement values
  const deleteInvalidAds = db.prepare(`
    DELETE FROM store_ads WHERE placement NOT IN ('banner', 'between_products')
  `);
  const deleteResult = deleteInvalidAds.run();
  console.log(`✅ Deleted ${deleteResult.changes} invalid ad records`);

  // Update ads with NULL or empty placement to 'banner'
  const updateAds = db.prepare(`
    UPDATE store_ads SET placement = 'banner' WHERE placement IS NULL OR placement = ''
  `);
  const updateAdsResult = updateAds.run();
  console.log(`✅ Updated ${updateAdsResult.changes} ad records with NULL placement`);

  console.log('\n✅ Database cleanup completed successfully!');
  db.close();
} catch (error) {
  console.error('❌ Error during cleanup:', error);
  db.close();
  process.exit(1);
}
