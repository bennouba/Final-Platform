import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  ArrowRight,
  Home,
  LogIn,
  Copy,
  Check
} from 'lucide-react';
import { useState } from 'react';

interface StoreData {
  nameAr: string;
  nameEn: string;
  description: string;
  logo: string | null;
  category: string;
  warehouseChoice: string;
  merchantEmail: string;
  merchantPhone: string;
}

interface StoreCreationSuccessPageProps {
  storeData: StoreData;
  onNavigateToHome: () => void;
  onNavigateToLogin: () => void;
  onContinueToProducts?: () => void;
}

const StoreCreationSuccessPage: React.FC<StoreCreationSuccessPageProps> = ({
  storeData,
  onNavigateToHome,
  onNavigateToLogin,
  onContinueToProducts
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(storeData.merchantEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subdomain = storeData.nameEn.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* الأيقونة والعنوان */}
        <div className="text-center mb-12 mt-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">تم إنشاء متجرك بنجاح! 🎉</h1>
          <p className="text-lg text-gray-600">مبروك! متجرك الإلكتروني جاهز الآن على منصة إشرو</p>
        </div>

        {/* بطاقة معلومات المتجر */}
        <Card className="shadow-xl mb-8 border-2 border-green-200">
          <CardContent className="pt-8">
            <div className="space-y-6">
              {/* الشعار والاسم */}
              <div className="flex items-center gap-6">
                {storeData.logo && (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    <img
                      src={storeData.logo}
                      alt={storeData.nameAr}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{storeData.nameAr}</h2>
                  <p className="text-gray-600 text-sm mt-1">{storeData.nameEn}</p>
                  <p className="text-gray-500 text-sm mt-2">{storeData.description}</p>
                </div>
              </div>

              {/* الفاصل */}
              <div className="border-t border-gray-200"></div>

              {/* معلومات المتجر */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">رابط المتجر</label>
                    <div className="flex items-center gap-2 mt-2 bg-gray-50 p-3 rounded-lg">
                      <code className="text-sm font-mono text-primary flex-1 break-all">{`eshro.ly/${subdomain}`}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`eshro.ly/${subdomain}`);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="نسخ الرابط"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">بريدك الإلكتروني</label>
                    <div className="flex items-center gap-2 mt-2 bg-gray-50 p-3 rounded-lg">
                      <code className="text-sm font-mono text-primary flex-1 break-all">{storeData.merchantEmail}</code>
                      <button
                        onClick={handleCopyEmail}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="نسخ البريد"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">نوع النشاط التجاري</label>
                    <div className="mt-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs px-3 py-1">
                        {storeData.category}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">خيار المخزن</label>
                    <div className="mt-2">
                      <Badge className="bg-purple-100 text-purple-800 text-xs px-3 py-1">
                        {storeData.warehouseChoice === 'personal' && 'مخزن شخصي'}
                        {storeData.warehouseChoice === 'platform' && 'مخازن المنصة'}
                        {storeData.warehouseChoice === 'both' && 'الخيارات كاملة'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* خطوات ما الآن */}
        <Card className="shadow-lg mb-8 border border-blue-200 bg-blue-50/50">
          <CardContent className="pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ما الخطوات التالية؟</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold text-gray-900">سجل الدخول إلى لوحة التحكم</p>
                  <p className="text-sm text-gray-600 mt-1">استخدم بريدك الإلكتروني وكلمة المرور للدخول إلى لوحة التحكم</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold text-gray-900">أضف منتجاتك</p>
                  <p className="text-sm text-gray-600 mt-1">ابدأ برفع منتجاتك مع الصور والأسعار والأوصاف التفصيلية</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold text-gray-900">ظهر على الصفحة الرئيسية</p>
                  <p className="text-sm text-gray-600 mt-1">سيظهر متجرك على الصفحة الرئيسية للمنصة ليراه العملاء</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-semibold text-gray-900">ابدأ البيع والتطور</p>
                  <p className="text-sm text-gray-600 mt-1">راقب طلباتك وادرِ متجرك باستخدام أدوات التحليلات المتقدمة</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* نصائح مهمة */}
        <Card className="shadow-lg mb-8 border border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">💡 نصائح مهمة</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span>احتفظ ببريدك الإلكتروني وكلمة المرور في مكان آمن</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span>ملأ صور المنتجات بجودة عالية تزيد من الثقة</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span>اكتب أوصاف منتجات واضحة وجذابة</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span>رد على استفسارات العملاء بسرعة</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onContinueToProducts || onNavigateToLogin}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <ArrowRight className="h-5 w-5" />
            {onContinueToProducts ? 'إضافة المنتجات والصور' : 'دخول لوحة التحكم'}
          </Button>

          <Button
            onClick={onNavigateToHome}
            variant="outline"
            className="flex-1 py-6 text-lg font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            العودة للصفحة الرئيسية
          </Button>
        </div>

        {/* شكراً */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">شكراً لاختيارك منصة إشرو! 🚀</p>
          <p className="text-xs mt-2">للدعم الفني، تواصل معنا عبر support@eshro.ly</p>
        </div>
      </div>
    </div>
  );
};

export default StoreCreationSuccessPage;
