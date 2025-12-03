import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, MapPin, Navigation } from 'lucide-react';
import { getCityAreas, getCityById, libyanCities } from '@/data/libya/cities/cities';
import type { Area, City } from '@/data/libya/cities/cities';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

interface CityAreaSelectorProps {
  selectedCity: string;
  selectedArea: string;
  onCityChange: (cityId: string) => void;
  onAreaChange: (areaId: string) => void;
  onLocationDetected?: (location: LocationData) => void;
  className?: string;
  required?: boolean;
}

const CityAreaSelector: React.FC<CityAreaSelectorProps> = ({
  selectedCity,
  selectedArea,
  onCityChange,
  onAreaChange,
  onLocationDetected,
  className = '',
  required = false
}) => {
  const [availableAreas, setAvailableAreas] = useState<Area[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // تحديث المناطق عند تغيير المدينة
  useEffect(() => {
    if (selectedCity) {
      const areas = getCityAreas(selectedCity);

      // تحديث المناطق بشكل آمن
      setAvailableAreas(prev => {
        // تحقق من أن المناطق تغيرت فعلاً
        if (JSON.stringify(prev) === JSON.stringify(areas)) {
          return prev;
        }
        return areas;
      });

      // إذا لم تكن المنطقة المحددة متاحة في المدينة الجديدة، اعيد تعيينها
      if (selectedArea && !areas.find(area => area.id === selectedArea)) {
        onAreaChange('');
      }
    } else {
      setAvailableAreas([]);
      if (selectedArea) {
        onAreaChange('');
      }
    }
  }, [selectedCity, selectedArea, onAreaChange]);

  // إصلاح أيقونة Leaflet
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-shadow.png',
    });
  }, []);

  const handleCityChange = (cityId: string) => {
    // منع إعادة التحميل
    if (cityId === selectedCity) return;
    
    // تحديث المدينة والمنطقة بشكل آمن
    requestAnimationFrame(() => {
      onCityChange(cityId);
      onAreaChange(''); // إعادة تعيين المنطقة عند تغيير المدينة
    });
  };

  // وظيفة تحديد الموقع الحالي بـ GPS
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('متصفحك لا يدعم تحديد الموقع');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 دقائق
          }
        );
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      // محاولة الحصول على العنوان من الإحداثيات
      try {
        const response = await fetch(
          `https://api.openstreetmap.org/reverse?lat=${locationData.latitude}&lon=${locationData.longitude}&format=json&accept-language=ar,en`
        );
        const data = await response.json();
        
        if (data && data.display_name) {
          locationData.address = data.display_name;
        }
      } catch (geocodeError) {

      }

      setCurrentLocation(locationData);
      
      // إشعار الوالد بالموقع المكتشف
      if (onLocationDetected) {
        onLocationDetected(locationData);
      }

      // محاولة تحديد المدينة والمنطقة تلقائياً بناءً على الموقع
      if (locationData.address) {
        const addressLower = locationData.address.toLowerCase();
        
        // البحث عن مدينة مطابقة في قائمة المدن الليبية
        const matchedCity = libyanCities.find(city => 
          addressLower.includes(city.name.toLowerCase()) || 
          city.name.toLowerCase().includes('طرابلس') && addressLower.includes('tripoli')
        );

        if (matchedCity && matchedCity.id !== selectedCity) {
          onCityChange(matchedCity.id);
        }
      }

    } catch (error) {

      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('تم رفض الإذن للوصول للموقع. يرجى السماح للموقع بالوصول لموقعك.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('لا يمكن تحديد موقعك حالياً. تأكد من تفعيل GPS.');
            break;
          case error.TIMEOUT:
            setLocationError('انتهت مهلة تحديد الموقع. يرجى المحاولة مرة أخرى.');
            break;
          default:
            setLocationError('حدث خطأ غير معروف في تحديد الموقع.');
        }
      } else {
        setLocationError('حدث خطأ في تحديد الموقع. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${className}`} style={{ minHeight: '120px', background: 'transparent' }}>
      {/* اختيار المدينة */}
      <div className="space-y-2">
        <Label htmlFor="city-select">
          المدينة {required && <span className="text-red-500">*</span>}
        </Label>
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger id="city-select">
            <SelectValue placeholder="اختر المدينة" />
          </SelectTrigger>
          <SelectContent>
            {libyanCities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* اختيار المنطقة */}
      <div className="space-y-2">
        <Label htmlFor="area-select">
          المنطقة {required && <span className="text-red-500">*</span>}
        </Label>
        <Select 
          value={selectedArea} 
          onValueChange={onAreaChange}
        >
          <SelectTrigger id="area-select" disabled={!selectedCity || availableAreas.length === 0}>
            <SelectValue 
              placeholder={
                !selectedCity 
                  ? "اختر المدينة أولاً" 
                  : availableAreas.length === 0 
                  ? "لا توجد مناطق متاحة" 
                  : "اختر المنطقة"
              } 
            />
          </SelectTrigger>
          <SelectContent>
            {availableAreas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* تحديد الموقع بـ GPS */}
      <div className="col-span-full">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">تحديد الموقع التلقائي</h3>
              <p className="text-sm text-slate-600">استخدم GPS لتحديد موقعك تلقائياً</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 min-w-0 flex-1 sm:flex-initial sm:min-w-[200px]">
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="w-full sm:w-auto"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  جاري التحديد...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  تحديد موقعي
                </>
              )}
            </Button>
            
            {currentLocation && (
              <Badge variant="secondary" className="text-xs w-full sm:w-auto justify-center">
                <CheckCircle className="h-3 w-3 ml-1" />
                تم تحديد الموقع
              </Badge>
            )}
          </div>
        </div>

        {/* عرض معلومات الموقع */}
        {currentLocation && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-green-800 mb-1">تم تحديد موقعك بنجاح</p>
                <div className="text-xs text-green-700 space-y-1">
                  <p>خط الطول: {currentLocation.longitude.toFixed(6)}</p>
                  <p>خط العرض: {currentLocation.latitude.toFixed(6)}</p>
                  <p>الدقة: {Math.round(currentLocation.accuracy)} متر</p>
                  {currentLocation.address && (
                    <p className="break-words">العنوان: {currentLocation.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* عرض الخريطة */}
        {currentLocation && (
          <div className="col-span-full mt-4">
            <MapContainer center={[currentLocation.latitude, currentLocation.longitude]} zoom={13} style={{ height: '300px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
                <Popup>
                  موقعك: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* عرض رسالة الخطأ */}
        {locationError && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">فشل في تحديد الموقع</p>
                <p className="text-xs text-red-700">{locationError}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* معلومات إضافية للمطورين */}
      {process.env.NODE_ENV === 'development' && selectedCity && (
        <div className="col-span-full text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>معلومات التطوير:</strong>
          <br />
          المدينة المحددة: {getCityById(selectedCity)?.name || 'غير معروف'}
          <br />
          المناطق المتاحة: {availableAreas.length}
          {selectedArea && (
            <>
              <br />
              المنطقة المحددة: {availableAreas.find(a => a.id === selectedArea)?.name || 'غير معروف'}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CityAreaSelector;
