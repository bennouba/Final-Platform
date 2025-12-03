import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { openMoamalatLightbox, ensureMoamalatScript } from '@/lib/moamalat';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Crown,
  Gift,
  Percent,
  Shield,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

interface SubscriptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: any;
  billingCycle: 'monthly' | 'yearly';
  onBillingCycleChange: (cycle: 'monthly' | 'yearly') => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'moamalat', name: 'معاملات', icon: '/assets/partners/payment/moamalat.png', description: 'البوابة الوطنية للمدفوعات الإلكترونية' },
  { id: 'sadad', name: 'سداد', icon: '/assets/partners/payment/sadad.png', description: 'خدمة الدفع الإلكتروني' },
  { id: 'tadawul', name: 'تداول', icon: '/assets/partners/payment/tadawul.png', description: 'منصة التداول الإلكتروني' },
  { id: 'mobicash', name: 'موبي كاش', icon: '/assets/partners/payment/mobicash.png', description: 'محفظة إلكترونية' },
  { id: 'anis', name: 'أنيس', icon: '/assets/partners/payment/anis.png', description: 'خدمات مالية إلكترونية' },
  { id: 'edfali', name: 'إدفعلي', icon: '/assets/partners/payment/edfali.png', description: 'حلول دفع إلكترونية' },
  { id: '1pay', name: '1Pay', icon: '/assets/partners/payment/1Pay.png', description: 'منصة دفع متكاملة' },
  { id: 'becom', name: 'Becom', icon: '/assets/partners/payment/Becom.png', description: 'خدمات دفع إلكترونية' },
  { id: 'blueline', name: 'BlueLine', icon: '/assets/partners/payment/BlueLine.png', description: 'حلول دفع متقدمة' },
  { id: 'debit', name: 'بطاقات الخصم', icon: '/assets/partners/payment/debit.png', description: 'بطاقات الخصم المباشر' },
  { id: 'nab4pay', name: 'nab4pay', icon: '/assets/partners/payment/nab4pay.png', description: 'منصة دفع وطنية' },
  { id: 'youssr', name: 'يوسر', icon: '/assets/partners/payment/youssr.png', description: 'خدمات مالية إلكترونية' },
];

const PAYMENT_FALLBACK_ICON = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTI4IDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMiAyMGMwLTQuNDI5IDIuNjUxLTguNDQzIDYuNzEzLTEwLjMzTDU5LjA4NCAyLjYzOUM2MS43OTYgMS4zNzIgNjQuNzQ4IDAgNjcuOTk5IDBoNTguMDAyQzEyNy4zOTcgMCAxMzIgNC42MDMgMTMyIDEwLjI1NHY1OS40OTJDMTEzLjMzMiA3NS4zMzUgOTQuMzg3IDgwIDc1LjUwMiA4MEg1Mi41Yy02LjAyOCAwLTEyLjA0LTIuMTc3LTE2LjczNC02LjA4OEwxNC4wNTIgNjMuNzA0QzExLjQxMiA2MS42NzQgMTAuMDAyIDU4LjY1OCAxMCA1NS40NTJWMjB6IiBmaWxsPSIjZjNmNGY5Ii8+PHRleHQgeD0iNjQiIHk9IjUwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiM1NjU2NTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5PIElDT048L3RleHQ+PC9zdmc+';

function formatTrxDateTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${y}${m}${day}${hh}${mm}`;
}

function getPublicEnv(key: string): string | undefined {
  const w = (typeof window !== 'undefined' ? (window as any) : {}) || {};
  const pe: any = (typeof process !== 'undefined' ? (process as any).env : {}) || {};
  return (
    pe[`NEXT_PUBLIC_${key}`] ||
    pe[`VITE_${key}`] ||
    pe[key] ||
    w[key]
  );
}

function getFirstEnv(...keys: string[]) {
  for (const k of keys) {
    const v = getPublicEnv(k);
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

function getLightboxSrc(env: string) {
  return env === 'production'
    ? 'https://pgw.moamalat.net:6006/lightbox/lightbox.js'
    : 'https://tnpg.moamalat.net:6006/lightbox/lightbox.js';
}

export const SubscriptionCheckoutModal: React.FC<SubscriptionCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  billingCycle,
  onBillingCycleChange,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLaunchingMoamalat, setIsLaunchingMoamalat] = useState(false);

  const basePrice = selectedPackage ? (billingCycle === 'yearly' ? Math.floor(selectedPackage.yearlyPrice) : selectedPackage.monthlyPrice) : 0;
  const discount = selectedPackage && billingCycle === 'yearly' ? (selectedPackage.id === 'lite' ? basePrice * 0.01 : selectedPackage.id === 'growth' ? basePrice * 0.03 : basePrice * 0.05) : 0;
  const discountedPrice = basePrice - discount;
  const couponDiscount = appliedCoupon ? discountedPrice * 0.1 : 0;
  const finalPrice = discountedPrice - couponDiscount;
  const selectedMethod = useMemo(() => paymentMethods.find((method) => method.id === selectedPaymentMethod) ?? null, [selectedPaymentMethod]);
  const displayIcon = selectedMethod?.icon ?? '/assets/partners/payment/moamalat.png';
  const displayName = selectedMethod?.name ?? 'معاملات';
  const displayDescription = selectedMethod?.description ?? 'البوابة الوطنية للمدفوعات الإلكترونية في ليبيا';

  const handleCouponApply = () => {
    if (couponCode.trim()) setAppliedCoupon(couponCode);
  };

  const handlePaymentSelect = (methodId: string) => setSelectedPaymentMethod(methodId);

  const handleProceedToPayment = () => {
    if (!selectedPaymentMethod) return;
    setCurrentStep(3);
  };

  useEffect(() => {
    if (!isOpen) return;
    if (currentStep >= 2) {
      ensureMoamalatScript().catch((error) => {

      });
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (!isOpen || !selectedPaymentMethod) return;
    ensureMoamalatScript().catch((error) => {

      alert('تعذر تحميل سكربت بوابة معاملات. حاول مرة أخرى.');
    });
  }, [isOpen, selectedPaymentMethod]);

  const launchMoamalatCheckout = useCallback(async () => {
    if (!selectedPaymentMethod) return;
    const methodLabel = selectedMethod?.name ?? 'معاملات';

    setIsProcessing(true);
    setIsLaunchingMoamalat(true);
    try {
      await ensureMoamalatScript();
      await openMoamalatLightbox({
        amountLYD: Number(finalPrice),
        referencePrefix: selectedPaymentMethod.toUpperCase(),
        additionalConfig: { PaymentChannel: selectedPaymentMethod },
        onComplete: () => {
          setIsProcessing(false);
          setIsLaunchingMoamalat(false);
          onClose();
          setTimeout(() => alert(`تمت عملية الدفع بنجاح عبر ${methodLabel}! سيتم تفعيل الاشتراك قريباً.`), 400);
        },
        onError: (err) => {

          setIsProcessing(false);
          setIsLaunchingMoamalat(false);
          alert('حدث خطأ في عملية الدفع عبر ' + methodLabel + ': ' + (err?.error || err?.message || 'خطأ غير معروف'));
        },
        onCancel: () => {
          setIsProcessing(false);
          setIsLaunchingMoamalat(false);
        },
      });
    } catch (error: any) {

      setIsProcessing(false);
      setIsLaunchingMoamalat(false);
      alert('فشل في تهيئة بوابة الدفع عبر ' + methodLabel + ': ' + (error?.message || 'خطأ غير معروف'));
    }
  }, [finalPrice, onClose, selectedMethod, selectedPaymentMethod]);

  const handlePaymentComplete = async () => {
    if (!selectedPaymentMethod) return;
    await launchMoamalatCheckout();
  };

  const resetModal = () => {
    setCurrentStep(1);
    setCouponCode('');
    setAppliedCoupon(null);
    setSelectedPaymentMethod(null);
    setIsProcessing(false);
    setIsLaunchingMoamalat(false);
  };

  useEffect(() => {
    if (!isOpen) resetModal();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            aria-label="إغلاق نافذة الدفع"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative z-10 p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step <= currentStep
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : 'bg-white/20 text-white/60 backdrop-blur-sm'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {step}
                    </motion.div>
                    {step < 3 && (
                      <div className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                        step < currentStep ? 'bg-green-500' : 'bg-white/30'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-8 rtl:space-x-reverse text-sm text-white/80 mb-6">
              <span className={currentStep >= 1 ? 'text-white font-medium' : ''}>ملخص المشتريات</span>
              <span className={currentStep >= 2 ? 'text-white font-medium' : ''}>طرق الدفع</span>
              <span className={currentStep >= 3 ? 'text-white font-medium' : ''}>إتمام الدفع</span>
            </div>
          </div>

          <div className="relative z-10 px-6 pb-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl">
              <CardContent className="p-8">
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Crown className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
                        {selectedPackage?.name}
                      </h2>
                      <p className="text-gray-600">مراجعة تفاصيل الاشتراك</p>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                      <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-indigo-600' : 'text-gray-500'}`}>شهري</span>
                      <Switch checked={billingCycle === 'yearly'} onCheckedChange={(checked) => onBillingCycleChange(checked ? 'yearly' : 'monthly')} className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500" />
                      <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-indigo-600' : 'text-gray-500'}`}>سنوي</span>
                      {billingCycle === 'yearly' && (
                        <Badge className="bg-green-100 text-green-800 text-xs">وفر {selectedPackage?.id === 'lite' ? '1%' : selectedPackage?.id === 'growth' ? '3%' : '5%'}</Badge>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-700">السعر الأساسي ({billingCycle === 'yearly' ? 'سنوي' : 'شهري'})</span>
                        <span className="font-bold text-lg">{basePrice} د.ل</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
                          <span className="text-green-700 flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            الخصم ({selectedPackage?.id === 'lite' ? '1%' : selectedPackage?.id === 'growth' ? '3%' : '5%'})
                          </span>
                          <span className="font-bold text-green-600">-{discount.toFixed(0)} د.ل</span>
                        </div>
                      )}

                      <div className="space-y-3">
                        <Label htmlFor="coupon" className="text-gray-700 font-medium">كوبون تخفيض</Label>
                        <div className="flex gap-2">
                          <Input id="coupon" placeholder="أدخل رمز الكوبون" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1" />
                          <Button onClick={handleCouponApply} variant="outline" className="px-6">
                            <Gift className="h-4 w-4 mr-2" />
                            تطبيق
                          </Button>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-purple-700 flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              كوبون: {appliedCoupon}
                            </span>
                            <span className="font-bold text-purple-600">-{couponDiscount.toFixed(0)} د.ل</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                          <span className="text-indigo-800 font-bold text-lg">الإجمالي</span>
                          <span className="text-2xl font-bold text-indigo-900">{finalPrice.toFixed(0)} د.ل</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg mt-2">
                          <span className="text-blue-700">المبلغ المستحق</span>
                          <span className="font-bold text-blue-800">{finalPrice.toFixed(0)} د.ل</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center text-sm text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <AlertCircle className="h-4 w-4 inline mr-2 text-yellow-600" />
                      📄 سيتم التحقق من الوصل قبل تفعيل الاشتراك.
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                      <Button variant="outline" onClick={onClose}>إلغاء</Button>
                      <Button onClick={() => setCurrentStep(2)} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                        استمرار
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CreditCard className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">اختر طريقة الدفع</h2>
                      <p className="text-gray-600">اختر الطريقة الأنسب لك من الخيارات المتاحة</p>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8">
                      {paymentMethods.map((method) => (
                        <motion.div key={method.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }} className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-300 ${
                          selectedPaymentMethod === method.id ? 'border-4 border-green-500 bg-green-50 shadow-2xl' : 'border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl bg-white'
                        }`} onClick={() => handlePaymentSelect(method.id)} style={{ willChange: 'transform' }}>
                          <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-white rounded-3xl flex items-center justify-center shadow-lg border border-gray-100">
                              <img
                                src={method.icon}
                                alt={method.name}
                                loading="lazy"
                                className="w-16 h-16 object-contain"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (target.dataset.fallbackApplied === 'true') return;
                                  target.dataset.fallbackApplied = 'true';
                                  target.src = PAYMENT_FALLBACK_ICON;
                                }}
                              />
                            </div>
                          </div>
                          {selectedPaymentMethod === method.id && (
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-6">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        رجوع
                      </Button>
                      <Button onClick={handleProceedToPayment} disabled={!selectedPaymentMethod} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50">
                        استمرار
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">بوابة الدفع معاملات</h2>
                      <p className="text-gray-600">{displayDescription}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 shadow-xl">
                      <div className="text-center space-y-6">
                        <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-xl border border-blue-100">
                          <img
                            src={displayIcon}
                            alt={displayName}
                            loading="lazy"
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.dataset.fallbackApplied === 'true') return;
                              target.dataset.fallbackApplied = 'true';
                              target.src = PAYMENT_FALLBACK_ICON;
                            }}
                          />
                        </div>
                        <h3 className="text-2xl font-bold text-blue-900">{displayName}</h3>
                        <p className="text-blue-700 text-lg">{displayDescription}</p>

                        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">طريقة الدفع المختارة:</span>
                            <span className="font-semibold text-blue-900">{displayName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">المبلغ المطلوب:</span>
                            <span className="font-bold text-xl text-blue-900">{finalPrice.toFixed(0)} د.ل</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">رسوم المعالجة:</span>
                            <span className="text-green-600 font-semibold">مجاناً</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium mb-1">ملاحظة هامة:</p>
                          <p>في حالة ظهور أي أخطاء في بوابة الدفع، يرجى المحاولة مرة أخرى أو اختيار طريقة دفع أخرى.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6">
                      <Button variant="outline" onClick={() => setCurrentStep(2)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        رجوع
                      </Button>
                      <Button onClick={handlePaymentComplete} disabled={isProcessing} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50">
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {isLaunchingMoamalat ? 'جاري فتح بوابة معاملات...' : 'جاري الدفع...'}
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            الدفع
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="text-center text-xs text-gray-500">بوابة معاملات - البوابة الوطنية للمدفوعات الإلكترونية في ليبيا</div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
