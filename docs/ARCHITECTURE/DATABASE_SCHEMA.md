# 🗄️ تصميم قاعدة البيانات

**آخر تحديث:** 6 ديسمبر 2025

---

## 📊 الجداول الرئيسية

### 1. جدول المستخدمين (users)
- id
- email
- password (مشفرة)
- name
- created_at

### 2. جدول المتاجر (stores)
- id
- name
- description
- logo_url
- active (true/false)

### 3. جدول المنتجات (products)
- id
- store_id
- name
- description
- price
- image_url
- badges (JSON array)

### 4. جدول الطلبات (orders)
- id
- user_id
- status
- total_price
- created_at

---

**للمزيد:** راجع التوثيق الكامل في مجلد DOCUMENTATION/
