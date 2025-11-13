# 🚀 EISHRO Backend Setup Guide

## 📋 خطوات إنشاء Backend Express.js

---

## 1️⃣ إعداد المشروع الأساسي

### خطوة 1: إنشاء مجلد Backend
```bash
# انتقل إلى مجلد المشروع
cd c:\Users\dataf\Downloads

# أنشئ مجلد جديد للـ backend
mkdir eishro-backend
cd eishro-backend
```

### خطوة 2: تهيئة NPM Project
```bash
npm init -y
```

### خطوة 3: تثبيت المكتبات المطلوبة

**الأساسيات:**
```bash
npm install express cors dotenv helmet body-parser
```

**قاعدة البيانات:**
```bash
npm install mysql2 sequelize
```

**المصادقة:**
```bash
npm install jsonwebtoken bcryptjs
```

**التحقق:**
```bash
npm install joi express-validator
```

**الأدوات:**
```bash
npm install nodemon crypto axios
```

**للتطوير:**
```bash
npm install --save-dev typescript @types/express @types/node ts-node
```

---

## 2️⃣ بنية المشروع

```
eishro-backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── environment.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── orderController.ts
│   │   ├── paymentController.ts
│   │   ├── couponController.ts
│   │   ├── productController.ts
│   │   └── userController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── couponRoutes.ts
│   │   ├── productRoutes.ts
│   │   └── userRoutes.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Order.ts
│   │   ├── Product.ts
│   │   ├── Coupon.ts
│   │   └── Payment.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── moamalat.ts
│   │   └── validators.ts
│   └── app.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3️⃣ ملف Configuration (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eishro_db

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Moamalat
MOAMALAT_MID=10081014649
MOAMALAT_TID=99179395
MOAMALAT_SECRET=3a488a89b3f7993476c252f017c488bb
MOAMALAT_ENV=sandbox

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Production
# PORT=5000
# NODE_ENV=production
# FRONTEND_URL=https://platform-eishro.vercel.app
```

---

## 4️⃣ ملف package.json

```json
{
  "name": "eishro-backend",
  "version": "1.0.0",
  "description": "EISHRO E-commerce Platform Backend API",
  "main": "dist/app.js",
  "scripts": {
    "dev": "ts-node src/app.ts",
    "start": "node dist/app.js",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "helmet": "^7.0.0",
    "body-parser": "^1.20.2",
    "mysql2": "^3.6.5",
    "sequelize": "^6.35.2",
    "jsonwebtoken": "^9.1.2",
    "bcryptjs": "^2.4.3",
    "joi": "^17.11.0",
    "express-validator": "^7.0.0",
    "nodemon": "^3.0.2",
    "crypto": "^1.0.1",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/bcryptjs": "^2.4.6",
    "ts-node": "^10.9.2"
  }
}
```

---

## 5️⃣ ملف tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 6️⃣ الملفات الأساسية المطلوبة

**سيتم إنشاؤها في الخطوة التالية:**
- ✅ src/app.ts (Express App)
- ✅ src/config/database.ts (MySQL Connection)
- ✅ src/config/environment.ts (Environment Variables)
- ✅ src/models/* (Database Models)
- ✅ src/controllers/* (Business Logic)
- ✅ src/routes/* (API Routes)
- ✅ src/middleware/auth.ts (JWT Auth)
- ✅ src/utils/moamalat.ts (Payment Hash Generator)

---

## 🚀 للبدء السريع:

```bash
# 1. إنشاء المشروع
npm init -y
npm install express cors dotenv mysql2 jsonwebtoken bcryptjs joi

# 2. البناء
npm run build

# 3. التطوير
npm run dev

# 4. الإنتاج
npm start
```

---

## 📦 الخطوة التالية:

**سيتم إنشاء الملفات الفعلية للـ Backend في الخطوة القادمة**
