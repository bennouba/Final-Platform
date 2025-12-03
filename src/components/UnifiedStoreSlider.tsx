import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getStoreConfig } from '@/config/storeConfig';

interface SliderHeightConfig {
  mobile?: number;
  desktop?: number;
}

interface Slider {
  id: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  imagePath: string;
  image?: string;
  sortOrder?: number;
}

interface UnifiedStoreSliderProps {
  storeSlug: string;
  height?: SliderHeightConfig;
}

const DEFAULT_SLIDER_HEIGHT = {
  mobile: 600,
  desktop: 800
};

const UnifiedStoreSlider: React.FC<UnifiedStoreSliderProps> = ({ 
  storeSlug, 
  height 
}) => {
  const staticConfig = getStoreConfig(storeSlug);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [config, setConfig] = useState(staticConfig);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    return window.innerWidth < 768;
  });

  useEffect(() => {
    loadSliders();

    const handleSliderUpdate = (event: CustomEvent) => {
      loadSliders();
    };

    window.addEventListener('storeSlidersUpdated', handleSliderUpdate as EventListener);

    return () => {
      window.removeEventListener('storeSlidersUpdated', handleSliderUpdate as EventListener);
    };
  }, [storeSlug]);

  const loadSliders = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/sliders/store/${storeSlug}`);
      
      if (response.ok) {
        const result = await response.json();
        const loadedSliders = result.data.map((slider: any) => ({
          id: slider.id,
          title: slider.title,
          subtitle: slider.subtitle,
          buttonText: slider.buttonText,
          imagePath: slider.imagePath,
          image: slider.imagePath,
          sortOrder: slider.sortOrder,
        }));
        
        loadedSliders.sort((a: Slider, b: Slider) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setSliders(loadedSliders);
        localStorage.setItem(`eshro_store_sliders_${storeSlug}`, JSON.stringify(loadedSliders));
        return;
      }
    } catch (error) {
      console.error('Error loading sliders from backend:', error);
    }

    const storageKey = `eshro_store_sliders_${storeSlug}`;
    const savedSliders = localStorage.getItem(storageKey);
    if (savedSliders) {
      try {
        const parsed = JSON.parse(savedSliders);
        setSliders(parsed);
        return;
      } catch {
        // Parse error
      }
    }

    if (staticConfig?.sliders) {
      setSliders(staticConfig.sliders);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sliderHeight = {
    mobile: height?.mobile ?? config?.sliderHeight?.mobile ?? DEFAULT_SLIDER_HEIGHT.mobile,
    desktop: height?.desktop ?? config?.sliderHeight?.desktop ?? DEFAULT_SLIDER_HEIGHT.desktop,
  };
  const resolvedHeight = isMobile ? sliderHeight.mobile : sliderHeight.desktop;

  const resolveBackgroundImage = (image?: string) => {
    if (!image) return undefined;
    try {
      return `url("${encodeURI(image)}")`;
    } catch (error) {
      return `url("${image}")`;
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || sliders.length === 0) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, sliders.length]);

  if (!config || sliders.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % sliders.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-lg w-full"
      style={{
        height: `${resolvedHeight}px`,
        minHeight: `${resolvedHeight}px`
      }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative w-full h-full">
        {sliders.map((slider, index) => (
          <div
            key={slider.id}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{
              opacity: index === activeSlide ? 1 : 0,
              visibility: index === activeSlide ? 'visible' : 'hidden',
            }}
          >
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={slider.image}
                alt={slider.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center z-10">
                <h2 className="text-white text-3xl md:text-5xl font-bold text-center mb-4 drop-shadow-lg">
                  {slider.title}
                </h2>
                {slider.subtitle && (
                  <p className="text-white text-lg md:text-2xl text-center mb-6 drop-shadow-lg">
                    {slider.subtitle}
                  </p>
                )}
                <button
                  className="px-8 py-3 rounded-lg font-bold text-white transition-all duration-300"
                  style={{
                    backgroundColor: config.colors.primary,
                    boxShadow: `0 0 20px ${config.colors.primary}40`,
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.boxShadow = `0 0 30px ${config.colors.primary}80`;
                    (e.target as HTMLElement).style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.boxShadow = `0 0 20px ${config.colors.primary}40`;
                    (e.target as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  {slider.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sliders.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
            aria-label="Next slide"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {sliders.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => {
                  setActiveSlide(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 8000);
                }}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    index === activeSlide ? config.colors.primary : 'rgba(255,255,255,0.5)',
                  width: index === activeSlide ? '24px' : '8px',
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UnifiedStoreSlider;
