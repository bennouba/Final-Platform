# 🔄 سير العمل الكامل - Complete Workflow Design

**آخر تحديث:** 6 ديسمبر 2025  
**النسخة:** 1.0

---

## 📍 المسار الكامل من البداية إلى النهاية

### 🎯 سيناريو عملي كامل: عميل يشتري منتج

```
═══════════════════════════════════════════════════════════════════════════════

STAGE 1: DISCOVERY & BROWSING (اكتشاف التصفح)
────────────────────────────────────────────────────────────────────────────────

┌─ العميل يفتح التطبيق
├─ (Frontend/App.tsx)
│  ├─► App renders
│  ├─► Load initial state
│  └─► Check authentication
│
├─ الصفحة الرئيسية تحميل
│  └─ ModernStorePage.tsx
│     ├─► GET /api/stores
│     │   └─ Backend: storeController.getAll()
│     │      └─ DB: SELECT * FROM stores
│     │
│     ├─► Display [Store1, Store2, Store3, ...]
│     │
│     └─► Render StoresCarousel.tsx
│         ├─ عرض الصور
│         ├─ عرض الأسماء
│         └─ عرض التقييمات
│
└─ العميل اختار متجر معين (Delta Store)
   └─ (StorePage.tsx)
      ├─► GET /api/stores/delta-store
      │   └─ DB: SELECT * FROM stores WHERE slug='delta-store'
      │
      ├─► GET /api/products?store_id=1
      │   └─ DB: SELECT * FROM products WHERE store_id=1
      │
      └─► Display products with badges
          ├─► ProductsView.tsx
          │   ├─ عرض قائمة المنتجات
          │   ├─ عرض الأسعار
          │   ├─ عرض الشارات (🔥 Hot, ⭐ Best Seller)
          │   └─ عرض التقييمات

═══════════════════════════════════════════════════════════════════════════════

STAGE 2: PRODUCT SELECTION (اختيار المنتج)
────────────────────────────────────────────────────────────────────────────────

┌─ العميل نقر على منتج
│  └─ (EnhancedProductPage.tsx)
│
├─ تحميل تفاصيل المنتج
│  ├─► GET /api/products/:productId
│  │   └─ DB: SELECT * FROM products WHERE id=productId
│  │
│  ├─► GET /api/products/:productId/badges
│  │   └─ DB: SELECT * FROM product_badges WHERE product_id=productId
│  │
│  ├─► GET /api/products/:productId/reviews
│  │   └─ DB: SELECT * FROM reviews WHERE product_id=productId
│  │
│  └─► Render detailed page
│      ├─ عرض صور المنتج (ImageGalleryModal.tsx)
│      ├─ عرض الأسعار (الأصلي، المخفف)
│      ├─ عرض الشارات مع التفاصيل
│      ├─ عرض التقييمات والتعليقات
│      └─ خيارات: الحجم، اللون، الكمية
│
├─ العميل اختار الحجم واللون
│  └─ اختيار من القوائم المتاحة
│
└─ العميل نقر "إضافة إلى السلة"
   └─ (AddToCartPopup.tsx)

═══════════════════════════════════════════════════════════════════════════════

STAGE 3: CART MANAGEMENT (إدارة السلة)
────────────────────────────────────────────────────────────────────────────────

┌─ إضافة المنتج إلى السلة
│
├─ تحقق من السلة الحالية
│  ├─► GET /api/carts/active
│  │   └─ DB: SELECT * FROM carts WHERE user_id=userId AND status='active'
│  │
│  └─ إذا لم توجد سلة:
│      └─► POST /api/carts
│          └─ DB: INSERT INTO carts (user_id, status, ...)
│
├─ إضافة عنصر إلى السلة
│  ├─► POST /api/carts/:cartId/items
│  │   Body: {product_id: 123, size: "M", color: "Red", quantity: 2}
│  │
│  └─ Backend: cartController.addItem()
│     ├─ Validate product exists
│     ├─ Check stock availability
│     ├─ DB: INSERT INTO cart_items
│     │  (cart_id, product_id, quantity, price_at_add, ...)
│     └─ RESULT: {success: true, item_id}
│
├─ عرض رسالة النجاح
│  └─ AddToCartSuccessModal.tsx
│     ├─ المنتج تمت إضافته بنجاح
│     ├─ عدد العناصر في السلة
│     └─ خيارات: متابعة التسوق / عرض السلة
│
├─ العميل ينقر "عرض السلة"
│  └─ (CartPage.tsx)
│
├─ تحميل عناصر السلة
│  ├─► GET /api/carts/:cartId/items
│  │   └─ DB: SELECT * FROM cart_items
│  │      JOIN products ON cart_items.product_id = products.id
│  │
│  └─ عرض:
│     ├─ قائمة المنتجات
│     ├─ الأسعار الفردية
│     ├─ الكميات
│     ├─ تحديث الكميات (±)
│     └─ حذف عناصر (Trash icon)
│
├─ العميل تحديث الكمية
│  ├─► PUT /api/carts/:cartId/items/:itemId
│  │   Body: {quantity: 3}
│  │
│  └─ DB: UPDATE cart_items SET quantity=3
│
├─ العميل تطبيق كوبون
│  ├─► POST /api/coupons/validate
│  │   Body: {code: "SALE50"}
│  │
│  ├─ Backend: couponController.validate()
│  │  ├─ DB: SELECT * FROM coupons WHERE code='SALE50'
│  │  ├─ Check expiry date
│  │  ├─ Check minimum amount
│  │  └─ RESULT: {valid: true, discount: 50}
│  │
│  └─ عرض الخصم المطبق
│     ├─ السعر الأصلي: 150 LYD
│     ├─ الخصم: -50 LYD
│     └─ السعر النهائي: 100 LYD
│
└─ العميل ينقر "متابعة للدفع"
   └─ Move to STAGE 4

═══════════════════════════════════════════════════════════════════════════════

STAGE 4: CHECKOUT & PAYMENT (الدفع والشحن)
────────────────────────────────────────────────────────────────────────────────

┌─ فتح صفحة الدفع
│  └─ (EnhancedCheckoutPage.tsx)
│
├─ STEP 1: بيانات العميل
│  ├─ إدخال:
│  │  ├─ الاسم الأول والأخير
│  │  ├─ رقم الهاتف
│  │  ├─ البريد الإلكتروني
│  │  └─ العنوان
│  │
│  ├─ اختيار المدينة والمنطقة
│  │  ├─ CityAreaSelector.tsx
│  │  └─ GET /api/cities (from Libya data)
│  │
│  └─ حفظ في State
│
├─ STEP 2: اختيار طريقة الشحن
│  ├─ خيارات:
│  │  ├─ 🚚 عادي - طرابلس (30-45 LYD) → 3-5 أيام
│  │  ├─ 🚚 عادي - خارج طرابلس (50-85 LYD) → 5-7 أيام
│  │  ├─ ⚡ معجل - طرابلس (85-120 LYD) → 1-2 أيام
│  │  └─ ⚡ معجل - خارج طرابلس (120-185 LYD) → 2-3 أيام
│  │
│  ├─ حساب التكلفة:
│  │  └─ function getShippingCost(city, type)
│  │     └─ return calculated_cost
│  │
│  └─ عرض الإجمالي مع الشحن
│
├─ STEP 3: اختيار طريقة الدفع
│  ├─ Option 1: الدفع عند الاستلام
│  │  └─ Skip payment gateway
│  │
│  └─ Option 2: دفع فوري
│     ├─ Select payment method
│     │  ├─ Credit Card
│     │  ├─ Debit Card
│     │  ├─ Moamalat
│     │  └─ Other gateways
│     │
│     └─ "تأكيد وللدفع" (Proceed to payment)
│
├─ Review Order Summary
│  ├─ عرض العناصر المطلوب شراؤها
│  ├─ عرض الأسعار الفردية
│  ├─ عرض الخصم المطبق
│  ├─ عرض تكلفة الشحن
│  ├─ عرض الضرائب
│  └─ عرض الإجمالي النهائي
│
└─ عند النقر "تأكيد الطلب والدفع"
   └─ Move to STAGE 5

═══════════════════════════════════════════════════════════════════════════════

STAGE 5: ORDER PROCESSING (معالجة الطلب)
────────────────────────────────────────────────────────────────────────────────

┌─ إنشاء الطلب في Database (Transaction)
│
├─ POST /api/orders
│  │
│  └─ Backend: orderController.createOrder()
│     │
│     ├─ START TRANSACTION
│     │
│     ├─ STEP 1: Create Order
│     │  └─ INSERT INTO orders
│     │     (user_id, order_number, status='pending', total_price, ...)
│     │     RESULT: order_id = 12345
│     │
│     ├─ STEP 2: Create Order Items
│     │  FOR EACH item in cartItems:
│     │    ├─ INSERT INTO order_items
│     │    │  (order_id=12345, product_id, quantity, price_at_purchase, ...)
│     │    │
│     │    └─ UPDATE products
│     │       SET quantity_stock = quantity_stock - quantity
│     │       WHERE id = product_id
│     │
│     ├─ STEP 3: Create Payment Record
│     │  └─ INSERT INTO payments
│     │     (order_id=12345, amount, method='pending', status='pending')
│     │
│     ├─ STEP 4: Create Shipping Record
│     │  └─ INSERT INTO shipping
│     │     (order_id=12345, carrier='pending', status='pending')
│     │
│     ├─ STEP 5: Update Cart Status
│     │  └─ UPDATE carts
│     │     SET status='checked_out'
│     │     WHERE id=cartId
│     │
│     ├─ IF ALL SUCCESS:
│     │  ├─ COMMIT
│     │  ├─ Generate invoice
│     │  └─ Send confirmation email
│     │
│     └─ IF ANY FAILED:
│        ├─ ROLLBACK
│        ├─ Restore cart
│        └─ Show error message
│
└─ Order created successfully ✅

═══════════════════════════════════════════════════════════════════════════════

STAGE 6: PAYMENT PROCESSING (معالجة الدفع)
────────────────────────────────────────────────────────────────────────────────

IF payment_method == 'onDelivery':
│  ├─ Update order status → 'confirmed'
│  ├─ Update payment status → 'pending_on_delivery'
│  └─ Send confirmation + COD order details
│
ELSE IF payment_method == 'immediate':
│  │
│  ├─ Open Moamalat Lightbox
│  │  └─ (MoamalatPaymentGateway.tsx)
│  │
│  ├─ User enters card details
│  │  ├─ Card number
│  │  ├─ CVV
│  │  ├─ Expiry date
│  │  └─ Cardholder name
│  │
│  ├─ Moamalat processes payment
│  │  ├─► External API call
│  │  ├─► Bank verification
│  │  └─► Authorization response
│  │
│  ├─ ON PAYMENT SUCCESS (✅)
│  │  ├─► POST /api/orders/:orderId/confirm
│  │  │   Body: {payment_id, transaction_id, amount}
│  │  │
│  │  ├─► Backend: orderController.confirmPayment()
│  │  │   ├─ UPDATE orders SET status='confirmed'
│  │  │   ├─ UPDATE payments SET status='completed'
│  │  │   ├─ Create invoice
│  │  │   ├─ Send confirmation email
│  │  │   └─ Notify store owner
│  │  │
│  │  └─► Frontend: Show success modal
│  │      ├─ Order number
│  │      ├─ Order summary
│  │      ├─ Estimated delivery
│  │      └─ Tracking link
│  │
│  └─ ON PAYMENT FAILURE (❌)
│     ├─► POST /api/orders/:orderId/cancel
│     │   └─ Restore inventory
│     │
│     ├─► Show error message
│     │   ├─ Reason for failure
│     │   ├─ Options: Retry / Use COD
│     │   └─ Contact support
│     │
│     └─► Keep order as 'pending'
│         (Cart not checked out yet)

═══════════════════════════════════════════════════════════════════════════════

STAGE 7: ORDER CONFIRMATION (تأكيد الطلب)
────────────────────────────────────────────────────────────────────────────────

┌─ Display Order Success Page
│  └─ (OrderSuccessModal / CompleteOrdersPage)
│
├─ عرض معلومات الطلب:
│  ├─ رقم الطلب: #12345
│  ├─ التاريخ: 6 ديسمبر 2025
│  ├─ الإجمالي: 350 LYD
│  └─ الحالة: تم التأكيد ✅
│
├─ عرض عناصر الطلب:
│  └─ جدول يوضح:
│     ├─ صور المنتجات
│     ├─ الأسماء
│     ├─ الأسعار
│     ├─ الكميات
│     └─ الإجمالي
│
├─ عرض معلومات التسليم:
│  ├─ الاسم: محمد أحمد
│  ├─ الهاتف: 201234567
│  ├─ العنوان: طرابلس - القرجة
│  ├─ طريقة الشحن: معجل (1-2 أيام)
│  └─ رقم التتبع: SHIP123456 (عند الشحن)
│
├─ خيارات إضافية:
│  ├─ 📋 تحميل الفاتورة (Invoice)
│  │  └─ (InvoiceGenerator.tsx)
│  │
│  ├─ 📧 إرسال الفاتورة عبر البريد
│  │
│  ├─ 📱 مشاركة الطلب
│  │  └─ (ShareMenu.tsx)
│  │
│  ├─ 👍 تقييم الطلب
│  │
│  └─ 🔄 إعادة الطلب (Reorder)
│
└─ Send to email confirmation
   └─ إرسال رسالة بريد تفصيلية للعميل

═══════════════════════════════════════════════════════════════════════════════

STAGE 8: FULFILLMENT & SHIPPING (التنفيذ والشحن)
────────────────────────────────────────────────────────────────────────────────

┌─ Store receives order notification
│  └─ (MerchantDashboard)
│     ├─ New order alert
│     ├─ Order details displayed
│     └─ Print label option
│
├─ PROCESSING PHASE (0-1 days)
│  ├─ Store prepares items
│  ├─ Staff picks products
│  ├─ Quality check
│  ├─ Packaging
│  └─ UPDATE orders SET status='processing'
│
├─ HANDOFF TO CARRIER
│  ├─ Generate shipping label
│  ├─ Assign tracking number
│  ├─ Hand over to courier
│  └─ UPDATE shipping
│     ├─ carrier = 'FedEx'
│     ├─ tracking_number = 'FDX123456789'
│     └─ status = 'picked'
│
├─ IN TRANSIT UPDATES
│  ├─ Day 1: Package picked up
│  ├─ Day 1-2: In transit
│  ├─ Day 3: Out for delivery
│  └─ UPDATE shipping
│     ├─ status = 'in_transit'
│     └─ location updates (optional)
│
├─ DELIVERY DAY
│  ├─ Delivery attempt
│  ├─ Customer signature
│  ├─ Package delivered ✅
│  └─ UPDATE shipping + orders
│     ├─ shipping.status = 'delivered'
│     ├─ shipping.actual_delivery = TODAY
│     ├─ orders.status = 'delivered'
│     └─ Send delivery confirmation email
│
└─ Customer notifications throughout
   ├─ Confirmation email (immediately)
   ├─ Processing notification (next day)
   ├─ Shipped notification (with tracking)
   ├─ In transit updates
   └─ Delivery confirmation

═══════════════════════════════════════════════════════════════════════════════

STAGE 9: POST-DELIVERY (بعد التسليم)
────────────────────────────────────────────────────────────────────────────────

┌─ Customer receives package
│  └─ Check contents, verify items
│
├─ RATING & REVIEW
│  ├─ Customer opens app
│  ├─ Navigate to CompleteOrdersPage
│  ├─ Find delivered order
│  ├─ Open ReviewModal.tsx
│  │
│  ├─ Enter review:
│  │  ├─ Rating (1-5 stars)
│  │  ├─ Review text
│  │  ├─ Upload photos
│  │  └─ Submit
│  │
│  └─ Backend: reviewController.create()
│     ├─ DB: INSERT INTO reviews
│     ├─ Update product rating
│     └─ Notify store owner
│
├─ RETURNS (if needed)
│  ├─ Customer opens ReturnsView
│  ├─ Select items to return
│  ├─ Reason for return
│  ├─ Generate return label
│  │
│  └─ Backend: returnController
│     ├─ CREATE return request
│     ├─ Generate label
│     ├─ Email return shipping label
│     └─ UPDATE order status → 'return_requested'
│
├─ Customer ships back
│  ├─ Print return label
│  ├─ Pack items
│  ├─ Ship back
│  └─ Provide tracking number
│
├─ Merchant receives return
│  ├─ Inspect items
│  ├─ Process refund
│  ├─ Restore inventory
│  └─ UPDATE order status → 'returned'
│
└─ Refund issued
   ├─ Payment refunded to original source
   ├─ Confirmation email sent
   └─ END

═══════════════════════════════════════════════════════════════════════════════

STAGE 10: SPECIAL SCENARIOS (السيناريوهات الخاصة)
────────────────────────────────────────────────────────────────────────────────

SCENARIO A: Out of Stock
┌─ During checkout, product goes out of stock
├─ System detects: quantity_stock = 0
├─ Show notification: "This item is now out of stock"
├─ Options:
│  ├─ Remove from order
│  ├─ Notify when available (NotifyWhenAvailable)
│  └─ Suggest alternatives
└─ Order not completed

SCENARIO B: Payment Declined
┌─ Customer enters card details
├─ Moamalat returns: DECLINED
├─ Show error: "Payment was declined. Please try again."
├─ Options:
│  ├─ Retry payment
│  ├─ Use different card
│  ├─ Switch to COD
│  └─ Contact support
├─ Order remains 'pending'
└─ Cart preserved for retry

SCENARIO C: Delivery Failed
┌─ Courier unable to deliver
├─ Customer not available
├─ Package returned to sender
├─ Notify customer
├─ Customer can:
│  ├─ Update address and reschedule
│  ├─ Pick up from store
│  └─ Request refund
└─ Order status → 'delivery_failed'

SCENARIO D: Long Wait (Abandoned Cart)
┌─ Cart inactive for X days
├─ System detects: cart.status = 'abandoned'
├─ Send reminder email
├─ Offer coupon incentive
├─ If still not purchased:
│  └─ Move to AbandonedCartsView for admin
└─ Potential follow-up campaigns

═══════════════════════════════════════════════════════════════════════════════
```

---

## ⏰ المواقيت والحد الزمني

| المرحلة | المدة المتوقعة | الحالة |
|--------|-------------|--------|
| **Discovery** | 5-10 دقائق | متغير |
| **Product Selection** | 5-15 دقيقة | متغير |
| **Cart Management** | 5-10 دقائق | متغير |
| **Checkout** | 3-5 دقائق | متغير |
| **Payment** | 1-2 دقيقة | متغير |
| **Order Confirmation** | فوري | ثابت |
| **Processing** | 0-1 يوم | ثابت |
| **Shipping** | حسب الطريقة | ثابت |
| **Delivery** | 1-7 أيام | ثابت |
| **Post-Delivery** | متغير | متغير |

---

## 🔁 العمليات المتكررة والتنبيهات

```
┌─ Backend Scheduled Tasks
│
├─ Every 1 hour:
│  ├─ Check abandoned carts
│  ├─ Send reminder emails
│  └─ Update inventory alerts
│
├─ Every 6 hours:
│  ├─ Sync with courier APIs
│  ├─ Update shipping status
│  └─ Send delivery updates
│
├─ Every 24 hours:
│  ├─ Generate daily reports
│  ├─ Backup database
│  ├─ Clean temporary data
│  └─ Check for expired coupons
│
└─ On Demand:
   ├─ Process returns
   ├─ Generate invoices
   ├─ Send custom notifications
   └─ Handle disputes
```

---

**آخر تحديث:** 6 ديسمبر 2025  
**الحالة:** ✅ شامل وتفصيلي جداً
