import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  MapPin,
  ShoppingCart,
  Upload,
  X,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { storeBusinessCategories } from '@/data/storeBusinessCategories';

interface StoreWizardData {
  nameAr: string;
  nameEn: string;
  description: string;
  logo: string | null;
  logoFile: File | null;
  category: string;
  latitude: number | null;
  longitude: number | null;
  warehouseChoice: 'personal' | 'platform' | 'both';
}

interface CreateStoreWizardProps {
  onBack: () => void;
  onComplete: (data: StoreWizardData & { merchantEmail: string; merchantPhone: string }) => void;
  merchantEmail: string;
  merchantPhone: string;
}

const CreateStoreWizard: React.FC<CreateStoreWizardProps> = ({
  onBack,
  onComplete,
  merchantEmail,
  merchantPhone
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StoreWizardData>({
    nameAr: '',
    nameEn: '',
    description: '',
    logo: null,
    logoFile: null,
    category: '',
    latitude: null,
    longitude: null,
    warehouseChoice: 'both'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMap, setShowMap] = useState(false);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nameAr.trim()) newErrors.nameAr = 'اسم المتجر بالعربية مطلوب';
    if (!formData.nameEn.trim()) newErrors.nameEn = 'اسم المتجر بالإنجليزية مطلوب';
    if (!formData.description.trim()) newErrors.description = 'الوصف مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (!formData.logo) {
      setErrors({ logo: 'شعار المتجر مطلوب' });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.category) {
      setErrors({ category: 'اختيار النشاط التجاري مطلوب' });
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!formData.latitude || !formData.longitude) {
      setErrors({ location: 'تحديد موقع المخزن مطلوب' });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();
    else if (currentStep === 4) isValid = validateStep4();

    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
      setErrors({});
    }
  };

  const handleComplete = () => {
    onComplete({
      ...formData,
      merchantEmail,
      merchantPhone
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          logo: event.target?.result as string,
          logoFile: file
        }));
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, logo: '' }));
    }
  };

  const handleMapClick = () => {
    setShowMap(!showMap);
  };

  const handleCoordinatesSet = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
    setErrors(prev => ({ ...prev, location: '' }));
    setShowMap(false);
  };

  const progress = ((currentStep - 1) / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* الهيدر */}
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            العودة
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">إنشاء متجرك</h1>
          <div className="w-20"></div>
        </div>

        {/* شريط التقدم */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">الخطوة {currentStep} من 4</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* بطاقة الخطوة */}
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-lg font-bold">
                {currentStep}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {currentStep === 1 && 'معلومات المتجر الأساسية'}
                  {currentStep === 2 && 'شعار المتجر'}
                  {currentStep === 3 && 'النشاط التجاري'}
                  {currentStep === 4 && 'موقع المخزن'}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {currentStep === 1 && 'أدخل اسم ووصف متجرك'}
                  {currentStep === 2 && 'أضف شعار متجرك'}
                  {currentStep === 3 && 'اختر نشاط متجرك التجاري'}
                  {currentStep === 4 && 'حدد موقع مخزنك أو اختر من مخازن المنصة'}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* الخطوة 1: معلومات المتجر */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="nameAr" className="text-sm font-semibold">اسم المتجر (عربي) *</Label>
                  <Input
                    id="nameAr"
                    placeholder="مثال: متجري الرائع"
                    value={formData.nameAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    className="mt-2 rtl"
                  />
                  {errors.nameAr && <p className="text-red-500 text-sm mt-1">{errors.nameAr}</p>}
                </div>

                <div>
                  <Label htmlFor="nameEn" className="text-sm font-semibold">اسم المتجر (إنجليزي) *</Label>
                  <Input
                    id="nameEn"
                    placeholder="Example: My Store"
                    value={formData.nameEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                    className="mt-2"
                  />
                  {errors.nameEn && <p className="text-red-500 text-sm mt-1">{errors.nameEn}</p>}
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-semibold">وصف المتجر *</Label>
                  <Textarea
                    id="description"
                    placeholder="صف متجرك وخدماتك بكلمات قليلة..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="mt-2 rtl"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            )}

            {/* الخطوة 2: الشعار */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <Label className="text-sm font-semibold mb-3 block">شعار المتجر (الصورة) *</Label>
                  
                  {formData.logo ? (
                    <div className="relative w-48 h-48 mx-auto mb-4">
                      <img
                        src={formData.logo}
                        alt="شعار المتجر"
                        className="w-full h-full object-cover rounded-lg border-2 border-primary"
                      />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, logo: null, logoFile: null }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        title="إزالة الشعار"
                        aria-label="إزالة الشعار"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-primary/5 hover:border-primary/50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label="تحميل شعار المتجر"
                        title="اختر صورة الشعار"
                      />
                      <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-gray-700 font-semibold">اسحب الصورة هنا أو انقر لتحديد</p>
                      <p className="text-gray-500 text-sm mt-1">صيغ مدعومة: PNG, JPG, WebP</p>
                    </div>
                  )}
                  {errors.logo && <p className="text-red-500 text-sm mt-2">{errors.logo}</p>}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">استخدم صورة عالية الجودة بحجم 400x400 بكسل أو أكبر للحصول على أفضل النتائج</p>
                </div>
              </div>
            )}

            {/* الخطوة 3: النشاط التجاري */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="category" className="text-sm font-semibold mb-3 block">اختر نشاط متجرك التجاري *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {storeBusinessCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.category === cat.id
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{cat.name}</p>
                            <p className="text-xs text-gray-600 mt-1">{cat.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
                </div>
              </div>
            )}

            {/* الخطوة 4: الموقع */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <Label className="text-sm font-semibold mb-3 block">اختر موقع مخزنك *</Label>

                  <div className="space-y-3">
                    {/* خيار المخزن الشخصي */}
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, warehouseChoice: 'personal' }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.warehouseChoice === 'personal'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-gray-900">مخزن شخصي</p>
                          <p className="text-sm text-gray-600">حدد موقع مخزنك على الخريطة</p>
                        </div>
                      </div>
                    </button>

                    {formData.warehouseChoice === 'personal' && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        {formData.latitude && formData.longitude && (
                          <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                            <p className="text-green-800 font-semibold">✓ تم تحديد الموقع</p>
                            <p className="text-green-700 text-xs mt-1">الإحداثيات: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</p>
                          </div>
                        )}
                        <Button
                          onClick={handleMapClick}
                          variant="outline"
                          className="w-full"
                        >
                          <MapPin className="h-4 w-4 ml-2" />
                          {showMap ? 'إغلاق الخريطة' : 'فتح الخريطة'}
                        </Button>

                        {showMap && (
                          <OpenStreetMapPicker onSelectLocation={handleCoordinatesSet} />
                        )}
                      </div>
                    )}

                    {/* خيار مخازن المنصة */}
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, warehouseChoice: 'platform' }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.warehouseChoice === 'platform'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-gray-900">مخازن المنصة</p>
                          <p className="text-sm text-gray-600">استخدم مخازن إشرو الموزعة</p>
                        </div>
                      </div>
                    </button>

                    {/* خيار الاثنين */}
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, warehouseChoice: 'both' }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.warehouseChoice === 'both'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-gray-900">المرونة الكاملة</p>
                          <p className="text-sm text-gray-600">استخدم مخزنك الشخصي ومخازن المنصة معاً</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {errors.location && <p className="text-red-500 text-sm mt-3">{errors.location}</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* الأزرار */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              السابق
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
          >
            {currentStep === 4 ? (
              <>
                <CheckCircle className="h-4 w-4" />
                إنشاء المتجر
              </>
            ) : (
              <>
                التالي
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// مكون الخريطة التفاعلية باستخدام OpenStreetMap
const OpenStreetMapPicker: React.FC<{ onSelectLocation: (lat: number, lng: number) => void }> = ({ onSelectLocation }) => {
  const defaultCenter: [number, number] = [32.8872, 13.1913]; // Tripoli, Libya
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);

  // مكون للتعامل مع النقر على الخريطة
  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setSelectedPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return selectedPosition === null ? null : (
      <Marker position={selectedPosition}>
        <Popup>
          <div className="text-center">
            <p className="font-semibold">الموقع المحدد</p>
            <p className="text-sm">خط العرض: {selectedPosition[0].toFixed(4)}</p>
            <p className="text-sm">خط الطول: {selectedPosition[1].toFixed(4)}</p>
            <Button
              onClick={() => onSelectLocation(selectedPosition[0], selectedPosition[1])}
              size="sm"
              className="mt-2 w-full"
            >
              <CheckCircle className="h-3 w-3 ml-1" />
              تأكيد هذا الموقع
            </Button>
          </div>
        </Popup>
      </Marker>
    );
  };

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="text-sm font-semibold text-gray-900 mb-2">اختر موقعك على الخريطة</p>
        <p className="text-xs text-gray-600">انقر على الموقع المطلوب على الخريطة لتحديده</p>
      </div>

      <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={defaultCenter}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          className="leaflet-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
      </div>

      {selectedPosition && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p className="text-sm font-semibold text-green-800">تم تحديد الموقع</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">خط العرض:</span>
              <span className="font-mono ml-1">{selectedPosition[0].toFixed(4)}</span>
            </div>
            <div>
              <span className="text-gray-600">خط الطول:</span>
              <span className="font-mono ml-1">{selectedPosition[1].toFixed(4)}</span>
            </div>
          </div>
          <Button
            onClick={() => onSelectLocation(selectedPosition[0], selectedPosition[1])}
            size="sm"
            className="w-full mt-2 bg-primary hover:bg-primary/90"
          >
            <CheckCircle className="h-3 w-3 ml-1" />
            تأكيد الموقع النهائي
          </Button>
        </div>
      )}

      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>نصيحة:</strong> تأكد من تحديد الموقع بدقة لتسهيل عملية التوصيل
        </p>
      </div>
    </div>
  );
};

export default CreateStoreWizard;
