const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const storeColors = {
  nawaem: { primary: '#8B5CF6', secondary: '#DDD6FE' },
  sherine: { primary: '#EC4899', secondary: '#FCE7F3' },
  pretty: { primary: '#F59E0B', secondary: '#FEF3C7' },
  'delta-store': { primary: '#3B82F6', secondary: '#DBEAFE' },
  'magna-beauty': { primary: '#06B6D4', secondary: '#CFFAFE' },
};

const storeTexts = {
  nawaem: ['نواعم - الأزياء الراقية', 'أحدث التشكيلات'],
  sherine: ['شيرين - المجوهرات الفاخرة', 'تألقي بألمع المجوهرات'],
  pretty: ['Pretty - الأناقة والجمال', 'استكشفي آخر الصيحات'],
  'delta-store': ['Delta Store - أزياء عصرية', 'تسوقي مع أسلوب'],
  'magna-beauty': ['Magna Beauty - العناية والتجميل', 'اعتني بجمالك'],
};

async function createDefaultSliderImage(storeName, sliderNumber, outputPath) {
  const width = 1200;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const colors = storeColors[storeName] || { primary: '#6366F1', secondary: '#E0E7FF' };
  const texts = storeTexts[storeName] || ['متجر', 'جديد'];

  ctx.fillStyle = colors.primary;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = colors.secondary;
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 100 + 50;
    ctx.fillRect(x, y, size, size);
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(texts[0], width / 2, height / 2 - 40);

  ctx.font = '32px Arial';
  ctx.fillStyle = '#F3F4F6';
  ctx.fillText(texts[1], width / 2, height / 2 + 40);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Created: ${outputPath}`);
}

async function main() {
  const basePath = path.join(__dirname, 'backend', 'public', 'assets');

  for (const [storeName] of Object.entries(storeColors)) {
    const sliderDir = path.join(basePath, storeName, 'sliders');
    
    if (!fs.existsSync(sliderDir)) {
      fs.mkdirSync(sliderDir, { recursive: true });
      console.log(`📁 Created directory: ${sliderDir}`);
    }

    for (let i = 1; i <= 2; i++) {
      const imagePath = path.join(sliderDir, `default-slider-${i}.png`);
      
      if (!fs.existsSync(imagePath)) {
        await createDefaultSliderImage(storeName, i, imagePath);
      } else {
        console.log(`⏭️  Already exists: ${imagePath}`);
      }
    }
  }

  console.log('\n✅ All default slider images created successfully!');
}

main().catch(console.error);
