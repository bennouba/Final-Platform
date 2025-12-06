# 🖥️ دليل الإعدادات المحلية - Local Development Setup

**منصة إشروا (EISHRO Platform)**  
**آخر تحديث**: 6 ديسمبر 2025  
**الحالة**: جاهز للاستخدام الفوري

---

## 📋 المحتويات

1. [إعداد البيئة المحلية](#إعداد-البيئة-المحلية)
2. [إصلاح مشاكل CORS](#إصلاح-مشاكل-cors)
3. [التحقق من الإعدادات](#التحقق-من-الإعدادات)
4. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🚀 إعداد البيئة المحلية

### المشكلة 🔴

المشروع كان يعمل **100% محلياً** ثم **توقفت السلايدرز** بسبب:
- تغيير `.env.production` لتحتوي على URLs السحابة
- Vite يقرأ `.env.production` حتى في التطوير المحلي
- المشروع يحاول الاتصال بـ `https://srv-d4p3d76r433s73edktfg.onrender.com` بدلاً من `http://localhost:5000`

### الحل ✅

#### الخطوة 1: إنشاء ملف `.env.local`

أنشئ ملف جديد في جذر المشروع باسم `.env.local` وضع فيه:

```env
# Local Development Environment Variables
NODE_ENV=development

# Frontend Local URL
VITE_FRONTEND_URL=http://localhost:5174

# Backend Local URL - CRITICAL
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000

# CORS Origin for Local Development
VITE_CORS_ORIGIN=http://localhost:5174

# Disable AI Features Locally
VITE_MINIMAX_ENABLED=false
```

#### الخطوة 2: تأكد من `.env.production`

`.env.production` يجب أن يحتوي على URLs السحابة فقط (اتركه كما هو الآن):

```env
VITE_API_URL=https://srv-d4p3d76r433s73edktfg.onrender.com/api
VITE_BACKEND_URL=https://srv-d4p3d76r433s73edktfg.onrender.com
```

#### الخطوة 3: فهم كيفية عمل Vite مع البيئات

Vite يقرأ الملفات بهذا الترتيب (الأول له أولوية):

1. **`.env.local`** ← جديد! للتطوير المحلي فقط
2. `.env.[mode]` ← مثل `.env.development` أو `.env.production`
3. `.env` ← الافتراضي

**لذلك:**
- عند تشغيل `npm run dev` → سيقرأ `.env.local` (محلي)
- عند البناء `npm run build` → سيقرأ `.env.production` (للسحابة)

---

## 🌐 إصلاح مشاكل CORS

### الأعراض 🔴

```
❌ Cross-Origin Request Blocked
❌ CORS header 'Access-Control-Allow-Origin' does not match
❌ Failed to load sliders
❌ "Notify when available" doesn't work
```

### السبب الجذري

- **Frontend**: يحاول الاتصال بـ URL خاطئ للـ Backend
- **Backend**: يرسل CORS header خاطئ
- **Root Cause**: متغيرات البيئة غير متطابقة بين Frontend و Backend

### الحل الشامل

#### أولاً: تأكد من `.env.local` موجود

تأكد من أن `.env.local` يحتوي على نفس URLs:

```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
VITE_CORS_ORIGIN=http://localhost:5174
```

#### ثانياً: تأكد من Backend Configuration

في `backend/src/app.ts` يجب أن يكون CORS مُفعّل:

```typescript
const allowedOrigins = [
  'http://localhost:5174',  // ← يجب أن يكون موجود
  config.frontend.production,
];
```

#### ثالثاً: امسح Cache وأعد التشغيل

```bash
# من جذر المشروع
# 1. احذف node_modules والـ cache
rmdir /s /q node_modules
rmdir /s /q .vite
rmdir /s /q dist

# 2. أعد تثبيت الـ dependencies
npm install

# 3. اشتغل المشروع من جديد
npm run dev
```

---

## ✅ التحقق من الإعدادات

### اختبر المشروع محلياً

```bash
# من جذر المشروع
npm run dev
```

**تحقق من النقاط التالية:**

1. ✅ افتح `http://localhost:5174`
2. ✅ ادخل إلى متجر **نواعم** أو أي متجر آخر
3. ✅ **يجب أن تظهر السلايدرز بالصور**
4. ✅ افتح DevTools (F12) → Console
5. ✅ **لا يجب أن تكون هناك أي CORS errors**

### أوامر التحقق

```bash
# تحقق من أن الـ API يعمل
curl http://localhost:5000/api/health

# تحقق من الـ Frontend يعمل
curl http://localhost:5174

# تحقق من متغيرات البيئة المحملة
npm run dev -- --inspect-env
```

---

## 🔧 استكشاف الأخطاء

### المشكلة: السلايدرز لا تظهر بعد إنشاء `.env.local`

**الحل:**
```bash
# 1. احذف node_modules والـ cache
rmdir /s /q node_modules
npm install

# 2. امسح cache Vite
rmdir /s /q .vite
rmdir /s /q dist

# 3. اشتغل المشروع من جديد
npm run dev

# 4. Hard refresh في المتصفح (Ctrl+Shift+R)
```

### المشكلة: لا تزال CORS errors

**تحقق من `backend/src/app.ts`:**
```typescript
const allowedOrigins = [
  'http://localhost:5174',  // ← يجب أن يكون موجود
  config.frontend.production,
];
```

### المشكلة: "Notify when available" لا يعمل

**تحقق من:**
1. `VITE_API_URL` في `.env.local` → `http://localhost:5000/api`
2. Backend متشغّل على `http://localhost:5000`
3. Browser Console لا يظهر CORS errors

### المشكلة: الـ Build يفشل

**تأكد من:**
1. `.env.production` يحتوي على URLs السحابة الصحيحة
2. `npm run build` يقرأ `.env.production` وليس `.env.local`
3. البناء يكتمل بدون errors

---

## 📊 الفروقات بين الإعدادات

### محلي vs. إنتاج

| المتغير | محلي | إنتاج |
|--------|------|--------|
| **NODE_ENV** | development | production |
| **VITE_API_URL** | http://localhost:5000/api | https://srv-d4p3d76r433s73edktfg.onrender.com/api |
| **VITE_BACKEND_URL** | http://localhost:5000 | https://srv-d4p3d76r433s73edktfg.onrender.com |
| **VITE_CORS_ORIGIN** | http://localhost:5174 | https://final-platform-kvbk.vercel.app |
| **VITE_MINIMAX_ENABLED** | false | false (or true if enabled) |

---

## 🎯 الخلاصة

### قبل التصحيح ❌
- المشروع يقرأ `.env.production` (URLs السحابة) حتى محلياً
- السلايدرز تحاول الاتصال بـ Render وتفشل
- CORS errors في كل مكان

### بعد التصحيح ✅
- `.env.local` يخبر Vite استخدم localhost محلياً
- `.env.production` تبقى للسحابة فقط
- السلايدرز تعمل محلياً بشكل مثالي
- عند البناء للسحابة، يتم استخدام URLs الصحيحة

---

## 📁 ملفات مهمة

| الملف | الغرض | الاستخدام |
|------|------|----------|
| `.env.local` | 🆕 محلي فقط | تطوير محلي (localhost) |
| `.env.production` | ☁️ سحابة | Vercel و Render |
| `.env.example` | 📋 مثال | لنسخ البيانات منه |
| `vite.config.ts` | ⚙️ إعدادات | proxy للـ API |
| `backend/src/app.ts` | 🔧 Backend | CORS configuration |

---

## 📞 ملاحظات مهمة

1. **`.env.local` يجب أن يكون في `.gitignore`** - لا تُرفعه على Git
2. **لا تضع أي secrets في `.env.local`** - استخدم كلمات مرور آمنة
3. **اختبر محلياً قبل النشر** - تأكد من أن كل شيء يعمل
4. **عند النشر، تأكد من `.env.production` صحيح** - يجب أن يحتوي على URLs السحابة

---

**آخر تحديث**: 6 ديسمبر 2025  
**المرجع**: دليل شامل لإعدادات التطوير المحلي
**الحالة**: ✅ جاهز للاستخدام الفوري
