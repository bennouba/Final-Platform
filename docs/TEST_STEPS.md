# خطوات الاختبار بدقة عالية

## الخطوة 1: التحضير

```bash
# تحقق من أن node_modules موجود
ls backend/node_modules

# إذا لم يكن موجود:
cd backend
npm install
cd ..
```

## الخطوة 2: بناء المشروع

```bash
# بناء الـ backend
cd backend && npm run build

# بناء الـ frontend
cd .. && npm run build
```

**النتيجة المتوقعة**: 
- ✅ `dist/` موجود في الجذر
- ✅ `backend/dist/` موجود

## الخطوة 3: تشغيل الخادم والواجهة

**الخيار 1: تشغيل موحد (الأفضل)**
```bash
# من الجذر
npm run dev
```

**النتيجة المتوقعة**:
```
[FRONTEND] VITE v6.4.1 ready in 123 ms

[BACKEND] ✅ Server is running on http://localhost:4000
[BACKEND] 🏥 Health check: http://localhost:4000/health
```

**الخيار 2: تشغيل منفصل** (إذا أردت مراقبة منفصلة)
```bash
# نافذة 1
cd backend && npm run dev

# نافذة 2 (من الجذر)
npm run dev:frontend
```

## الخطوة 4: الاختبار الفعلي

### **Part A: اختبار الصحة أولاً**

1. افتح DevTools في http://localhost:5174
2. افتح Network tab
3. افتح Console

**توقع الرسائل**:
```
✅ Backend health check successful via http://localhost:4000/health: {status: 'ok', ...}
✅ Backend is healthy, proceeding with store creation
```

### **Part B: متجر اختبار صغير (2 منتج فقط)**

1. **الخطوة 1**: معلومات صاحب المتجر
   - اسم صاحب: `اختبار`
   - البريد: `test@test.com`
   - الهاتف: `0925555777`
   - **ثم Next**

2. **الخطوة 2**: معلومات المتجر
   - الاسم (عربي): `متجر اختبار صغير`
   - الاسم (إنجليزي): `test-small`
   - الوصف: `اختبار بسيط`
   - الفئات: اختر أي 2
   - النطاق الفرعي: `test-small-shop`
   - **ثم Next**

3. **الخطوات 3-6**: تحميل صور/شهادات (اختياري للاختبار)
   - **ثم Next**

4. **الخطوة 5**: إضافة منتجات (2 فقط)
   - **المنتج 1**:
     - الاسم: `منتج اختبار 1`
     - السعر: `100`
     - الصور: اختر **صورة واحدة فقط**
     - **Add Product**
   
   - **المنتج 2**:
     - الاسم: `منتج اختبار 2`
     - السعر: `200`
     - الصور: اختر **صورة واحدة فقط**
     - **Add Product**
   
   - **ثم Next**

5. **الخطوة 6**: صور السلايدر (اختياري)
   - **ثم Next**

6. **الخطوة 7**: موقع المخزن
   - العنوان: `طرابلس`
   - المدينة: `tripoli`
   - الهاتف: `0925555777`
   - **ثم Next**

7. **الخطوة 8**: كلمة المرور
   - كلمة المرور: `Password123!`
   - تأكيد: `Password123!`
   - **إنشاء المتجر**

### **Part C: مراقبة النتائج**

**في Console - ابحث عن**:
```
🔍 Checking backend health before store creation...
✅ Backend health check successful via http://localhost:4000/health
✅ Backend is healthy, proceeding with store creation
Checking if store/emails already exist in system...
Preparing data for store creation...
Products count: 2
Slider images count: 0
📤 Sending store data to backend API...
FormData prepared with: {storeId: ..., storeSlug: 'test-small-shop', productsCount: 2, ...}
✅ Store created successfully on backend
```

**في Network tab - ابحث عن**:
- **Request**: `POST http://localhost:4000/api/stores/create-with-images`
- **Status**: `201` ✅ (أو `200`)
- **Response**: `{success: true, message: "Store created successfully..."}`

**في server logs - ابحث عن**:
```
POST /api/stores/create-with-images
📥 Received POST /create-with-images
✅ Upload middleware passed
📁 Moving 3 file fields from temp directory...
✅ Files moved successfully to /assets/test-small-shop/
✅ Store created successfully on backend
```

### **Part D: التحقق من الملفات المُنتجة**

```bash
# افتح explorer وتحقق من:
public/assets/stores/
├── index.json  ✅ (يجب أن يحتوي على "test-small-shop")

public/assets/test-small-shop/
├── store.json  ✅
├── logo/       ✅ (قد يكون فارغ)
├── products/   ✅ (يجب أن يحتوي على صورتين)
└── sliders/    ✅ (قد يكون فارغ)
```

### **Part E: اختبار العرض**

1. افتح الصفحة الرئيسية: http://localhost:5174
2. ابحث عن "متجر اختبار صغير"
3. انقر عليه وتحقق من:
   - ✅ الاسم واللوجو
   - ✅ المنتجات الاثنان موجودان
   - ✅ الصور تظهر

## الخطوة 5: اختبار المتجر الكبير (16 منتج)

بعد نجاح الاختبار الصغير:

```bash
# استخدم بيانات المتجر الفعلي من CreateStorePage.tsx
# (16 منتج + 64 صورة)
```

**توقع**:
- الطلب يأخذ 10-30 ثانية
- Status `201` في Network
- رسالة نجاح في Console

## استكشاف الأخطاء

### إذا رأيت "Failed to fetch"

1. **تحقق من الـ server**:
   ```bash
   # في terminal الـ backend
   # يجب أن ترى: ✅ Server is running on http://localhost:4000
   ```

2. **تحقق من الـ logs**:
   ```
   لو لم تر "POST /api/stores/create-with-images" → الطلب لم يصل
   لو رأيت error → الخادم توقف أثناء المعالجة
   ```

3. **تحقق من timeout**:
   ```bash
   # إذا استغرق الطلب 5+ دقائق، زيادة timeout في:
   # backend/src/index.ts
   server.requestTimeout = 600000;  // 10 دقائق
   ```

### إذا رأيت "Upload error"

- تحقق من صلاحيات `.tmp-uploads/`
- تحقق من صلاحيات `public/assets/`

### إذا لم تظهر الملفات

```bash
# تحقق من المسار
ls -la public/assets/test-small-shop/

# يجب أن ترى:
# -rw-r--r-- store.json
# drwxr-xr-x products/
```

## الملخص السريع

| الخطوة | الأمر | النتيجة المتوقعة |
|-------|-----|-----------------|
| 1. تشغيل | `npm run dev` | Frontend ✅ و Backend ✅ |
| 2. اختبار صحة | Console | `Backend health: ok` |
| 3. متجر صغير | Browser | `201` و `success: true` |
| 4. ملفات | File System | `store.json` موجود |
| 5. عرض | الصفحة الرئيسية | المتجر يظهر |
| 6. متجر كبير | Browser | 10-30 ثانية ثم `201` |

---

**إذا استمرت المشكلة**: أرسل:
- رقم السطر من Network tab
- رسالة الخطأ من Console
- سطر من لوج الـ server
