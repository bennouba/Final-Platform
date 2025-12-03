# حل مشكلة خطأ Minimax API

## المشكلة
```
API Request Failed
Minimax error: invalid params, tool result's tool id(call_function_qqwfsmq82u5x_1) not found (2013)
```

## السبب
هذا الخطأ يحدث لأن النظام يحاول استدعاء أدوات الذكاء الاصطناعي من Minimax API بمعرفات أدوات غير صحيحة أو غير متوفرة.

## الحلول

### الحل السريع (الأسرع - موصى به)

**تعطيل Minimax API مؤقتاً لتجنب الأخطاء:**

1. **إنشاء ملف `.env` جديد** (إذا لم يكن موجوداً):
```bash
# في جذر المشروع
touch .env
```

2. **إضافة هذه الأسطر في الملف:**
```env
# تعطيل Minimax API لتجنب الأخطاء
VITE_MINIMAX_ENABLED=false
VITE_MINIMAX_API_KEY=demo_key
VITE_MINIMAX_TIMEOUT=5000
```

3. **إعادة تشغيل المشروع:**
```bash
npm run dev
# أو
npm run build && npm run preview
```

### الحل الدائم (إذا كنت تريد استخدام الذكاء الاصطناعي)

1. **الحصول على API Key صحيح من Minimax:**
   - اذهب إلى [Minimax API Dashboard](https://api.minimax.chat)
   - أنشئ حساب أو سجل دخول
   - احصل على API Key صالح

2. **تحديث ملف `.env`:**
```env
# تفعيل Minimax API مع API Key صحيح
VITE_MINIMAX_ENABLED=true
VITE_MINIMAX_API_KEY=your-actual-api-key-here
VITE_MINIMAX_API_URL=https://api.minimax.chat/v1
VITE_MINIMAX_TIMEOUT=5000
```

3. **إعادة تشغيل المشروع:**
```bash
npm run dev
```

## التحديثات المطبقة

تم تحديث الملف `src/services/enhancedApi.ts` بالتحسينات التالية:

### 1. فحص محسن للأخطاء
- تقليل عدد المحاولات لتجنب التكرار
- تحسين معالجة الأخطاء
- إضافة نظام fallback فعال

### 2. إدارة أفضل للـ API
- إمكانية تعطيل/تفعيل API حسب الحاجة
- فحص صحة API Key
- استجابات احتياطية ذكية

### 3. رسائل خطأ واضحة
- رسائل خطأ مفهومة باللغة العربية
- تفاصيل تقنية للمطورين
- تسجيل مفصل للأخطاء

## فحص الحالة

لتأكد من حالة API، افتح Developer Tools في المتصفح وشغّل هذا الأمر في Console:

```javascript
// فحص حالة Minimax API
fetch('/api/health')
  .then(r => r.json())
  .then(data => console.log('Backend Health:', data));

// أو فحص API service مباشرة
import enhancedApiService from './services/enhancedApi';
enhancedApiService.checkApiHealth().then(status => {
  console.log('API Status:', status);
  console.log('Current Config:', enhancedApiService.getAPIStatus());
});
```

## استكشاف الأخطاء

### إذا استمر الخطأ:
1. تأكد من إنشاء ملف `.env` في جذر المشروع
2. تأكد من كتابة `VITE_MINIMAX_ENABLED=false` بشكل صحيح
3. تأكد من إعادة تشغيل الخادم بعد التغيير
4. افحص Console للحصول على تفاصيل أكثر

### تحقق من التكوين:
```javascript
// في Console
console.log('Minimax Config:', {
  enabled: import.meta.env.VITE_MINIMAX_ENABLED,
  hasKey: !!import.meta.env.VITE_MINIMAX_API_KEY,
  keyLength: (import.meta.env.VITE_MINIMAX_API_KEY || '').length
});
```

## ملاحظات مهمة

- **الحل السريع يعطل ميزات الذكاء الاصطناعي** لكنه يمنع ظهور الأخطاء
- **التطبيق سيعمل بشكل طبيعي** مع تعطيل هذه الميزة
- **يمكن تفعيل الذكاء الاصطناعي لاحقاً** بإعداد API Key صحيح
- **الخطأ لا يؤثر على وظائف التجارة الإلكترونية الأساسية**

## الدعم

إذا استمرت المشكلة:
1. تأكد من استخدام آخر إصدار من الكود
2. احذف `node_modules` وأعد `npm install`
3. تأكد من صحة إعدادات البيئة
4. راجع console للحصول على أخطاء إضافية

---
**تاريخ الإصلاح:** 2025-11-29
**الإصدار:** v1.0
**المؤلف:** Kilo Code Assistant