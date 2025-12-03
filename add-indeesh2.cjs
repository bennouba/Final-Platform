const fs = require('fs');
const path = 'src/config/storeConfig.ts';
let content = fs.readFileSync(path, 'utf8');

// Simple approach: add before };
const searchStr = '};\n\nexport function getStoreConfig';
const indeeshStr = `  },

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
  }
};\n\nexport function getStoreConfig`;

const newContent = content.replace(searchStr, indeeshStr);
if (content !== newContent) {
  fs.writeFileSync(path, newContent);
  console.log('✅ indeesh config added successfully!');
} else {
  console.log('❌ Could not find the pattern');
  // Try to just insert after magna-beauty
  const idx = content.indexOf('    products: [],\n  },\n};');
  if (idx > 0) {
    const before = content.substring(0, idx + 17); // 17 = len of '    products: [],\n'
    const after = content.substring(idx + 17);
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
    products: []`;
    const finalContent = before + after.replace('  },', indeeshConfig + ',\n  },');
    fs.writeFileSync(path, finalContent);
    console.log('✅ indeesh config added with fallback method!');
  }
}