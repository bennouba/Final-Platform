// BrandSlider component: Displays merchant/brand logos in an auto-rotating slider
// مكون السلايدر لعرض شعارات الماركات والمتاجر
import React, { useState, useEffect } from 'react';

interface BrandSliderProps {
  images: string[];
  autoRotateInterval?: number; // in milliseconds
}

const BrandSlider: React.FC<BrandSliderProps> = ({
  images,
  autoRotateInterval = 5000 // 5 seconds default
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get correct image path - served from public assets
  const getImagePath = (imageName: string) => {
    return `/assets/slider/${imageName}`;
  };

  // Auto-rotate functionality
  useEffect(() => {
    if (!isAutoRotating || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {

        return (prevIndex + 1) % images.length;
      });
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [isAutoRotating, images.length, autoRotateInterval]);

  // Preload images and handle loading state
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      setIsLoading(false);
      return;
    }

    images.forEach((image, index) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        setLoadedImages(prev => new Set(prev).add(index));
        if (loadedCount === totalImages) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {

        loadedCount++;
        setLoadedImages(prev => new Set(prev).add(index));
        if (loadedCount === totalImages) {
          setIsLoading(false);
        }
      };
      img.src = getImagePath(image);
    });
  }, [images]);

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoRotating(false); // Pause auto-rotation when manually navigating

    // Resume auto-rotation after 10 seconds of inactivity
    setTimeout(() => setIsAutoRotating(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 10000);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">لا توجد صور للعرض</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
          <div className="text-center">
            <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', borderRadius: '9999px', height: '48px', width: '48px', borderBottom: '2px solid currentColor', color: 'rgb(59, 130, 246)', margin: '0 auto 16px' }}></div>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
            <p className="text-primary font-medium">جاري تحميل الصور...</p>
          </div>
        </div>
      )}

      {/* Main slider container */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden bg-transparent">
        {/* Images */}
        <div className="relative w-full h-full bg-transparent">
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: index === currentIndex ? 1 : 0,
                zIndex: index === currentIndex ? 10 : 1,
                transform: index === currentIndex ? 'scale(1)' : 'scale(0.95)',
                pointerEvents: index === currentIndex ? 'auto' : 'none'
              }}
            >
              <img
                src={getImagePath(image)}
                alt={`Brand logo ${index + 1}`}
                className="w-full h-full high-quality-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  filter: 'brightness(1.08) contrast(1.18) saturate(1.1) hue-rotate(1deg) drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  minHeight: '100%',
                  background: 'transparent',
                  willChange: 'transform, filter',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
                onError={(e) => {

                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors duration-300 opacity-80 hover:opacity-100 z-10"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors duration-300 opacity-80 hover:opacity-100 z-10"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* No thumbnail navigation */}
    </div>
  );
};

export default BrandSlider;
