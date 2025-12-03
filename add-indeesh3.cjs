const fs = require('fs');
const path = 'src/config/storeConfig.ts';
let content = fs.readFileSync(path, 'utf8');

// Windows line endings: \r\n
const searchStr = '  },\r\n};';
const indeeshConfig = `,\r\n\r\n  indeesh: {\r\n    slug: 'indeesh',\r\n    storeId: 6,\r\n    name: 'انديش',\r\n    description: 'منتجات العناية بالمنزل والعائلة',\r\n    logo: '/assets/indeesh/logo.webp',\r\n    icon: '🏠',\r\n    sliderHeight: {\r\n      mobile: 500,\r\n      desktop: 600,\r\n    },\r\n    colors: {\r\n      primary: '#10b981',\r\n      secondary: '#059669',\r\n      accent: '#d1fae5',\r\n    },\r\n    sliders: [\r\n      {\r\n        id: 'banner1',\r\n        image: '/assets/indeesh/slide1.webp',\r\n        title: 'منتجات العناية بالمنزل',\r\n        subtitle: 'جودة عالية وأسعار منافسة',\r\n        buttonText: 'تسوق الآن',\r\n      },\r\n    ],\r\n    products: [],\r\n  },\r\n};`;

const newContent = content.replace(searchStr, indeeshConfig);
if (content !== newContent) {
  fs.writeFileSync(path, newContent);
  console.log('✅ indeesh config added successfully!');
} else {
  console.log('❌ Could not add indeesh');
}