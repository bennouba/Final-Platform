import sequelize from '@config/database';
import Store from '@models/Store';
import StoreSlider from '@models/StoreSlider';

const DEFAULT_SLIDERS = [
  {
    title: 'مرحبا بك في متجر انديش',
    subtitle: 'علامة رائدة في عالم المنظفات',
    buttonText: 'تسوق الآن',
    imagePath: '/assets/indeesh/sliders/1764003949431-7n5h5h-3.jpg',
    sortOrder: 0
  },
  {
    title: 'عروض انديش الخاصة',
    subtitle: 'منتجات أصلية بأسعار مميزة',
    buttonText: 'اكتشف العروض',
    imagePath: '/assets/indeesh/sliders/1764003949444-z43zxk-9.jpg',
    sortOrder: 1
  },
  {
    title: 'عروض انديش الخاصة',
    subtitle: 'منتجات أصلية بأسعار مميزة',
    buttonText: 'اكتشف العروض',
    imagePath: '/assets/indeesh/sliders/1764003949446-93ffbn-8.jpg',
    sortOrder: 2
  },
  {
    title: 'عروض انديش الخاصة',
    subtitle: 'منتجات أصلية بأسعار مميزة',
    buttonText: 'اكتشف العروض',
    imagePath: '/assets/indeesh/sliders/1764003949455-gvxg6e-7.jpg',
    sortOrder: 3
  },
  {
    title: 'عروض انديش الخاصة',
    subtitle: 'منتجات أصلية بأسعار مميزة',
    buttonText: 'اكتشف العروض',
    imagePath: '/assets/indeesh/sliders/1764003949480-48hujc-1.jpg',
    sortOrder: 4
  }
];

async function fixIndeesh() {
  try {
    const store = await Store.findOne({ where: { slug: 'indeesh' } });
    if (!store) {
      console.log('❌ متجر indeesh غير موجود');
      process.exit(1);
    }

    console.log(`🔄 حذف الشرائح القديمة...`);
    await StoreSlider.destroy({ where: { storeId: store.id } });

    console.log(`✅ إضافة 5 شرائح جديدة...`);
    for (const slider of DEFAULT_SLIDERS) {
      await StoreSlider.create({
        storeId: store.id,
        title: slider.title,
        subtitle: slider.subtitle,
        buttonText: slider.buttonText,
        imagePath: slider.imagePath,
        sortOrder: slider.sortOrder,
        metadata: { isActive: true }
      });
    }

    console.log(`✅ تم تحديث indeesh بـ 5 شرائح!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ:', error);
    process.exit(1);
  }
}

fixIndeesh();
