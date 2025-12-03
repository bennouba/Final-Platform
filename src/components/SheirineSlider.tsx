import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Crown,
  Sparkles,
  Heart,
  ShoppingCart,
  Eye
} from 'lucide-react';
import type { Product } from '@/data/storeProducts';

interface PrettySliderProps {
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

const PrettySlider: React.FC<PrettySliderProps> = ({
  products,
  storeSlug = 'pretty',
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

  // صور السلايدر لمتجر بريتي
  const sliderBanners = [
    {
      id: 'banner1',
      image: '/assets/sheirine/slider1.jpg',
      title: 'مجموعة العطور الفاخرة في بريتي'
    },
    {
      id: 'banner2',
      image: '/assets/sheirine/slider2.jpg',
      title: 'عطور نسائية أنيقة'
    },
    {
      id: 'banner3',
      image: '/assets/sheirine/slider3.jpg',
      title: 'عطور رجالية مميزة'
    },
    {
      id: 'banner4',
      image: '/assets/sheirine/slider4.jpg',
      title: 'مجموعات عطور خاصة'
    },
  ];

  const allSlides = sliderBanners;

  // التشغيل التلقائي
  useEffect(() => {
    if (!isAutoPlaying || allSlides.length <= 1 || isDragging) return;

    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % allSlides.length);
    }, 5000);

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

  // ألوان متجر بريتي
  const storeColors = {
    background: 'from-rose-50 via-pink-50 to-fuchsia-50',
    accent: 'from-rose-400 via-pink-400 to-fuchsia-400',
    gradient: 'from-rose-500 to-pink-600',
    button: 'from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
  };

  return (
    <div className={`relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br ${storeColors.background}`}>
      {/* خلفية متحركة لمتجر بريتي */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-r ${storeColors.accent}/20 via-current/10 to-current/20`}></div>
        <div className="absolute inset-0">
          {SPARKLE_CONFIGS.map((config, index) => (
            <div
              key={`${config.positionClass}-${index}`}
              className={`sparkle-piece ${config.positionClass} ${config.delayClass} ${config.durationClass}`}
            >
              <Sparkles className="h-4 w-4 text-rose-400/40" />
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
              } ${isDragging ? 'filter brightness-90' : 'filter brightness-100'}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التنقل */}
      {allSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="الشريحة السابقة"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-colors duration-300 border-2 border-rose-200 hover:border-rose-400 z-50"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="الشريحة التالية"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-colors duration-300 border-2 border-rose-200 hover:border-rose-400 z-50"
          >
            <ArrowRight className="h-6 w-6 text-gray-700" />
          </button>
        </>
      )}

      {/* نقاط التنقل */}
      {allSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {allSlides.map((_, index) => {
            const isActive = index === activeSlide;
            return isActive ? (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`الانتقال إلى الشريحة ${index + 1}`}
                aria-pressed="true"
                className="transition-colors duration-300 rounded-full w-10 h-3 bg-gradient-to-r from-rose-400 to-pink-500"
              />
            ) : (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`الانتقال إلى الشريحة ${index + 1}`}
                aria-pressed="false"
                className="transition-colors duration-300 rounded-full w-3 h-3 bg-white/60 hover:bg-white/80"
              />
            );
          })}
        </div>
      )}

      {/* مؤشر التشغيل التلقائي */}
      <div className="absolute top-4 left-4 z-20">
        {isAutoPlaying ? (
          <button
            type="button"
            onClick={() => setIsAutoPlaying(false)}
            aria-label="إيقاف التشغيل التلقائي"
            aria-pressed="true"
            className="p-2 rounded-full backdrop-blur-sm border transition-colors duration-300 bg-green-500/90 border-green-300 text-white"
          >
            <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsAutoPlaying(true)}
            aria-label="تشغيل السلايدر تلقائيًا"
            aria-pressed="false"
            className="p-2 rounded-full backdrop-blur-sm border transition-colors duration-300 bg-white/90 border-gray-300 text-gray-600"
          >
            <div className="h-3 w-3 bg-gray-400 rounded-full" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PrettySlider;
