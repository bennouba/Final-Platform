# دليل حل خطأ Minimax API

## المشكلة
```
API Request Failed
Minimax error: invalid params, tool result's tool id(call_function_jzh7qqso6s48_1) not found (2013)
```

## الحلول

### 1. فحص إعدادات API
```typescript
// تأكد من صحة إعدادات API في ملف الخدمات
const MINIMAX_API_CONFIG = {
  baseURL: 'https://api.minimax.chat',
  apiKey: 'your-valid-api-key', // تأكد من صحة الـ API Key
  timeout: 10000,
  retries: 3
};
```

### 2. إضافة معالجة أخطاء محسنة
```typescript
// في ملف src/services/api.ts
class ApiService {
  private async requestWithRetry<T>(
    endpoint: string, 
    options: RequestInit = {},
    maxRetries: number = 3
  ): Promise<ApiResponse<T>> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(endpoint, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MINIMAX_API_CONFIG.apiKey}`,
            ...options.headers,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`API Error (Attempt ${attempt}):`, errorData);
          
          if (response.status === 401) {
            throw new Error('Unauthorized: Check your API key');
          } else if (response.status === 2013) {
            throw new Error('Invalid parameters: Check tool ID and parameters');
          }
        }

        return await response.json();
      } catch (error) {
        console.error(`Request failed (Attempt ${attempt}):`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}
```

### 3. إضافة فحص صحة البيانات
```typescript
// وظيفة للتحقق من صحة معرف الأداة قبل الإرسال
function validateToolId(toolId: string): boolean {
  // قائمة بالمعرفات الصحيحة للأدوات
  const validToolIds = [
    'call_function_jzh7qqso6s48_1',
    'other_valid_tool_id',
    // أضف المزيد حسب الحاجة
  ];
  
  return validToolIds.includes(toolId);
}

// استخدام التحقق
const callTool = async (toolId: string, params: any) => {
  if (!validateToolId(toolId)) {
    throw new Error(`Invalid tool ID: ${toolId}`);
  }
  
  // تنفيذ استدعاء الأداة
  return await minimaxAPI.callTool(toolId, params);
};
```

### 4. إضافة Logging مفصل
```typescript
// إضافة Logging مفصل لتتبع الأخطاء
const logAPIRequest = (url: string, method: string, data: any) => {
  console.log('📡 API Request:', {
    url,
    method,
    timestamp: new Date().toISOString(),
    data: JSON.stringify(data, null, 2)
  });
};

const logAPIResponse = (url: string, status: number, response: any) => {
  console.log('📨 API Response:', {
    url,
    status,
    timestamp: new Date().toISOString(),
    response: JSON.stringify(response, null, 2)
  });
};
```

### 5. تكوين fallback للحالات الطارئة
```typescript
// نظام fallback عند فشل API
const apiService = {
  async callToolWithFallback(toolId: string, params: any) {
    try {
      // محاولة الاستدعاء الأساسي
      return await this.callTool(toolId, params);
    } catch (error) {
      console.warn('Primary API failed, trying fallback:', error);
      
      // استخدام حل بديل
      return await this.getFallbackResponse(toolId, params);
    }
  },
  
  async getFallbackResponse(toolId: string, params: any) {
    // إرجاع استجابة افتراضية أو استخدام خدمة بديلة
    return {
      success: false,
      fallback: true,
      message: 'API temporarily unavailable',
      data: null
    };
  }
};
```

## خطوات التشخيص

### 1. فحص Network Tab في المتصفح
- افتح Developer Tools
- انتقل إلى Network tab
- ابحث عن الطلبات الفاشلة مع رمز خطأ 2013
- فحص headers وpayload للطلب

### 2. فحص Console Logs
- ابحث عن أخطاء JavaScript
- فحص رسائل الخطأ المفصلة

### 3. فحص API Configuration
```typescript
// تأكد من صحة هذه الإعدادات في ملفات البيئة
VITE_MINIMAX_API_KEY=your_api_key_here
VITE_MINIMAX_API_URL=https://api.minimax.chat/v1
VITE_MINIMAX_TIMEOUT=10000
```

### 4. اختبار API مباشرة
```bash
# اختبار API باستخدام curl
curl -X POST https://api.minimax.chat/v1/tools/call \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tool_id": "call_function_jzh7qqso6s48_1",
    "parameters": {}
  }'
```

## نقاط مهمة للمراجعة

1. **API Key**: تأكد من صحة وصلاحية API Key
2. **Tool ID**: تأكد من صحة معرف الأداة
3. **Parameters**: تأكد من صحة المعاملات المُرسلة
4. **Network**: تأكد من عدم وجود مشاكل في الشبكة
5. **Rate Limits**: تأكد من عدم تجاوز حدود الاستخدام

## في حالة استمرار المشكلة

إذا استمرت المشكلة بعد تطبيق هذه الحلول:
1. تواصل مع دعم Minimax
2. راجع documentation الرسمي لـ Minimax API
3. تحقق من آخر تحديثات في الـ service