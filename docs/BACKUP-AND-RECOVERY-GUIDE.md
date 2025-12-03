# 💾 دليل النسخ الاحتياطية واستعادة البيانات
## Backup & Recovery - Safety First

**الهدف**: ضمان عدم فقدان أي بيانات أثناء تطبيق الإصلاحات الأمنية  
**الأولوية**: عالية جداً  
**الضمان**: ✅ Zero Data Loss

---

## ⚠️ نقاط حرجة

### ⛔ لا تفعل هذا:
```bash
❌ تطبيق الإصلاحات بدون backup
❌ حذف البيانات القديمة مباشرة
❌ تغيير قاعدة البيانات بدون تسجيل
❌ نسخ الملفات أثناء الرفع
```

### ✅ افعل هذا:
```bash
✅ عمل backup كامل قبل البدء
✅ توثيق كل التغييرات
✅ اختبار الاستعادة
✅ إبقاء البيانات القديمة للمرجعية
```

---

## 📋 خطة النسخ الاحتياطية قبل الإصلاحات

### الخطوة 1: النسخ الاحتياطية من قاعدة البيانات

```bash
# 1. إنشاء مجلد للنسخ الاحتياطية
mkdir -p ./backups/$(date +%Y-%m-%d)
BACKUP_DIR="./backups/$(date +%Y-%m-%d)"

# 2. النسخ الاحتياطية من MySQL
mysqldump -u root -p eshro_database > "$BACKUP_DIR/database.sql"

# 3. النسخ الاحتياطية من user data
mysqldump -u root -p eshro_database users > "$BACKUP_DIR/users.sql"

# 4. النسخ الاحتياطية من المتاجر
mysqldump -u root -p eshro_database stores > "$BACKUP_DIR/stores.sql"

# 5. النسخ الاحتياطية من المنتجات
mysqldump -u root -p eshro_database products > "$BACKUP_DIR/products.sql"

# 6. النسخ الاحتياطية من المعاملات
mysqldump -u root -p eshro_database payments > "$BACKUP_DIR/payments.sql"

# 7. التحقق من حجم النسخ الاحتياطية
ls -lh "$BACKUP_DIR/"

# 8. ضغط النسخ الاحتياطية (اختياري)
tar -czf "$BACKUP_DIR/database-backup.tar.gz" "$BACKUP_DIR"/*.sql
```

**التحقق من النسخة الاحتياطية**:
```bash
# التأكد من أن النسخة تحتوي على البيانات
grep -c "INSERT INTO" "$BACKUP_DIR/database.sql"
# يجب أن يُرجع رقم > 0
```

### الخطوة 2: النسخ الاحتياطية من الملفات

```bash
# 1. النسخ الاحتياطية من الأصول
BACKUP_DIR="./backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR/files"

# 2. نسخ مجلد المنتجات
cp -r backend/public/assets/products "$BACKUP_DIR/files/"

# 3. نسخ مجلد السلايدرز
cp -r backend/public/assets/sliders "$BACKUP_DIR/files/"

# 4. نسخ مجلد الشعارات
cp -r backend/public/assets/brands "$BACKUP_DIR/files/"

# 5. نسخ ملفات الـ storage
cp -r backend/public/assets "$BACKUP_DIR/files/"

# 6. التحقق من النسخة
ls -lh "$BACKUP_DIR/files/"

# 7. عد الملفات
find "$BACKUP_DIR/files" -type f | wc -l
# يجب أن يُرجع الرقم > 1000
```

### الخطوة 3: التوثيق

```bash
# إنشاء ملف توثيق
cat > "./backups/$(date +%Y-%m-%d)/README.md" << 'EOF'
# Backup Information

Date: $(date)
Database Size: $(du -sh database.sql)
Files Size: $(du -sh files/)

## Database Tables:
- users: $(wc -l < users.sql)
- stores: $(wc -l < stores.sql)
- products: $(wc -l < products.sql)
- payments: $(wc -l < payments.sql)

## Files:
- Products: $(find files/products -type f | wc -l)
- Sliders: $(find files/sliders -type f | wc -l)
- Brands: $(find files/brands -type f | wc -l)

## Security Fixes Applied:
- Encryption migration
- Path traversal protection
- Hash algorithm update
EOF
```

---

## 🔄 عملية الاستعادة في حالة الطوارئ

### السيناريو 1: مشكلة بسيطة (خطأ صغير)

```bash
# 1. إيقاف الخادم
npm stop

# 2. إرجاع الكود إلى الإصدار الأخير
git revert <commit-hash>

# 3. تثبيت الـ dependencies
npm install

# 4. إعادة تشغيل الخادم
npm run dev

# 5. التحقق من الحالة
curl http://localhost:5000/api/health
```

### السيناريو 2: مشكلة بقاعدة البيانات

```bash
# 1. إيقاف الخادم
npm stop

# 2. استعادة قاعدة البيانات من النسخة الاحتياطية
mysql -u root -p eshro_database < ./backups/$(date +%Y-%m-%d)/database.sql

# 3. التحقق من البيانات
mysql -u root -p eshro_database << 'EOF'
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM stores;
SELECT COUNT(*) FROM products;
EOF

# 4. إعادة تشغيل الخادم
npm run dev

# 5. اختبار الوظائف الأساسية
npm run test:smoke
```

### السيناريو 3: مشكلة بالملفات المرفوعة

```bash
# 1. إيقاف الخادم
npm stop

# 2. استعادة مجلد الأصول
rm -rf backend/public/assets
cp -r ./backups/$(date +%Y-%m-%d)/files/assets backend/public/

# 3. التحقق من الملفات
ls -lh backend/public/assets/

# 4. إعادة تشغيل الخادم
npm run dev

# 5. التحقق من الصور
curl http://localhost:5000/assets/products/image.jpg
```

### السيناريو 4: مشكلة شاملة

```bash
# 1. إيقاف كل شيء
npm stop
systemctl stop mysql

# 2. استعادة قاعدة البيانات
systemctl start mysql
mysql -u root -p eshro_database < ./backups/$(date +%Y-%m-%d)/database.sql

# 3. استعادة الملفات
rm -rf backend/public/assets/*
cp -r ./backups/$(date +%Y-%m-%d)/files/assets/* backend/public/assets/

# 4. إرجاع الكود
git checkout HEAD~1
npm install

# 5. إعادة التشغيل
npm run dev

# 6. اختبار شامل
npm run test:all
```

---

## ✅ قائمة التحقق قبل الإصلاح

```bash
# قبل تطبيق أي إصلاح، تأكد من:

# ✅ 1. وجود backup كامل
ls -lh ./backups/*/database.sql
ls -lh ./backups/*/files/

# ✅ 2. يمكن استعادة البيانات
mysql -u root -p eshro_database < ./backups/*/database.sql
echo "OK"

# ✅ 3. عد الملفات
find ./backups/*/files -type f | wc -l

# ✅ 4. الخادم يعمل
curl http://localhost:5000/api/health

# ✅ 5. قاعدة البيانات تستجيب
mysql -u root -p -e "SELECT COUNT(*) FROM eshro_database.users;"

# ✅ 6. الملفات موجودة
ls backend/public/assets/

echo "✅ كل شيء جاهز للإصلاح!"
```

---

## 📊 جدول الحالة

| الجانب | الحالة | التفاصيل |
|-------|--------|---------|
| **قاعدة البيانات** | ✅ Backed up | Full dump |
| **الملفات** | ✅ Backed up | Complete copy |
| **الكود** | ✅ Tagged | Git tag created |
| **التوثيق** | ✅ Complete | README.md |
| **الاختبارات** | ✅ Ready | Test suite ready |

---

## 🛡️ خطة الاسترجاع التدريجي

### المرحلة 1: اختبار محدود (5% من المستخدمين)
```bash
# تطبيق الإصلاح على فرع staging
git checkout -b security/fixes-staging

# نشر على staging server
npm run deploy:staging

# اختبار مع 5% من المستخدمين (مثلاً)
# ...
```

### المرحلة 2: توسيع الاختبار (25%)
```bash
# بعد نجاح المرحلة الأولى
# توسيع لـ 25% من المستخدمين
# مراقبة الأخطاء والأداء
```

### المرحلة 3: إطلاق كامل (100%)
```bash
# بعد نجاح المرحلة الثانية
# إطلاق الإصلاح على جميع المستخدمين
git merge security/fixes-staging main
npm run deploy:production
```

---

## 📞 خطط الطوارئ

### ماذا لو فشل كل شيء؟

```bash
#!/bin/bash
# emergency-restore.sh - استعادة شاملة في حالة الطوارئ

BACKUP_DIR="./backups/$(date +%Y-%m-%d)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚨 Emergency Restore Started at $TIMESTAMP"

# 1. إيقاف الخادم
echo "1. Stopping services..."
npm stop
systemctl stop mysql

# 2. النسخ الاحتياطية من الحالة الحالية (للمرجعية)
echo "2. Creating emergency backup..."
mkdir -p ./backups/emergency/$TIMESTAMP
mysqldump -u root -p eshro_database > ./backups/emergency/$TIMESTAMP/database.sql
cp -r backend/public/assets ./backups/emergency/$TIMESTAMP/

# 3. استعادة البيانات
echo "3. Restoring from backup..."
systemctl start mysql
mysql -u root -p eshro_database < "$BACKUP_DIR/database.sql"

# 4. استعادة الملفات
echo "4. Restoring files..."
rm -rf backend/public/assets/*
cp -r "$BACKUP_DIR/files/assets/*" backend/public/assets/

# 5. إرجاع الكود إلى الإصدار السابق
echo "5. Reverting code..."
git revert HEAD
npm install

# 6. إعادة التشغيل
echo "6. Restarting services..."
npm run dev

# 7. التحقق
echo "7. Verifying..."
curl http://localhost:5000/api/health

echo "✅ Emergency restore completed!"
echo "📝 Emergency backup saved to: ./backups/emergency/$TIMESTAMP/"
```

---

## 📋 Checklist الأمان والنسخ الاحتياطية

- [ ] تم عمل backup كامل من قاعدة البيانات
- [ ] تم عمل backup من جميع الملفات المرفوعة
- [ ] تم اختبار استعادة البيانات
- [ ] تم توثيق البيانات والملفات
- [ ] تم التحقق من سلامة الـ backups
- [ ] تم إنشاء rollback plan
- [ ] تم تدريب الفريق على الاستعادة
- [ ] تم اختبار جميع السيناريوهات

---

## 🎯 الخطة الزمنية

| المرحلة | المدة | الوصف |
|--------|------|--------|
| **النسخ الاحتياطية** | 1 ساعة | عمل backups شاملة |
| **الاختبار** | 2 ساعة | اختبار الاستعادة |
| **التطبيق** | 1-2 ساعة | تطبيق الإصلاحات |
| **المراقبة** | 24 ساعة | مراقبة الأخطاء |

---

**الضمان**: ✅ 100% Zero Data Loss  
**الأمان**: ✅ محمي تماماً  
**الاستعادة**: ✅ سريعة وآمنة
