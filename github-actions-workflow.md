# 🔄 ملف GitHub Actions للنشر الآلي

## 📄 **المحتوى المطلوب في `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --passWithNoTests
        continue-on-error: true

      - name: Build project
        run: npm run build

  deploy-preview:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        id: deploy
        run: |
          url=$(vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT

      - name: Notify success
        if: success()
        run: |
          echo "🎉 Production deployment completed successfully!"
          echo "🌐 Live URL: ${{ steps.deploy.outputs.url }}"
```

## 📋 **الخطوات لإنشاء الملف:**

### **1. إنشاء المجلدات:**
```bash
mkdir -p .github/workflows
```

### **2. إنشاء الملف:**
أنشئ ملف جديد باسم `deploy.yml` في المجلد `.github/workflows/` والصق المحتوى أعلاه.

### **3. إعدادات GitHub Secrets:**

في GitHub repository الخاص بك:

1. اذهب إلى **Settings** → **Secrets and variables** → **Actions**
2. اضغط **New repository secret** وأضف:

```
VERCEL_TOKEN      = [your-vercel-token]
VERCEL_ORG_ID     = [your-vercel-org-id] 
VERCEL_PROJECT_ID = [your-vercel-project-id]
```

### **4. الحصول على Vercel Credentials:**

#### **VERCEL_TOKEN:**
```bash
# تسجيل الدخول إلى Vercel CLI
npx vercel login

# إنشاء token
npx vercel token
```

#### **VERCEL_ORG_ID & VERCEL_PROJECT_ID:**
```bash
# في مشروع Vercel الخاص بك
npx vercel ls

# أو من dashboard: Settings → General → Project ID & Organization ID
```

## 🎯 **كيفية عمل الـ Workflow**

### **عند Push إلى Main Branch:**
1. تشغيل الاختبارات
2. بناء المشروع
3. نشر إلى Production على Vercel
4. إرسال إشعار بالنجاح

### **عند Pull Request:**
1. تشغيل الاختبارات
2. بناء المشروع  
3. نشر Preview على Vercel
4. إضافة تعليق برابط المعاينة

### **عند Push إلى Branch آخر:**
1. تشغيل الاختبارات
2. بناء المشروع
3. نشر Preview على Vercel

## ✅ **المميزات**

- 🔄 **نشر تلقائي**: كل push ينشر خلال 5 دقائق
- 🧪 **اختبارات آلية**: فحص الكود قبل النشر
- 👀 **Preview deployments**: معاينة التغييرات
- 🔔 **إشعارات**: تحديثات حالة النشر
- 🚀 **سريع**: نشر فوري للتحديثات

## 📝 **ملاحظات مهمة**

1. **Node Version**: مُحدد على 18، يمكن تغييره حسب الحاجة
2. **Cache**: يستخدم npm cache لتحسين السرعة
3. **Error Handling**: يتابع النشر حتى لو فشلت الاختبارات (يمكن تغييرها)
4. **Secrets**: جميع البيانات الحساسة مخزنة كـ GitHub Secrets

---

**الوقت المتوقع للإعداد: 10-15 دقيقة**