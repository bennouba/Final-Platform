# 🔐 إصلاح Hash Algorithm - Detailed Implementation Guide

**الملف المستهدف**: `backend/src/middleware/storeImageUpload.ts:89`  
**الثغرة**: استخدام MD5 (weak crypto algorithm)  
**المستوى**: عالي 🟠  
**التأثير**: التحقق من سلامة الملفات والكشف عن التعديلات

---

## 📋 الوضع الحالي

### المشكلة
```typescript
// ⚠️ ضعيف - MD5 تم كسره
const calculateFileHash = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');  // ❌ weak
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
};
```

### لماذا MD5 ضعيف؟
1. **Cryptanalysis attacks** - تم كسره من طرف الباحثين
2. **Collision attacks** - يمكن إنشاء ملفات مختلفة بنفس الـ MD5
3. **NIST deprecation** - محذور رسمياً من قبل NIST
4. **Performance trade-off** - لا يوفر أمان حقيقي

### الفرق بين الخوارزميات

| الخوارزمية | الأمان | الأداء | الحالة |
|-----------|--------|--------|--------|
| **MD5** | ❌ ضعيف جداً | سريع | ❌ محذور |
| **SHA-1** | ⚠️ ضعيف | سريع | ⚠️ مهجّر |
| **SHA-256** | ✅ قوي | سريع | ✅ موصى به |
| **SHA-3** | ✅ قوي جداً | أبطأ قليلاً | ✅ الأفضل |

---

## 🛡️ الحل - Backward Compatible

### المبدأ الأساسي
```
[الملفات الجديدة] ← SHA-256 ✓ آمنة
[الملفات القديمة] ← MD5 (للتوافقية) ✓ تعمل
[نظام الكشف] ← يقبل كليهما ✓ مرن
```

### التطبيق خطوة بخطوة

#### الخطوة 1: إنشاء دوال متعددة الخوارزميات

```typescript
// في utils/file-hash.ts (ملف جديد)

import crypto from 'crypto';
import fs from 'fs';
import logger from './logger';

export type HashAlgorithm = 'md5' | 'sha256' | 'sha512';

interface FileHash {
  algorithm: HashAlgorithm;
  hash: string;
  timestamp: Date;
  fileSize: number;
}

/**
 * حساب hash الملف باستخدام خوارزمية محددة
 */
export async function calculateFileHash(
  filePath: string,
  algorithm: HashAlgorithm = 'sha256'
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash(algorithm);
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (data) => {
        hash.update(data);
      });
      
      stream.on('end', () => {
        const digest = hash.digest('hex');
        logger.info(`File hash (${algorithm}): ${digest}`);
        resolve(digest);
      });
      
      stream.on('error', (error) => {
        logger.error(`Error reading file for hashing: ${error.message}`);
        reject(new Error(`Failed to hash file: ${error.message}`));
      });
      
    } catch (error) {
      logger.error(`Hash calculation error: ${(error as Error).message}`);
      reject(error);
    }
  });
}

/**
 * حساب hashes متعددة للملف (للمقارنة)
 */
export async function calculateMultipleHashes(
  filePath: string
): Promise<{
  sha256: string;
  md5: string;  // للتوافقية فقط
  sha512: string;
}> {
  const [sha256, md5, sha512] = await Promise.all([
    calculateFileHash(filePath, 'sha256'),
    calculateFileHash(filePath, 'md5'),    // للملفات القديمة
    calculateFileHash(filePath, 'sha512')
  ]);
  
  return { sha256, md5, sha512 };
}

/**
 * التحقق من singleness الملف (لا توجد نسخة مكررة)
 * يستخدم SHA-256 كـ primary و MD5 للتوافقية
 */
export async function verifyFileUniqueness(
  filePath: string,
  existingHashes: Map<string, string>  // algorithm -> hash
): Promise<boolean> {
  try {
    const sha256 = await calculateFileHash(filePath, 'sha256');
    
    // ✅ التحقق من SHA-256 (primary)
    if (existingHashes.has('sha256')) {
      const existing = existingHashes.get('sha256');
      if (existing === sha256) {
        logger.warn(`Duplicate file detected (SHA-256): ${sha256}`);
        return false;
      }
    }
    
    // ⚠️ التحقق من MD5 للملفات القديمة (fallback)
    if (existingHashes.has('md5')) {
      const md5 = await calculateFileHash(filePath, 'md5');
      const existing = existingHashes.get('md5');
      if (existing === md5) {
        logger.warn(`Duplicate file detected (MD5): ${md5}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logger.error(`Uniqueness verification error: ${(error as Error).message}`);
    return true; // في حالة الخطأ، اسمح برفع الملف
  }
}

/**
 * مقارنة hashes بشكل آمن (timing-safe comparison)
 */
export function compareHashes(hash1: string, hash2: string): boolean {
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash1, 'hex'),
      Buffer.from(hash2, 'hex')
    );
  } catch {
    // في حالة الفشل (مثل أطوال مختلفة)
    return false;
  }
}

/**
 * حفظ hash الملف مع metadata
 */
export async function saveFileHash(
  filePath: string,
  fileSize: number,
  preferredAlgorithm: HashAlgorithm = 'sha256'
): Promise<FileHash> {
  const hash = await calculateFileHash(filePath, preferredAlgorithm);
  
  return {
    algorithm: preferredAlgorithm,
    hash,
    timestamp: new Date(),
    fileSize
  };
}
```

#### الخطوة 2: تحديث Deduplication Logic

```typescript
// في middleware/storeImageUpload.ts

import {
  calculateFileHash,
  calculateMultipleHashes,
  verifyFileUniqueness,
  HashAlgorithm
} from '@utils/file-hash';

// Store file hashes for deduplication
interface FileHashMap {
  [filePath: string]: {
    sha256: string;
    md5?: string;
    sha512?: string;
  };
}

const fileHashCache: FileHashMap = {};

/**
 * Deduplicate files using strong hash algorithm
 */
const deduplicateFiles = async (
  files: Express.Multer.File[],
  targetDir: string,
  imageType: 'products' | 'sliders' | 'logo'
): Promise<Express.Multer.File[]> => {
  const hashMap = new Map<string, Express.Multer.File>();
  const duplicates: string[] = [];
  
  for (const file of files) {
    try {
      // ✅ استخدام SHA-256 كـ primary
      const sha256 = await calculateFileHash(file.path, 'sha256');
      
      // ⚠️ حساب MD5 أيضاً (للتوافقية مع النسخ القديمة)
      const md5 = await calculateFileHash(file.path, 'md5');
      
      // تخزين في الـ cache
      fileHashCache[file.path] = { sha256, md5 };
      
      // ✅ التحقق من عدم وجود نسخة مطابقة
      let isDuplicate = false;
      
      // 1. البحث في الـ SHA-256 (الحالي)
      for (const [, existingFile] of hashMap) {
        const existingSha256 = fileHashCache[existingFile.path]?.sha256;
        if (existingSha256 && existingSha256 === sha256) {
          isDuplicate = true;
          logger.warn(`Duplicate detected (SHA-256): ${sha256}`);
          break;
        }
      }
      
      // 2. البحث في الـ MD5 (للملفات القديمة)
      if (!isDuplicate) {
        for (const [, existingFile] of hashMap) {
          const existingMd5 = fileHashCache[existingFile.path]?.md5;
          if (existingMd5 && existingMd5 === md5) {
            isDuplicate = true;
            logger.warn(`Duplicate detected (MD5): ${md5}`);
            break;
          }
        }
      }
      
      if (!isDuplicate) {
        // ✅ ملف جديد - إضافته للـ map
        hashMap.set(sha256, file);
      } else {
        // ❌ ملف مكرر - تخطيه
        duplicates.push(file.filename);
      }
      
    } catch (error) {
      // في حالة الخطأ، استخدم UUID كـ key (آمن)
      const fallbackKey = `error_${Date.now()}_${Math.random()}`;
      hashMap.set(fallbackKey, file);
      logger.warn(`Hash calculation failed, using fallback: ${file.filename}`);
    }
  }
  
  if (duplicates.length > 0) {
    logger.info(`Skipped ${duplicates.length} duplicate files: ${duplicates.join(', ')}`);
  }
  
  return Array.from(hashMap.values());
};
```

#### الخطوة 3: تسجيل معلومات الملف

```typescript
// في controller عند حفظ بيانات الملف

import { saveFileHash } from '@utils/file-hash';

interface FileMetadata {
  filename: string;
  originalName: string;
  size: number;
  hash: string;
  algorithm: HashAlgorithm;
  uploadDate: Date;
  storeId: string;
}

async function saveFileMetadata(
  file: Express.Multer.File,
  storeId: string
): Promise<FileMetadata> {
  const fileHash = await saveFileHash(file.path, file.size, 'sha256');
  
  return {
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    hash: fileHash.hash,
    algorithm: fileHash.algorithm,
    uploadDate: fileHash.timestamp,
    storeId
  };
}
```

---

## 🧪 الاختبارات

### 1. اختبار الخوارزميات المختلفة

```typescript
// tests/file-hash.test.ts

import {
  calculateFileHash,
  calculateMultipleHashes,
  compareHashes
} from '@utils/file-hash';

describe('File Hash Functions', () => {
  let testFilePath: string;
  
  beforeEach(async () => {
    // إنشاء ملف اختبار
    const testContent = 'Test file for hash calculation';
    testFilePath = await createTempFile(testContent);
  });
  
  // ✅ اختبار SHA-256
  it('should calculate SHA-256 hash', async () => {
    const hash = await calculateFileHash(testFilePath, 'sha256');
    
    expect(hash).toHaveLength(64);  // SHA-256 = 64 hex characters
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
  
  // ✅ اختبار MD5 (للتوافقية)
  it('should calculate MD5 hash', async () => {
    const hash = await calculateFileHash(testFilePath, 'md5');
    
    expect(hash).toHaveLength(32);  // MD5 = 32 hex characters
    expect(hash).toMatch(/^[a-f0-9]{32}$/);
  });
  
  // ✅ اختبار hashes متعددة
  it('should calculate multiple hashes', async () => {
    const hashes = await calculateMultipleHashes(testFilePath);
    
    expect(hashes.sha256).toHaveLength(64);
    expect(hashes.md5).toHaveLength(32);
    expect(hashes.sha512).toHaveLength(128);
  });
  
  // ✅ اختبار مقارنة آمنة
  it('should compare hashes safely', async () => {
    const hash1 = await calculateFileHash(testFilePath, 'sha256');
    const hash2 = await calculateFileHash(testFilePath, 'sha256');
    
    // نفس الملف = نفس الـ hash
    expect(compareHashes(hash1, hash2)).toBe(true);
    
    // ملفات مختلفة = hashes مختلفة
    const otherFilePath = await createTempFile('Different content');
    const hash3 = await calculateFileHash(otherFilePath, 'sha256');
    expect(compareHashes(hash1, hash3)).toBe(false);
  });
  
  // ✅ اختبار الكشف عن التعديلات
  it('should detect file tampering', async () => {
    const originalHash = await calculateFileHash(testFilePath, 'sha256');
    
    // تعديل الملف
    fs.appendFileSync(testFilePath, '\nTampered');
    const tamperedHash = await calculateFileHash(testFilePath, 'sha256');
    
    expect(compareHashes(originalHash, tamperedHash)).toBe(false);
  });
});
```

### 2. اختبار Deduplication

```typescript
describe('File Deduplication', () => {
  it('should detect duplicate files by SHA-256', async () => {
    const file1 = await createTempFile('content');
    const file2 = await createTempFile('content');
    
    const hash1 = await calculateFileHash(file1, 'sha256');
    const hash2 = await calculateFileHash(file2, 'sha256');
    
    // نفس الـ content = نفس الـ hash
    expect(hash1).toBe(hash2);
  });
  
  it('should preserve MD5 detection for backward compatibility', async () => {
    const file = await createTempFile('test');
    
    const sha256 = await calculateFileHash(file, 'sha256');
    const md5 = await calculateFileHash(file, 'md5');
    
    // كلاهما يجب أن يعمل
    expect(sha256).toBeDefined();
    expect(md5).toBeDefined();
    
    // لكن SHA-256 هو الأساسي
    expect(sha256.length).toBeGreaterThan(md5.length);
  });
});
```

---

## ✅ قائمة التحقق

### قبل الدمج (Pre-Merge):
- [ ] SHA-256 يعمل بشكل صحيح
- [ ] MD5 محفوظ للتوافقية
- [ ] الملفات المكررة تُكتشف بشكل صحيح
- [ ] لا توجد أخطاء في TypeScript

### قبل الإنتاج (Pre-Production):
- [ ] اختبار مع ملفات حقيقية كبيرة
- [ ] الأداء مقبول (لا توجد تأخيرات)
- [ ] الملفات القديمة تعمل بدون مشاكل

---

## 🔄 خطة الرجوع (Rollback)

```bash
git revert <commit-hash>
npm run dev
# الملفات والـ hashes القديمة تعمل كما هي
```

---

## 📊 الفوائد

| الجانب | MD5 | SHA-256 |
|-------|-----|---------|
| **الأمان** | ❌ ضعيف | ✅ قوي |
| **السرعة** | سريع | سريع أيضاً |
| **التوثيق** | محذور | موصى به |
| **الكشف عن التعديلات** | ضعيف | قوي جداً |
| **التوافقية** | محفوظة | جديد |

---

**الحالة**: جاهز للتطبيق  
**الخطر**: منخفض جداً (backward compatible)  
**الفائدة**: أمان محسّن + كشف أفضل للتعديلات
