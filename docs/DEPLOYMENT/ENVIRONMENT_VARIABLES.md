# 🔐 توثيق متغيرات البيئة الحالية

**آخر تحديث:** 6 ديسمبر 2025  
**الحالة:** ✅ نشط ومستخدم

---

## 📊 نظرة عامة

| المنصة | النوع | الحالة | URL |
|--------|--------|--------|-----|
| **Render** | Backend API | ✅ نشط | https://final-platform.onrender.com |
| **Vercel** | Frontend | ✅ نشط | https://final-platform-kvbk.vercel.app |

---

## 🖥️ Backend - Render

### معلومات الخادم
```
Platform: Render
Environment: Production
Region: [آخر منطقة في Render]
URL: https://final-platform.onrender.com
Status: ✅ Active 24/7
```

### متغيرات البيئة الأساسية

#### 1. إعدادات التطبيق
```env
ENVIRONMENT=production
NODE_ENV=production
PORT=auto
APP_NAME=EISHRO Platform V7
```

#### 2. قاعدة البيانات
```env
DATABASE_TYPE=mysql
DATABASE_URL=mysql://[user]:[password]@[host]:[port]/[database]
DB_HOST=[المضيف]
DB_PORT=3306
DB_NAME=eishro_platform
DB_USER=[اسم المستخدم]
DB_PASSWORD=[كلمة المرور - مشفرة]
DB_POOL_SIZE=10
```

#### 3. المصادقة والأمان
```env
JWT_SECRET=[مشفر - 32 حرف عشوائي]
JWT_EXPIRY=24h
ADMIN_PASSWORD=[مشفرة]
ENCRYPTION_KEY=[مشفر - 32 حرف]
HASH_ALGORITHM=sha256
```

#### 4. معايير API
```env
API_BASE_URL=https://final-platform.onrender.com
API_PREFIX=/api
API_VERSION=v1
CORS_ORIGIN=https://final-platform-kvbk.vercel.app
CORS_CREDENTIALS=true
```

#### 5. بوابات الدفع
```env
PAYMENT_GATEWAY=moamalat
MOAMALAT_API_KEY=[مشفر]
MOAMALAT_MERCHANT_ID=[معرّف التاجر]
MOAMALAT_SECRET=[مشفر]
PAYMENT_WEBHOOK_URL=https://final-platform.onrender.com/api/payment/webhook
```

#### 6. خدمات ثالثة
```env
MINIMAX_API_KEY=[اختياري - للتوصيات الذكية]
EMAIL_SERVICE=nodemailer
EMAIL_USER=[بريد الخدمة]
EMAIL_PASSWORD=[كلمة مرور البريد]
```

#### 7. المراقبة والسجلات
```env
LOG_LEVEL=info
LOG_FORMAT=json
SENTRY_DSN=[اختياري - للمراقبة]
ENABLE_METRICS=true
```

---

## 🌐 Frontend - Vercel

### معلومات التطبيق
```
Platform: Vercel
Environment: Production
Region: Edge Global CDN
URL: https://final-platform-kvbk.vercel.app
Status: ✅ Active
Build: Automatic on push
```

### متغيرات البيئة

#### متغيرات العام (تُستخدم في البناء والتشغيل)
```env
VITE_API_URL=https://final-platform.onrender.com/api
VITE_BACKEND_URL=https://final-platform.onrender.com
VITE_APP_NAME=EISHRO Platform
VITE_APP_VERSION=7.0.0
```

#### متغيرات المصادقة
```env
VITE_GOOGLE_CLIENT_ID=654393699706-c734g7laimhqnj19p51pldgms5e3tpoh.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://final-platform-kvbk.vercel.app/auth/callback
VITE_AUTH_PROVIDER=google
```

#### متغيرات ميزات اختيارية
```env
VITE_MINIMAX_API_KEY=[اختياري - لـ AI Recommendations]
VITE_ANALYTICS_ID=[اختياري - Google Analytics]
VITE_ENABLE_PREVIEW_MODE=false
```

#### متغيرات التطوير (Local Development فقط)
```env
VITE_DEV_SERVER=http://localhost:5173
VITE_API_DEV_URL=http://localhost:3000/api
```

### إعدادات البناء على Vercel
```
Root Directory:        ./
Build Command:         npm run build
Output Directory:      dist
Install Command:       npm ci --include=dev
Node Version:          18.x or higher
Environment:           Production
Auto Deploy:           On push to main
```

---

## 🔗 الربط بين الأنظمة

```
┌─────────────────────────────────────┐
│   Frontend (Vercel)                 │
│   https://final-platform-kvbk...    │
└────────────────┬────────────────────┘
                 │
         VITE_API_URL points to
                 │
┌────────────────▼────────────────────┐
│   Backend API (Render)              │
│   https://final-platform.onrender...│
│   Port: auto (managed by Render)    │
└────────────────┬────────────────────┘
                 │
         DATABASE_URL points to
                 │
┌────────────────▼────────────────────┐
│   MySQL Database                    │
│   [مضيف خارجي آمن]                  │
└─────────────────────────────────────┘
```

---

## 🔒 معلومات الأمان

### ✅ الممارسات الآمنة المطبقة
- ✅ لا توجد مفاتيح API في الكود المصدري
- ✅ جميع الأسرار مخزنة في متغيرات البيئة
- ✅ HTTPS/SSL مفعل على جميع الاتصالات
- ✅ CORS محدد بعنوان Vercel فقط
- ✅ JWT مستخدم للمصادقة
- ✅ كلمات المرور مشفرة في قاعدة البيانات

### ⚠️ نقاط مهمة للأمان
1. **لا تشارك الأسرار** عبر البريد أو السلاك
2. **غيّر الأسرار دورياً** (كل 3 أشهر)
3. **راجع السجلات** للأنشطة المريبة
4. **استخدم 2FA** على حسابات الخدمات السحابية

---

## 📝 كيفية تحديث متغيرات البيئة

### على Render (Backend)

1. انتقل إلى https://dashboard.render.com
2. اختر الخدمة `final-platform`
3. اذهب إلى **Settings** → **Environment**
4. اضغط **Add Environment Variable**
5. أضف/عدّل المتغير
6. اضغط **Deploy**

### على Vercel (Frontend)

1. انتقل إلى https://vercel.com/dashboard
2. اختر المشروع `final-platform-kvbk`
3. اذهب إلى **Settings** → **Environment Variables**
4. اضغط **Add New**
5. أضف/عدّل المتغير
6. سيتم البناء والنشر تلقائياً

---

## 🔄 عملية التحديث

### عند إضافة متغير بيئة جديد:

```bash
# Local Development
1. أضف المتغير في .env.local
2. اختبر محلياً: npm run dev
3. تأكد من أنه يعمل

# Cloud Deployment
4. أضفه في Render Dashboard
5. أضفه في Vercel Dashboard
6. تحقق من السجلات بعد النشر
```

---

## 🧪 اختبار متغيرات البيئة

### للتحقق من البيانات محلياً:
```bash
npm run dev
# يجب أن تظهر البيانات بشكل صحيح
```

### للتحقق على السحابية:
```bash
# تحقق من سجلات Render
https://dashboard.render.com/logs

# تحقق من سجلات Vercel
https://vercel.com/[username]/final-platform-kvbk/deployments
```

---

## 📊 سجل التغييرات

| التاريخ | المتغير | الإجراء | الملاحظات |
|--------|--------|--------|----------|
| 6 ديسمبر 2025 | جميع المتغيرات | ✅ توثيق | توثيق شامل لجميع المتغيرات الحالية |
| - | - | - | - |

---

## 🔗 ملفات ذات صلة
- [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md) - دليل النشر السحابي
- [PRODUCTION_SYNC_FIX.md](../TROUBLESHOOTING/PRODUCTION_SYNC_FIX.md) - حل مشكلة التزامن
- [LOCAL_DEVELOPMENT.md](../SETUP_GUIDES/LOCAL_DEVELOPMENT.md) - دليل التطوير المحلي

---

## ⚡ اختصارات مفيدة

```bash
# عرض متغيرات البيئة الحالية (بحذر)
echo $VITE_API_URL

# اختبار الاتصال بـ Backend
curl https://final-platform.onrender.com/api/health

# التحقق من البناء
npm run build
```
