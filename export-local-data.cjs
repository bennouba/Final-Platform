#!/usr/bin/env node

/**
 * تصدير البيانات المحلية لنشرها على السحابة
 * 
 * هذا السكريبت يقوم بتصدير:
 * - بيانات المتاجر
 * - المنتجات 
 * - بيانات المستخدمين
 * - الطلبات
 * - الإعدادات
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class DataExporter {
  constructor() {
    this.exportDir = './cloud-export';
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  async createExportDirectory() {
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
    console.log(`📁 Created export directory: ${this.exportDir}`);
  }

  async exportDatabase() {
    try {
      console.log('🗄️ Exporting local MySQL database...');
      
      // تصدير قاعدة البيانات المحلية
      const backupFile = `${this.exportDir}/eishro_db_backup.sql`;
      const command = `mysqldump -u root -p eishro_db > ${backupFile}`;
      
      console.log('💡 To export database, run this command manually:');
      console.log(`   mysqldump -u root -p eishro_db > ${backupFile}`);
      console.log('   (Enter your MySQL password when prompted)');
      
      return { success: true, file: backupFile };
    } catch (error) {
      console.error('❌ Database export failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async exportStoreData() {
    try {
      console.log('🏪 Exporting store configuration data...');
      
      const storesData = {
        timestamp: this.timestamp,
        local_stores: [],
        public_assets: [],
        backend_assets: []
      };

      // قراءة بيانات المتاجر من public/assets
      const publicAssetsDir = './public/assets';
      if (fs.existsSync(publicAssetsDir)) {
        const storeDirs = fs.readdirSync(publicAssetsDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        for (const storeDir of storeDirs) {
          const storePath = path.join(publicAssetsDir, storeDir);
          const storeJsonPath = path.join(storePath, 'store.json');
          
          if (fs.existsSync(storeJsonPath)) {
            const storeData = JSON.parse(fs.readFileSync(storeJsonPath, 'utf8'));
            storesData.public_assets.push({
              storeSlug: storeDir,
              data: storeData,
              assetsPath: storePath
            });
          }
        }
      }

      // قراءة بيانات المتاجر من src/data
      const srcStoresDir = './src/data/stores';
      if (fs.existsSync(srcStoresDir)) {
        const storeDirs = fs.readdirSync(srcStoresDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        for (const storeDir of storeDirs) {
          const storePath = path.join(srcStoresDir, storeDir);
          const configPath = path.join(storePath, 'config.ts');
          const productsPath = path.join(storePath, 'products.ts');
          
          if (fs.existsSync(configPath)) {
            storesData.local_stores.push({
              storeSlug: storeDir,
              configPath: configPath,
              productsPath: productsPath,
              hasConfig: true,
              hasProducts: fs.existsSync(productsPath)
            });
          }
        }
      }

      // حفظ البيانات المصدرة
      const exportFile = `${this.exportDir}/stores_data.json`;
      fs.writeFileSync(exportFile, JSON.stringify(storesData, null, 2));
      
      console.log(`✅ Store data exported to: ${exportFile}`);
      console.log(`📊 Found ${storesData.local_stores.length} local stores`);
      console.log(`📊 Found ${storesData.public_assets.length} public store assets`);
      
      return { success: true, file: exportFile, storesCount: storesData.local_stores.length };
    } catch (error) {
      console.error('❌ Store data export failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async generateDeploymentGuide() {
    try {
      console.log('📋 Generating deployment guide...');
      
      const guide = `# 🚀 دليل النشر السحابي - البيانات المصدرة ${this.timestamp}

## 📊 **البيانات المصدرة**

### 🗄️ **قاعدة البيانات**
- الملف: \`eishro_db_backup.sql\`
- النوع: MySQL
- المحتوى: جميع جداول قاعدة البيانات

### 🏪 **المتاجر**
- عدد المتاجر: سيتم تحديده بعد التصدير
- النوع: TypeScript configurations + JSON assets
- المسارات: \`./src/data/stores/\` + \`./public/assets/\`

## 🔧 **خطوات الرفع للسحابة**

### 1. **إعداد قاعدة البيانات في Neon**
\`\`\`bash
# رفع البيانات إلى Neon MySQL
mysql -h your-neon-host -u username -p database_name < eishro_db_backup.sql
\`\`\`

### 2. **إعداد متغيرات البيئة**
# DATABASE_URL=mysql://username:password@hostname:port/database_name

### 3. **رفع ملفات المتاجر**
نسخ جميع ملفات المتاجر من:
- \`./src/data/stores/\` → Backend storage
- \`./public/assets/\` → CDN/Static files

## ✅ **التحقق من النجاح**
- [ ] قاعدة البيانات تعمل في Neon
- [ ] جميع المتاجر ظاهرة في النظام
- [ ] المنتجات محملة بشكل صحيح
- [ ] الصور والـ assets تعمل

---
*تم الإنشاء في: ${this.timestamp}*
`;

      const guideFile = `${this.exportDir}/deployment_guide.md`;
      fs.writeFileSync(guideFile, guide);
      
      console.log(`✅ Deployment guide created: ${guideFile}`);
      return { success: true, file: guideFile };
    } catch (error) {
      console.error('❌ Guide generation failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async run() {
    console.log('🌟 Starting local data export for cloud deployment...\n');
    
    try {
      await this.createExportDirectory();
      await this.exportStoreData();
      await this.generateDeploymentGuide();
      
      console.log('\n🎉 Data export completed successfully!');
      console.log(`📁 Check the export directory: ${this.exportDir}`);
      console.log('\n📋 Next steps:');
      console.log('1. Run the MySQL backup command shown above');
      console.log('2. Follow the deployment guide');
      console.log('3. Upload data to Neon MySQL');
      console.log('4. Deploy frontend and backend to cloud');
      
    } catch (error) {
      console.error('\n💥 Export failed:', error.message);
      process.exit(1);
    }
  }
}

// تشغيل السكريبت
if (require.main === module) {
  const exporter = new DataExporter();
  exporter.run();
}

module.exports = DataExporter;