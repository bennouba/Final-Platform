const fs = require('fs');
const path = 'src/pages/EnhancedMerchantDashboard.tsx';
const content = fs.readFileSync(path, 'utf8');
const oldLine = 'const storeId = merchantStoreData?.storeId || merchantStoreData?.id || currentMerchant?.id || merchantStoreSlug;';
const newLine = 'const storeId = merchantStoreSlug || merchantStoreData?.slug || merchantStoreData?.storeSlug || merchantStoreData?.storeId || merchantStoreData?.id;';
const newContent = content.replace(oldLine, newLine);
if (content !== newContent) {
  fs.writeFileSync(path, newContent);
  console.log('✅ handlePublishAd storeId line fixed');
} else {
  console.log('❌ Line not found');
}