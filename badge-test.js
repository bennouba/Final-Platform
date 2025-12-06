// Test script for badge calculation system
const { calculateBadge, getTagColor } = require('./src/utils/badgeCalculator.ts');

console.log('🎯 Testing Badge System...\n');

// Test cases with different product scenarios
const testProducts = [
  {
    name: 'منتج جديد',
    views: 50,
    likes: 10,
    orders: 5,
    quantity: 10,
    price: 100,
    originalPrice: 100,
    isNew: true
  },
  {
    name: 'منتج أكثر مشاهدة',
    views: 450,
    likes: 50,
    orders: 20,
    quantity: 10,
    price: 100,
    originalPrice: 100
  },
  {
    name: 'منتج أكثر إعجاباً',
    views: 200,
    likes: 250,
    orders: 30,
    quantity: 10,
    price: 100,
    originalPrice: 100
  },
  {
    name: 'منتج أكثر طلباً',
    views: 150,
    likes: 80,
    orders: 60,
    quantity: 10,
    price: 100,
    originalPrice: 100
  },
  {
    name: 'منتج أكثر مبيعاً',
    views: 300,
    likes: 150,
    orders: 120,
    quantity: 10,
    price: 100,
    originalPrice: 100
  },
  {
    name: 'منتج مميزة',
    views: 400,
    likes: 250,
    orders: 150,
    quantity: 10,
    price: 100,
    originalPrice: 100
  },
  {
    name: 'منتج تخفيضات',
    views: 100,
    likes: 50,
    orders: 25,
    quantity: 10,
    price: 80,
    originalPrice: 100
  },
  {
    name: 'منتج غير متوفر',
    views: 200,
    likes: 100,
    orders: 50,
    quantity: 0,
    price: 100,
    originalPrice: 100
  }
];

testProducts.forEach(product => {
  const badge = calculateBadge(product);
  const colorInfo = getTagColor(badge);
  
  console.log(`📦 ${product.name}`);
  console.log(`   Views: ${product.views}, Likes: ${product.likes}, Orders: ${product.orders}, Quantity: ${product.quantity}`);
  console.log(`   Badge: ${badge}`);
  console.log(`   Color: ${colorInfo.style.backgroundColor}`);
  console.log(`   Status: ${product.quantity <= 0 ? 'غير متوفر' : product.originalPrice > product.price ? 'تخفيضات' : 'متوفر'}`);
  console.log('   ---\n');
});

console.log('✅ Badge system test completed!');