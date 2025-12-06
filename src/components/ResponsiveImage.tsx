import React, { useEffect, useRef, useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Responsive image component with modern image formats support
 * Supports AVIF, WebP, and JPEG with automatic fallbacks
 * Uses Intersection Observer for lazy loading
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width = 1920,
  height = 1080,
  className,
  sizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1920px',
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const pictureRef = useRef<HTMLPictureElement>(null);

  const basename = src.replace(/\.[^/.]+$/, '');

  useEffect(() => {
    if (!pictureRef.current || priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = pictureRef.current?.querySelector('img') as HTMLImageElement;
            if (img) {
              img.src = `${basename}.jpg`;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    observer.observe(pictureRef.current);

    return () => {
      observer.disconnect();
    };
  }, [basename, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  return (
    <picture
      ref={pictureRef}
      className={`block ${className || ''}`}
    >
      <source
        srcSet={`${basename}.avif`}
        type="image/avif"
      />
      <source
        srcSet={`
          ${basename}-480w.webp 480w,
          ${basename}-768w.webp 768w,
          ${basename}-1024w.webp 1024w,
          ${basename}-1920w.webp 1920w
        `}
        sizes={sizes}
        type="image/webp"
      />
      <source
        srcSet={`
          ${basename}-480w.jpg 480w,
          ${basename}-768w.jpg 768w,
          ${basename}-1024w.jpg 1024w,
          ${basename}-1920w.jpg 1920w
        `}
        sizes={sizes}
        type="image/jpeg"
      />
      <img
        src={priority ? `${basename}.jpg` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e0e0e0" width="100" height="100"/%3E%3C/svg%3E'}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        className={`
          w-full h-auto
          ${isLoaded ? 'opacity-100' : 'opacity-50'}
          ${error ? 'bg-gray-200' : ''}
          transition-opacity duration-300
        `}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          aspectRatio: `${width}/${height}`,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </picture>
  );
};

export default ResponsiveImage;
