إعداد تسجيل الدخول عبر Google (OAuth 2.0) — منصة إشرو

1) أنشئ OAuth 2.0 Client ID من نوع Web application
- انتقل إلى: https://console.cloud.google.com/
- APIs & Services > Credentials > Create Credentials > OAuth client ID
- Application type: Web application
- Name: Eishro Web (مثال)

2) أضف Authorized redirect URIs (حسب بيئتك)
أثناء التطوير:
- http://localhost:5173/auth/google/callback
- (إن استخدمت 127.0.0.1)
  http://127.0.0.1:5173/auth/google/callback

الإنتاج (استبدل نطاقك الفعلي):
- https://YOUR-DOMAIN.com/auth/google/callback

مهم:
- أضف كل URI مستخدم حرفياً (بروتوكول، منفذ، ومسار) بدون مسافات إضافية.
- إن كان لديك أكثر من بيئة/منفذ، أضف كل URI على حدة.

3) شاشة موافقة OAuth (OAuth consent screen)
- إن كانت الحالة Testing: أضف البريد الذي ستختبر به ضمن Test users
- أو قم بنشر التطبيق (Publish) ليصبح متاحاً للجميع

4) ضَع Client ID في بيئة المشروع
- افتح الملف .env.example وانسخ منه إلى .env أو .env.local
- عيّن القيمة الفعلية:
  VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_WEB_CLIENT_ID

اختياري: يمكن ضبط VITE_GOOGLE_REDIRECT_URI إذا أردت فرض رابط محدد بدل البناء التلقائي من origin

5) كيف يبني التطبيق رابط Google OAuth؟
التطبيق يوجّه مباشرة إلى:
https://accounts.google.com/o/oauth2/v2/auth
بالمعاملات:
- client_id = VITE_GOOGLE_CLIENT_ID
- redirect_uri = `${origin}/auth/google/callback`
- scope = openid email profile
- response_type = code
- state = قيمة مشفرة Base64
- prompt = select_account

6) استكشاف الأخطاء
Access blocked: Authorization Error
- تأكد أن redirect_uri الممرر يطابق تماماً أحد URIs المُصرّح بها في Google Console
- تأكد أن Client ID من نوع Web application
- في الوضع Testing: أضف بريدك ضمن Test users
- انتظر دقيقة بعد تعديل الإعدادات وأعد المحاولة

7) ملاحظات
- لا تضع أسراراً أو مفاتيح في المستودع العام
- استخدم .env المحلي لكل بيئة
- بعد تعديل .env، أعد تشغيل السيرفر/البناء
