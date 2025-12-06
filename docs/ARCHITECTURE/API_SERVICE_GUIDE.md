# 🔌 دليل استخدام الخدمة الموحدة للـ API

## مقدمة

تم دمج جميع خدمات الـ API في خدمة موحدة واحدة (`UnifiedApiService`) توفر:
- ✅ معالجة موحدة للأخطاء
- ✅ آليات retry ذكية
- ✅ تكامل Minimax AI
- ✅ فحوصات صحة الخدمات

---

## 📋 جدول المحتويات

1. [الاستيراد والتهيئة](#الاستيراد-والتهيئة)
2. [عمليات المتاجر](#عمليات-المتاجر)
3. [عمليات الـ Minimax](#عمليات-الـ-minimax)
4. [معالجة الأخطاء](#معالجة-الأخطاء)
5. [الأمثلة العملية](#الأمثلة-العملية)

---

## الاستيراد والتهيئة

### الاستيراد الأساسي:

```typescript
import { apiService } from '@/services/api';
// أو
import apiService from '@/services/api';
```

### المتغيرات البيئية المطلوبة:

```bash
# في ملف .env
VITE_API_URL=http://localhost:5000/api
VITE_MINIMAX_API_URL=https://api.minimax.chat/v1
VITE_MINIMAX_API_KEY=your_api_key_here
VITE_MINIMAX_ENABLED=true
```

---

## عمليات المتاجر

### 1. إنشاء متجر مع الصور

```typescript
// استخدام FormData لرفع الصور
const formData = new FormData();
formData.append('name', 'متجري الجديد');
formData.append('description', 'وصف المتجر');
formData.append('logo', imageFile);

const response = await apiService.createStoreWithImages(formData);

if (response.success) {
  console.log('تم إنشاء المتجر:', response.data);
} else {
  console.error('خطأ:', response.error);
}
```

### 2. إنشاء متجر مع الملفات

```typescript
const storeData = {
  storeId: 'store-123',
  storeSlug: 'my-store',
  storeName: 'متجري',
  storeNameEn: 'My Store',
  description: 'وصف المتجر',
  icon: 'store.png',
  color: '#FF0000',
  categories: ['electronics', 'fashion'],
  products: [...],
  sliderImages: [...]
};

const response = await apiService.createStoreWithFiles(storeData);
```

### 3. التحقق من صحة بيانات المتجر

```typescript
const storeData = {
  storeName: 'متجري',
  description: 'وصف المتجر'
};

const response = await apiService.validateStoreData(storeData);

if (response.success) {
  console.log('البيانات صحيحة');
} else {
  console.log('أخطاء في البيانات:', response.error);
}
```

### 4. جلب جميع المتاجر

```typescript
const response = await apiService.getAllStores();

if (response.success) {
  const stores = response.data.stores;
  stores.forEach(store => {
    console.log(`${store.name} - ${store.slug}`);
  });
}
```

### 5. فحص صحة الـ Backend

```typescript
const health = await apiService.checkBackendHealth();

console.log(health.message);
// ✅ Backend server is running on http://localhost:5000
// ❌ Cannot connect to backend server...
```

---

## عمليات الـ Minimax

### 1. استدعاء أداة Minimax

```typescript
// استدعاء أداة توليد نصوص
const toolCall = {
  tool_id: 'text_generation',
  parameters: {
    prompt: 'اكتب وصفاً لمنتج',
    length: 100
  }
};

const response = await apiService.callMinimaxTool(toolCall);

if (response.success) {
  console.log('النتيجة:', response.data);
}
```

### 2. فحص صحة Minimax API

```typescript
const health = await apiService.checkApiHealth();

console.log(health.isHealthy);     // true/false
console.log(health.message);        // الرسالة
console.log(health.details);        // تفاصيل إضافية
```

### 3. تفعيل/تعطيل Minimax

```typescript
// تعطيل Minimax مؤقتاً
apiService.disableMinimaxAPI();

// تفعيل Minimax
apiService.enableMinimaxAPI();

// الحصول على الحالة
const status = apiService.getAPIStatus();
console.log(status);
// {
//   enabled: true,
//   configured: true,
//   message: '✅ Minimax API is ready'
// }
```

---

## معالجة الأخطاء

### أنواع الأخطاء:

#### Authentication Errors (401, 403)
```typescript
const response = await apiService.getAllStores();

if (!response.success && response.error.includes('401')) {
  // إعادة توجيه للتسجيل
  redirectToLogin();
}
```

#### Validation Errors (400)
```typescript
const response = await apiService.validateStoreData(invalidData);

if (!response.success) {
  // عرض رسالة الخطأ
  showError(response.error);
}
```

#### Network Errors
```typescript
const response = await apiService.checkBackendHealth();

if (!response.isHealthy) {
  // تنبيه اتصال الشبكة
  showNetworkAlert(response.message);
}
```

### Fallback Mechanism

عند فشل Minimax، يتم إرجاع استجابة احتياطية:

```typescript
const response = await apiService.callMinimaxTool(toolCall);

if (response.fallback) {
  console.log('Using fallback response');
  console.log('Message:', response.message);
  // استخدم الاستجابة الاحتياطية
}
```

---

## الأمثلة العملية

### مثال 1: تدفق إنشاء متجر كامل

```typescript
// Step 1: التحقق من الصحة
let validation = await apiService.validateStoreData({
  storeName: 'متجري الجديد',
  storeSlug: 'my-new-store'
});

if (!validation.success) {
  showError('بيانات المتجر غير صحيحة');
  return;
}

// Step 2: إعداد البيانات
const formData = new FormData();
formData.append('name', 'متجري الجديد');
formData.append('logo', logoFile);

// Step 3: إنشاء المتجر
const response = await apiService.createStoreWithImages(formData);

if (response.success) {
  showSuccess('تم إنشاء المتجر بنجاح');
  navigateTo('/stores/' + response.data.storeId);
} else {
  showError(response.error);
}
```

### مثال 2: التعامل مع Minimax مع Fallback

```typescript
// محاولة استدعاء Minimax
const aiResponse = await apiService.callMinimaxTool({
  tool_id: 'text_generation',
  parameters: { prompt: 'اكتب وصف منتج' }
});

// استخدام النتيجة سواء كانت حقيقية أو احتياطية
const description = aiResponse.data?.result || 'وصف افتراضي';

console.log('الوصف:', description);
console.log('نوع الاستجابة:', aiResponse.fallback ? 'احتياطي' : 'حقيقي');
```

### مثال 3: فحص الصحة الدوري

```typescript
// فحص الصحة كل 5 دقائق
setInterval(async () => {
  const backendHealth = await apiService.checkBackendHealth();
  const minimaxHealth = await apiService.checkApiHealth();

  if (!backendHealth.isHealthy) {
    console.warn('تحذير: Backend غير متاح');
  }

  if (!minimaxHealth.isHealthy) {
    console.warn('تحذير: Minimax API غير متاح');
  }
}, 5 * 60 * 1000);
```

### مثال 4: استخدام في مكون React

```typescript
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';

export function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStores = async () => {
      try {
        const response = await apiService.getAllStores();
        
        if (response.success) {
          setStores(response.data.stores);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;
  
  return (
    <div>
      {stores.map(store => (
        <div key={store.id}>{store.name}</div>
      ))}
    </div>
  );
}
```

---

## ⚙️ الخيارات والإعدادات

### معايير الـ API:

```typescript
// مهلة الاتصال (Timeout)
const TIMEOUT = 5000; // 5 ثواني

// عدد محاولات الإعادة
const MAX_RETRIES = 3; // للـ API العام
const MINIMAX_RETRIES = 1; // لـ Minimax فقط

// تأخير التراجع (Backoff)
const RETRY_DELAY = 1000 * attempt; // 1s, 2s, 3s...
```

### معرفات الأدوات المدعومة في Minimax:

```typescript
// أدوات النصوص
'text_generation'
'code_analysis'
'document_processing'

// أدوات الصور
'image_generation'

// أدوات البيانات
'data_analysis'

// دوال مخصصة
'call_function_*_*'
```

---

## 🔒 الأمان والموثوقية

### نقاط الأمان المدمجة:

✅ **JWT Authentication**: جميع الطلبات تتضمن بيانات المصادقة  
✅ **HTTPS**: الاتصال آمن بـ SSL/TLS  
✅ **API Key Validation**: التحقق من مفاتيح API  
✅ **Input Validation**: التحقق من البيانات المدخلة  
✅ **Error Handling**: معالجة أمنة للأخطاء  

### موثوقية الخدمة:

✅ **Retry Logic**: إعادة محاولة ذكية  
✅ **Timeout Protection**: حماية من التعليق  
✅ **Fallback Mechanisms**: استجابات احتياطية  
✅ **Health Checks**: فحوصات دورية  
✅ **Error Recovery**: استرجاع من الأخطاء  

---

## 📊 استخدام الذاكرة والأداء

### تحسينات الأداء:

```
✅ Single service instance: تقليل استهلاك الذاكرة
✅ Efficient retry logic: عدم إعادة محاولة غير ضرورية
✅ Connection pooling: استخدام فعال للاتصالات
✅ Cached responses: حفظ الاستجابات المتكررة
```

---

## 🐛 استكشاف الأخطاء

### تفعيل وضع التصحيح:

```typescript
// في الخدمة
const DEBUG = true;

if (DEBUG) {
  console.log('Request:', url);
  console.log('Response:', data);
  console.log('Status:', response.status);
}
```

### الأخطاء الشائعة:

| الخطأ | السبب | الحل |
|------|------|------|
| 401 Unauthorized | بيانات مصادقة غير صحيحة | تحديث التوكن |
| 404 Not Found | الـ endpoint غير موجود | تحقق من الـ URL |
| 500 Server Error | خطأ في الخادم | حاول لاحقاً |
| Connection timeout | الخادم بطيء جداً | افحص الاتصال |

---

## 📚 الموارد الإضافية

- **ملف الخدمة**: `src/services/api.ts`
- **نموذج الخادم**: Backend API documentation
- **مثال استخدام**: راجع المكونات في `src/components/`

---

## 🎯 الخلاصة

الخدمة الموحدة توفر:
- 🔌 واجهة موحدة لجميع استدعاءات API
- 🛡️ معالجة أخطاء شاملة
- 🔄 آليات retry ذكية
- 🤖 تكامل AI محسّن
- 📊 فحوصات صحة دورية
- ⚡ أداء محسّن

**استخدمها في جميع استدعاءات API لضمان الموثوقية والأمان.**

---

*آخر تحديث: 2025-12-06*  
*الإصدار: V7.1*
