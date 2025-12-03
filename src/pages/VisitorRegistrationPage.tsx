import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, ArrowLeft, Calendar, CalendarIcon, CheckCircle, Eye, EyeOff, FileText, Lock, Mail, MapPin, Shield, User, X } from 'lucide-react';
import CityAreaSelector from '@/components/CityAreaSelector';
import { DatePicker } from '@/components/ui/date-picker';
import { libyanCities } from '@/data/libya/cities/cities';

interface VisitorRegistrationPageProps {
  onBack: () => void;
  onRegister: (userData: any) => void;
  onNavigateToLogin: () => void;
  onNavigateToTerms: () => void;
}

const VisitorRegistrationPage: React.FC<VisitorRegistrationPageProps> = ({
  onBack,
  onRegister,
  onNavigateToLogin,
  onNavigateToTerms
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    city: '',
    area: '',
    phone: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeToOffers: true,
    subscribeToNewsletter: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم مطلوب';
    if (!formData.lastName.trim()) newErrors.lastName = 'اللقب مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صالح';

    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    else if (formData.password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'كلمات المرور غير متطابقة';

    if (!formData.birthDate) newErrors.birthDate = 'تاريخ الميلاد مطلوب';
    if (!formData.gender) newErrors.gender = 'الجنس مطلوب';
    if (!formData.city) newErrors.city = 'المدينة مطلوبة';
    if (!formData.area) newErrors.area = 'المنطقة مطلوبة';

    if (!formData.agreeToTerms) newErrors.terms = 'يجب الموافقة على الشروط والأحكام';
    if (!formData.agreeToPrivacy) newErrors.privacy = 'يجب الموافقة على سياسة الخصوصية';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
     // محاكاة إنشاء الحساب
     await new Promise(resolve => setTimeout(resolve, 2000));

     const userData = {
       ...formData,
       fullName: `${formData.firstName} ${formData.lastName}`,
       registrationDate: new Date().toISOString(),
       userType: 'visitor',
       id: Date.now().toString()
     };

     // حفظ بيانات المستخدم في localStorage
     const existingUsers = JSON.parse(localStorage.getItem('eshro_users') || '[]');

     // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
     const userExists = existingUsers.find((user: any) => user.email === formData.email);
     if (userExists) {
       setErrors({ email: 'البريد الإلكتروني موجود مسبقاً' });
       setIsLoading(false);
       return;
     }

     existingUsers.push(userData);
     localStorage.setItem('eshro_users', JSON.stringify(existingUsers));

     onRegister(userData);
    } catch (error) {
      setErrors({ submit: 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBirthDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('ar-LY');
      handleInputChange('birthDate', formattedDate);
      setSelectedDate(date);

      // Also update the form validation
      if (errors.birthDate) {
        setErrors(prev => ({ ...prev, birthDate: '' }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 relative overflow-hidden">
      {/* خلفية ديناميكية محسنة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-400/20 to-green-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* الهيدر */}
      <header className="relative z-10 p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة للرئيسية
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">إشرو</span>
          </div>

          <Button variant="outline" onClick={onNavigateToLogin}>
            تسجيل الدخول
          </Button>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* الهيدر المحسن */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">إنشاء حساب جديد</h1>
            <p className="text-gray-600 leading-relaxed text-lg">انضم إلى مجتمع إشرو واستمتع بتجربة تسوق مميزة</p>

            {/* مميزات التسجيل */}
            <div className="flex justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>توصيل مجاني</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>خصومات خاصة</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>دعم 24/7</span>
              </div>
            </div>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-center">معلومات الحساب</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* الاسم واللقب */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">الاسم *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="أدخل اسمك"
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">اللقب *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="أدخل لقبك"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                      className={`pr-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* كلمة المرور */}
                <div>
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="أدخل كلمة مرور قوية"
                      className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>

                {/* تأكيد كلمة المرور */}
                <div>
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="أعد إدخال كلمة المرور"
                      className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* تاريخ الميلاد */}
                <div>
                  <Label>تاريخ الميلاد *</Label>
                  <DatePicker
                    date={selectedDate ?? new Date()}
                    onDateChange={handleBirthDateSelect}
                    placeholder="اختر تاريخ الميلاد"
                    className={errors.birthDate ? 'border-red-500' : ''}
                  />
                  {errors.birthDate && <p className="text-sm text-red-600 mt-1">{errors.birthDate}</p>}
                </div>

                {/* الجنس */}
                <div>
                  <Label>الجنس *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                      <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-600 mt-1">{errors.gender}</p>}
                </div>

                {/* المدينة والمنطقة */}
                <div>
                  <Label>المدينة والمنطقة *</Label>
                  <CityAreaSelector
                    selectedCity={formData.city}
                    selectedArea={formData.area}
                    onCityChange={(cityId) => handleInputChange('city', cityId)}
                    onAreaChange={(areaId) => handleInputChange('area', areaId)}
                    required
                  />
                  {(errors.city || errors.area) && (
                    <p className="text-sm text-red-600 mt-1">{errors.city || errors.area}</p>
                  )}
                </div>

                {/* رقم الهاتف */}
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="091XXXXXXX"
                    />
                  </div>
                </div>

                {/* خيارات الاشتراك */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="offers"
                      checked={formData.subscribeToOffers}
                      onCheckedChange={(checked) => handleInputChange('subscribeToOffers', !!checked)}
                    />
                    <Label htmlFor="offers" className="text-sm">
                      الحصول على العروض من شركائنا
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="newsletter"
                      checked={formData.subscribeToNewsletter}
                      onCheckedChange={(checked) => handleInputChange('subscribeToNewsletter', !!checked)}
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      الاشتراك في النشرة البريدية
                    </Label>
                  </div>
                </div>

                {/* الموافقة على الشروط */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
                      className={errors.terms ? 'border-red-500' : ''}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      أوافق على{' '}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => setShowTermsModal(true)}
                      >
                        الشروط والأحكام
                      </button>
                    </Label>
                  </div>
                  {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

                  <div className="flex items-start space-x-2 space-x-reverse">
                    <Checkbox
                      id="privacy"
                      checked={formData.agreeToPrivacy}
                      onCheckedChange={(checked) => handleInputChange('agreeToPrivacy', !!checked)}
                      className={errors.privacy ? 'border-red-500' : ''}
                    />
                    <Label htmlFor="privacy" className="text-sm leading-relaxed">
                      أوافق على{' '}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => setShowPrivacyModal(true)}
                      >
                        سياسة الخصوصية
                      </button>
                    </Label>
                  </div>
                  {errors.privacy && <p className="text-sm text-red-600">{errors.privacy}</p>}
                </div>

                {/* رسالة الخطأ العامة */}
                {errors.submit && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-700">{errors.submit}</span>
                  </div>
                )}

                {/* زر إنشاء الحساب المحسن */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري إنشاء الحساب...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      إنشاء الحساب وابدأ التسوق
                    </div>
                  )}
                </Button>
              </form>

              {/* رابط تسجيل الدخول المحسن */}
              <div className="text-center pt-6 border-t mt-6">
                <p className="text-sm text-gray-600 mb-3">
                  لديك حساب بالفعل؟
                </p>
                <Button
                  onClick={onNavigateToLogin}
                  variant="outline"
                  className="text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  تسجيل الدخول لحسابك
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* نافذة سياسة الخصوصية */}
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-black border-gray-800">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  سياسة الخصوصية وحماية البيانات الشخصية
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrivacyModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0 max-h-96 overflow-auto">
                <div className="p-6 bg-white">
                  <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-sm">
                    {`# سياسة الخصوصية وحماية البيانات الشخصية

## مقدمة
في منصة إشرو، نحن ملتزمون بحماية خصوصيتك وبناء الثقة معك. تُعد خصوصيتك أولوية قصوى بالنسبة لنا، ونحن نحرص على حماية معلوماتك الشخصية بأعلى معايير الأمان والسرية.

## البيانات التي نجمعها
### البيانات الشخصية:
- الاسم الكامل وتاريخ الميلاد والجنس
- البريد الإلكتروني ورقم الهاتف
- العنوان والمدينة والمنطقة
- معلومات الحساب البنكي (مشفرة بالكامل)

### بيانات الاستخدام:
- سجل النشاطات والتفاعلات مع المنصة
- معلومات الجهاز ونوع المتصفح
- عنوان IP وسجل التصفح
- ملفات تعريف الارتباط (Cookies)

## كيفية حماية بياناتك
نستخدم أحدث تقنيات التشفير والأمان لحماية بياناتك:
- تشفير SSL 256-bit لجميع البيانات المرسلة
- تخزين آمن في خوادم محمية ومراقبة
- نظام مراقبة 24/7 للكشف عن التهديدات
- نسخ احتياطية دورية مشفرة

## مشاركة البيانات مع الأطراف الأخرى
لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية دون موافقتك الصريحة.

### ما نشاركه:
- معلومات الشحن مع شركات التوصيل
- بيانات الدفع مع البنوك ومعالجات الدفع
- إحصائيات عامة مع شركاء الأعمال
- البيانات المطلوبة قانوناً للجهات المختصة

### ما لا نشاركه:
- معلوماتك الشخصية لأغراض تسويقية
- بياناتك المالية مع أطراف ثالثة
- سجل تصفحك أو نشاطك الشخصي
- بياناتك مع الشركات الإعلانية

## حقوقك في التحكم ببياناتك
يحق لك:
- الوصول لبياناتك الشخصية وطلب نسخة منها
- تصحيح أو تحديث معلوماتك في أي وقت
- طلب حذف حسابك وبياناتك نهائياً
- الاعتراض على معالجة بياناتك لأغراض معينة
- طلب نقل بياناتك لمنصة أخرى
- سحب الموافقة في أي وقت

## ملفات تعريف الارتباط (Cookies)
نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة وتقديم محتوى مخصص.

### أنواع الكوكيز المستخدمة:
- ملفات أساسية لتشغيل الموقع بشكل صحيح
- ملفات التحليل لفهم سلوك المستخدمين
- ملفات التسويق لعرض إعلانات مناسبة
- ملفات التفضيلات لتخصيص التجربة

## فترة الاحتفاظ بالبيانات
نحتفظ ببياناتك للمدة اللازمة فقط:
- بيانات الحساب: طول فترة استخدام المنصة
- سجل الطلبات: 5 سنوات لأغراض المحاسبة
- بيانات الدفع: 3 سنوات لأغراض الامتثال
- سجل التواصل: سنتان لتحسين الخدمة

## خصوصية الأطفال
منصة إشرو مخصصة للاستخدام من قبل الأشخاص فوق سن 18 عاماً. نحن لا نجمع عمداً معلومات شخصية من الأطفال دون سن 18 عاماً دون موافقة الوالدين.

## التواصل بشأن الخصوصية
إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية، يرجى التواصل معنا:
- مسؤول حماية البيانات: privacy@eshro.ly
- رقم الهاتف: +218 94 406 2927
- العنوان: طرابلس، ليبيا

## تحديث سياسة الخصوصية
قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار داخلي في المنصة.

**تاريخ آخر تحديث:** ${new Date().toLocaleDateString('ar-LY')}
**الإصدار:** 4.3 - منصة إشرو للتجارة الإلكترونية`}
                  </pre>
                </div>
              </CardContent>
              <div className="p-4 border-t bg-gray-50">
                <Button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full"
                >
                  فهمت، إغلاق
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* نافذة الشروط والأحكام */}
        {showTermsModal && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-black border-gray-800">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  إتفاقية وشروط إستخدام منصة إشرو
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTermsModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0 max-h-96 overflow-auto">
                <div className="p-6 bg-white">
                  <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-sm">
                    {`# إتفاقية وشروط إستخدام منصة إشرو

## مقدمة
مرحباً بك في منصة إشرو للتجارة الإلكترونية، المنصة الرائدة في ليبيا لإنشاء وإدارة المتاجر الإلكترونية.

## الشروط والأحكام
هذه الشروط والأحكام تحدد القواعد واللوائح لاستخدام موقع إشرو الإلكتروني وتطبيقاته المحمولة. باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام.

## تعريف المصطلحات
- **المنصة:** موقع إشرو الإلكتروني وتطبيقاته المحمولة
- **المستخدم:** أي شخص يستخدم خدمات المنصة سواء كتاجر أو زائر
- **التاجر:** الشخص أو الشركة المسجلة لبيع المنتجات عبر المنصة
- **الزائر:** المستخدم الذي يتصفح أو يشتري المنتجات دون بيع

## شروط التسجيل والحسابات
يجب على المستخدمين تقديم معلومات دقيقة وحديثة عند التسجيل والحفاظ على سرية كلمة المرور وعدم مشاركتها مع الآخرين.

## سياسة البيع والشراء
يجب على التجار تقديم وصف دقيق وصادق للمنتجات المعروضة وتحديد الأسعار بوضوح شاملة جميع الرسوم والضرائب.

## سياسة الشحن والتوصيل
نوفر خدمات شحن متعددة بالتعاون مع أفضل شركات الشحن في ليبيا مع ضمان سلامة المنتجات أثناء الشحن.

## سياسة الإرجاع والاستبدال
يحق للعميل إرجاع المنتج خلال 7 أيام من الاستلام مع الحفاظ على حالة المنتج الأصلية.

## حماية البيانات والخصوصية
نلتزم بحماية خصوصية مستخدمينا وفقاً لأعلى المعايير ولا نشارك البيانات الشخصية مع أطراف ثالثة دون موافقة صريحة.

## الرسوم والعمولات
تختلف العمولات حسب الباقة المختارة من التاجر ويتم خصم العمولة تلقائياً من مبيعات التاجر.

## المحتوى والملكية الفكرية
يحتفظ التاجر بحقوق الملكية الفكرية لمنتجاته وصوره ويمنح المنصة ترخيصاً محدوداً لعرض المنتجات.

## إنهاء الخدمة
يحق للمنصة إنهاء الخدمة في حالة انتهاك الشروط مع تسوية جميع المستحقات قبل إنهاء الخدمة.

## تحديث الشروط
نحتفظ بالحق في تحديث هذه الشروط في أي وقت مع إشعار المستخدمين بالتحديثات المهمة.

## القانون المعمول به
تخضع هذه الشروط للقوانين الليبية المعمول بها وأي نزاع ينشأ عن استخدام المنصة يخضع للاختصاص القضائي الليبي.

## التواصل
للتواصل معنا: support@eshro.ly | +218 94 406 2927 | طرابلس، ليبيا

**تاريخ آخر تحديث:** ${new Date().toLocaleDateString('ar-LY')}
**الإصدار:** 4.3 - منصة إشرو للتجارة الإلكترونية`}
                  </pre>
                </div>
              </CardContent>
              <div className="p-4 border-t bg-gray-50">
                <Button
                  onClick={() => setShowTermsModal(false)}
                  className="w-full"
                >
                  فهمت، إغلاق
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorRegistrationPage;
