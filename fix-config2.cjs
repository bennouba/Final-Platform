const fs = require('fs');
const path = 'src/config/storeConfig.ts';
let content = fs.readFileSync(path, 'utf8');

// Find the position to insert indeesh config
const searchStr = '    ],\n    products: [],\n  },\n};';
const replaceStr = `    ],\n    products: [],\n  },\n\n  indeesh: {\n    slug: 'indeesh',\n    storeId: 6,\n    name: 'انديش',\n    description: 'منتجات العناية بالمنزل والعائلة',\n    logo: '/assets/indeesh/logo.webp',\n    icon: '🏠',\n    sliderHeight: {\n      mobile: 500,\n      desktop: 600,\n    },\n    colors: {\n      primary: '#10b981',\n      secondary: '#059669',\n      accent: '#d1fae5',\n    },\n    sliders: [\n      {\n        id: 'banner1',\n        image: '/assets/indeesh/slide1.webp',\n        title: 'منتجات العناية بالمنزل',\n        subtitle: 'جودة عالية وأسعار منافسة',\n        buttonText: 'تسوق الآن',\n      },\n    ],\n    products: [],\n  },\n};`;

const newContent = content.replace(searchStr, replaceStr);
if (content !== newContent) {
  fs.writeFileSync(path, newContent);
  console.log('✅ indeesh config added successfully');
} else {
  console.log('❌ Pattern not found');
}