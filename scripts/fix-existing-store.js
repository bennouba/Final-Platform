// fix-existing-store.js
const fs = require('fs');
const path = require('path');

const storeSlug = 'indeesh'; // غيّر هذا حسب المتجر

const backendBase = './backend/public/assets/' + storeSlug;
const frontendBase = './public/assets/' + storeSlug;
const brandsDir = './public/assets/brands';

// نسخ المجلدات
['products', 'sliders', 'logo'].forEach(type => {
  const src = path.join(backendBase, type);
  const dest = path.join(frontendBase, type);
  
  if (fs.existsSync(src)) {
    fs.mkdirSync(dest, { recursive: true });
    const files = fs.readdirSync(src);
    files.forEach(file => {
      fs.copyFileSync(
        path.join(src, file),
        path.join(dest, file)
      );
      console.log(`✅ Copied: ${type}/${file}`);
    });
  }
});

// نسخ store.json
fs.copyFileSync(
  path.join(backendBase, 'store.json'),
  path.join(frontendBase, 'store.json')
);

// نسخ الشعار إلى brands
const logoDir = path.join(backendBase, 'logo');
if (fs.existsSync(logoDir)) {
  const logoFiles = fs.readdirSync(logoDir);
  if (logoFiles.length > 0) {
    fs.mkdirSync(brandsDir, { recursive: true });
    fs.copyFileSync(
      path.join(logoDir, logoFiles[0]),
      path.join(brandsDir, logoFiles[0])
    );
    console.log(`✅ Logo copied to brands`);
  }
}

console.log('🎉 Store files synced successfully!');