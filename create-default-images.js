const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const backendPublicDir = path.join(__dirname, 'backend', 'public');

const defaultSvgImages = {
  'default-store.png': '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="16" fill="#999" font-family="Arial">متجر</text></svg>',
  'default-product.png': '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#e8e8e8"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="16" fill="#999" font-family="Arial">منتج</text></svg>',
  'default-slider.png': '<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="600" fill="#d0d0d0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="24" fill="#999" font-family="Arial">صورة سلايدر</text></svg>'
};

function createDefaultImages(targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  Object.entries(defaultSvgImages).forEach(([filename, svg]) => {
    const filepath = path.join(targetDir, filename);
    fs.writeFileSync(filepath, svg, 'utf8');
    console.log(`✅ Created: ${filepath}`);
  });
}

try {
  createDefaultImages(publicDir);
  console.log(`\n✅ Default images created in Frontend public/`);
} catch (err) {
  console.error('❌ Error creating frontend images:', err.message);
}

try {
  createDefaultImages(backendPublicDir);
  console.log(`✅ Default images created in Backend public/`);
} catch (err) {
  console.error('⚠️ Backend public dir error:', err.message);
}
