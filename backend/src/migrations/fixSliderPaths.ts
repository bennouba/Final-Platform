import sequelize from '@config/database';
import Store from '@models/Store';
import StoreSlider from '@models/StoreSlider';
import logger from '@utils/logger';

export async function fixSliderPaths() {
  try {
    logger.info('🔄 Starting slider path fix...');

    const stores = await Store.findAll({
      attributes: ['id', 'slug', 'name']
    });

    logger.info(`📦 Found ${stores.length} stores`);

    const storesWithOldPaths = ['nawaem', 'sherine', 'pretty', 'delta-store', 'magna-beauty'];

    for (const store of stores) {
      const storeSlug = store.slug?.toLowerCase() || '';

      if (storesWithOldPaths.includes(storeSlug)) {
        const sliderCount = await StoreSlider.count({ where: { storeId: store.id } });
        
        if (sliderCount > 0) {
          logger.info(`🗑️  Deleting ${sliderCount} old sliders for '${storeSlug}'`);
          await StoreSlider.destroy({ where: { storeId: store.id } });
        }
      }
    }

    logger.info('✅ Slider path fix complete! Now run populateSliders migration.');
    return { success: true };
  } catch (error) {
    logger.error('❌ Error during slider path fix:', error);
    throw error;
  }
}

if (require.main === module) {
  (async () => {
    try {
      await fixSliderPaths();
      logger.info('✅ Migration completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Migration failed:', error);
      process.exit(1);
    }
  })();
}
