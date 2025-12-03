import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Award,
  Bell,
  Calendar,
  CheckCircle,
  DollarSign,
  Gift,
  Heart,
  Package,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap
} from 'lucide-react';

interface MerchantWelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  storeData: any;
  loginHistory: any[];
}

const MerchantWelcomePopup: React.FC<MerchantWelcomePopupProps> = ({
  isOpen,
  onClose,
  storeData,
  loginHistory
}) => {
  // Get business type display name
  const getBusinessTypeDisplay = (businessType: string) => {
    const businessTypes: Record<string, string> = {
      'beauty': 'الجمال والعناية',
      'fashion': 'الأزياء والملابس',
      'electronics': 'الإلكترونيات والأجهزة',
      'cleaning': 'مواد التنظيف',
      'food': 'المواد الغذائية',
      'sports': 'الرياضة واللياقة',
      'home': 'المنزل والحديقة',
      'books': 'الكتب والقرطاسية',
      'automotive': 'السيارات والدراجات',
      'jewelry': 'المجوهرات والإكسسوارات',
      'toys': 'الألعاب والهوايات',
      'health': 'الصحة والعلاج'
    };
    return businessTypes[businessType] || businessType;
  };
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  interface Step { title: string; subtitle: string; content: React.ReactNode; }

  const steps: Step[] = [
    {
      title: '🎉 مرحباً بك في عائلة إشرو!',
      subtitle: `أهلاً ${storeData.ownerName}`,
      content: (
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-primary via-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
              <Rocket className="h-12 w-12 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xl text-gray-700 font-bold">
              تم إنشاء متجرك <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent text-2xl">{storeData.nameAr}</span> بنجاح! 🎊
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                🎯 <strong>نشاط متجرك:</strong> {getBusinessTypeDisplay(storeData.businessType || 'لم يتم تحديد النشاط')}
              </p>
            </div>
            <p className="text-gray-600 text-lg">
              الآن أنت جزء من أكبر منصة تجارة إلكترونية في ليبيا 🚀
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-gray-700">
                🎯 <strong>رؤيتنا:</strong> مساعدتك في الوصول لعملاء جدد وزيادة مبيعاتك
              </p>
              <p className="text-sm text-gray-700 mt-2">
                💪 <strong>قوتنا:</strong> تقنية متقدمة ودعم فني على مدار 24 ساعة
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '📊 إحصائيات متجرك الأولية',
      subtitle: `مرحباً ${storeData.ownerName} - ابدأ رحلتك معنا`,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-gray-700 font-medium">
              متجر <span className="font-bold text-primary">{storeData.nameAr}</span> جاهز للانطلاق! 🚀
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <Package className="h-8 w-8 text-green-500 mx-auto mb-2 animate-pulse" />
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">المنتجات</p>
                <p className="text-xs text-green-500 mt-1">أضف منتجاتك الأولى</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-pulse" />
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">العملاء</p>
                <p className="text-xs text-blue-500 mt-1">انتظر زبائنك الأوائل</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2 animate-pulse" />
                <p className="text-2xl font-bold text-purple-600">0 د.ل</p>
                <p className="text-sm text-gray-600">الإيرادات</p>
                <p className="text-xs text-purple-500 mt-1">ابدأ في كسب المال</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-orange-500 mx-auto mb-2 animate-pulse" />
                <p className="text-2xl font-bold text-orange-600">0%</p>
                <p className="text-sm text-gray-600">معدل التحويل</p>
                <p className="text-xs text-orange-500 mt-1">حول الزوار لعملاء</p>
              </CardContent>
            </Card>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700 text-center">
              💡 <strong>نصيحة:</strong> ابدأ بإضافة 5-10 منتجات مميزة لجذب العملاء الأوائل
            </p>
          </div>
        </div>
      )
    },
    {
      title: '🎯 خطوات البدء السريع',
      subtitle: `خطة عمل لمتجر ${storeData.nameAr}`,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-green-900">أضف منتجاتك الأولى 🛍️</p>
              <p className="text-sm text-green-700">ابدأ بإضافة 5-10 منتجات مميزة مع صور احترافية</p>
              <p className="text-xs text-green-600 mt-1">• اختر منتجات متنوعة • أضف أسعار تنافسية • استخدم وصف مفصل</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center animate-bounce delay-[200ms]">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-blue-900">خصص متجرك 🎨</p>
              <p className="text-sm text-blue-700">أضف شعارك وصور المتجر لجعله مميزاً</p>
              <p className="text-xs text-blue-600 mt-1">• ارفع شعار عالي الجودة • أضف صور للمتجر • اختر ألوان تعكس هويتك</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center animate-bounce delay-[400ms]">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-purple-900">شارك رابط متجرك 📢</p>
              <p className="text-sm text-purple-700">انشر متجرك على وسائل التواصل وابدأ في استقبال الطلبات</p>
              <p className="text-xs text-purple-600 mt-1">• شارك على فيسبوك وإنستغرام • أرسل لأصدقائك • استخدم كوبونات الخصم</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-700 text-center font-medium">
              🚀 <strong>هدفك الأول:</strong> 10 طلبات في الأسبوع الأول!
            </p>
          </div>
        </div>
      )
    },
    {
      title: '🎁 هدايا البدء مع إشرو',
      subtitle: 'مميزات حصرية للتجار الجدد',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <Gift className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="font-bold text-yellow-900">7 أيام مجانية كاملة</p>
              <p className="text-sm text-yellow-700">استمتع بجميع مميزات المنصة مجاناً</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <Award className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-bold text-blue-900">دعم فني على مدار 24 ساعة</p>
              <p className="text-sm text-blue-700">فريقنا جاهز لمساعدتك في أي وقت</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <Sparkles className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-bold text-green-900">أدوات تسويق مجانية</p>
              <p className="text-sm text-green-700">كوبونات وأدوات ترويج لعملائك</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '🎁 هدايا البدء مع إشرو',
      subtitle: 'مميزات حصرية للتجار الجدد',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <Gift className="h-8 w-8 text-yellow-600 animate-bounce" />
            <div>
              <p className="font-bold text-yellow-900">7 أيام مجانية كاملة 🆓</p>
              <p className="text-sm text-yellow-700">استمتع بجميع مميزات المنصة مجاناً</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <Award className="h-8 w-8 text-blue-600 animate-pulse" />
            <div>
              <p className="font-bold text-blue-900">دعم فني على مدار 24 ساعة 👨‍💻</p>
              <p className="text-sm text-blue-700">فريقنا جاهز لمساعدتك في أي وقت</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <Sparkles className="h-8 w-8 text-green-600 animate-pulse delay-[500ms]" />
            <div>
              <p className="font-bold text-green-900">أدوات تسويق مجانية </p>
              <p className="text-sm text-green-700">كوبونات وعروض لجذب العملاء</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-700 text-center font-medium">
              📞 <strong>تواصل معنا:</strong> 00218928829999 | hi@eshro.ly
            </p>
            <p className="text-xs text-gray-600 text-center mt-1">
              نحن هنا لنجاحك! 💪
            </p>
          </div>
        </div>
      )
    },
    {
      title: '📈 تاريخ تسجيل الدخول',
      subtitle: `آخر مرات الدخول لمتجر ${storeData.nameAr}`,
      content: (
        <div className="space-y-3">
          <div className="text-center mb-4">
            <p className="text-gray-700 font-medium">
              تتبع نشاط متجرك وتسجيلات الدخول 📊
            </p>
          </div>
          {loginHistory.slice(0, 5).map((login, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{storeData.ownerName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(login.time).toLocaleDateString('ar-LY', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                تسجيل دخول ✅
              </Badge>
            </div>
          ))}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-3 rounded-lg border border-primary/20">
            <p className="text-sm text-gray-700 text-center">
              🎯 <strong>نصيحة:</strong> قم بتسجيل الدخول يومياً لمتابعة أداء متجرك
            </p>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Guard against out-of-range index to satisfy strict checks
  const step: Step = steps[currentStep] ?? steps[0] ?? { title: "", subtitle: "", content: null };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white relative">
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="text-center">
            <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
            <p className="text-white/90">{step.subtitle}</p>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <Progress value={(currentStep + 1) / steps.length * 100} className="h-2" />
            <p className="text-xs text-white/80 mt-1 text-center">
              {currentStep + 1} من {steps.length}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-96">
          {step.content}
        </CardContent>

        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            السابق
          </Button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextStep}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircle className="h-4 w-4" />
                ابدأ الآن
              </>
            ) : (
              <>
                التالي
                <TrendingUp className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MerchantWelcomePopup;
