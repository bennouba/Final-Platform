const fs = require('fs');
const path = 'src/components/SimplifiedSliderManager.tsx';
const content = fs.readFileSync(path, 'utf8');
const oldLine = "const storeId = currentMerchant?.id || storeData?.id || storeSlug;";
const newLine = "const storeId = storeSlug || currentMerchant?.storeSlug || currentMerchant?.slug || storeData?.slug || storeData?.id || currentMerchant?.id;";
const newContent = content.replace(oldLine, newLine);
if (content !== newContent) {
  fs.writeFileSync(path, newContent);
  console.log('✅ SimplifiedSliderManager storeId line fixed');
} else {
  console.log('❌ Line not found');
}