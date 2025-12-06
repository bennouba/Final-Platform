# ☁️ دليل النشر السحابي - Cloud Deployment Guide

**منصة إشروا (EISHRO Platform)**  
**آخر تحديث**: 6 ديسمبر 2025  
**الحالة**: جاهز للاستخدام الفوري

---

## 📋 المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [المشاكل الشائعة وحلولها](#المشاكل-الشائعة-وحلولها)
3. [إعدادات Render Backend](#إعدادات-render-backend)
4. [إعدادات Vercel Frontend](#إعدادات-vercel-frontend)
5. [خطوات النشر](#خطوات-النشر)
6. [التحقق والاختبار](#التحقق-والاختبار)
7. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🌐 نظرة عامة

### البنية السحابية

```
Frontend (Vercel)
    ↓ API calls to ↓
Backend (Render)
    ↓ serves ↓
Assets & Data
```

### المتغيرات الحرجة

| الطرف | المتغير | القيمة |
|------|--------|--------|
| **Frontend** | VITE_API_URL | https://srv-d4p3d76r433s73edktfg.onrender.com/api |
| **Frontend** | VITE_BACKEND_URL | https://srv-d4p3d76r433s73edktfg.onrender.com |
| **Backend** | FRONTEND_URL | https://final-platform-kvbk.vercel.app |
| **Backend** | FRONTEND_PRODUCTION_URL | https://final-platform-kvbk.vercel.app |

---

## 🔧 المشاكل الشائعة وحلولها

### ❌ مشكلة 1: CORS Errors

**الأعراض:**
```
Cross-Origin Request Blocked
CORS header 'Access-Control-Allow-Origin' does not match
```

**السبب:**
- Backend on Render يرسل CORS header خاطئ
- متغيرات البيئة غير متطابقة

**الحل:**
```env
# على Render Backend
FRONTEND_URL=https://final-platform-kvbk.vercel.app
FRONTEND_PRODUCTION_URL=https://final-platform-kvbk.vercel.app
```

---

### ❌ مشكلة 2: API URL Configuration

**الأعراض:**
- Frontend لا يعرف أين Backend
- API calls تفشل مع 404

**السبب:**
- `VITE_API_URL` غير مُعرّف على Vercel

**الحل:**
```env
# على Vercel Frontend
VITE_API_URL=https://srv-d4p3d76r433s73edktfg.onrender.com/api
```

---

### ❌ مشكلة 3: الصور لا تظهر

**الأعراض:**
- صور المنتجات لا تحمّل
- صور السلايدرز فارغة

**السبب:**
- الصور لم تُنقل إلى Backend Assets

**الحل:**
```
تأكد من وجود الملفات في:
backend/public/assets/{storeName}/*.jpg
backend/public/assets/{storeName}/*.webp
```

---

### ❌ مشكلة 4: Badges لا تظهر

**الأعراض:**
- التمييزات (مميزة، أكثر مبيعاً، إلخ) لا تظهر

**السبب:**
- منطق حساب التمييز يحتاج تحديث
- البيانات لا تحتوي على metrics صحيح

**الحل:**
```typescript
// في src/utils/badgeCalculator.ts
// تأكد من أن الدالة تحسب التمييزات بناءً على:
- عدد المشاهدات (views)
- عدد الطلبات (orders)
- عدد الإعجابات (likes)
- حالة المخزون (inStock)
```

---

### ❌ مشكلة 5: "Notify when Available" لا يعمل

**الأعراض:**
- الزر يظهر لكن لا يعمل
- CORS errors عند الضغط

**السبب:**
- Backend CORS لم يتم إعداده بشكل صحيح
- Frontend لا تعرف Backend URL

**الحل:**
```env
# على Backend (Render)
FRONTEND_URL=https://final-platform-kvbk.vercel.app

# على Frontend (Vercel)
VITE_API_URL=https://srv-d4p3d76r433s73edktfg.onrender.com/api
```

---

## ⚙️ إعدادات Render Backend

### الخطوة 1: الوصول إلى Render Dashboard

اذهب إلى: `https://dashboard.render.com/web/srv-d4p3d76r433s73edktfg/environment`

### الخطوة 2: متغيرات البيئة المطلوبة

أضف أو حدّث هذه المتغيرات:

```env
# === Environment ===
NODE_ENV=production
PORT=5000
API_PREFIX=/api
LOG_LEVEL=info

# === Frontend URLs (CRITICAL) ===
FRONTEND_URL=https://final-platform-kvbk.vercel.app
FRONTEND_PRODUCTION_URL=https://final-platform-kvbk.vercel.app

# === Database ===
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=eishro_user
DB_PASSWORD=your-secure-password
DB_NAME=eishro_db
DB_LOGGING=false

# === JWT Security ===
JWT_SECRET=your-secure-jwt-secret-minimum-32-chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-chars
JWT_REFRESH_EXPIRE=30d

# === Encryption ===
ENCRYPTION_KEY=a7f3e9d2c1b4f6a8e5c7d9b2f4a6c8e0d1f3a5b7c9e1d3f5a7b9c1e3f5a7b9
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-minimum-32-chars

# === Payment (Moamalat) ===
MOAMALAT_MID=10081014649
MOAMALAT_TID=99179395
MOAMALAT_SECRET=3a488a89b3f7993476c252f017c488bb
MOAMALAT_ENV=sandbox
```

### الخطوة 3: حفظ و Redeploy

1. اضغط **Save Changes**
2. Render سيُعيد النشر تلقائياً
3. انتظر حتى ينتهي النشر (عادة 2-3 دقائق)

---

## 🚀 إعدادات Vercel Frontend

### الخطوة 1: الوصول إلى Vercel Dashboard

اذهب إلى: Project Settings → Environment Variables

### الخطوة 2: متغيرات البيئة المطلوبة

أضف أو حدّث هذه المتغيرات:

```env
# === CRITICAL: Backend API URLs ===
VITE_API_URL=https://srv-d4p3d76r433s73edktfg.onrender.com/api
VITE_BACKEND_URL=https://srv-d4p3d76r433s73edktfg.onrender.com

# === Payment ===
VITE_MOAMALAT_HASH_ENDPOINT=https://srv-d4p3d76r433s73edktfg.onrender.com

# === Google OAuth ===
VITE_GOOGLE_CLIENT_ID=1034286241802-hkdlf7mua6img2vhdo6mhna8ghb3mmhg.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://final-platform-kvbk.vercel.app/auth/google/callback

# === AI Features (Optional) ===
VITE_MINIMAX_ENABLED=false
VITE_MINIMAX_API_URL=https://api.minimax.chat/v1
VITE_MINIMAX_TIMEOUT=5000
```

### الخطوة 3: Redeploy Frontend

1. اضغط **Save**
2. اذهب إلى **Deployments** tab
3. اضغط على الـ deployment الأخير
4. اضغط **3-dot menu** → **Redeploy**
5. انتظر حتى ينتهي البناء

---

## 📝 خطوات النشر الكاملة

### قبل النشر: التحقق المحلي

```bash
# 1. تأكد من أن كل شيء يعمل محلياً
npm run dev

# 2. اختبر جميع المتاجر والميزات محلياً
# - افتح جميع المتاجر
# - اختبر "Notify when available"
# - تأكد من عدم وجود console errors

# 3. بناء النسخة الإنتاجية محلياً
npm run build

# 4. إذا كان البناء ناجحاً، متابعة إلى الخطوة التالية
```

### النشر على Render Backend

```bash
# 1. اذهب إلى Render Dashboard
# https://dashboard.render.com

# 2. اختر خدمة Backend: srv-d4p3d76r433s73edktfg

# 3. اضغط Environment tab

# 4. أضف/حدّث المتغيرات (انظر أعلاه)

# 5. اضغط "Save Changes"

# 6. انتظر الـ redeploy التلقائي
```

### النشر على Vercel Frontend

```bash
# 1. اذهب إلى Vercel Project

# 2. اضغط Settings → Environment Variables

# 3. أضف/حدّث المتغيرات (انظر أعلاه)

# 4. اضغط "Save"

# 5. اذهب إلى Deployments

# 6. اضغط على latest deployment → 3-dot → Redeploy

# 7. انتظر حتى ينتهي البناء
```

---

## ✅ التحقق والاختبار

### التحقق من CORS

```bash
# اختبر أن Backend يرسل CORS headers الصحيحة
curl -H "Origin: https://final-platform-kvbk.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://srv-d4p3d76r433s73edktfg.onrender.com/api/stores/unavailable/notify

# يجب أن ترى:
# Access-Control-Allow-Origin: https://final-platform-kvbk.vercel.app
```

### اختبار يدوي في المتصفح

1. **زيارة الموقع**: `https://final-platform-kvbk.vercel.app`
2. **فتح جميع المتاجر**:
   - نواعم (Nawaem)
   - بريتي (Pretty)
   - دالتا ستور (Delta Store)
   - ميجنا بيوتي (Magna Beauty)
   - انديش (Indish)

3. **التحقق من**:
   - ✅ تحميل الصور
   - ✅ ظهور التمييزات (Badges)
   - ✅ زر "Notify when available"
   - ✅ عدم وجود CORS errors في Console

### قائمة الاختبار الشاملة

- [ ] زيارة الموقع من متصفح جديد
- [ ] تحميل نواعم - يجب أن تظهر السلايدرز
- [ ] تحميل بريتي - منتجات بدون صور
- [ ] تحميل دالتا ستور - منتجات مع badges
- [ ] تحميل ميجنا - منتجات مع صور
- [ ] اختبار "Notify when available" - يجب أن يعمل بدون CORS error
- [ ] فتح Console (F12) - لا يجب أن تكون هناك أي CORS errors
- [ ] إعادة تحميل الصفحة (Ctrl+R) - كل شيء يجب أن يحمّل بسرعة
- [ ] اختبار من device مختلف - يجب أن يعمل بنفس الطريقة

---

## 🔍 استكشاف الأخطاء

### الصور لا تظهر

**تحقق من:**
1. الملفات موجودة في `backend/public/assets/{storeName}/`
2. مسارات الصور في بيانات المنتج صحيحة
3. Backend يخدم الملفات الثابتة بشكل صحيح

**الحل:**
```bash
# تحقق من وجود الملفات
ls backend/public/assets/nawaem/
ls backend/public/assets/magna-beauty/

# إذا كانت مفقودة، انسخها من frontend
cp frontend/public/assets/nawaem/* backend/public/assets/nawaem/
```

### CORS Errors تستمر

**تحقق من:**
1. `FRONTEND_URL` على Render مطابقة تماماً للـ Frontend URL
2. `VITE_API_URL` على Vercel مطابقة تماماً للـ Backend URL
3. تم Redeploy بعد تحديث المتغيرات

**الحل:**
```bash
# Render: اضغط "Clear Build Cache" ثم redeploy
# Vercel: اضغط "Redeploy" على latest deployment
# Browser: Ctrl+Shift+Delete (clear cache) + Ctrl+Shift+R (hard refresh)
```

### API Calls تفشل

**تحقق من:**
1. Backend يعمل: `https://srv-d4p3d76r433s73edktfg.onrender.com/health`
2. Frontend `VITE_API_URL` صحيح
3. Network tab في DevTools - تحقق من الـ URL الفعلي

**الحل:**
```bash
# اختبر Backend مباشرة
curl https://srv-d4p3d76r433s73edktfg.onrender.com/api/stores

# إذا لم يستجب، قد يكون Backend نائماً (Render free tier)
# اضغط redeploy أو زيارة الموقع لإيقاظه
```

### Database لا يتصل

**تحقق من:**
1. DB credentials على Render صحيح
2. Database server يعمل ومتاح
3. Firewall لا يحجب الاتصال

**الحل:**
```bash
# اختبر الاتصال مباشرة (إذا كان ممكناً)
# من خلال Database management tool
```

---

## 📊 ملخص الإعدادات

| الخدمة | المتغير | القيمة | النطاق |
|-------|--------|--------|--------|
| **Render** | NODE_ENV | production | Backend |
| **Render** | FRONTEND_URL | https://final-platform-kvbk.vercel.app | Backend |
| **Vercel** | VITE_API_URL | https://srv-d4p3d76r433s73edktfg.onrender.com/api | Frontend |
| **Vercel** | VITE_BACKEND_URL | https://srv-d4p3d76r433s73edktfg.onrender.com | Frontend |

---

## 📞 ملاحظات أمان مهمة

1. **جميع الـ Secrets يجب أن تكون قوية** (minimum 32 characters)
2. **لا تضع JWT secrets في repositories**
3. **استخدم Render's secure storage** للمتغيرات الحساسة
4. **استخدم Vercel's secret management** للـ Frontend secrets
5. **لا تشارك environment variables** مع الآخرين

---

**آخر تحديث**: 6 ديسمبر 2025  
**المرجع**: دليل شامل للنشر السحابي  
**الحالة**: ✅ جاهز للاستخدام الفوري
