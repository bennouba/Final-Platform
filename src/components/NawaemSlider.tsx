// NawaemSlider component: Image slider for store banners with auto-play and navigation
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  Eye,
  Heart,
  ShoppingCart,
  Sparkles,
  Star
} from 'lucide-react';
import type { Product } from '@/data/storeProducts';

interface NawaemSliderProps {
  products: Product[];
  storeSlug?: string;
  onProductClick: (productId: number) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  favorites: number[];
}

const SPARKLE_CONFIGS = Array.from({ length: 20 }, (_, index) => ({
  positionClass: `sparkle-position-${(index % 10) + 1}`,
  delayClass: `sparkle-delay-${index % 5}`,
  durationClass: `sparkle-duration-${index % 4}`,
}));

const NawaemSlider: React.FC<NawaemSliderProps> = ({
  products,
  storeSlug = 'nawaem',
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  favorites = []
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  
  // صور السلايدر حسب المتجر
  const getSliderBanners = (store: string) => {
    if (store === 'sheirine') {
      return [
        {
          id: 'banner1',
          image: '/assets/sheirine/slider1.jpg',
          title: 'ملابس للمناسبات أحجام كبيرة',
          subtitle: 'اكتشفي مجموعتنا الجديدة من الملابس المناسباتية بأحجام كبيرة لكل المناسبات',
          buttonText: 'تسوقي الآن'
        },
        {
          id: 'banner2',
          image: '/assets/sheirine/slider2.jpg',
          title: 'أحذية نسائية أنيقة',
          subtitle: 'مجموعة مميزة من الأحذية النسائية لإطلالات استثنائية في كل خطوة',
          buttonText: 'استكشفي الأحذية'
        },
        {
          id: 'banner3',
          image: '/assets/sheirine/slider3.jpg',
          title: 'ملابس للمناسبات أحجام كبيرة',
          subtitle: 'تصاميم فريدة من الملابس المناسباتية بأحجام كبيرة لإطلالة مميزة',
          buttonText: 'اطلعي على المجموعة'
        },
        {
          id: 'banner4',
          image: '/assets/sheirine/slider4.jpg',
          title: 'أحذية نسائية راقية',
          subtitle: 'أحذية نسائية بأحدث الصيحات لكل المناسبات والأيام',
          buttonText: 'تسوقي الأحذية'
        },
        {
          id: 'banner5',
          image: '/assets/sheirine/slider1.jpg',
          title: 'ملابس مناسبات أحجام كبيرة',
          subtitle: 'مجموعة متنوعة من الملابس المناسباتية بأحجام كبيرة لكل الأذواق',
          buttonText: 'اكتشفي الملابس'
        }
      ];
    }
    
    // البانرات الافتراضية لنواعم
    return [
      {
        id: 'banner1',
        image: '/assets/nawaem/bag2.jpg',
        title: 'حقائب نواعم الأنيقة'
      },
      {
        id: 'banner2',
        image: '/assets/nawaem/bag3-black.jpg',
        title: 'حقائب سوداء فاخرة'
      },
      {
        id: 'banner3',
        image: '/assets/nawaem/bag3-green.jpg',
        title: 'حقائب خضراء عصرية'
      },
      {
        id: 'banner4',
        image: '/assets/nawaem/dress3.jpg',
        title: 'فساتين نواعم الراقية'
      },
      {
        id: 'banner5',
        image: '/assets/nawaem/dress4.jpg',
        title: 'فساتين مناسبات مميزة'
      },
      {
        id: 'banner6',
        image: '/assets/nawaem/dress5.jpg',
        title: 'فساتين صيفية أنيقة'
      },
      {
        id: 'banner7',
        image: '/assets/nawaem/gold-jewelry-set-1.jpg',
        title: 'مجوهرات ذهبية فاخرة'
      },
      {
        id: 'banner8',
        image: '/assets/nawaem/handbag-beige-1.jpg',
        title: 'حقائب بيج راقية'
      },
      {
        id: 'banner9',
        image: '/assets/nawaem/handbag-black-1.jpg',
        title: 'حقائب سوداء أنيقة'
      },
      {
        id: 'banner10',
        image: '/assets/nawaem/handbags-luxury-1.jpg',
        title: 'حقائب فاخرة'
      }
    ];
  };

  const sliderBanners = getSliderBanners(storeSlug);

  // دمج البانرات بدون منتجات - فقط صور السلايدر
  const allSlides = sliderBanners;

  // التشغيل التلقائي المحسن
  useEffect(() => {
    if (!isAutoPlaying || allSlides.length <= 1 || isDragging) return;

    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % allSlides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, allSlides.length, isDragging]);

  const nextSlide = () => {
    setActiveSlide(prev => (prev + 1) % allSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide(prev => (prev - 1 + allSlides.length) % allSlides.length);
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  // معالجة السحب للأجهزة اللمسية
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    setIsAutoPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  if (allSlides.length === 0) return null;

  // ألوان حسب المتجر
  const getStoreColors = (store: string) => {
    if (store === 'sheirine') {
      return {
        background: 'from-pink-50 via-purple-50 to-fuchsia-50',
        accent: 'from-pink-400 via-purple-400 to-fuchsia-400',
        gradient: 'from-pink-500 to-purple-600',
        button: 'from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
      };
    }
    // الألوان الافتراضية لنواعم
    return {
      background: 'from-amber-50 via-yellow-50 to-orange-50',
      accent: 'from-amber-400 via-yellow-400 to-orange-400',
      gradient: 'from-yellow-500 to-amber-600',
      button: 'from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
    };
  };

  const storeColors = getStoreColors(storeSlug);

  return (
    <div className={`relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br ${storeColors.background}`}>
      {/* خلفية متحركة حسب المتجر */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-r ${storeColors.accent}/20 via-current/10 to-current/20`}></div>
        <div className="absolute inset-0">
          {SPARKLE_CONFIGS.map((config, index) => (
            <div
              key={index}
              className={`absolute animate-pulse ${config.positionClass} ${config.delayClass} ${config.durationClass}`}
            >
              <Sparkles className={`h-4 w-4 ${storeSlug === 'sheirine' ? 'text-pink-400/40' : 'text-yellow-400/40'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* السلايدر */}
      <div
        ref={sliderRef}
        className="relative h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            setIsAutoPlaying(true);
          }
        }}
      >
        <div className="relative h-full w-full">
          {allSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              } ${isDragging ? 'slider-image-dimmed' : 'slider-image-normal'}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التنقل المحسنة */}
      {allSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="الشريحة السابقة"
            className={`absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-colors duration-300 group border-2 ${
              storeSlug === 'sheirine' ? 'border-pink-200 hover:border-pink-400' : 'border-yellow-200 hover:border-yellow-400'
            }`}
          >
            <ArrowLeft className={`h-5 w-5 md:h-6 md:w-6 text-gray-700 ${
              storeSlug === 'sheirine' ? 'group-hover:text-pink-600' : 'group-hover:text-yellow-600'
            }`} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="الشريحة التالية"
            className={`absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-colors duration-300 group border-2 ${
              storeSlug === 'sheirine' ? 'border-pink-200 hover:border-pink-400' : 'border-yellow-200 hover:border-yellow-400'
            }`}
          >
            <ArrowRight className={`h-5 w-5 md:h-6 md:w-6 text-gray-700 ${
              storeSlug === 'sheirine' ? 'group-hover:text-pink-600' : 'group-hover:text-yellow-600'
            }`} />
          </button>
        </>
      )}

      {/* نقاط التنقل المحسنة */}
      {allSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          {allSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`الانتقال إلى الشريحة ${index + 1}`}
              aria-pressed={index === activeSlide}
              className={`transition-colors duration-300 rounded-full ${
                index === activeSlide 
                  ? `w-10 h-3 bg-gradient-to-r ${storeSlug === 'sheirine' ? 'from-pink-400 to-purple-500' : 'from-yellow-400 to-amber-500'}` 
                  : 'w-3 h-3 bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* مؤشر التشغيل التلقائي */}
      <div className="absolute top-4 left-4">
        <button
          type="button"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          aria-label={isAutoPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل السلايدر تلقائيًا'}
          aria-pressed={isAutoPlaying}
          className={`p-2 rounded-full backdrop-blur-sm border transition-colors duration-300 ${
            isAutoPlaying 
              ? 'bg-green-500/90 border-green-300 text-white' 
              : 'bg-white/90 border-gray-300 text-gray-600'
          }`}
        >
          {isAutoPlaying ? (
            <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
          ) : (
            <div className="h-3 w-3 bg-gray-400 rounded-full" />
          )}
        </button>
      </div>

      {/* شريط التقدم */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className={`progress-bar h-full bg-gradient-to-r transition-colors duration-5000 ease-linear ${
            storeSlug === 'sheirine' ? 'from-pink-400 to-purple-500' : 'from-yellow-400 to-amber-500'
          } ${isAutoPlaying ? 'progress-bar-active' : 'progress-bar-paused'}`}
        />
      </div>

      <style>{`
        .progress-bar { width: 0%; }
        .progress-bar-active { width: 100%; animation: progress 3s linear infinite; }
        .progress-bar-paused { width: 0%; animation: none; }
        .slider-image-normal { filter: brightness(1); }
        .slider-image-dimmed { filter: brightness(0.9); }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default NawaemSlider;
