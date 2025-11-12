import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  X,
  Gift,
  Copy,
  Check,
  Bell,
  Trophy,
  Star,
  Mail,
  Phone,
  User
} from 'lucide-react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: (couponData: any) => void;
}

const SESSION_COUPON_KEY = 'eshro_reward_session_code';
const COUPON_DATA_KEY = 'eshro_reward_coupon_data';
const USER_COUPON_STORAGE_KEY = 'eshro_user_coupon';

const WelcomePopup: React.FC<WelcomePopupProps> = ({
  isOpen,
  onClose,
  onRegistrationComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCouponCode = () => {
    // توليد كود ديناميكي يتغير كل مرة
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const prefix = 'ESHRO-';
    const suffix = '-WLC' + Date.now().toString().slice(-4);
    let randomPart = '';
    
    // توليد الجزء الأوسط عشوائياً
    for (let i = 0; i < 8; i++) {
      randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return prefix + randomPart + suffix;
  };

  const handleRegistration = () => {
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const normalizedPhone = formData.phone.trim();

    if (!trimmedName || !trimmedEmail || !normalizedPhone) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      alert('يرجى إدخال رقم الهاتف بالصيغة الصحيحة: 09XXXXXXXX');
      return;
    }

    const activeCode = couponCode || generateCouponCode();
    const couponPayload = {
      code: activeCode,
      discount: 50,
      minAmount: 0,
      user: {
        name: trimmedName,
        phone: normalizedPhone,
        email: trimmedEmail
      },
      createdAt: new Date().toISOString(),
      expiryHours: 24
    };

    setCouponCode(activeCode);

    const serialized = JSON.stringify(couponPayload);
    localStorage.setItem(USER_COUPON_STORAGE_KEY, serialized);
    localStorage.setItem(COUPON_DATA_KEY, serialized);
    sessionStorage.setItem(USER_COUPON_STORAGE_KEY, serialized);
    sessionStorage.setItem(COUPON_DATA_KEY, serialized);
    sessionStorage.setItem(SESSION_COUPON_KEY, activeCode);

    onRegistrationComplete(couponPayload);
    sendWelcomeEmail(couponPayload.user, activeCode);
    setCurrentStep(2);
  };

  const handleCopyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('فشل في نسخ الكوبون:', err);
    }
  };

  const handleStartShopping = () => {
    console.log('handleStartShopping called - closing welcome popup');
    if (typeof window !== 'undefined') {
      localStorage.setItem('eshro_logged_in_as_visitor', 'false');
      sessionStorage.setItem('eshro_logged_in_as_visitor', 'false');
    }
    onClose();
  };

  // دالة إرسال البريد الإلكتروني (محاكاة)
  const sendWelcomeEmail = async (userData: any, couponCode: string) => {
    try {
      // محاكاة إرسال البريد الإلكتروني
      console.log('إرسال بريد إلكتروني إلى:', userData.email);
      console.log('الكوبون:', couponCode);
      console.log('البيانات:', userData);
      
      // هنا يمكن إضافة تكامل مع خدمة إرسال البريد الإلكتروني
      // مثل EmailJS أو خدمة أخرى
      
      return true;
    } catch (error) {
      console.error('فشل في إرسال البريد الإلكتروني:', error);
      return false;
    }
  };

  React.useEffect(() => {
    if (!isOpen || typeof window === 'undefined') {
      return;
    }

    const ensureCouponData = () => {
      try {
        const sessionCoupon = sessionStorage.getItem(COUPON_DATA_KEY);
        if (sessionCoupon) {
          const parsed = JSON.parse(sessionCoupon);
          setCouponCode(parsed.code);
          localStorage.setItem(COUPON_DATA_KEY, sessionCoupon);
          sessionStorage.setItem(SESSION_COUPON_KEY, parsed.code);
          return;
        }

        const sessionCode = sessionStorage.getItem(SESSION_COUPON_KEY);
        if (sessionCode) {
          const fallbackPayload = {
            code: sessionCode,
            discount: 50,
            minAmount: 0,
            createdAt: new Date().toISOString(),
            expiryHours: 24
          };
          const serializedFallback = JSON.stringify(fallbackPayload);
          sessionStorage.setItem(COUPON_DATA_KEY, serializedFallback);
          localStorage.setItem(COUPON_DATA_KEY, serializedFallback);
          setCouponCode(sessionCode);
          return;
        }

        const newCode = generateCouponCode();
        const couponPayload = {
          code: newCode,
          discount: 50,
          minAmount: 0,
          createdAt: new Date().toISOString(),
          expiryHours: 24
        };
        const serialized = JSON.stringify(couponPayload);
        sessionStorage.setItem(SESSION_COUPON_KEY, newCode);
        sessionStorage.setItem(COUPON_DATA_KEY, serialized);
        localStorage.setItem(COUPON_DATA_KEY, serialized);
        setCouponCode(newCode);
      } catch (error) {
        console.error('فشل في إعداد بيانات الكوبون:', error);
      }
    };

    ensureCouponData();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-50 via-blue-50 to-primary/10 rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl relative border-2 border-primary/20">
        
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          title="إغلاق"
          className="absolute top-4 left-4 w-8 h-8 bg-gray-200/80 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-10"
        >
          <X className="h-4 w-4 text-gray-700" />
        </button>

        {currentStep === 1 ? (
          /* الواجهة الأولى - الترحيب والتسجيل */
          <div className="relative p-6 flex flex-col items-center justify-center text-center gap-6">
            {/* العنوان والرموز */}
            <div className="w-full flex flex-col items-center justify-center gap-3">
              <h2 className="flex items-center justify-center text-2xl font-black text-primary leading-relaxed text-center">
                 مرحبا في عالم إشرو السحري!🎉
              </h2>
              <p className="flex items-center justify-center text-lg text-purple-600 font-semibold leading-relaxed text-center">
                ✨تجربة لا تُنسى مع عروض ومكافآت مذهلة ✨
              </p>
            </div>

            {/* نموذج التسجيل */}
            <div className="w-full space-y-4">
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="الاسم بالكامل"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-right pr-10 bg-white border-2 border-primary/20 focus:border-primary rounded-xl py-3"
                />
              </div>

              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="البريد الالكتروني"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="text-right pr-10 bg-white border-2 border-primary/20 focus:border-primary rounded-xl py-3"
                />
              </div>

              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="رقم الموبايل (09XXXXXXXX)"
                  value={formData.phone}
                  maxLength={10}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    setFormData(prev => ({ ...prev, phone: digitsOnly }));
                  }}
                  className="text-right pr-10 bg-white border-2 border-primary/20 focus:border-primary rounded-xl py-3"
                />
              </div>

              {/* زر اشترك الآن */}
              <Button
                onClick={handleRegistration}
                className="w-full bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg mt-6"
              >
                اشترك الآن
              </Button>
            </div>
          </div>
        ) : (
          /* الواجهة الثانية - المبروك والكوبون */
          <div className="relative p-6 space-y-6 bg-gradient-to-br from-purple-100 via-amber-50 to-pink-100 flex flex-col items-center justify-center text-center max-h-[78vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-white/40">
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-pink-400/30 via-amber-300/30 to-purple-400/30 blur-3xl" />

            <div className="relative text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-xl gift-swing">
                <Gift className="h-10 w-10 text-white" />
              </div>
              <h2 className="flex items-center justify-center text-2xl font-bold text-purple-700">
                مبروك ! لقد فزت بعضويةإشرو !
              </h2>
              <h3 className="flex items-center justify-center text-xl font-bold text-orange-500">
                🎁 مكافأت وهدايا حصرية💸
              </h3>
            </div>

            <div className="relative bg-white/90 border-2 border-dashed border-primary rounded-2xl p-6 text-center shadow-lg flex flex-col items-center gap-4">
              <h4 className="text-xl font-extrabold text-primary">
                🔥 كوبون خصم خرافي 50% 🔥
              </h4>
              <p className="flex items-center justify-center text-sm text-gray-700">
                صالح لمدة 24 ساعة لجميع المنتجات مع التوصيل المجاني!
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-green-100 rounded-xl p-4 w-full">
                <p className="flex items-center justify-center text-sm font-bold text-gray-700 mb-2">الكود:</p>
                <div className="bg-white rounded-lg p-3 mb-3 border border-primary/40">
                  <code className="flex items-center justify-center text-sm font-bold text-primary tracking-wider block break-words">
                    {couponCode}
                  </code>
                </div>
                <Button
                  onClick={handleCopyCoupon}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      تم النسخ!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      نسخ
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-3 text-center text-sm bg-white/80 rounded-2xl p-4 shadow">
              <h4 className="text-center font-bold text-gray-700 mb-2">📍 ما ينتظرك الآن</h4>
              <div className="flex items-center gap-3 justify-center">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-gray-700">تم إرسال كود الخصم الذهبي إلى بريدك الإلكتروني</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Bell className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-700">إشعارات فورية بالعروض الخرافية والمكافآت المذهلة</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="text-gray-700">دخول تلقائي للسحب الشهري على جوائز بقيمة 10000 د.ل</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Star className="h-4 w-4 text-purple-500" />
                <span className="text-gray-700">نقاط ولاء ذهبية تتضاعف مع كل عملية شراء</span>
              </div>
            </div>

            <Button
              onClick={handleStartShopping}
              className="w-full bg-gradient-to-r from-green-500 to-primary hover:from-green-600 hover:to-primary/90 text-white font-bold py-4 rounded-xl shadow-lg text-base"
            >
              🛍️ ابدأ رحلة التسوق معنا 🛍️
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomePopup;