import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Chrome,
  Eye,
  EyeOff,
  Headphones,
  Infinity as InfinityIcon,
  Mail,
  Phone,
  Store,
  User,
  Users,
  X
} from 'lucide-react';

// تعريف أنواع Google
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
        };
        oauth2: {
          initTokenClient: (config: any) => any;
        };
      };
    };
  }
}

interface ShopLoginPageProps {
  onBack: () => void;
  onLogin: (credentials: { username: string; password: string; userType?: string }) => void;
  onNavigateToRegister: () => void;
  onNavigateToAccountTypeSelection?: () => void;
  onForgotPassword?: () => void;
}

const ShopLoginPage: React.FC<ShopLoginPageProps> = ({
  onBack,
  onLogin,
  onNavigateToRegister,
  onNavigateToAccountTypeSelection,
  onForgotPassword
}) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [userType, setUserType] = useState<'merchant' | 'user' | 'admin'>('merchant');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'method' | 'email' | 'phone'>('method');
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username.trim()) {
      setError('يرجى إدخال اسم المستخدم');
      return;
    }

    if (!credentials.password.trim()) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // محاكاة طلب تسجيل الدخول
      await new Promise(resolve => setTimeout(resolve, 1500));

      // التحقق من بيانات مسؤول النظام
      if (userType === 'admin') {
        if (credentials.username === 'admin@eshro.ly' && credentials.password === 'admin123') {
          console.log('Admin login successful');
          alert('تم تسجيل دخول مسؤول النظام بنجاح! 🎉');
          // في التطبيق الحقيقي، سيتم توجيه مسؤول النظام للوحة التحكم الرئيسية
          // هنا سنستخدم نفس نظام التاجر مؤقتاً لحين تطوير لوحة التحكم الإدارية الرئيسية
          onLogin({ ...credentials, userType: 'admin' });
          setIsLoading(false);
          return;
        } else {
          setError('بيانات مسؤول النظام غير صحيحة');
          setIsLoading(false);
          return;
        }
      }

      // في التطبيق الحقيقي، ستتم المعالجة عبر API
      if (userType === 'merchant') {
        // البحث عن بيانات المتجر في localStorage
        const stores = JSON.parse(localStorage.getItem('eshro_stores') || '[]');
        const storeData = stores.find((store: any) =>
          (store.email === credentials.username || store.phone === credentials.username) &&
          store.password === credentials.password
        );

        if (storeData) {
          // حفظ بيانات المستخدم الحالي في localStorage
          localStorage.setItem('eshro_current_user', JSON.stringify({
            email: credentials.username,
            userType: 'merchant',
            loginTime: new Date().toISOString()
          }));

          console.log('Merchant login successful');
          alert('تم تسجيل دخول التاجر بنجاح! 🎉');
          onLogin({ ...credentials, userType: 'merchant' });
          setIsLoading(false);
          return;
        } else {
          // التحقق من وجود المستخدم بدون كلمة مرور صحيحة
          const userExists = stores.find((store: any) => store.email === credentials.username || store.phone === credentials.username);
          if (userExists) {
            setError('كلمة المرور غير صحيحة');
            setIsLoading(false);
            return;
          } else {
            setError('اسم المستخدم أو البريد الإلكتروني غير موجود');
            setIsLoading(false);
            return;
          }
        }
      }

      if (userType === 'user') {
        // البحث عن بيانات المستخدم في localStorage
        const users = JSON.parse(localStorage.getItem('eshro_users') || '[]');
        const userData = users.find((user: any) =>
          (user.email === credentials.username || user.phone === credentials.username) &&
          user.password === credentials.password
        );

        if (userData) {
          console.log('User login successful');
          alert('تم تسجيل دخول المستخدم بنجاح! 🎉');
          onLogin({ ...credentials, userType: 'user' });
          setIsLoading(false);
          return;
        } else {
          // التحقق من وجود المستخدم بدون كلمة مرور صحيحة
          const userExists = users.find((user: any) => user.email === credentials.username || user.phone === credentials.username);
          if (userExists) {
            setError('كلمة المرور غير صحيحة');
            setIsLoading(false);
            return;
          } else {
            setError('اسم المستخدم أو البريد الإلكتروني غير موجود');
            setIsLoading(false);
            return;
          }
        }
      }

      onLogin({ ...credentials, userType });
    } catch (error) {
      setError('حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      // التحقق من وجود client ID صالح
      if (!clientId || clientId === 'your_google_client_id_here' || clientId.includes('demo')) {
        showGoogleSetupInstructions();
        setIsGoogleLoading(false);
        return;
      }

      // التحقق من صحة تنسيق client ID
      if (!clientId.includes('.') || clientId.split('.').length !== 2) {
        showGoogleSetupInstructions();
        setIsGoogleLoading(false);
        return;
      }

      // محاولة استخدام Google Identity Services
      if (typeof window !== 'undefined') {
        try {
          // تحميل Google Identity Services SDK
          await loadGoogleSDK();

          // تهيئة Google Sign-In
          const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'openid email profile',
            callback: (response: any) => {
              if (response.error) {
                console.error('Google OAuth error:', response.error);
                setError(`خطأ في Google OAuth: ${response.error_description || response.error}`);
                setIsGoogleLoading(false);
                return;
              }

              // نجح في الحصول على التوكن
              handleGoogleAuthSuccess(response);
            },
            state: btoa(JSON.stringify({
              timestamp: Date.now(),
              platform: 'eshro'
            }))
          });

          // طلب الوصول
          tokenClient.requestAccessToken();

        } catch (sdkError) {
          console.error('Google SDK error:', sdkError);
          // الرجوع للطريقة التقليدية
          redirectToGoogleOAuth(clientId);
        }
      } else {
        // بيئة الخادم - إعادة توجيه مباشرة
        redirectToGoogleOAuth(clientId);
      }

    } catch (error) {
      console.error('Google Sign-In error:', error);
      setError('فشل في تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.');
      setIsGoogleLoading(false);
    }
  };

  const redirectToGoogleOAuth = (clientId: string) => {
    // إنشاء رابط OAuth تقليدي
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
    const state = btoa(JSON.stringify({
      timestamp: Date.now(),
      returnTo: window.location.pathname
    }));

    const authUrl = `https://accounts.google.com/oauth/authorize?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${encodeURIComponent('openid email profile')}&` +
      `response_type=code&` +
      `state=${encodeURIComponent(state)}&` +
      `access_type=offline&` +
      `prompt=consent`;

    // فتح في نفس النافذة لتجنب مشاكل popup blockers
    window.location.href = authUrl;
  };

  const loadGoogleSDK = async () => {
    return new Promise((resolve, reject) => {
      // التحقق إذا كان SDK محمل مسبقاً
      if (window.google && window.google.accounts) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // تهيئة Google Identity Services
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id',
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
        resolve(true);
      };

      script.onerror = () => {
        reject(new Error('فشل في تحميل Google SDK'));
      };

      document.head.appendChild(script);
    });
  };

  const handleGoogleCredentialResponse = (response: any) => {
    if (response.credential) {
      // فك شيفرة JWT token للحصول على بيانات المستخدم
      try {
        const base64Payload = response.credential.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));

        const userInfo = {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          verified: payload.email_verified
        };

        handleGoogleSignInSuccess({ access_token: response.credential, user: userInfo });
      } catch (error) {
        console.error('Error decoding Google credential:', error);
        setError('فشل في معالجة بيانات Google.');
        setIsGoogleLoading(false);
      }
    }
  };

  const handleGoogleSignInSuccess = (authResponse: any) => {
    console.log('Google Sign-In successful:', authResponse);

    // محاكاة نجاح تسجيل الدخول
    alert('تم تسجيل الدخول بنجاح عبر Google! 🎉');

    // في التطبيق الحقيقي، سيتم إرسال التوكن للخادم للتحقق
    // وإنشاء/تحديث حساب المستخدم

    setIsGoogleLoading(false);
  };

  const showGoogleSetupInstructions = () => {
    const setupInstructions = `
🔧 إعداد Google OAuth مطلوب

لاستخدام تسجيل الدخول عبر Google، يرجى اتباع الخطوات التالية:

1️⃣ اذهب لـ Google Cloud Console:
   https://console.cloud.google.com/

2️⃣ أنشئ مشروع جديد أو اختر موجود

3️⃣ فعل Google+ API:
   APIs & Services > Library > Google+ API > Enable

4️⃣ أنشئ بيانات OAuth 2.0:
   APIs & Services > Credentials > Create Credentials > OAuth 2.0 Client IDs

5️⃣ أضف الإعدادات التالية:
   • Application type: Web application
   • Authorized redirect URIs:
     ${window.location.origin}/auth/google/callback

6️⃣ انسخ Client ID وأضفه في ملف .env:
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here

7️⃣ أعد تشغيل الخادم بعد إضافة Client ID

💡 للاختبار الحالي، يمكنك استخدام النموذج العادي لتسجيل الدخول
    `;

    alert(setupInstructions);
  };

  const handleGoogleAuthSuccess = (response: any) => {
    console.log('Google OAuth successful:', response);

    // في التطبيق الحقيقي، سيتم إرسال التوكن للخادم للتحقق
    // وإنشاء/تحديث حساب المستخدم

    alert('تم تسجيل الدخول بنجاح عبر Google! 🎉');
    setIsGoogleLoading(false);
  };

  const resetForgotPasswordState = () => {
    setForgotPasswordStep('method');
    setForgotPasswordData({ email: '', phone: '' });
  };

  const handleForgotPassword = () => {
    resetForgotPasswordState();
    setShowForgotPasswordModal(true);
  };

  const stats = [
    {
      icon: <Headphones className="h-6 w-6" />,
      number: "24/7",
      description: "دعم فني",
      color: "bg-blue-500"
    },
    {
      icon: <InfinityIcon className="h-6 w-6" />,
      number: "∞",
      description: "منتج و خدمة",
      color: "bg-cyan-500"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      number: "7",
      description: "أيام مجانية",
      color: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* خلفية ديناميكية محسنة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* الهيدر المبسط */}
      <header className="relative z-10 p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="w-full px-4 mx-auto max-w-7xl flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            الرئيسية
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">إشرو</span>
          </div>

          <div className="w-20"></div>
        </div>
      </header>

      <div className="relative z-10 w-full px-4 mx-auto max-w-7xl py-12 flex flex-col items-center">

        {/* نموذج تسجيل الدخول */}
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="space-y-2">
              <h2 className="flex items-center justify-center text-2xl font-bold text-slate-800">تسجيل الدخول</h2>
              <p className="flex items-center justify-center text-sm text-slate-600">
                {userType === 'admin'
                  ? 'أدخل بيانات مسؤول النظام'
                  : userType === 'merchant'
                  ? 'أدخل بيانات متجرك للوصول إلى لوحة التحكم'
                  : 'أدخل بياناتك للوصول إلى حسابك'
                }
              </p>
              
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* اختيار نوع المستخدم */}
            <div className="space-y-3">
              <Label className="flex items-center justify-center text-base font-medium">نوع الحساب</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={userType === 'merchant' ? 'default' : 'outline'}
                  onClick={() => setUserType('merchant')}
                  className="flex items-center gap-1 justify-center text-sm"
                >
                  <Store className="h-4 w-4" />
                  تاجر
                </Button>
                <Button
                  type="button"
                  variant={userType === 'user' ? 'default' : 'outline'}
                  onClick={() => setUserType('user')}
                  className="flex items-center gap-1 justify-center text-sm"
                >
                  <User className="h-4 w-4" />
                  مستخدم
                </Button>
                <Button
                  type="button"
                  variant={userType === 'admin' ? 'default' : 'outline'}
                  onClick={() => setUserType('admin')}
                  className={`flex items-center gap-1 justify-center text-sm ${
                    userType === 'admin' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''
                  }`}
                >
                  <Users className="h-4 w-4" />
                  مسؤول
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* اسم المستخدم */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-right">
                  {userType === 'admin' ? 'اسم مسؤول النظام' : 'اسم المستخدم'}
                </Label>
                <Input
                  id="username"
                  type={userType === 'admin' ? 'email' : 'text'}
                  placeholder={
                    userType === 'admin'
                      ? 'admin@eshro.ly'
                      : userType === 'merchant'
                      ? 'أدخل اسم المتجر أو البريد الإلكتروني'
                      : 'أدخل اسم المستخدم أو البريد الإلكتروني'
                  }
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="text-right"
                  required
                />
              </div>

              {/* كلمة المرور */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      userType === 'admin'
                        ? 'admin123'
                        : 'أدخل كلمة المرور'
                    }
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="text-right pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* رسالة الخطأ */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* رابط نسيت كلمة المرور */}
              <div className="flex items-center justify-center text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="flex items-center justify-center text-sm text-cyan-600 hover:text-cyan-800 hover:underline font-medium"
                >
                  هل نسيت كلمة المرور او اسم المستخدم ؟
                </button>
              </div>

              {/* زر تسجيل الدخول */}
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
                disabled={isLoading}
              >
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>

              {/* فاصل أنيق */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">أو</span>
                </div>
              </div>

              {/* زر تسجيل الدخول عبر Google */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 font-medium"
              >
                <div className="flex items-center justify-center gap-3">
                  {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Chrome className="h-5 w-5 text-red-500" />
                  )}
                  <span>{isGoogleLoading ? 'جاري الاتصال بـ Google...' : 'متابعة بـ Google'}</span>
                </div>
              </Button>
            </form>

            {/* رابط إنشاء حساب جديد */}
            <div className="text-center pt-4 border-t">
              <p className="flex items-center justify-center text-sm text-gray-600 mb-2">
                ليس لديك حساب في الموقع؟
              </p>
              <button
                onClick={onNavigateToAccountTypeSelection || onNavigateToRegister}
                className="text-sm font-medium text-green-400 hover:text-green-400 hover:underline"
              >
                قم بإنشاء حساب جديد معنا
              </button>
            </div>
          </CardContent>
        </Card>

        {/* الإحصائيات */}
        <div className="grid grid-cols-3 gap-4 mt-12 w-full max-w-md">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{stat.number}</div>
                <div className="text-xs text-slate-600 leading-tight">{stat.description}</div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* نافذة إعادة تعيين كلمة المرور */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => {
                setShowForgotPasswordModal(false);
                resetForgotPasswordState();
              }}
              title="إغلاق"
              className="absolute top-4 left-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-10"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>

            {forgotPasswordStep === 'method' && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">إعادة تعيين كلمة المرور</h2>
                  <p className="text-gray-600">هل تريد إعادة تعيين كلمة المرور عبر البريد الإلكتروني ام عبر رقم الموبايل ؟</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setForgotPasswordStep('email')}
                    className="w-full p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors text-right flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">البريد الإلكتروني</div>
                      <div className="text-sm text-gray-600">إرسال رابط إعادة التعيين عبر البريد الإلكتروني</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setForgotPasswordStep('phone')}
                    className="w-full p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-colors text-right flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">رقم الموبايل</div>
                      <div className="text-sm text-gray-600">إرسال رمز OTP عبر الرسائل النصية</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {forgotPasswordStep === 'email' && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">إعادة تعيين كلمة المرور</h2>
                  <p className="text-gray-600">الرجاء إدخال البريد الإلكتروني الذي استخدمته للتسجيل, ستتلقى رابطا مؤقتا لإعادة تعيين كلمة المرور</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="أدخل البريد الإلكتروني"
                      value={forgotPasswordData.email}
                      onChange={(e) => setForgotPasswordData(prev => ({ ...prev, email: e.target.value }))}
                      className="text-right pr-10"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        if (!forgotPasswordData.email.trim()) {
                          alert('يرجى إدخال البريد الإلكتروني أولاً');
                          return;
                        }

                        // البحث عن المستخدم في البيانات المحفوظة
                        const users = JSON.parse(localStorage.getItem('eshro_users') || '[]');
                        const stores = JSON.parse(localStorage.getItem('eshro_stores') || '[]');

                        const userExists = users.find((user: any) => user.email === forgotPasswordData.email);
                        const storeExists = stores.find((store: any) => store.email === forgotPasswordData.email);

                        if (userExists || storeExists) {
                          alert(`سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني (${forgotPasswordData.email}) قريباً 📧\n\nملاحظة: في النسخة التجريبية، يمكنك تسجيل الدخول بالبيانات الأصلية.`);
                          resetForgotPasswordState();
                          setShowForgotPasswordModal(false);
                          return;
                        }

                        alert('البريد الإلكتروني غير موجود في سجلاتنا');
                        return;
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      إرسال رابط إعادة التعيين
                    </Button>
                    <Button
                      onClick={() => setForgotPasswordStep('method')}
                      variant="outline"
                      className="flex-1"
                    >
                      العودة للخيارات
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {forgotPasswordStep === 'phone' && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">إعادة تعيين كلمة المرور</h2>
                  <p className="text-gray-600">أدخل رقم الموبايل</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="Phone Number (e.g., 09x xxxxxxx)"
                      value={forgotPasswordData.phone}
                      onChange={(e) => setForgotPasswordData(prev => ({ ...prev, phone: e.target.value }))}
                      className="text-right pr-10"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        if (!forgotPasswordData.phone.trim()) {
                          alert('يرجى إدخال رقم الهاتف أولاً');
                          return;
                        }

                        // البحث عن المستخدم في البيانات المحفوظة
                        const users = JSON.parse(localStorage.getItem('eshro_users') || '[]');
                        const stores = JSON.parse(localStorage.getItem('eshro_stores') || '[]');

                        const userExists = users.find((user: any) => user.phone === forgotPasswordData.phone);
                        const storeExists = stores.find((store: any) => store.phone === forgotPasswordData.phone);

                        if (userExists || storeExists) {
                          alert(`سيتم إرسال رمز OTP إلى رقم هاتفك (${forgotPasswordData.phone}) قريباً 📱\n\nملاحظة: في النسخة التجريبية، يمكنك تسجيل الدخول بالبيانات الأصلية.`);
                          resetForgotPasswordState();
                          setShowForgotPasswordModal(false);
                          return;
                        }

                        alert('رقم الهاتف غير موجود في سجلاتنا');
                        return;
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      طلب OTP
                    </Button>
                    <Button
                      onClick={() => setForgotPasswordStep('method')}
                      variant="outline"
                      className="flex-1"
                    >
                      العودة للخيارات
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopLoginPage;