import sequelize from '@config/database';
import Store from '@models/Store';
import StoreSlider from '@models/StoreSlider';
import logger from '@utils/logger';

const DEFAULT_SLIDERS: Record<string, Array<{ title: string; subtitle: string; buttonText: string; imagePath: string; sortOrder: number }>> = {
  sherine: [
    {
      title: 'مجوهرات شيرين الفاخرة',
      subtitle: 'تألقي بأجمل المجوهرات والإكسسوارات',
      buttonText: 'استكشفي المجموعة',
      imagePath: '/assets/sherine/sliders/slider1.webp',
      sortOrder: 0
    },
    {
      title: 'عروض خاصة من شيرين',
      subtitle: 'أجمل المجوهرات بأسعار مميزة',
      buttonText: 'اطلعي على العروض',
      imagePath: '/assets/sherine/sliders/slider2.webp',
      sortOrder: 1
    },
    {
      title: 'أناقة وتألق من شيرين',
      subtitle: 'أجمل المجوهرات بأسعار مميزة',
      buttonText: 'اكتشف أسعارنا',
      imagePath: '/assets/sherine/sliders/slider3.webp',
      sortOrder: 1
    },
    {
      title: 'عروض خاصة من شيرين',
      subtitle: 'أجمل المجوهرات بأسعار مميزة',
      buttonText: 'أناقة لا مثيل لها',
      imagePath: '/assets/sherine/sliders/slider4.webp',
      sortOrder: 1
    }
  ],
  nawaem: [
    {
      title: 'اكتشف تشكيلة نواعم الحصرية',
      subtitle: 'أحدث الأزياء والعبايات الراقية',
      buttonText: 'تسوق الآن',
      imagePath: '/assets/nawaem/sliders/slider2.jpg',
      sortOrder: 0
    },
    {
      title: 'عروض حصرية من نواعم',
      subtitle: 'لا تفوت الفرصة - عروض محدودة',
      buttonText: 'شاهد العروض',
      imagePath: '/assets/nawaem/sliders/abaya3.jpg',
      sortOrder: 1
    },
    {
      title: 'عروض حصرية من نواعم',
      subtitle: 'لا تفوت الفرصة - عروض محدودة',
      buttonText: 'شاهد العروض',
      imagePath: '/assets/nawaem/sliders/bag2.jpg',
      sortOrder: 1
    },
    {
      title: 'عروض حصرية من نواعم',
      subtitle: 'لا تفوت الفرصة - عروض محدودة',
      buttonText: 'شاهد العروض',
      imagePath: '/assets/nawaem/sliders/bag3-green.jpg',
      sortOrder: 1
    },
    {
      title: 'عروض حصرية من نواعم',
      subtitle: 'لا تفوت الفرصة - عروض محدودة',
      buttonText: 'شاهد العروض',
      imagePath: '/assets/nawaem/sliders/dress3.jpg',
      sortOrder: 1
    },
    {
      title: 'عروض حصرية من نواعم',
      subtitle: 'لا تفوت الفرصة - عروض محدودة',
      buttonText: 'شاهد العروض',
      imagePath: '/assets/nawaem/sliders/handbag-black-1.jpg',
      sortOrder: 1
    },
    {
      title: 'عروض حصرية من نواعم',
      subtitle: 'لا تفوت الفرصة - عروض محدودة',
      buttonText: 'شاهد العروض',
      imagePath: '/assets/nawaem/sliders/handbags-luxury-1.jpg',
      sortOrder: 1
    }
  ],

  pretty: [
    {
      title: 'أناقة Pretty',
      subtitle: 'اكتشفي أحدث مجموعات الأزياء',
      buttonText: 'تسوقي الآن',
      imagePath: '/assets/pretty/sliders/slider10.webp',
      sortOrder: 0
    },
    {
      title: 'عروض Pretty',
      subtitle: 'تخفيضات كبيرة على المنتجات المختارة',
      buttonText: 'اعرضي الآن',
      imagePath: '/assets/pretty/sliders/slider11.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Pretty',
      subtitle: 'تخفيضات كبيرة على المنتجات المختارة',
      buttonText: 'اعرضي الآن',
      imagePath: '/assets/pretty/sliders/slider12.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Pretty',
      subtitle: 'تخفيضات كبيرة على المنتجات المختارة',
      buttonText: 'اعرضي الآن',
      imagePath: '/assets/pretty/sliders/slider13.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Pretty',
      subtitle: 'تخفيضات كبيرة على المنتجات المختارة',
      buttonText: 'اعرضي الآن',
      imagePath: '/assets/pretty/sliders/slider14.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Pretty',
      subtitle: 'تخفيضات كبيرة على المنتجات المختارة',
      buttonText: 'اعرضي الآن',
      imagePath: '/assets/pretty/sliders/slider15.webp',
      sortOrder: 1
    }
  ],
  'delta-store': [
    {
      title: 'مجموعة Delta Store الجديدة',
      subtitle: 'أحدث الأزياء والتصاميم العصرية',
      buttonText: 'تسوق الآن',
      imagePath: '/assets/delta-store/sliders/slider1.webp',
      sortOrder: 0
    },
    {
      title: 'عروض Delta Store',
      subtitle: 'خصومات على كل المنتجات',
      buttonText: 'تسوق الآن',
      imagePath: '/assets/delta-store/sliders/slider2.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Delta Store',
      subtitle: 'خصومات على كل المنتجات',
      buttonText: 'تسوق الآن',
      imagePath: '/assets/delta-store/sliders/slider3.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Delta Store',
      subtitle: 'خصومات على كل المنتجات',
      buttonText: 'تسوق الآن',
      imagePath: '/assets/delta-store/sliders/slider4.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Delta Store',
      subtitle: 'خصومات على كل المنتجات',
      buttonText: 'تسوق الآن',
      imagePath: '/assets/delta-store/sliders/slider5.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Delta Store',
      subtitle: 'خصومات على كل المنتجات',
      buttonText: 'تسوق الآن',
      imagePath: '/assets/delta-store/sliders/slider6.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Delta Store',
      subtitle: 'خصومات على كل المنتجات',
      buttonText: 'تسوق الآن',
      imagePath: '/assets/delta-store/sliders/slider7.webp',
      sortOrder: 1
    }
  ],
  'magna-beauty': [
    {
      title: 'منتجات Magna Beauty',
      subtitle: 'اعتني بجمالك مع أفضل المنتجات',
      buttonText: 'اكتشفي المنتجات',
      imagePath: '/assets/magna-beauty/sliders/slide1.webp',
      sortOrder: 0
    },
    {
      title: 'عروض Magna Beauty',
      subtitle: 'منتجات التجميل بأسعار خاصة',
      buttonText: 'شاهدي العروض',
      imagePath: '/assets/magna-beauty/sliders/slide2.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Magna Beauty',
      subtitle: 'منتجات التجميل بأسعار خاصة',
      buttonText: 'شاهدي العروض',
      imagePath: '/assets/magna-beauty/sliders/slide3.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Magna Beauty',
      subtitle: 'منتجات التجميل بأسعار خاصة',
      buttonText: 'شاهدي العروض',
      imagePath: '/assets/magna-beauty/sliders/slide4.webp',
      sortOrder: 1
    },
    {
      title: 'عروض Magna Beauty',
      subtitle: 'منتجات التجميل بأسعار خاصة',
      buttonText: 'شاهدي العروض',
      imagePath: '/assets/magna-beauty/sliders/slide5.webp',
      sortOrder: 1
    }
  ],
  indeesh: [
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
      sortOrder: 1
    },
    {
      title: 'عروض انديش الخاصة',
      subtitle: 'منتجات أصلية بأسعار مميزة',
      buttonText: 'اكتشف العروض',
      imagePath: '/assets/indeesh/sliders/1764003949455-gvxg6e-7.jpg',
      sortOrder: 1
    },
    {
      title: 'عروض انديش الخاصة',
      subtitle: 'منتجات أصلية بأسعار مميزة',
      buttonText: 'اكتشف العروض',
      imagePath: '/assets/indeesh/sliders/1764003949480-48hujc-1.jpg',
      sortOrder: 1
    }
  ]
};

export async function populateSliders() {
  try {
    logger.info('🔄 Starting slider population for existing stores...');

    const stores = await Store.findAll({
      attributes: ['id', 'slug', 'name']
    });

    logger.info(`📦 Found ${stores.length} stores to process`);

    let totalSliders = 0;

    for (const store of stores) {
      const storeSlug = store.slug?.toLowerCase() || '';
      const existingSliders = await StoreSlider.count({ where: { storeId: store.id } });

      if (existingSliders > 0) {
        logger.info(`✅ Store '${storeSlug}' already has ${existingSliders} sliders, skipping...`);
        continue;
      }

      const defaultSliders = DEFAULT_SLIDERS[storeSlug];

      if (!defaultSliders) {
        logger.warn(`⚠️ No default sliders defined for store '${storeSlug}'`);
        continue;
      }

      try {
        for (const sliderData of defaultSliders) {
          await StoreSlider.create({
            storeId: store.id,
            title: sliderData.title,
            subtitle: sliderData.subtitle,
            buttonText: sliderData.buttonText,
            imagePath: sliderData.imagePath,
            sortOrder: sliderData.sortOrder,
            metadata: {
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          });
          totalSliders++;
        }
        logger.info(`✅ Added ${defaultSliders.length} sliders to store '${storeSlug}'`);
      } catch (error) {
        logger.error(`❌ Error adding sliders to store '${storeSlug}':`, error);
      }
    }

    logger.info(`✅ Slider population complete! Added ${totalSliders} sliders total`);
    return { success: true, totalSliders, storesProcessed: stores.length };
  } catch (error) {
    logger.error('❌ Error during slider population:', error);
    throw error;
  }
}

if (require.main === module) {
  (async () => {
    try {
      await populateSliders();
      logger.info('✅ Migration completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Migration failed:', error);
      process.exit(1);
    }
  })();
}
