# 🔍 دليل التشخيص السريع

**آخر تحديث:** 6 ديسمبر 2025

---

## ⚡ أوامر التشخيص الأساسية

### 1. التحقق من حالة الخادم

```bash
npm run dev
# أو
yarn dev
```

### 2. التحقق من الأخطاء

```bash
npm run lint
npm run type-check
```

### 3. فحص قاعدة البيانات

```bash
npm run test-db
```

---

## 🐛 المشاكل الشائعة

| المشكلة | الحل |
|--------|-----|
| **Port is already in use** | `lsof -i :3000` ثم `kill -9 <PID>` |
| **Module not found** | `npm install` أو `yarn install` |
| **CORS error** | تحقق من CORS config في `.env.local` |
| **Database connection failed** | تحقق من connection string |

---

## 📞 تحتاج مساعدة أكثر؟

اطلع على [COMMON_ISSUES.md](COMMON_ISSUES.md) للمزيد من الحلول المفصلة.
