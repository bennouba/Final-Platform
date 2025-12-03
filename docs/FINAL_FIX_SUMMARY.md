# ✅ حل نهائي لمشكلة "Failed to fetch" في إنشاء المتجر

## الملفات المصححة

### 1. **backend/src/index.ts** ✅
- **الإصلاح**: إضافة 5-دقيقة timeout لحماية الطلبات الكبيرة
```typescript
server.requestTimeout = 300000;  // 5 دقائق
server.headersTimeout = 300000;
```

### 2. **backend/src/app.ts** ✅
- **الإعدادات**: CORS، OPTIONS، body limits (25MB)، خدمة /assets
- **Timeout**: 120 ثانية في middleware

### 3. **backend/src/routes/index.ts** ✅
- **المسار**: `router.use(`${API_PREFIX}/stores`, storeRoutes);`

### 4. **backend/src/routes/storeRoutes.ts** ✅
- **المسار**: `POST /create-with-images` مع `uploadBothImages` middleware
- **معالجة الأخطاء**: dual-layer error handling

### 5. **backend/src/middleware/storeImageUpload.ts** ✅
- **التخزين المؤقت**: يحفظ الملفات أولاً في `.tmp-uploads/`
- **الدوال**:
  - `moveUploadedFiles()`: نقل الملفات من temp إلى `/assets/{slug}/{type}/`
  - `cleanupTempUploads()`: حذف المجلد المؤقت
  - `uploadBothImages()`: معالجة الرفع مع timeout 60 ثانية

### 6. **backend/src/services/storeGeneratorService.ts** ✅
- **التوليد**: إنشاء ملفات TS للتطوير و JSON للعرض الفوري
- **الملفات المُنتجة**:
  - `public/assets/{slug}/store.json` - بيانات المتجر الكامل
  - `public/assets/stores/index.json` - فهرس جميع المتاجر
  - `src/data/stores/{slug}/*` - ملفات TypeScript للتطوير

### 7. **backend/src/controllers/storeController.ts** ✅
- **Imports**: `moveUploadedFiles` من middleware
- **العملية**:
  1. Multer ينقل الملفات إلى `.tmp-uploads/`
  2. Controller ينقلها إلى `/assets/{slug}/{type}/`
  3. يستدعي `storeGeneratorService.generateStoreFiles()`
  4. يُرجع استجابة 201

### 8. **vite.config.ts** ✅
```typescript
proxy: {
  '/api': { target: 'http://localhost:4000', changeOrigin: true },
  '/health': { target: 'http://localhost:4000', changeOrigin: true }
}
```

### 9. **src/pages/CreateStorePage.tsx** ✅
- **المسار**: `/api/stores/create-with-images` (relative path)
- **FormData**: تتضمن `productsImageCounts` للتوزيع الصحيح

### 10. **.gitignore** ✅
- **المجلد المؤقت**: `.tmp-uploads/` معادة

## الخطوات للاختبار

### **A. اختبار صغير أولاً** (منتجين + صورتين)

```bash
# 1. شغّل الـ backend
cd backend && npm run dev

# 2. في نافذة أخرى، شغّل الـ frontend و backend معاً
npm run dev

# 3. افتح http://localhost:5174
# 4. إنشاء متجر بـ 2 منتج فقط و 2 صورة لكل منتج
```

**توقع النتائج**:
- ✅ صحة الخادم تظهر في console: `✅ Backend health check successful`
- ✅ لوج الـ server: `POST /api/stores/create-with-images`
- ✅ استجابة `201` مع `success: true`
- ✅ ملفات مُنتجة:
  - `public/assets/stores/index.json`
  - `public/assets/{slug}/store.json`
  - `public/assets/{slug}/logo/...`
  - `public/assets/{slug}/products/...`

### **B. اختبار كبير** (16 منتج + 64 صورة)

إذا نجح الاختبار الصغير:
```bash
# أعد الخطوات نفسها مع متجر 16 منتج
```

**إذا ظهر "Failed to fetch" مع الطلب الكبير**:
- زيادة timeout إلى 600 ثانية في `backend/src/index.ts`:
```typescript
server.requestTimeout = 600000;   // 10 دقائق
server.headersTimeout = 600000;
```

## تشخيص الأخطاء

| المشكلة | الحل |
|-------|------|
| POST لم يصل إلى الـ server | تحقق من Vite proxy في `vite.config.ts` |
| Multer error | تحقق من أن `.tmp-uploads/` قابلة للكتابة |
| Failed to move files | تحقق من صلاحيات مجلد `public/assets/` |
| JSON not generating | تحقق من استدعاء `storeGeneratorService` في controller |
| Timeout 5xx | زيادة `requestTimeout` في `backend/src/index.ts` |

## نقاط مهمة

1. **Temp Directory**: الملفات تُحفظ مؤقتاً في `.tmp-uploads/` ثم تُنقل
2. **Timeouts**: 300 ثانية (5 دقائق) كافية لمعظم الطلبات
3. **CORS**: مُفعّل على جميع localhost ports
4. **JSON Output**: يُنتج فوراً في `public/assets/` لعرض فوري

## التشغيل المستمر

```bash
# من الجذر - يشغّل frontend و backend معاً
npm run dev

# أو منفصل
npm run dev:frontend    # port 5174
npm run dev:backend     # port 4000
```

---

**آخر تحديث**: 19 نوفمبر 2025
**الحالة**: ✅ جاهز للاختبار
