import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  Bell, 
  Mail, 
  MessageCircle, 
  Phone,
  Check,
  Plus,
  Minus,
  CheckCircle,
  Smartphone
} from 'lucide-react';
import type { Product } from '@/data/storeProducts';
import {
  PRODUCT_IMAGE_FALLBACK_SRC,
  advanceImageOnError,
  buildProductMediaConfig,
  getImageMimeType
} from '@/lib/utils';

interface EnhancedNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSubmit: (notificationData: NotificationRequest) => void;
}

interface NotificationRequest {
  productId: number;
  productName: string;
  customerName: string;
  phone: string;
  email?: string;
  notificationMethods: string[];
  quantity: number;
}

const EnhancedNotifyModal: React.FC<EnhancedNotifyModalProps> = ({
  isOpen,
  onClose,
  product,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1); // 1 = نموذج التسجيل، 2 = شاشة التأكيد
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    notificationMethods: [] as string[],
    quantity: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaConfig = useMemo(
    () => buildProductMediaConfig(product, PRODUCT_IMAGE_FALLBACK_SRC),
    [product]
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim()) {
      alert('يرجى إدخال الاسم الكامل');
      return;
    }

    if (!formData.phone.trim()) {
      alert('يرجى إدخال رقم الهاتف');
      return;
    }

    if (formData.notificationMethods.length === 0) {
      alert('يرجى اختيار طريقة واحدة على الأقل للإشعار');
      return;
    }

    setIsSubmitting(true);

    try {
      const notificationData: NotificationRequest = {
        productId: product.id,
        productName: product.name,
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        notificationMethods: formData.notificationMethods,
        quantity: formData.quantity
      };

      // محاكاة إرسال الطلب
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSubmit(notificationData);
      setCurrentStep(2); // الانتقال لشاشة التأكيد
      
    } catch (error) {
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleNotificationMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      notificationMethods: prev.notificationMethods.includes(method)
        ? prev.notificationMethods.filter(m => m !== method)
        : [...prev.notificationMethods, method]
    }));
  };

  const updateQuantity = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta)
    }));
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      notificationMethods: [],
      quantity: 1
    });
    onClose();
  };

  // الشاشة الأولى - نموذج التسجيل (كما في الصورة 255)
  if (currentStep === 1) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">نبهني عند التوفر</h2>
              
              {/* صورة المنتج */}
              <div className="mb-4">
                <picture>
                  {mediaConfig.pictureSources.map((src) => {
                    const type = getImageMimeType(src);
                    return <source key={src} srcSet={src} {...(type ? { type } : {})} />;
                  })}
                  <img
                    src={mediaConfig.primary}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg mx-auto"
                    data-image-sources={JSON.stringify(mediaConfig.datasetSources)}
                    data-image-index="0"
                    data-fallback-src={PRODUCT_IMAGE_FALLBACK_SRC}
                    onError={advanceImageOnError}
                  />
                </picture>
              </div>
              
              {/* اسم المنتج */}
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              
              {/* السعر */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-lg font-bold text-gray-900">{product.price} د.ل</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice} د.ل</span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* الاسم بالكامل */}
              <div>
                <Input
                  type="text"
                  placeholder="الاسم بالكامل"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* رقم الهاتف */}
              <div>
                <Input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* الكمية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الكمية:</label>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(-1)}
                    className="w-8 h-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[2rem] text-center">
                    {formData.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(1)}
                    className="w-8 h-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* نوع الإشعار */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">نوع الإشعار:</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notificationMethods.includes('email')}
                      onChange={() => toggleNotificationMethod('email')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">📧 بريد إلكتروني</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notificationMethods.includes('sms')}
                      onChange={() => toggleNotificationMethod('sms')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Smartphone className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">📱 رسالة نصية</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notificationMethods.includes('whatsapp')}
                      onChange={() => toggleNotificationMethod('whatsapp')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <MessageCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">📲 واتساب</span>
                  </label>
                </div>
              </div>

              {/* أزرار العمل */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'جاري التسجيل...' : '🔔 نبهني عند التوفر'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="px-6"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // الشاشة الثانية - تأكيد التسجيل (كما في الصورة 256)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center">
            {/* صورة المنتج */}
            <div className="mb-4">
              <picture>
                {mediaConfig.pictureSources.map((src) => {
                  const type = getImageMimeType(src);
                  return <source key={src} srcSet={src} {...(type ? { type } : {})} />;
                })}
                <img
                  src={mediaConfig.primary}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg mx-auto"
                  data-image-sources={JSON.stringify(mediaConfig.datasetSources)}
                  data-image-index="0"
                  data-fallback-src={PRODUCT_IMAGE_FALLBACK_SRC}
                  onError={advanceImageOnError}
                />
              </picture>
            </div>
            
            {/* اسم المنتج */}
            <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
            
            {/* حالة عدم التوفر */}
            <div className="text-red-600 font-medium mb-4">غير متوفر حالياً</div>
            
            {/* رسالة النجاح */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-green-600 mb-2">تم التسجيل بنجاح !</h4>
              <p className="text-sm text-gray-700 mb-4">
                شكراً لك ! سنرسل لك إشعاراً فور توفر هذا المنتج في أقرب وقت ممكن
              </p>
              <p className="text-xs text-gray-600">
                يمكنك متابعة جميع طلبات الإشعارات الخاصة بك من حسابك الشخصي
              </p>
            </div>

            {/* أزرار العمل */}
            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Bell className="h-4 w-4 mr-2" />
                🔔 تابع عند التوفر
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-6"
              >
                <X className="h-4 w-4 mr-2" />
                ❌ إغلاق
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedNotifyModal;
