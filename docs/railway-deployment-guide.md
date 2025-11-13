# 🚀 Railway Deployment Guide - EISHRO Backend

## الهدف: حل مشكلة بوابة الدفع على Vercel

---

## 📋 المشكلة الحالية

```
❌ MoamalatRealLightbox.tsx:174
http://localhost:4000/api/moamalat/hash

✅ الحل:
https://{backend-name}.railway.app/api/moamalat/hash
```

---

## 🎯 خطوات الانتشار على Railway

### 1️⃣ إنشاء حساب Railway

1. اذهب إلى **https://railway.app**
2. سجل دخول أو أنشئ حساباً
3. اربط حسابك بـ GitHub (اختياري لكن موصى)

---

### 2️⃣ إنشاء Project جديد

```
1. Dashboard → New Project
2. Deploy from GitHub أو Upload
3. اختر مستودع Backend (أو أرفع الملفات مباشرة)
```

---

### 3️⃣ إضافة MySQL Database

```
1. في Dashboard → Add
2. اختر MySQL
3. سيتم إنشاء قاعدة بيانات جديدة تلقائياً
4. ستحصل على:
   - DB_HOST
   - DB_PORT
   - DB_USER
   - DB_PASSWORD
   - DB_NAME
```

---

### 4️⃣ إعداد Environment Variables

في Railway Dashboard:

```env
# Database
DB_HOST={من Railway MySQL}
DB_PORT={من Railway MySQL}
DB_USER={من Railway MySQL}
DB_PASSWORD={من Railway MySQL}
DB_NAME=eishro_db

# JWT
JWT_SECRET=your_super_secret_key_generate_random_string

# Moamalat Payment Gateway
MOAMALAT_MID=10081014649
MOAMALAT_TID=99179395
MOAMALAT_SECRET=3a488a89b3f7993476c252f017c488bb
MOAMALAT_ENV=sandbox

# Server
PORT=5000
NODE_ENV=production

# Frontend
FRONTEND_URL=https://platform-eishro.vercel.app

# Railway specific (automatic)
RAILWAY_ENVIRONMENT_NAME=production
```

---

### 5️⃣ Deploy Backend

#### الطريقة 1: من GitHub (أفضل)

```bash
# 1. في مشروعك المحلي، أنشئ مستودع GitHub
git init
git add .
git commit -m "Initial Express backend"
git branch -M main
git remote add origin https://github.com/yourusername/eishro-backend.git
git push -u origin main

# 2. في Railway Dashboard:
# - New Project
# - Connect GitHub
# - اختر مستودع eishro-backend
# - سيبدأ الانتشار تلقائياً
```

#### الطريقة 2: Upload مباشر

```bash
# 1. في Railway Dashboard → New Project
# 2. Upload Files
# 3. اختر مجلد backend كاملاً
```

---

### 6️⃣ إعدادات Railway

في **Railway Dashboard → Settings:**

```
Build Command:  npm run build
Start Command:  npm start
Port:           5000 (automatic)
```

---

### 7️⃣ الحصول على Backend URL

بعد الانتشار بنجاح:

```
🎉 Your Backend URL: https://eishro-backend.railway.app

✅ API Endpoint: https://eishro-backend.railway.app/api/payments/moamalat/hash
✅ Health Check: https://eishro-backend.railway.app/health
```

---

## 🔧 تحديث Vercel Frontend

### في Vercel Dashboard:

1. اذهب إلى Project Settings
2. أضف Environment Variables:

```env
VITE_BACKEND_URL=https://eishro-backend.railway.app
VITE_API_BASE_URL=https://eishro-backend.railway.app/api
```

### تحديث Frontend Code

في `src/components/MoamalatRealLightbox.tsx:174`:

```typescript
// قبل (localhost ❌)
const response = await fetch('http://localhost:4000/api/moamalat/hash', {

// بعد (Railway ✅)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://eishro-backend.railway.app';
const response = await fetch(`${BACKEND_URL}/api/moamalat/hash`, {
```

---

## 📊 Database Migration إلى Railway

### خطوة 1: تصدير Database المحلي

```bash
# من Command Prompt المحلي
mysqldump -u root -p eishro_db > eishro_backup.sql

# إدخال كلمة المرور عند الطلب
```

### خطوة 2: استيراد إلى Railway

```bash
# الحصول على معلومات الاتصال من Railway
mysql -h {DB_HOST} -u {DB_USER} -p {DB_NAME} < eishro_backup.sql

# أو باستخدام Railway CLI
railway db:shell < eishro_backup.sql
```

---

## ✅ Verification Checklist

```
☐ Backend مُنشر على Railway
☐ Database MySQL متصل
☐ Environment Variables محددة
☐ /health endpoint يعمل
☐ /api/payments/moamalat/hash يعطي SecureHash
☐ Frontend يشير إلى Backend URL
☐ CORS مفعّل في Backend
☐ Payment gateway يعمل من Vercel
```

---

## 🔒 Security Checklist

```
☐ JWT_SECRET آمن وعشوائي
☐ MOAMALAT_SECRET محفوظ (لا تشاركه)
☐ Database Password قوي
☐ CORS مقيّد لـ Vercel domain فقط
☐ HTTPS مفعّل (Railway توفره تلقائياً)
☐ No console.log للبيانات الحساسة
☐ Input validation على جميع endpoints
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: Backend لا يتصل بـ Database

```bash
# تحقق من البيانات في Railway Dashboard
# Database → Variables
# تأكد من:
- DB_HOST صحيح (ليس localhost)
- DB_PORT = 3306
- DB_USER موجود
- DB_PASSWORD صحيحة
```

### المشكلة: Payment Hash يفشل

```bash
# تحقق من:
1. MOAMALAT_SECRET صحيح
2. Amount في الصيغة الصحيحة (× 1000)
3. DateTimeLocalTrxn بصيغة yyyymmddHHmm
```

### المشكلة: CORS Error

```typescript
// في app.ts
app.use(cors({
  origin: 'https://platform-eishro.vercel.app',  // ✅ صحيح
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

---

## 📱 اختبار من Postman

```
1. POST https://eishro-backend.railway.app/api/payments/moamalat/hash

Headers:
Content-Type: application/json

Body:
{
  "Amount": "50000",
  "DateTimeLocalTrxn": "202511131000",
  "MerchantId": "10081014649",
  "MerchantReference": "TEST-001",
  "TerminalId": "99179395"
}

Response:
{
  "secureHash": "ABC123DEF456..."
}
```

---

## 💰 التكاليف

**Railway Pricing:**
- Free tier: يكفي للتطوير
- Starter: $5-20/شهر (مع database)
- مع استخدام مكثف: يزيد

**Vercel:**
- Frontend: مجاني (Hobby plan)

---

## 🔄 عملية النشر المستمر (CI/CD)

عند كل `git push`:

```
1. Railway يكتشف التغييرات
2. يشغل Build Command
3. يشغل Start Command
4. إذا فشل → إصدار إشعار
5. إذا نجح → البيانات محدثة
```

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Community: https://discord.gg/railway
- Status: https://status.railway.app

---

**Next Step: تحديث Frontend لاستخدام Backend URL**

---

## 📝 ملاحظات ختامية

```
✅ هذا الحل يحل مشكلة بوابة الدفع بالكامل
✅ Database محفوظة وآمنة
✅ يمكن توسعة لاحقاً
✅ Infrastructure scalable

🎉 بعد هذا، سيعمل الدفع من Vercel بنجاح!
```
