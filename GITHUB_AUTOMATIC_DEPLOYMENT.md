# 🔄 إعداد النشر الآلي عبر GitHub + Vercel

## 🎯 **الهدف**
إعداد نظام نشر تلقائي حيث كل تغيير في GitHub ينشر فوراً على Vercel

## 📋 **الخطوات التفصيلية**

### **1. تحضير GitHub Repository**

#### **أ. رفع الكود إلى GitHub:**
```bash
# تهيئة repository محلياً
git init
git add .
git commit -m "Initial commit - Eishro Platform ready for deployment"

# ربط مع GitHub repository
git remote add origin https://github.com/your-username/eishro-platform.git

# رفع الكود
git push -u origin main
```

#### **ب. التأكد من الملفات الأساسية:**
- ✅ `package.json` - موجود
- ✅ `vercel.json` - موجود ومُعد
- ✅ `src/` - كود الفرونت إند
- ✅ `backend/` - كود الباكيند

### **2. ربط Vercel مع GitHub**

#### **أ. إنشاء حساب Vercel:**
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخولك بحساب GitHub
3. اضغط "New Project"

#### **ب. استيراد Repository:**
1. اختر "Import Git Repository"
2. اختر repository `eishro-platform`
3. اضغط "Import"

#### **ج. إعدادات المشروع:**
```json
{
  "Framework Preset": "Vite",
  "Root Directory": "./", // أو مجلد الـ frontend إذا كان منفصلاً
  "Build Command": "npm run build",
  "Output Directory": "dist",
  "Install Command": "npm ci --include=dev"
}
```

### **3. تكوين Environment Variables**

#### **في Vercel Dashboard:**
اضغط على المشروع → Settings → Environment Variables

```env
# Frontend Configuration
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_ENV=production

# Database (للـ frontend queries إذا لزم الأمر)
VITE_DB_URL=https://your-neon-mysql-connection-string

# أي متغيرات أخرى مطلوبة للفرونت إند
```

### **4. إعداد GitHub Actions (اختياري لكن مُوصى)**

#### **إنشاء ملف `.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### **5. إعدادات Domain المخصص (اختياري)**

#### **ربط Domain:**
1. في Vercel Dashboard → Settings → Domains
2. أضف domainك: `www.eishro.com` أو `eishro-platform.vercel.app`
3. اتبع تعليمات DNS

### **6. اختبار النظام**

#### **اختبار النشر التلقائي:**
```bash
# إنشاء تغيير بسيط
echo "<!-- Test deployment -->" >> src/App.tsx

# Commit and push
git add src/App.tsx
git commit -m "Test deployment trigger"
git push origin main

# النتيجة: Vercel ينشر تلقائياً خلال 2-3 دقائق
```

## 🎯 **كيفية عمل النظام**

### **📊 Flow Diagram:**
```
GitHub Push → GitHub Actions → Vercel Webhook → Automatic Deployment
     ↓              ↓                    ↓              ↓
   Code Change  →  Build Process    →  Trigger      →  Live Site
```

### **⏱️ Timeline:**
- **Push إلى GitHub**: فوري
- **بداية البناء**: خلال 30 ثانية
- **البناء**: 2-5 دقائق (حسب حجم المشروع)
- **النشر**: فوري بعد انتهاء البناء
- **الوصول**: رابط Vercel محدث

### **🔔 الإشعارات:**
- GitHub: Email عن حالة الـ workflow
- Vercel: Email عن حالة النشر
- Slack/Discord: إعدادات اختيارية

## ✅ **فوائد النشر الآلي**

### **🚀 السرعة:**
- نشر فوري لكل تغيير
- لا حاجة للنشر اليدوي
- تجربة سريعة للتحديثات

### **🛡️ الموثوقية:**
- اختبارات آلية قبل النشر
- rollback سريع للنسخ السابقة
- إحصائيات مفصلة عن الأداء

### **👥 الفريق:**
- نشر متسق لجميع أعضاء الفريق
- مراجعة كود مع deploy preview
- تعاون سهل في التطوير

## 🔧 **إعدادات متقدمة**

### **Preview Deployments:**
كل pull request ينشئ رابط تجريبي لمراجعة التغييرات قبل الدمج.

### **Production Branch:**
يمكن تحديد branch مختلفة للإنتاج (مثل `production`).

### **Custom Build Scripts:**
```json
// في package.json
{
  "scripts": {
    "build:vercel": "npm run build",
    "deploy": "vercel --prod"
  }
}
```

## 📈 **مراقبة الأداء**

### **Vercel Analytics:**
- Core Web Vitals
- Page Speed Insights
- Error Tracking
- Usage Statistics

### **GitHub Insights:**
- Workflow success rates
- Deployment frequency
- Build times

## 🎉 **النتيجة النهائية**

بعد إكمال هذه الإعدادات ستحصل على:

- ✅ **نشر تلقائي**: كل push ينشر خلال 5 دقائق
- ✅ **معاينة التغييرات**: لكل PR رابط تجريبي
- ✅ **موثوقية عالية**: نظام backup وrollback
- ✅ **مراقبة شاملة**: إحصائيات وتقارير مفصلة

---

## 📞 **الدعم**
- وثائق Vercel: [vercel.com/docs](https://vercel.com/docs)
- GitHub Actions: [github.com/features/actions](https://github.com/features/actions)

*الوقت المتوقع للإعداد: 15-30 دقيقة*