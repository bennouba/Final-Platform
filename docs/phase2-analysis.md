# 📋 PHASE 2: تحليل شامل متطلبات Backend - EISHRO Platform

---

## 🚨 المشكلة الحالية (CRITICAL)

**بوابة الدفع معطلة على Vercel:**
- **الملف:** `src/components/MoamalatRealLightbox.tsx:174`
- **الخطأ:** `http://localhost:4000/api/moamalat/hash` ❌
- **الحل:** Backend على Railway مع HTTPS

---

## 📊 نماذج البيانات المطلوبة

### Order (الطلب)
```typescript
{
  id: string                      // ESHRO-{timestamp}
  status: 'pending'|'confirmed'|'shipped'|'delivered'
  items: CartItem[]               // المنتجات المطلوبة
  subtotal: number                // قبل الخصم
  discountAmount: number          // مبلغ الخصم
  shippingCost: number            // تكلفة الشحن
  finalTotal: number              // subtotal + shipping - discount
  
  customer: {
    name: string
    phone: string
    email: string
    address: string
    city: string
    area: string
  }
  
  payment: {
    method: 'onDelivery'|'immediate'
    type: 'moamalat'|'fawry'|'paypal'
    status: 'pending'|'completed'|'failed'
    transactionId?: string
  }
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

### CartItem (عنصر السلة)
```typescript
{
  product: { id, name, price }
  size: string
  color: string
  quantity: number
}
```

### Coupon (الكوبون)
```typescript
{
  code: string            // فريد
  discount: number        // %
  minAmount?: number      // الحد الأدنى
  expiresAt?: DateTime
}
```

### User (المستخدم)
```typescript
{
  id: string
  email: string
  password: string (bcrypt)
  firstName: string
  lastName: string
  phone: string
  role: 'customer'|'merchant'|'admin'
}
```

### Product (المنتج)
```typescript
{
  id: number
  name: string
  price: number
  category: string
  image: string
  storeId: number
}
```

---

## 🔌 API ENDPOINTS - الشامل

### 🔴 CRITICAL - يجب تطبيقها أولاً

#### 1️⃣ Generate Moamalat Hash ⚠️
```
POST /api/payments/moamalat/hash
Content-Type: application/json

Body:
{
  Amount: string
  DateTimeLocalTrxn: string
  MerchantId: string
  MerchantReference: string
  TerminalId: string
}

Response:
{
  secureHash: string
}

USED BY: MoamalatRealLightbox.tsx:174
```

#### 2️⃣ Get Moamalat Config
```
GET /api/payments/moamalat/config

Response:
{
  MID: string
  TID: string
  ENV: 'sandbox'|'production'
}
```

### 🟠 HIGH PRIORITY

#### Orders
```
POST   /api/orders                     // إنشاء طلب
GET    /api/orders/:id                // الحصول على الطلب
GET    /api/orders/user/:userId       // طلبات المستخدم
PUT    /api/orders/:id/status         // تحديث الحالة
```

#### Coupons
```
POST   /api/coupons/validate          // التحقق من الكوبون
GET    /api/coupons/:code             // الحصول على الكوبون
```

#### Auth
```
POST   /api/auth/register             // التسجيل
POST   /api/auth/login                // تسجيل الدخول
```

### 🟡 MEDIUM PRIORITY

#### Products
```
GET    /api/products                  // جميع المنتجات
GET    /api/products/:id              // تفاصيل المنتج
GET    /api/products/category/:cat    // حسب الفئة
```

#### Locations
```
GET    /api/cities                    // المدن
GET    /api/cities/:id/areas          // المناطق
POST   /api/shipping/calculate        // حساب الشحن
```

#### Users
```
GET    /api/users/:id                 // ملف المستخدم
PUT    /api/users/:id                 // تحديث البيانات
POST   /api/users/:id/addresses       // إضافة عنوان
```

---

## 🛠️ تكاليف الشحن المرجعية

| النوع | المنطقة | العادي | السريع |
|------|--------|--------|--------|
| **التوقيت** | - | 24-96 ساعة | 9-12 ساعة |
| **طرابلس** | - | 30-45 د.ل | 85-120 د.ل |
| **خارج** | - | 50-85 د.ل | 120-185 د.ل |

---

## 🗄️ Database Tables

### orders
```sql
id (PK)
order_id (UNIQUE)
user_id (FK)
status
subtotal
shipping_cost
discount_amount
final_total
payment_method
payment_status
notes
created_at
updated_at
```

### order_items
```sql
id (PK)
order_id (FK)
product_id (FK)
quantity
size
color
```

### coupons
```sql
id (PK)
code (UNIQUE)
discount_percentage
min_amount
expires_at
active
```

### users
```sql
id (PK)
email (UNIQUE)
password
first_name
last_name
phone
role
created_at
```

### products
```sql
id (PK)
name
price
category
image
store_id (FK)
in_stock
created_at
```

---

## ⚙️ Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=eishro_db

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d

# Moamalat
MOAMALAT_MID=10081014649
MOAMALAT_TID=99179395
MOAMALAT_SECRET=3a488a89b3f7993476c252f017c488bb
MOAMALAT_ENV=sandbox

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://platform-eishro.vercel.app
```

---

## 🚀 Implementation Roadmap

### Week 1: CRITICAL FIX
- [ ] Express.js + MySQL setup
- [ ] Payment hash endpoint
- [ ] Deploy to Railway
- [ ] Test payment flow

### Week 2: Core Features
- [ ] Orders management
- [ ] Coupons validation
- [ ] Authentication

### Week 3: Extended
- [ ] Products endpoints
- [ ] User management
- [ ] Merchant dashboard

---

## 🔒 Security

- ✅ CORS for Vercel domain
- ✅ JWT authentication
- ✅ Bcrypt passwords
- ✅ Input validation
- ✅ Rate limiting
- ✅ HTTPS only

---

## ✅ Integration Checklist

- [ ] Backend deployed on Railway
- [ ] Environment variables set
- [ ] Payment endpoint working
- [ ] Vercel frontend updated with backend URL
- [ ] CORS configured
- [ ] Database migrations ran
- [ ] Test payment gateway flow

---

**Next Step:** تصميم MySQL Schema + Express.js Backend
