import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle, 
  Store, 
  ShoppingBag, 
  Star,
  Gift,
  ArrowRight,
  Sparkles,
  Trophy
} from 'lucide-react';

interface StoreCreatedSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  onStartDashboard: () => void;
}

const StoreCreatedSuccessModal: React.FC<StoreCreatedSuccessModalProps> = ({
  isOpen,
  onClose,
  storeName,
  onStartDashboard
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isOpen) return null;

  const handleStartDashboard = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onStartDashboard();
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4" style={{backdropFilter: 'blur(4px)'}}>
      <Card className="max-w-lg w-full shadow-2xl border-0 animate-in zoom-in-95 duration-500 overflow-hidden">
        
        {/* Header بالخلفية المتدرجة */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-8 text-center relative overflow-hidden">
          
          {/* تأثيرات متحركة */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            {/* أيقونة النجاح */}
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            
            {/* العنوان الرئيسي */}
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6" />
              مبروك عليك!
              <Trophy className="h-6 w-6" />
            </h2>
            
            {/* اسم المتجر */}
            <h3 className="text-3xl font-black text-white mb-3 drop-shadow-lg">
              متجر "{storeName}"
            </h3>
            
            <p className="text-white/90 text-lg font-semibold">
              تم إنشاؤه بنجاح! 🎉
            </p>
          </div>
        </div>

        <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
          {/* رسالة الترحيب */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-bold text-gray-800">أهلاً وسهلاً بك في عائلة إشرو!</span>
              <Sparkles className="h-6 w-6 text-orange-500" />
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-4">
              متجرك الآن جاهز للانطلاق! يمكنك البدء في إضافة منتجاتك وإدارة طلباتك من لوحة التحكم الشاملة.
            </p>

            {/* المزايا */}
            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Store className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">متجر احترافي</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">إدارة سهلة</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">مكافآت حصرية</p>
              </div>
            </div>
          </div>

          {/* الإجراءات */}
          <div className="space-y-3">
            <Button
              onClick={handleStartDashboard}
              disabled={isAnimating}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              {isAnimating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري التحميل...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Store className="h-6 w-6" />
                  ادخل لوحة التحكم
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 py-3 rounded-xl"
            >
              إغلاق
            </Button>
          </div>

          {/* شعار إشرو */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2">
              <img 
                src="/eshro-new-logo.png" 
                alt="إشرو" 
                className="h-8 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-sm text-gray-500 font-medium">منصة إشرو للتجارة الإلكترونية</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreCreatedSuccessModal;
