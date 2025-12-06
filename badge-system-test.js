// اختبار نظام الـ badges المدمج الجديد
console.log('🧪 اختبار نظام الـ Badges الجديد');

const testScenarios = [
  {
    name: 'منتج جديد بدون إحصائيات',
    product: {
      id: 1,
      name: 'منتج جديد',
      price: 100,
      quantity: 10,
      views: 0,
      likes: 0,
      orders: 0
    },
    expectedBadge: 'جديد'
  },
  {
    name: 'منتج غير متوفر',
    product: {
      id: 2,
      name: 'منتج غير متوفر',
      price: 100,
      quantity: 0,
      views: 500,
      likes: 300,
      orders: 150
    },
    expectedBadge: 'غير متوفر'
  },
  {
    name: 'منتج مخفض',
    product: {
      id: 3,
      name: 'منتج مخفض',
      price: 80,
      originalPrice: 100,
      quantity: 10,
      views: 100,
      likes: 50,
      orders: 20
    },
    expectedBadge: 'تخفيضات'
  },
  {
    name: 'منتج أكثر مبيعاً',
    product: {
      id: 4,
      name: 'منتج شعبي',
      price: 100,
      quantity: 10,
      views: 200,
      likes: 150,
      orders: 120
    },
    expectedBadge: 'أكثر مبيعاً'
  },
  {
    name: 'منتج مميز',
    product: {
      id: 5,
      name: 'منتج مميز',
      price: 100,
      quantity: 10,
      views: 300,
      likes: 250,
      orders: 150
    },
    expectedBadge: 'مميزة'
  },
  {
    name: 'منتج أكثر إعجاباً',
    product: {
      id: 6,
      name: 'منتج محبوب',
      price: 100,
      quantity: 10,
      views: 200,
      likes: 220,
      orders: 80
    },
    expectedBadge: 'أكثر إعجاباً'
  },
  {
    name: 'منتج أكثر مشاهدة',
    product: {
      id: 7,
      name: 'منتج مشهور',
      price: 100,
      quantity: 10,
      views: 450,
      likes: 100,
      orders: 30
    },
    expectedBadge: 'أكثر مشاهدة'
  },
  {
    name: 'منتج أكثر طلباً',
    product: {
      id: 8,
      name: 'منتج مرغوب',
      price: 100,
      quantity: 10,
      views: 200,
      likes: 100,
      orders: 60
    },
    expectedBadge: 'أكثر طلباً'
  }
];

// دالة حساب الـ badge (نسخ من النظام الجديد)
function calculateBadgeForProduct(product) {
  const views = product.views || 0;
  const likes = product.likes || 0;
  const orders = product.orders || 0;
  const quantity = product.quantity || 0;
  const originalPrice = product.originalPrice || product.price || 0;
  const price = product.price || 0;

  // 1. أولوية أولى: المنتجات غير المتوفرة
  if (quantity <= 0) {
    return 'غير متوفر';
  }

  // 2. ثانيوية ثانية: المنتجات المخفضة (تخفيض أكثر من 10%)
  if (originalPrice > price && ((originalPrice - price) / originalPrice) >= 0.1) {
    return 'تخفيضات';
  }

  // 3. ثالثوية ثالثة: المنتجات المميزة (طلبات عالية + إعجابات عالية)
  if (orders > 100 && likes > 200) {
    return 'مميزة';
  }

  // 4. رابعوية رابعة: أكثر مبيعاً (طلبات عالية)
  if (orders > 100) {
    return 'أكثر مبيعاً';
  }

  // 5. خامسة خامسة: أكثر إعجاباً (إعجابات عالية)
  if (likes > 200) {
    return 'أكثر إعجاباً';
  }

  // 6. سادسة سادسة: أكثر مشاهدة (مشاهدات عالية)
  if (views > 400) {
    return 'أكثر مشاهدة';
  }

  // 7. سابعة سابعة: أكثر طلباً (طلبات متوسطة)
  if (orders > 50) {
    return 'أكثر طلباً';
  }

  // 8. أخيراً: المنتجات الجديدة
  return 'جديد';
}

// تشغيل الاختبارات
let passedTests = 0;
let totalTests = testScenarios.length;

console.log('\n📋 نتائج الاختبارات:\n');

testScenarios.forEach((scenario, index) => {
  const result = calculateBadgeForProduct(scenario.product);
  const passed = result === scenario.expectedBadge;
  
  console.log(`${index + 1}. ${scenario.name}`);
  console.log(`   المنتج: ${scenario.product.name}`);
  console.log(`   الإحصائيات: views=${scenario.product.views}, likes=${scenario.product.likes}, orders=${scenario.product.orders}`);
  console.log(`   النتيجة المتوقعة: ${scenario.expectedBadge}`);
  console.log(`   النتيجة الفعلية: ${result}`);
  console.log(`   الحالة: ${passed ? '✅ نجح' : '❌ فشل'}\n`);
  
  if (passed) passedTests++;
});

console.log('📊 ملخص الاختبارات:');
console.log(`الناجحة: ${passedTests}/${totalTests}`);
console.log(`معدل النجاح: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 جميع الاختبارات نجحت! النظام يعمل بشكل صحيح.');
} else {
  console.log('\n⚠️ بعض الاختبارات فشلت. يرجى مراجعة الكود.');
}

// ألوان الـ badges
console.log('\n🎨 ألوان الـ badges:');
const badgeColors = {
  'جديد': '#008080', // Teal Green
  'أكثر مبيعاً': '#FF6B6B', // Coral Red
  'أكثر إعجاباً': '#FFD700', // Gold
  'مميزة': '#808000', // Olive
  'أكثر مشاهدة': '#000080', // Navy Bleu
  'أكثر طلباً': '#FF7F50', // Coral
  'تخفيضات': '#FF1493', // Magenta
  'غير متوفر': '#FF6347' // Vermilion
};

Object.entries(badgeColors).forEach(([badge, color]) => {
  console.log(`• ${badge}: ${color}`);
});

console.log('\n✨ تم الانتهاء من اختبار نظام الـ badges!');