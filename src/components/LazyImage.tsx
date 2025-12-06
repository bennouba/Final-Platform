import React, { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  width?: number;
  height?: number;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Lazy loading image component using Intersection Observer API
 * Defers image loading until they're within the viewport
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e0e0e0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ELoading...%3C/text%3E%3C/svg%3E',
  width,
  height,
  className,
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = src;

            img.onload = () => {
              setIsLoaded(true);
              setImageSrc(src);
              onLoad?.();
            };

            img.onerror = () => {
              setError(true);
              onError?.();
            };

            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src, onLoad, onError]);

  return (
    <img
      ref={imgRef}
      src={placeholder}
      alt={alt}
      width={width}
      height={height}
      className={`
        ${className || ''} 
        ${isLoaded ? 'opacity-100' : 'opacity-50'} 
        ${error ? 'opacity-50 bg-gray-200' : ''}
        transition-opacity duration-300
      `}
      style={{
        transition: 'opacity 0.3s ease-in-out',
      }}
      onError={(e) => {
        setError(true);
        onError?.();
      }}
    />
  );
};

export default LazyImage;
