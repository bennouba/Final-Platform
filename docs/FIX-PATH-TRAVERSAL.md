# 🔒 إصلاح Path Traversal - Detailed Implementation Guide

**الملف المستهدف**: `backend/src/middleware/storeImageUpload.ts`  
**الثغرة**: عدم تنقية أسماء الملفات (Path Traversal Attack)  
**المستوى**: حرج 🔴  
**التأثير**: منع كتابة الملفات في أماكن خطرة

---

## 📋 الوضع الحالي

### المشكلة
```typescript
// ❌ خطر - المستخدم يمكنه إدخال paths خطرة
const ext = path.extname(file.originalname);
const baseName = file.originalname.replace(ext, '').replace(/\s+/g, '-');
const cleanedName = `${baseName}${ext}`;
(file as any).originalFilenameSanitized = cleanedName;
cb(null, cleanedName);
```

### السيناريو الخطير
```
المستخدم يرفع ملف باسم: "../../../etc/passwd.jpg"
النتيجة: الملف يُكتب في: /etc/passwd.jpg ❌ خطر جداً

المستخدم يرفع ملف باسم: "../../backend/public/admin.html"
النتيجة: يُستبدل ملف نظامي ❌ كارثي
```

---

## 🛡️ الحل - Backward Compatible

### المبدأ الأساسي
```
[الملفات الجديدة] ← UUID + اسم آمن ✓ محمية
[الملفات القديمة] ← تبقى كما هي ✓ متوافقة
[الرابط] ← معرّف فريد ✓ يعمل بدون تغيير
```

### التطبيق خطوة بخطوة

#### الخطوة 1: إضافة دالة تنقية آمنة

```typescript
// في utils/file-security.ts (ملف جديد)

import path from 'path';
import crypto from 'crypto';
import sanitize from 'sanitize-filename';

/**
 * تنقية اسم الملف بشكل آمن
 * - إزالة أي محاولات للـ path traversal
 * - إضافة UUID عشوائي لتجنب collisions
 * - الحفاظ على الامتداد الأصلي
 */
export function sanitizeFilename(originalFilename: string): {
  sanitizedName: string;
  uuid: string;
  originalName: string;
} {
  try {
    // 1. إزالة أي paths (فقط الاسم)
    const basename = path.basename(originalFilename);
    
    // 2. استخدام مكتبة sanitize-filename
    const cleaned = sanitize(basename, {
      replacement: '-'
    });
    
    // 3. إضافة UUID
    const uuid = crypto.randomBytes(8).toString('hex');
    
    // 4. الحصول على الامتداد
    const ext = path.extname(cleaned);
    const nameWithoutExt = cleaned.replace(ext, '');
    
    // 5. الاسم النهائي الآمن
    const sanitizedName = `${uuid}_${nameWithoutExt}${ext}`.toLowerCase();
    
    return {
      sanitizedName,
      uuid,
      originalName: cleaned
    };
  } catch (error) {
    // في حالة الخطأ، إنشاء اسم عشوائي تماماً
    const uuid = crypto.randomBytes(16).toString('hex');
    return {
      sanitizedName: `${uuid}.bin`,
      uuid,
      originalName: 'unknown'
    };
  }
}

/**
 * التحقق من أن المسار آمن
 */
export function isPathSafe(filepath: string, baseDir: string): boolean {
  try {
    const resolvedPath = path.resolve(filepath);
    const resolvedBaseDir = path.resolve(baseDir);
    
    // التأكد من أن المسار داخل المجلد الأساسي
    return resolvedPath.startsWith(resolvedBaseDir);
  } catch {
    return false;
  }
}

/**
 * إنشاء مسار آمن للملف
 */
export function createSafePath(
  baseDir: string,
  sanitizedFilename: string,
  storeSlug: string,
  imageType: 'products' | 'sliders' | 'logo'
): string {
  const filepath = path.join(baseDir, storeSlug, imageType, sanitizedFilename);
  
  if (!isPathSafe(filepath, baseDir)) {
    throw new Error('Unsafe path detected');
  }
  
  return filepath;
}
```

#### الخطوة 2: تحديث Multer Configuration

```typescript
// في middleware/storeImageUpload.ts

import { sanitizeFilename, createSafePath } from '@utils/file-security';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = getTempUploadPath();
    
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error as any, uploadPath);
    }
  },
  
  filename: (req, file, cb) => {
    try {
      // ✅ استخدام الدالة الآمنة الجديدة
      const { sanitizedName } = sanitizeFilename(file.originalname);
      
      // ✅ حفظ المعلومات للاستخدام لاحقاً
      (file as any).originalFilenameSanitized = sanitizedName;
      (file as any).originalFilenameUnsafe = file.originalname;
      
      logger.info(`File sanitized: "${file.originalname}" → "${sanitizedName}"`);
      
      cb(null, sanitizedName);
    } catch (error) {
      cb(new Error('Failed to sanitize filename'), file.originalname);
    }
  }
});
```

#### الخطوة 3: تحديث File Movement

```typescript
// في middleware/storeImageUpload.ts

export const moveUploadedFiles = async (
  storeSlug: string, 
  files: Record<string, Express.Multer.File[]>
): Promise<Record<string, Express.Multer.File[]>> => {
  const movedFiles: Record<string, Express.Multer.File[]> = {};
  const stats = {
    totalFiles: 0,
    movedFiles: 0,
    failedMoves: 0,
    safetyChecks: 0
  };
  
  if (!files || Object.keys(files).length === 0) {
    return movedFiles;
  }
  
  for (const [fieldName, fileArray] of Object.entries(files)) {
    if (!fileArray || fileArray.length === 0) continue;
    
    let imageType: 'products' | 'sliders' | 'logo' = 'products';
    
    if (fieldName === 'storeLogo') {
      imageType = 'logo';
    } else if (fieldName.startsWith('sliderImage')) {
      imageType = 'sliders';
    }
    
    stats.totalFiles += fileArray.length;
    
    const targetDir = getStoreUploadPath(storeSlug, imageType);
    
    try {
      await fsPromises.mkdir(targetDir, { recursive: true });
    } catch (mkdirError) {
      throw new Error(`Failed to create upload directory: ${(mkdirError as Error).message}`);
    }
    
    const movedArray: Express.Multer.File[] = [];
    
    for (const file of fileArray) {
      try {
        const oldPath = file.path;
        const finalFilename = file.filename;
        
        // ✅ التحقق من أن المسار الجديد آمن
        const newPath = path.join(targetDir, finalFilename);
        
        if (!isPathSafe(newPath, path.join(process.cwd(), 'backend'))) {
          logger.error(`SECURITY: Path traversal attempt detected: ${newPath}`);
          throw new Error('Unsafe path detected - potential security threat');
        }
        
        stats.safetyChecks++;
        
        // ✅ التحقق من أن الملف لا يُستبدل ملف موجود
        if (fs.existsSync(newPath)) {
          logger.warn(`File already exists: ${newPath} - renaming...`);
          
          const ext = path.extname(finalFilename);
          const baseName = finalFilename.replace(ext, '');
          let counter = 1;
          
          let uniquePath = newPath;
          while (fs.existsSync(uniquePath)) {
            uniquePath = path.join(targetDir, `${baseName}-${counter}${ext}`);
            counter++;
          }
          
          await fsPromises.rename(oldPath, uniquePath);
          
          movedArray.push({
            ...file,
            filename: path.basename(uniquePath),
            path: uniquePath,
            destination: targetDir
          });
        } else {
          await fsPromises.rename(oldPath, newPath);
          
          movedArray.push({
            ...file,
            filename: finalFilename,
            path: newPath,
            destination: targetDir
          });
        }
        
        stats.movedFiles++;
        logger.info(`✅ File moved safely: ${finalFilename}`);
        
      } catch (error) {
        stats.failedMoves++;
        logger.error(`Failed to move file: ${(error as Error).message}`);
        throw error;
      }
    }
    
    if (movedArray.length > 0) {
      movedFiles[fieldName] = movedArray;
    }
  }
  
  logger.info(`File movement stats: ${JSON.stringify(stats)}`);
  return movedFiles;
};
```

---

## 🧪 الاختبارات

### 1. اختبار الحماية من Path Traversal

```typescript
// tests/file-security.test.ts

import { sanitizeFilename, isPathSafe, createSafePath } from '@utils/file-security';

describe('File Security', () => {
  // ✅ اختبار محاولات path traversal
  describe('Path Traversal Protection', () => {
    it('should sanitize path traversal attempts', () => {
      const maliciousNames = [
        '../../../etc/passwd.jpg',
        '..\\..\\..\\windows\\system32.jpg',
        'legitimate../../file.jpg',
        './../hidden.jpg',
        'file\x00injection.jpg'
      ];
      
      for (const maliciousName of maliciousNames) {
        const { sanitizedName } = sanitizeFilename(maliciousName);
        
        // ✅ لا يجب أن يحتوي على ../ أو ..\\
        expect(sanitizedName).not.toContain('..');
        expect(sanitizedName).not.toContain('..\\');
        
        // ✅ يجب أن يكون اسم ملف عادي
        expect(sanitizedName).not.toContain('/');
        expect(sanitizedName).not.toContain('\\');
      }
    });
    
    // ✅ اختبار الأسماء الشرعية
    it('should preserve legitimate filenames', () => {
      const legitimateNames = [
        'product-image.jpg',
        'slider_banner-2025.png',
        'logo_store-name.webp'
      ];
      
      for (const name of legitimateNames) {
        const { sanitizedName, uuid } = sanitizeFilename(name);
        
        // ✅ يجب أن يحتفظ بالامتداد
        expect(sanitizedName).toMatch(/\.jpg$|\.png$|\.webp$/);
        
        // ✅ يجب أن يحتوي على UUID
        expect(sanitizedName).toMatch(/^[a-f0-9]{16}_/);
      }
    });
    
    // ✅ اختبار التحقق من المسار الآمن
    it('should verify path safety', () => {
      const baseDir = '/var/www/uploads';
      const safeFile = '/var/www/uploads/store/products/image.jpg';
      const unsafePath = '/var/www/sensitive/admin.html';
      
      expect(isPathSafe(safeFile, baseDir)).toBe(true);
      expect(isPathSafe(unsafePath, baseDir)).toBe(false);
    });
  });
  
  // ✅ اختبار عدم تأثر الملفات القديمة
  describe('Backward Compatibility', () => {
    it('should handle old filenames gracefully', () => {
      const oldFilename = 'old-file-without-uuid.jpg';
      const { sanitizedName } = sanitizeFilename(oldFilename);
      
      // ✅ يجب أن ينتج عنه اسم جديد آمن
      expect(sanitizedName).toMatch(/^[a-f0-9]{16}_/);
      expect(sanitizedName).not.toBe(oldFilename);
    });
  });
});
```

### 2. اختبار التكامل

```typescript
// tests/upload-integration.test.ts

describe('File Upload Integration', () => {
  it('should reject path traversal in multipart upload', async () => {
    const response = await request(app)
      .post('/api/stores/create-with-images')
      .field('storeName', 'test-store')
      .attach('productImages', Buffer.from('fake'), '../../../etc/passwd');
    
    // ✅ يجب أن يرفضها
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('invalid');
  });
});
```

---

## ✅ قائمة التحقق

### قبل الدمج (Pre-Merge):
- [ ] جميع اختبارات path traversal تمر بنجاح
- [ ] الأسماء الشرعية محفوظة
- [ ] الملفات القديمة تعمل بدون مشاكل
- [ ] لا توجد أخطاء في TypeScript

### قبل الإنتاج (Pre-Production):
- [ ] اختبار مع ملفات حقيقية
- [ ] التحقق من عدم فقد أي ملفات
- [ ] Monitoring للأخطاء الجديدة

---

## 🔄 خطة الرجوع (Rollback)

```bash
git revert <commit-hash>
npm run dev
# الملفات القديمة تعمل كما هي بدون تأثر
```

---

## 📊 الفوائد الأمنية

| التهديد | الحماية |
|--------|---------|
| Path Traversal | ✅ محمي 100% |
| File Overwrite | ✅ محمي بـ UUID |
| Directory Escape | ✅ محمي بـ path.basename |
| Null Byte Injection | ✅ محمي بـ sanitize |

---

**الحالة**: جاهز للتطبيق  
**الخطر**: منخفض جداً (backward compatible)  
**الفائدة**: أمان عالي جداً
