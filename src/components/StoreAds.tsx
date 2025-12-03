import React, { useState, useEffect } from 'react';

interface Ad {
  id: string;
  templateId: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  placement?: 'banner' | 'between_products';
  createdAt: string;
  views: number;
  clicks: number;
}

interface StoreAdsProps {
  storeId?: string | number;
  className?: string;
}

const StoreAds: React.FC<StoreAdsProps> = ({ storeId, className = '' }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [bannerAds, setBannerAds] = useState<Ad[]>([]);
  const [betweenProductsAds, setBetweenProductsAds] = useState<Ad[]>([]);

  useEffect(() => {
    loadAds();

    const handleAdsUpdate = (event: CustomEvent) => {
      loadAds();
    };

    window.addEventListener('storeAdsUpdated', handleAdsUpdate as EventListener);

    return () => {
      window.removeEventListener('storeAdsUpdated', handleAdsUpdate as EventListener);
    };
  }, [storeId]);

  const loadAds = async () => {
    try {
      if (storeId) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/ads/store/${storeId}`);
        if (response.ok) {
          const result = await response.json();
          const activeAds = result.data.filter((ad: Ad) => ad.isActive);
          setAds(activeAds);
          setBannerAds(activeAds.filter(ad => ad.placement === 'banner' || !ad.placement));
          setBetweenProductsAds(activeAds.filter(ad => ad.placement === 'between_products'));
          localStorage.setItem(`eshro_store_ads_${storeId}`, JSON.stringify(activeAds));
          return;
        }
      }
    } catch (error) {
      console.error('Error loading ads from API:', error);
    }

    const storageKey = `eshro_store_ads_${storeId}`;
    const savedAds = localStorage.getItem(storageKey);
    if (savedAds) {
      try {
        const parsedAds = JSON.parse(savedAds);
        const activeAds = parsedAds.filter((ad: Ad) => ad.isActive);
        setAds(activeAds);
        setBannerAds(activeAds.filter(ad => ad.placement === 'banner' || !ad.placement));
        setBetweenProductsAds(activeAds.filter(ad => ad.placement === 'between_products'));
      } catch (error) {
        console.error('Error parsing saved ads:', error);
      }
    }
  };

  const handleAdClick = (ad: Ad) => {
    if (ad.linkUrl) {
      if (ad.linkUrl.startsWith('http')) {
        window.open(ad.linkUrl, '_blank');
      } else {
        window.location.href = ad.linkUrl;
      }
    }
  };

  if (bannerAds.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {bannerAds.length > 0 && (
        <div className="space-y-4">
          {bannerAds.map((ad) => (
            <div
              key={ad.id}
              className="relative w-full h-40 md:h-48 lg:h-56 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleAdClick(ad)}
            >
              {ad.imageUrl ? (
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-200">
                  <div className="text-center text-white">
                    <div className="text-sm md:text-base font-semibold mb-2">{ad.title}</div>
                    <div className="text-xs md:text-sm opacity-90">{ad.description}</div>
                  </div>
                </div>
              )}

              {ad.imageUrl && (
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-center text-white">
                    <h3 className="font-bold text-lg md:text-xl mb-1">{ad.title}</h3>
                    {ad.description && (
                      <p className="text-sm md:text-base opacity-90 px-4 line-clamp-2">{ad.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {betweenProductsAds.length > 0 && (
        <div className="space-y-4" data-placement="between-products">
          {betweenProductsAds.map((ad) => (
            <div
              key={ad.id}
              className="w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleAdClick(ad)}
            >
              <div className="flex flex-col md:flex-row items-center p-4 md:p-6 gap-4">
                {ad.imageUrl && (
                  <div className="w-full md:w-32 h-32 md:h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="flex-1 text-center md:text-right">
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base mb-1">{ad.title}</h4>
                  {ad.description && (
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2">{ad.description}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition">
                    عرض
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreAds;
