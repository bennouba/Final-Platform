# 🏗️ PHASE 3: Backend Architecture Plan - EISHRO Platform

**الهدف:** بناء Backend متقن وآمن مع نظام صلاحيات شامل

---

## 📊 نظرة عامة على الهندسة المعمارية

```
┌─────────────────────────────────────────────────────────┐
│                   Vercel Frontend                       │
│              (React + TypeScript + Vite)                │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS API Calls
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   Railway Backend                       │
│          (Express.js + TypeScript + Sequelize)          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  1. Routes Layer (Endpoints)                     │  │
│  │     - /api/auth/*                               │  │
│  │     - /api/orders/*                             │  │
│  │     - /api/payments/*                           │  │
│  │     - /api/products/*                           │  │
│  │     - /api/coupons/*                            │  │
│  │     - /api/admin/*                              │  │
│  └──────────────────────────────────────────────────┘  │
│                       ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  2. Middleware Layer                             │  │
│  │     - Authentication (JWT)                       │  │
│  │     - Authorization (RBAC)                       │  │
│  │     - Validation                                 │  │
│  │     - Error Handling                             │  │
│  │     - Rate Limiting                              │  │
│  └──────────────────────────────────────────────────┘  │
│                       ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  3. Controller/Service Layer                     │  │
│  │     - Business Logic                             │  │
│  │     - Data Processing                            │  │
│  │     - External API Calls (Moamalat)              │  │
│  └──────────────────────────────────────────────────┘  │
│                       ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  4. Data Access Layer (Repository/DAO)           │  │
│  │     - Database Queries (Sequelize ORM)           │  │
│  │     - Data Validation                            │  │
│  │     - Transaction Management                     │  │
│  └──────────────────────────────────────────────────┘  │
│                       ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  5. Utilities & Helpers                          │  │
│  │     - JWT Generation/Verification                │  │
│  │     - Password Hashing (Bcrypt)                  │  │
│  │     - Payment Hash Generation                    │  │
│  │     - Validation Schemas                         │  │
│  │     - Constants & Enums                          │  │
│  └──────────────────────────────────────────────────┘  │
│                       ▼                                  │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
          ┌──────────────────────────┐
          │   Railway MySQL 5.7      │
          │   eishro_db              │
          │  (11 Tables + Indexes)   │
          └──────────────────────────┘
```

---

## 🔐 نظام الصلاحيات (RBAC) - Role-Based Access Control

### الأدوار المتاحة

```typescript
enum UserRole {
  CUSTOMER = 'customer',      // المشتري العادي
  MERCHANT = 'merchant',      // صاحب المتجر
  ADMIN = 'admin',            // مسؤول النظام
}
```

### الأذونات لكل دور

#### 🟦 Customer (العميل)
- ✅ عرض المنتجات
- ✅ إنشاء طلبات
- ✅ تتبع طلباته
- ✅ تطبيق كوبونات
- ✅ الدفع عبر بوابات الدفع
- ❌ إدارة المتاجر
- ❌ حذف الطلبات
- ❌ الوصول إلى بيانات المستخدمين الآخرين

#### 🟧 Merchant (التاجر)
- ✅ عرض منتجاته
- ✅ إضافة/تعديل/حذف المنتجات
- ✅ عرض طلبات متجره
- ✅ تحديث حالة الطلبات
- ✅ عرض إحصائيات المبيعات
- ✅ إدارة الكوبونات لمتجره
- ❌ الوصول إلى متاجر أخرى
- ❌ إدارة المستخدمين الآخرين
- ❌ الوصول إلى لوحة التحكم الإدارية

#### 🟥 Admin (المسؤول)
- ✅ جميع صلاحيات Customer
- ✅ جميع صلاحيات Merchant
- ✅ إدارة جميع المستخدمين
- ✅ إدارة جميع المنتجات والمتاجر
- ✅ إدارة الكوبونات النظامية
- ✅ عرض الإحصائيات الشاملة
- ✅ إدارة الشحن والتسليم
- ✅ إدارة بوابات الدفع

### مثال على التحقق من الأذونات

```typescript
// في Middleware
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// في الـ Routes
app.post(
  '/api/products',
  authenticate,                    // تأكد من هويته
  requireRole(['merchant', 'admin']), // تأكد من صلاحيته
  productController.create
);
```

---

## 🗂️ بنية المشروع (Project Structure)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # تكوين قاعدة البيانات
│   │   ├── environment.ts       # متغيرات البيئة
│   │   └── constants.ts         # الثوابت والـ Enums
│   │
│   ├── models/                  # Sequelize Models (ORM)
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Store.ts
│   │   ├── Order.ts
│   │   ├── OrderItem.ts
│   │   ├── Coupon.ts
│   │   ├── Payment.ts
│   │   ├── UserAddress.ts
│   │   ├── ProductImage.ts
│   │   └── index.ts             # تصدير جميع Models
│   │
│   ├── middleware/              # Express Middleware
│   │   ├── auth.ts              # JWT Authentication
│   │   ├── authorization.ts     # RBAC Authorization
│   │   ├── validation.ts        # Input Validation
│   │   ├── errorHandler.ts      # Error Handling
│   │   └── requestLogger.ts     # Request Logging
│   │
│   ├── controllers/             # Business Logic
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   ├── paymentController.ts (CRITICAL)
│   │   ├── couponController.ts
│   │   ├── userController.ts
│   │   ├── adminController.ts
│   │   └── merchantController.ts
│   │
│   ├── routes/                  # API Routes
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── couponRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── adminRoutes.ts
│   │   ├── merchantRoutes.ts
│   │   └── index.ts
│   │
│   ├── services/                # Business Logic (Optional)
│   │   ├── paymentService.ts
│   │   ├── orderService.ts
│   │   ├── productService.ts
│   │   └── couponService.ts
│   │
│   ├── validators/              # Validation Schemas (Joi)
│   │   ├── authValidator.ts
│   │   ├── productValidator.ts
│   │   ├── orderValidator.ts
│   │   ├── paymentValidator.ts
│   │   └── couponValidator.ts
│   │
│   ├── utils/                   # Utility Functions
│   │   ├── jwt.ts               # JWT Generation/Verification
│   │   ├── password.ts          # Bcrypt Hashing
│   │   ├── moamalat.ts          # Moamalat Hash Generation
│   │   ├── logger.ts            # Logging
│   │   ├── response.ts          # Response Formatting
│   │   └── helpers.ts           # General Helpers
│   │
│   ├── types/                   # TypeScript Interfaces/Types
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── order.ts
│   │   ├── product.ts
│   │   └── payment.ts
│   │
│   ├── app.ts                   # Express App Configuration
│   └── index.ts                 # Entry Point
│
├── .env.example
├── .env                         # (Git Ignored)
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile                   # للـ Deploy على Railway
├── railway.json                 # Railway Configuration
└── README.md
```

---

## 🔒 نظام الأمان - Security Layers

### Layer 1: HTTPS & CORS
```typescript
// في app.ts
app.use(helmet()); // أضف Security Headers

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Layer 2: Authentication (JWT)
```typescript
// إنشاء Token آمن
const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// التحقق من Token
const verified = jwt.verify(token, process.env.JWT_SECRET);
```

### Layer 3: Authorization (RBAC)
```typescript
// تحقق من الدور والأذونات
@requireRole(['admin', 'merchant'])
@requirePermission('edit_products')
```

### Layer 4: Input Validation
```typescript
// استخدام Joi للتحقق من البيانات
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required()
});

const { error, value } = schema.validate(req.body);
if (error) return res.status(400).json({ error: error.details });
```

### Layer 5: Data Protection
```typescript
// Hash كلمات المرور
const hashedPassword = await bcrypt.hash(password, 10);

// تشفير البيانات الحساسة
const encryptedData = encrypt(sensitiveData);
```

### Layer 6: Rate Limiting
```typescript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // 100 طلب لكل IP
});

app.use('/api/', limiter);
```

### Layer 7: Audit Logging
```typescript
// تسجيل جميع العمليات الحساسة
logger.audit({
  action: 'ORDER_CREATED',
  userId: req.user.id,
  orderId: order.id,
  timestamp: new Date()
});
```

---

## 📈 مراحل البناء بالتفصيل

### ✅ Phase 1: Setup & Configuration (الساعة الأولى)
- [ ] إعداد مشروع Node.js
- [ ] تثبيت Dependencies
- [ ] إعداد Sequelize و Database Connection
- [ ] إنشاء ملفات الإعدادات

### ✅ Phase 2: Models & Database (الساعة الثانية)
- [ ] كتابة 11 Sequelize Models
- [ ] إنشاء Relations بين الجداول
- [ ] إنشاء Indexes للأداء
- [ ] اختبار Connection

### ✅ Phase 3: Authentication & RBAC (الساعة الثالثة)
- [ ] JWT Generation/Verification
- [ ] Password Hashing
- [ ] Middleware Authentication
- [ ] Middleware Authorization (RBAC)
- [ ] Auth Validator

### ✅ Phase 4: Payment Gateway (الساعة الرابعة - CRITICAL)
- [ ] Moamalat Hash Generation
- [ ] Payment Endpoints
- [ ] Payment Status Handling
- [ ] Webhook Handling (إن أمكن)

### ✅ Phase 5: Order Management (الساعة الخامسة)
- [ ] Create Order Endpoint
- [ ] Get Orders Endpoint
- [ ] Update Order Status
- [ ] Order Validation

### ✅ Phase 6: Products & Coupons (الساعة السادسة)
- [ ] Get Products Endpoint
- [ ] Create Product (Merchant)
- [ ] Coupon Validation
- [ ] Apply Coupon

### ✅ Phase 7: Admin & Merchant Features (الساعة السابعة)
- [ ] Admin Dashboard Endpoints
- [ ] Merchant Dashboard Endpoints
- [ ] User Management
- [ ] Statistics & Reports

### ✅ Phase 8: Testing & Deployment (الساعة الثامنة)
- [ ] اختبار جميع Endpoints
- [ ] اختبار الأمان
- [ ] نشر على Railway
- [ ] ربط مع Frontend

---

## 💾 Database Tables Relationship

```
users
├── 1 ──→ N ──→ stores (merchant_id)
├── 1 ──→ N ──→ orders (customer_id)
├── 1 ──→ N ──→ user_addresses (user_id)
└── 1 ──→ N ──→ cart_items (user_id)

stores
├── 1 ──→ N ──→ products (store_id)
└── 1 ──→ N ──→ orders (merchant_id)

products
├── 1 ──→ N ──→ order_items (product_id)
└── 1 ──→ N ──→ product_images (product_id)

orders
├── 1 ──→ N ──→ order_items (order_id)
└── 1 ──→ 1 ──→ payments (order_id)

coupons
└── M ──→ N ──→ orders (coupon_code)
```

---

## 🚀 Critical Path - الطريق الحرج

**تركيز على الأولويات:**

1. **🔴 CRITICAL** → Payment Gateway (Moamalat)
   - بدون هذا، لا يعمل الدفع
   - هذا يحل المشكلة الأساسية

2. **🟠 HIGH** → Core Orders API
   - Create, Read, Update Orders
   - Status Management

3. **🟡 MEDIUM** → Products & Coupons
   - Product Listing
   - Coupon Validation

4. **🟢 LOW** → Admin & Analytics
   - Dashboard Features
   - Reports

---

## ✨ الخصائص الإضافية

- **Soft Delete:** للحفاظ على البيانات التاريخية
- **Audit Trail:** تتبع جميع التغييرات
- **Pagination:** لقوائم طويلة
- **Caching:** Redis (إذا لزم الأمر)
- **Rate Limiting:** منع الهجمات
- **Logging:** تسجيل شامل

---

## 📝 التالي

الآن سنبدأ في:
1. إعداد مشروع Express.js محلياً
2. كتابة Database Models
3. تطبيق نظام Authentication و RBAC
4. بناء Payment Gateway
5. اختبار شامل
6. نشر على Railway

