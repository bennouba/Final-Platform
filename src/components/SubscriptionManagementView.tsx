import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { SubscriptionCheckoutModal } from './SubscriptionCheckoutModal';
import {
  Award,
  Bell,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Crown,
  Mail,
  MessageSquare,
  Phone,
  Settings,
  Sparkles,
  Star,
  Timer,
  ToggleLeft,
  TrendingUp,
} from 'lucide-react';

interface SubscriptionManagementViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

export const SubscriptionManagementView: React.FC<SubscriptionManagementViewProps> = ({
  storeData,
  setStoreData,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('الباقات');
  const [isSubscriptionEnabled, setIsSubscriptionEnabled] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // Current subscription data
  const currentSubscription = {
    plan: 'النمو',
    status: 'نشط',
    startDate: '20/01/2024',
    endDate: '17/01/2025',
    daysRemaining: 45,
    monthlyPrice: 700,
    yearlyPrice: 7560,
    features: [
      'متجر إلكتروني كامل',
      'حتى 100 منتج',
      'واجهات متجر قابلة للتخصيص',
      'خيارات دفع أساسية',
      'دعم فني أساسي'
    ]
  };

  // Available packages
  const packages = [
    {
      id: 'lite',
      name: 'لايت',
      monthlyPrice: 400,
      yearlyPrice: 400 * 12 * 0.99, // 1% discount
      popular: false,
      features: [
        'متجر إلكتروني احترافي',
        '50 منتجات',
        'عدد الطلبات تصل إلى 30 طلب فقط',
        'عدد الطلبات المتروكة 10 فقط',
        '1 فيس بوك بيكسل',
        'بدون تخصيص واجهة المتجر CSS',
        'دومين فرعي 1 مجاني',
        'خيارات دفع أساسية',
        'دعم فني أساسي'
      ]
    },
    {
      id: 'growth',
      name: 'النمو',
      monthlyPrice: 700,
      yearlyPrice: 700 * 12 * 0.97, // 3% discount
      popular: true,
      features: [
        'متجر إلكتروني احترافي',
        '200 منتجات',
        'عدد الطلبات تصل إلى 80 طلب فقط',
        'عدد الطلبات المتروكة 30 فقط',
        '2 فيس بوك بيكسل',
        'بدون تخصيص واجهة المتجر CSS',
        'دومين فرعي 1 مجاني',
        'خيارات دفع أساسية',
        'دعم فني أساسي'
      ]
    },
    {
      id: 'professional',
      name: 'الإحترافية',
      monthlyPrice: 1200,
      yearlyPrice: 1200 * 12 * 0.95, // 5% discount
      popular: false,
      features: [
        'متجر إلكتروني احترافي',
        'منتجات غير محدودة',
        'طلبات غير محدودة',
        'الطلبات المتروكة مجانا',
        '4 فيس بوك بيكسل',
        'بدون تخصيص واجهة المتجر CSS',
        'دومين فرعي 1 مجاني',
        'خيارات دفع أساسية',
        'دعم فني أساسي'
      ]
    },
    {
      id: 'enterprise',
      name: 'الأعمال',
      monthlyPrice: null,
      yearlyPrice: null,
      popular: false,
      features: [
        'متجر إلكتروني احترافي',
        'منتجات غير محدودة',
        'طلبات غير محدودة',
        'الطلبات المتروكة غير محدودة',
        'فيس بوك بيكسيل غير محدود',
        'تخصيص واجهة المتجر CSS',
        'دومين إحترافي غير محدود',
        'خيارات دفع أساسية',
        'دعم فني أساسي'
      ]
    }
  ];

  // Notification settings
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    sms: false,
    email: true
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header احترافي متطور */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full translate-y-32 -translate-x-32 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <Crown className="h-8 w-8 text-yellow-300 drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  👑 إدارة الاشتراك
                </h1>
                <p className="text-blue-100/90 text-lg font-medium">
                  إدارة اشتراكك والباقات والإشعارات
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl">
                <span className="text-sm font-medium text-white/90">حالة الاشتراك</span>
                <Button
                  variant={isSubscriptionEnabled ? "default" : "outline"}
                  size="lg"
                  onClick={() => setIsSubscriptionEnabled(!isSubscriptionEnabled)}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isSubscriptionEnabled
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/25 shadow-2xl'
                      : 'bg-white/20 hover:bg-white/30 border-white/30 backdrop-blur-sm'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-300 ${
                    isSubscriptionEnabled ? 'from-green-400/20 to-emerald-400/20' : 'opacity-0'
                  }`}></div>
                  <div className="relative flex items-center gap-2">
                    {isSubscriptionEnabled ? (
                      <>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></div>
                        <span className="text-white font-medium">نشط</span>
                        <CheckCircle className="h-4 w-4 drop-shadow-sm" />
                      </>
                    ) : (
                      <>
                        <span className="text-white/80">معطل</span>
                        <ToggleLeft className="h-4 w-4" />
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="الباقات">الباقات</TabsTrigger>
          <TabsTrigger value="الباقة الحالية">الباقة الحالية</TabsTrigger>
          <TabsTrigger value="الإشعارات">الإشعارات</TabsTrigger>
        </TabsList>

        <TabsContent value="الباقات" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
              الباقات
            </h3>
            <p className="text-gray-600 text-lg">اختر الباقة المناسبة لك</p>
          </motion.div>

          {/* Billing Toggle متطور */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-emerald-500/20 rounded-full translate-y-12 -translate-x-12 animate-pulse"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg border border-emerald-200/50">
                      <Calendar className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-800 text-lg">خطة دفع شهرية</h4>
                      <p className="text-sm text-emerald-600">ادفع شهرياً</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">خطة دفع سنوية</div>
                      <div className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">وفر 10%</div>
                    </div>
                    <Switch
                      checked={billingCycle === 'yearly'}
                      onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Packages Grid متطور مع هوية إشرو */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className={`relative overflow-hidden hover:shadow-2xl transition-all duration-500 group transform hover:scale-105 cursor-pointer h-full ${
                  pkg.popular
                    ? 'border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 shadow-indigo-200/50'
                    : 'bg-white hover:shadow-green-100/50 border-2 border-gray-100 hover:border-green-300 hover:bg-green-50/30'
                }`}>

                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full translate-y-10 -translate-x-10 group-hover:scale-110 transition-transform duration-500"></div>

                  <CardHeader className="text-center pb-4 relative flex flex-col items-center justify-center">
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</CardTitle>
                    <div className="mt-4 flex flex-col items-center justify-center text-center">
                      {pkg.monthlyPrice ? (
                        <div className="space-y-2 flex flex-col items-center justify-center text-center">
                          <div>
                            <span className="text-4xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                              {billingCycle === 'yearly' ? Math.floor(pkg.yearlyPrice! / 12) : pkg.monthlyPrice}
                            </span>
                            <span className="text-gray-600 mr-1 text-lg">د.ل</span>
                          </div>
                          <p className="text-sm text-gray-600 flex flex-col items-center justify-center text-center">
                            {billingCycle === 'yearly' ? 'سنوي' : 'شهري'}
                          </p>
                          {billingCycle === 'yearly' && (
                            <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block">
                              وفر {pkg.id === 'lite' ? '1%' : pkg.id === 'growth' ? '3%' : '5%'}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent block">
                              {pkg.id === 'business' ? 'بأسعار مخصصة' : 'حلول مؤسسات'}
                            </span>
                            <p className="text-sm text-gray-600 mt-4 flex flex-col items-center justify-center text-center">
                              {pkg.id === 'business' ? 'حسب احتياجاتك' : 'حسب احتياجاتك'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 relative flex flex-col justify-between min-h-[320px]">
                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3 text-sm">
                          <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            <CheckCircle className="w-3 h-3 text-white drop-shadow-sm" />
                          </div>
                          <span className="text-gray-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full relative overflow-hidden group transition-all duration-300 bg-white border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                      variant="outline"
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setCheckoutModalOpen(true);
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-300 ${
                        pkg.id === 'growth' ? 'from-white/20 to-transparent' : 'opacity-0'
                      }`}></div>
                      <span className="relative flex items-center gap-2">
                        أختر الباقة
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Package Benefits */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>جميع الباقات تشمل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                   <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                   </svg>
                 </div>
                 <h4 className="font-medium text-gray-900 mb-1 flex flex-col items-center justify-center text-center">مجتمعات إشرو النشطة</h4>
                 <p className="text-sm text-gray-600 flex flex-col items-center justify-center text-center">تفاعل مع شبكة نشطة من التجار الآخرين لتبادل الخبرات ومناقشة أفضل الممارسات والبقاء في صدارة التوجهات السوقية.</p>
               </div>

               <div className="flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                   <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                   </svg>
                 </div>
                 <h4 className="font-medium text-gray-900 mb-1 flex flex-col items-center justify-center text-center">تجربة دفع عالية التحويل</h4>
                 <p className="text-sm text-gray-600 flex flex-col items-center justify-center text-center">توفر إشرو تجربة دفع محسّنة ومصممة لتحقيق معدلات تحويل عالية، ما يضمن تجربة سلسة للعملاء في ليبيا.</p>
               </div>

               <div className="flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                   <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                   </svg>
                 </div>
                 <h4 className="font-medium text-gray-900 mb-1 flex flex-col items-center justify-center text-center">واجهات متجر قابلة للتخصيص</h4>
                 <p className="text-sm text-gray-600 flex flex-col items-center justify-center text-center">اختر من بين مجموعة من القوالب وخصص متجرك بسهولة بما يتناسب مع هوية علامتك التجارية.</p>
               </div>

               <div className="flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                   <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                   </svg>
                 </div>
                 <h4 className="font-medium text-gray-900 mb-1">خيارات دفع مدمجة وخدمة الشراء لاحقًا</h4>
                 <p className="text-sm text-gray-600">اقبل المدفوعات بطرق متعددة مثل سداد, تداول, موبي كاش, معاملات, أنيس, إدفعلي, قصتلي, الدفع كاش، وخدمة الشراء الآن والدفع لاحقًا.</p>
               </div>
             </div>

              {/* Additional Benefits */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 flex flex-col items-center justify-center text-center">تكامل مرن مع شركات الشحن</h4>
                    <p className="text-sm text-gray-600 flex flex-col items-center justify-center text-center">تواصل مع أفضل مزودي الشحن والتوصيل المحليين، وخصص سياسات الشحن، وأدِر خيارات التوصيل بكفاءة</p>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 flex flex-col items-center justify-center text-center">تحليلات متقدمة</h4>
                    <p className="text-sm text-gray-600 flex flex-col items-center justify-center text-center">احصل على رؤى مفصلة حول أداء متجرك وتحسين استراتيجيات البيع الخاصة بك</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="الباقة الحالية" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 border-amber-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full translate-y-16 -translate-x-16 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full animate-pulse"></div>

              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg border border-amber-200/50">
                    <Star className="h-6 w-6 text-white drop-shadow-sm" />
                  </div>
                  <div>
                    <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent font-bold">
                      بيانات الاشتراك الحالي
                    </span>
                    <p className="text-sm text-amber-600 mt-1 font-normal">
                      تفاصيل اشتراكك الحالي في منصة إشرو
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="relative space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* تاريخ البداية */}
                  <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-amber-800">تاريخ البداية</h4>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-amber-900">{currentSubscription.startDate}</p>
                      <p className="text-sm text-amber-600">تاريخ الاشتراك بمنصة إشرو</p>
                    </div>
                  </div>

                  {/* تاريخ الانتهاء */}
                  <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Timer className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-orange-800">تاريخ الانتهاء</h4>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-orange-900">{currentSubscription.endDate}</p>
                      <p className="text-sm text-orange-600">تاريخ انتهاء الاشتراك</p>
                    </div>
                  </div>

                  {/* الباقة الحالية */}
                  <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-green-800">الباقة الحالية</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 shadow-lg">
                          {currentSubscription.plan}
                        </Badge>
                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 shadow-lg">
                          {currentSubscription.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-600">الباقة نشطة وتعمل بشكل طبيعي</p>
                    </div>
                  </div>

                  {/* الأيام المتبقية */}
                  <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-purple-800">الأيام المتبقية</h4>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-purple-900 mb-1">{currentSubscription.daysRemaining}</p>
                      <p className="text-sm text-purple-600">يوم متبقي</p>
                      <Progress
                        value={(currentSubscription.daysRemaining / 365) * 100}
                        className="mt-3 h-2 bg-purple-100"
                      />
                    </div>
                  </div>
                </div>

                {/* مميزات الباقة الحالية */}
                <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-100">
                  <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    مميزات الباقة الحالية
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentSubscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                        <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-amber-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ترقية الباقة */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-indigo-800">هل تريد ترقية باقتك؟</p>
                        <p className="text-sm text-indigo-600">استكشف باقاتنا المختلفة واختر الباقة المناسبة لنمو متجرك</p>
                      </div>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => setActiveTab('الباقات')}
                    >
                      عرض الباقات
                      <ChevronRight className="h-4 w-4 mr-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="الإشعارات" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 border-violet-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-violet-500/20 rounded-full translate-y-12 -translate-x-12 animate-pulse"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-violet-200/50">
                    <Bell className="h-6 w-6 text-white drop-shadow-sm" />
                  </div>
                  <div>
                    <span className="bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent font-bold">
                      إشعارات / تنبيهات
                    </span>
                    <p className="text-sm text-violet-600 mt-1 font-normal">
                      إدارة تنبيهات الاشتراك والباقات
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* تنبيه رئيسي */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-blue-200/50">
                      <Bell className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-800 mb-2">تنبيهات إعادة التجديد واختيار الباقة</h4>
                      <p className="text-sm text-blue-600 mb-3">سيتم إرسال تنبيهات لمتابعة العمل عبر منصة إشرو قبل انتهاء الاشتراك</p>
                      <div className="flex items-center gap-2 text-xs text-blue-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>تنبيه قبل 30 يوم من الانتهاء</span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>تنبيه قبل 7 أيام من الانتهاء</span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>تنبيه في يوم الانتهاء</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-violet-800 text-lg">نوع التنبيهات:</h4>

                  {/* واتساب */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg border border-green-200/50">
                          <MessageSquare className="h-6 w-6 text-white drop-shadow-sm" />
                        </div>
                        <div>
                          <p className="font-bold text-green-800">واتساب</p>
                          <p className="text-sm text-green-600">رسائل فورية تصل مباشرة للتاجر</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.whatsapp}
                        onCheckedChange={(checked) => setNotifications({...notifications, whatsapp: checked})}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
                      />
                    </div>
                    {notifications.whatsapp && (
                      <div className="mt-4 pt-4 border-t border-green-100">
                        <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                          ✅ تم تفعيل تنبيهات واتساب - ستتلقى التنبيهات فوراً على رقم هاتفك المسجل
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {/* رسائل SMS */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg border border-blue-200/50">
                          <Phone className="h-6 w-6 text-white drop-shadow-sm" />
                        </div>
                        <div>
                          <p className="font-bold text-blue-800">رسائل SMS</p>
                          <p className="text-sm text-blue-600">رسائل نصية تصل للتاجر</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-500"
                      />
                    </div>
                    {notifications.sms && (
                      <div className="mt-4 pt-4 border-t border-blue-100">
                        <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                          ✅ تم تفعيل رسائل SMS - ستتلقى رسائل نصية على رقم هاتفك المسجل
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {/* البريد الإلكتروني */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg border border-purple-200/50">
                          <Mail className="h-6 w-6 text-white drop-shadow-sm" />
                        </div>
                        <div>
                          <p className="font-bold text-purple-800">البريد الإلكتروني</p>
                          <p className="text-sm text-purple-600">إشعارات بريدية للتاجر</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                      />
                    </div>
                    {notifications.email && (
                      <div className="mt-4 pt-4 border-t border-purple-100">
                        <p className="text-sm text-purple-700 bg-purple-50 p-3 rounded-lg border border-purple-200">
                          ✅ تم تفعيل البريد الإلكتروني - ستتلقى التنبيهات على بريدك الإلكتروني المسجل
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* ملخص الإشعارات النشطة */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-400/10 to-slate-400/10 rounded-full -translate-y-10 translate-x-10 animate-pulse"></div>
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    ملخص الإشعارات النشطة
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center transition-all duration-300 ${notifications.whatsapp ? 'bg-green-100 shadow-green-200/50' : 'bg-gray-100'}`}>
                        <MessageSquare className={`h-4 w-4 transition-colors duration-300 ${notifications.whatsapp ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <p className={`text-sm font-medium transition-colors duration-300 ${notifications.whatsapp ? 'text-green-800' : 'text-gray-500'}`}>
                        {notifications.whatsapp ? 'واتساب نشط' : 'واتساب معطل'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center transition-all duration-300 ${notifications.sms ? 'bg-blue-100 shadow-blue-200/50' : 'bg-gray-100'}`}>
                        <Phone className={`h-4 w-4 transition-colors duration-300 ${notifications.sms ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <p className={`text-sm font-medium transition-colors duration-300 ${notifications.sms ? 'text-blue-800' : 'text-gray-500'}`}>
                        {notifications.sms ? 'SMS نشط' : 'SMS معطل'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center transition-all duration-300 ${notifications.email ? 'bg-purple-100 shadow-purple-200/50' : 'bg-gray-100'}`}>
                        <Mail className={`h-4 w-4 transition-colors duration-300 ${notifications.email ? 'text-purple-600' : 'text-gray-400'}`} />
                      </div>
                      <p className={`text-sm font-medium transition-colors duration-300 ${notifications.email ? 'text-purple-800' : 'text-gray-500'}`}>
                        {notifications.email ? 'البريد نشط' : 'البريد معطل'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Checkout Modal */}
      <SubscriptionCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        selectedPackage={selectedPackage}
        billingCycle={billingCycle}
        onBillingCycleChange={setBillingCycle}
      />
      </div>
    </div>
  );
};
