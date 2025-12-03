import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();
const publicAssetsPath = path.join(baseDir, 'public', 'assets');
const srcDataStoresPath = path.join(baseDir, 'src', 'data', 'stores');
const storesIndexPath = path.join(publicAssetsPath, 'stores', 'index.json');

interface VerificationResult {
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: string[];
}

const results: VerificationResult[] = [];

function addResult(status: 'PASS' | 'FAIL' | 'WARNING', message: string, details?: string[]) {
  results.push({ status, message, details });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${message}`);
  if (details) {
    details.forEach(d => console.log(`   ${d}`));
  }
}

function verifyStoresIndex() {
  console.log('\n📋 Checking stores index.json...\n');
  
  try {
    if (!fs.existsSync(storesIndexPath)) {
      addResult('FAIL', 'stores/index.json does not exist', [
        'Path: ' + storesIndexPath,
        'Action: Run: npm run init:stores (in backend)'
      ]);
      return;
    }

    const indexContent = fs.readFileSync(storesIndexPath, 'utf-8');
    const indexData = JSON.parse(indexContent);

    if (!Array.isArray(indexData)) {
      addResult('FAIL', 'index.json is not an array');
      return;
    }

    if (indexData.length === 0) {
      addResult('WARNING', 'index.json is empty', [
        'Action: Run: npm run init:stores (in backend) to initialize with default stores'
      ]);
      return;
    }

    addResult('PASS', `index.json contains ${indexData.length} stores`, [
      ...indexData.map(s => `  - ${s.slug}: ${s.name}`)
    ]);
  } catch (error) {
    addResult('FAIL', 'Failed to read/parse index.json', [
      'Error: ' + (error as Error).message
    ]);
  }
}

function verifyStoreDirectories() {
  console.log('\n📁 Checking store directories...\n');

  const requiredStores = ['nawaem', 'sheirine', 'delta-store', 'pretty', 'magna-beauty'];

  requiredStores.forEach(storeName => {
    const assetDir = path.join(publicAssetsPath, storeName);
    const srcDir = path.join(srcDataStoresPath, storeName);

    const assetExists = fs.existsSync(assetDir);
    const srcExists = fs.existsSync(srcDir);

    const details = [];
    if (assetExists) details.push(`  ✅ Assets: ${assetDir}`);
    else details.push(`  ❌ Missing: ${assetDir}`);

    if (srcExists) details.push(`  ✅ TS Files: ${srcDir}`);
    else details.push(`  ⚠️  Missing: ${srcDir}`);

    if (assetExists || srcExists) {
      addResult('PASS', `${storeName} - directory structure OK`, details);
    } else {
      addResult('WARNING', `${storeName} - directories not found`, details);
    }
  });
}

function verifyCarouselComponent() {
  console.log('\n🎠 Checking StoresCarousel component...\n');

  const carouselPath = path.join(baseDir, 'src', 'components', 'StoresCarousel.tsx');

  try {
    const content = fs.readFileSync(carouselPath, 'utf-8');

    const hasAllowedStores = content.includes('const ALLOWED_STORES');
    if (hasAllowedStores) {
      addResult('WARNING', 'StoresCarousel still has hardcoded ALLOWED_STORES', [
        'Action: Remove ALLOWED_STORES array - carousel should accept all stores from index.json'
      ]);
    } else {
      addResult('PASS', 'StoresCarousel correctly uses dynamic store loading from index.json');
    }

    const hasFetchJsonStores = content.includes('fetchJsonStores');
    if (!hasFetchJsonStores) {
      addResult('WARNING', 'fetchJsonStores function not found in carousel');
    } else {
      addResult('PASS', 'StoresCarousel has fetchJsonStores implementation');
    }
  } catch (error) {
    addResult('FAIL', 'Could not read StoresCarousel component', [
      'Error: ' + (error as Error).message
    ]);
  }
}

function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 STORES SYSTEM VERIFICATION REPORT');
  console.log('='.repeat(60) + '\n');

  verifyStoresIndex();
  verifyStoreDirectories();
  verifyCarouselComponent();

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60) + '\n');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warnings = results.filter(r => r.status === 'WARNING').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);

  if (failed > 0) {
    console.log('\n🔧 ACTION ITEMS:');
    results
      .filter(r => r.status === 'FAIL' || r.status === 'WARNING')
      .forEach(r => {
        console.log(`\n${r.message}`);
        if (r.details) {
          r.details.forEach(d => console.log(`  ${d}`));
        }
      });
  }

  console.log('\n' + '='.repeat(60) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

generateReport();
