# 🗄️ تصميم قاعدة البيانات الشامل

**آخر تحديث:** 6 ديسمبر 2025  
**الإصدار:** 1.0

---

## 📊 رسم توضيحي ER Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                      EISHRO DATABASE SCHEMA                          │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │ ◄────────────┐
│ email (UNIQUE)  │              │
│ password        │              │
│ name            │              │
│ phone           │              │
│ address         │              │
│ created_at      │              │
└─────────────────┘              │
        │                        │
        │ (1 to Many)           │
        │                        │
        ├────────────────────────┼──────────────────┐
        │                        │                  │
        ▼                        │                  │
┌──────────────────┐             │                  │
│  CARTS           │             │                  │
├──────────────────┤             │                  │
│ id (PK)          │             │                  │
│ user_id (FK) ────┼─────────────┘                  │
│ created_at       │                                │
└──────────────────┘                                │
        │                                           │
        ▼ (1 to Many)                               │
┌──────────────────────┐                            │
│  CART_ITEMS          │                            │
├──────────────────────┤                            │
│ id (PK)              │                            │
│ cart_id (FK)         │                            │
│ product_id (FK) ──┐  │                            │
│ quantity           │  │                            │
│ added_at           │  │                            │
└──────────────────────┘  │                          │
                          │                          │
        ┌─────────────────┘                          │
        │                                            │
        ▼                                            │
┌──────────────────────┐          ┌────────────────┐ │
│    PRODUCTS          │          │    STORES      │ │
├──────────────────────┤          ├────────────────┤ │
│ id (PK)              │          │ id (PK)        │ │
│ store_id (FK) ───────┼──────────┼─ id (FK)       │ │
│ name                 │          │ name           │ │
│ description          │          │ description    │ │
│ price                │          │ logo_url       │ │
│ quantity_stock       │          │ active         │ │
│ image_url            │          │ created_at     │ │
│ created_at           │          └────────────────┘ │
└──────────────────────┘                             │
        │                                            │
        ▼ (1 to Many)                                │
┌──────────────────────────┐                         │
│  PRODUCT_BADGES          │                         │
├──────────────────────────┤                         │
│ id (PK)                  │                         │
│ product_id (FK) ─────────┼─────┐                  │
│ badge_type               │     │                  │
│ badge_name               │     │                  │
│ badge_color              │     │                  │
│ active                   │     │                  │
└──────────────────────────┘     │                  │
                                 │                  │
        ┌────────────────────────┘                  │
        │                                            │
        ▼ (1 to Many)                                │
┌──────────────────────┐                            │
│     ORDERS           │                            │
├──────────────────────┤                            │
│ id (PK)              │                            │
│ user_id (FK) ────────┼────────────────────────────┘
│ status               │
│ total_price          │
│ shipping_address     │
│ shipping_method      │
│ tracking_number      │
│ created_at           │
│ updated_at           │
└──────────────────────┘
        │
        ▼ (1 to Many)
┌──────────────────────────┐
│     ORDER_ITEMS          │
├──────────────────────────┤
│ id (PK)                  │
│ order_id (FK)            │
│ product_id (FK) ─────────┼─────┐
│ quantity                 │     │
│ price_at_purchase        │     │
└──────────────────────────┘     │
                                 │
        ┌────────────────────────┘
        │
        ▼
┌──────────────────┐
│    PAYMENTS      │
├──────────────────┤
│ id (PK)          │
│ order_id (FK)    │
│ amount           │
│ method           │
│ status           │
│ transaction_id   │
│ created_at       │
└──────────────────┘

┌──────────────────────────┐
│    SHIPPING              │
├──────────────────────────┤
│ id (PK)                  │
│ order_id (FK)            │
│ carrier                  │
│ tracking_number          │
│ status                   │
│ estimated_delivery       │
│ actual_delivery          │
└──────────────────────────┘

┌──────────────────────────┐
│    ADMIN_LOGS            │
├──────────────────────────┤
│ id (PK)                  │
│ admin_id (FK)            │
│ action                   │
│ entity_type              │
│ entity_id                │
│ old_data                 │
│ new_data                 │
│ created_at               │
└──────────────────────────┘
```

---

## 📋 الجداول التفصيلية

### 1. جدول USERS (المستخدمون)

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- مشفر باستخدام bcrypt
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  country VARCHAR(50),
  postal_code VARCHAR(20),
  role ENUM('customer', 'admin', 'vendor') DEFAULT 'customer',
  avatar_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
);
```

### 2. جدول STORES (المتاجر)

```sql
CREATE TABLE stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  logo_url VARCHAR(255),
  owner_id INT,
  category VARCHAR(50),
  active BOOLEAN DEFAULT true,
  rating DECIMAL(2,1),
  review_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (owner_id) REFERENCES users(id),
  INDEX idx_active (active),
  INDEX idx_created_at (created_at)
);
```

### 3. جدول PRODUCTS (المنتجات)

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  store_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity_stock INT DEFAULT 0,
  image_url VARCHAR(255),
  gallery_urls JSON,  -- صور إضافية
  category VARCHAR(50),
  sku VARCHAR(50) UNIQUE,
  rating DECIMAL(2,1),
  review_count INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (store_id) REFERENCES stores(id),
  INDEX idx_store_id (store_id),
  INDEX idx_active (active),
  INDEX idx_price (price)
);
```

### 4. جدول PRODUCT_BADGES (شارات المنتجات)

```sql
CREATE TABLE product_badges (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  badge_type VARCHAR(50) NOT NULL,  -- 'hot', 'new', 'best', 'sale', etc.
  badge_name VARCHAR(50),
  badge_color VARCHAR(20),           -- color code
  badge_icon VARCHAR(100),
  discount_percent INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  start_date TIMESTAMP NULL,
  end_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_badge_type (badge_type)
);
```

### 5. جدول CARTS (السلة)

```sql
CREATE TABLE carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  status ENUM('active', 'abandoned', 'checked_out') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY idx_user_active (user_id, status),
  INDEX idx_status (status)
);
```

### 6. جدول CART_ITEMS (عناصر السلة)

```sql
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price_at_add DECIMAL(10, 2),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_cart_id (cart_id),
  UNIQUE KEY idx_cart_product (cart_id, product_id)
);
```

### 7. جدول ORDERS (الطلبات)

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(50) UNIQUE,
  user_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  total_price DECIMAL(10, 2),
  tax_amount DECIMAL(10, 2),
  shipping_cost DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  
  shipping_address TEXT,
  shipping_method ENUM('standard', 'express', 'overnight') DEFAULT 'standard',
  shipping_tracking_number VARCHAR(100),
  
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_order_number (order_number)
);
```

### 8. جدول ORDER_ITEMS (عناصر الطلب)

```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(150),
  quantity INT NOT NULL,
  price_at_purchase DECIMAL(10, 2),
  subtotal DECIMAL(10, 2),
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order_id (order_id)
);
```

### 9. جدول PAYMENTS (المدفوعات)

```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  amount DECIMAL(10, 2),
  method VARCHAR(50),  -- 'credit_card', 'debit_card', 'paypal', 'stripe'
  transaction_id VARCHAR(100),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
);
```

### 10. جدول SHIPPING (الشحن)

```sql
CREATE TABLE shipping (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  carrier VARCHAR(50),  -- 'fedex', 'ups', 'dhl', 'local'
  tracking_number VARCHAR(100),
  status ENUM('pending', 'picked', 'in_transit', 'delivered', 'returned') DEFAULT 'pending',
  estimated_delivery DATE,
  actual_delivery DATE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX idx_order_id (order_id),
  INDEX idx_tracking_number (tracking_number)
);
```

### 11. جدول ADMIN_LOGS (سجلات الإدارة)

```sql
CREATE TABLE admin_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NOT NULL,
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id INT,
  old_data JSON,
  new_data JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (admin_id) REFERENCES users(id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_created_at (created_at)
);
```

---

## 🔗 العلاقات بين الجداول

| الجدول الأول | العلاقة | الجدول الثاني |
|-------------|--------|-------------|
| USERS | 1 to Many | CARTS |
| USERS | 1 to Many | ORDERS |
| USERS | 1 to Many | ADMIN_LOGS |
| STORES | 1 to Many | PRODUCTS |
| PRODUCTS | 1 to Many | PRODUCT_BADGES |
| PRODUCTS | 1 to Many | CART_ITEMS |
| PRODUCTS | 1 to Many | ORDER_ITEMS |
| CARTS | 1 to Many | CART_ITEMS |
| ORDERS | 1 to Many | ORDER_ITEMS |
| ORDERS | 1 to 1 | PAYMENTS |
| ORDERS | 1 to 1 | SHIPPING |

---

## 🔍 الفهارس (Indexes) المهمة

```sql
-- للأداء الأفضل
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_shipping_tracking_number ON shipping(tracking_number);
```

---

## 💾 Transactions (المعاملات الآمنة)

### مثال: معاملة كاملة للطلب

```sql
START TRANSACTION;

-- 1. إنشاء الطلب
INSERT INTO orders (order_number, user_id, status, total_price, ...) 
VALUES (...);

-- 2. إضافة عناصر الطلب
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
VALUES (...);

-- 3. تحديث المخزون
UPDATE products 
SET quantity_stock = quantity_stock - ? 
WHERE id = ?;

-- 4. إنشاء دفعة
INSERT INTO payments (order_id, amount, status) 
VALUES (...);

-- 5. إنشاء شحنة
INSERT INTO shipping (order_id, carrier, status) 
VALUES (...);

COMMIT;  -- إذا نجحت جميع العمليات
-- أو ROLLBACK; إذا حدث خطأ
```

---

## 📈 إحصائيات وتقارير

### Queries مهمة:

```sql
-- مبيعات اليوم
SELECT SUM(final_price) as today_sales 
FROM orders 
WHERE DATE(created_at) = CURDATE() 
AND status != 'cancelled';

-- أكثر المنتجات مبيعاً
SELECT p.name, COUNT(oi.id) as sales_count 
FROM order_items oi 
JOIN products p ON oi.product_id = p.id 
GROUP BY p.id 
ORDER BY sales_count DESC 
LIMIT 10;

-- عملاء الشهر هذا
SELECT COUNT(DISTINCT user_id) as new_customers 
FROM users 
WHERE MONTH(created_at) = MONTH(CURDATE()) 
AND YEAR(created_at) = YEAR(CURDATE());
```

---

**للمزيد:** اطلع على:
- [DATA_FLOW.md](DATA_FLOW.md) - تدفق البيانات
- [WORKFLOW_DESIGN.md](WORKFLOW_DESIGN.md) - سير العمل
