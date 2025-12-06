const fs = require('fs');
const path = require('path');

function updateStoreJson(storeDir) {
  const storeJsonPath = path.join(process.cwd(), 'public/assets', storeDir, 'store.json');
  
  console.log('Processing:', storeJsonPath);
  
  if (!fs.existsSync(storeJsonPath)) {
    console.log('❌ File not found:', storeJsonPath);
    return false;
  }
  
  try {
    const store = JSON.parse(fs.readFileSync(storeJsonPath, 'utf8'));
    
    store.products = store.products.map((product) => {
      return {
        ...product,
        storeId: product.storeId || store.storeId,
        rating: product.rating !== undefined ? product.rating : (Math.round((4 + Math.random()) * 10) / 10),
        reviews: product.reviews !== undefined ? product.reviews : Math.floor(Math.random() * 100 + 10),
        views: product.views !== undefined ? product.views : Math.floor(Math.random() * 450 + 50),
        likes: product.likes !== undefined ? product.likes : Math.floor(Math.random() * 290 + 10),
        orders: product.orders !== undefined ? product.orders : Math.floor(Math.random() * 145 + 5),
        quantity: product.quantity !== undefined ? product.quantity : (product.inStock ? Math.floor(Math.random() * 45 + 5) : 0),
        badge: product.badge || 'جديد'
      };
    });
    
    fs.writeFileSync(storeJsonPath, JSON.stringify(store, null, 2), 'utf8');
    console.log('✓ Updated:', storeJsonPath);
    return true;
  } catch (error) {
    console.error('✗ Error updating', storeDir, ':', error.message);
    return false;
  }
}

try {
  console.log('Current directory:', process.cwd());
  console.log('Starting store updates...\n');
  
  const results = [
    updateStoreJson('nawaem'),
    updateStoreJson('delta-store'),
    updateStoreJson('indeesh')
  ];
  
  console.log('\n✓ All stores processed successfully');
  process.exit(results.every(r => r) ? 0 : 1);
} catch (error) {
  console.error('Fatal error:', error.message);
  process.exit(1);
}
