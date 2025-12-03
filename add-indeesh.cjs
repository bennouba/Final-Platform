const fs = require('fs');
const path = 'src/config/storeConfig.ts';
let content = fs.readFileSync(path, 'utf8');

// Add indeesh before the closing brace
const indeeshConfig = `,

  indeesh: {
    slug: 'indeesh',
    storeId: 6,
    name: 'انديش',
    description: 'منتجات العناية بالمنزل والعائلة',
    logo: '/assets/indeesh/logo.webp',
    icon: '🏠',
    sliderHeight: {
      mobile: 500,
      desktop: 600,
    },
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#d1fae5',
    },
    sliders: [
      {
        id: 'banner1',
        image: '/assets/indeesh/slide1.webp',
        title: 'منتجات العناية بالمنزل',
        subtitle: 'جودة عالية وأسعار منافسة',
        buttonText: 'تسوق الآن',
      },
    ],
    products: [],
  }`;

const newContent = content.replace('    products: [],\n  },\n};', indeeshConfig + ',\n    products: [],\n  },\n};');
if (content !== newContent) {
  fs.writeFileSync(path, newContent);
  console.log('✅ indeesh config added');
} else {
  console.log('Trying alternative approach...');
}