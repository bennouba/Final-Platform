#!/usr/bin/env node

/**
 * Fix Script for Indeesh Store Image Assignment Issue
 * 
 * This script clears the corrupted localStorage cache for the indeesh store
 * and ensures the correct product image assignments are loaded from the backend.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Starting Indeesh Store Fix Script...\n');

// Paths
const backendStorePath = path.join(__dirname, 'backend', 'public', 'assets', 'indeesh', 'store.json');
const frontendStorePath = path.join(__dirname, 'public', 'assets', 'indeesh', 'store.json');

console.log('📋 Checking store.json files...');

// Check if backend store.json exists and has correct data
if (fs.existsSync(backendStorePath)) {
    try {
        const backendStoreData = JSON.parse(fs.readFileSync(backendStorePath, 'utf8'));
        console.log(`✅ Backend store.json found: ${backendStoreData.products?.length || 0} products`);
        
        // Verify key products have correct images
        const product3 = backendStoreData.products?.find(p => p.id === 1764003948994003);
        const product4 = backendStoreData.products?.find(p => p.id === 1764003948994004);
        const product5 = backendStoreData.products?.find(p => p.id === 1764003948994005);
        
        console.log('\n🖼️  Verifying product image assignments:');
        console.log('Product 3 (Washing Powder):', product3?.images?.length || 0, 'images');
        console.log('Product 4 (Liquid Detergent):', product4?.images?.length || 0, 'images');
        console.log('Product 5 (Blue Carpet Powder):', product5?.images?.length || 0, 'images');
        
        if (product3?.images?.[0]?.includes('alosra-collection.jpg')) {
            console.log('✅ Product 3 images are correct');
        } else {
            console.log('❌ Product 3 images are incorrect');
        }
        
        if (product4?.images?.[0]?.includes('alossra-gel-washing')) {
            console.log('✅ Product 4 images are correct');
        } else {
            console.log('❌ Product 4 images are incorrect');
        }
        
        if (product5?.images?.[0]?.includes('blu')) {
            console.log('✅ Product 5 images are correct');
        } else {
            console.log('❌ Product 5 images are incorrect');
        }
        
    } catch (error) {
        console.error('❌ Error reading backend store.json:', error);
        process.exit(1);
    }
} else {
    console.error('❌ Backend store.json not found at:', backendStorePath);
    process.exit(1);
}

// Check if frontend store.json exists
if (fs.existsSync(frontendStorePath)) {
    console.log('✅ Frontend store.json found');
} else {
    console.log('⚠️ Frontend store.json not found, will copy from backend');
    try {
        // Copy backend store.json to frontend
        fs.mkdirSync(path.dirname(frontendStorePath), { recursive: true });
        fs.copyFileSync(backendStorePath, frontendStorePath);
        console.log('✅ Frontend store.json created from backend');
    } catch (error) {
        console.error('❌ Error creating frontend store.json:', error);
    }
}

console.log('\n🧹 Creating cache clearing script for browser...');

// Create browser script to clear localStorage cache
const clearCacheScript = `
// Clear localStorage cache for Indeesh store
(function() {
    console.log('🧹 Clearing Indeesh store cache...');
    
    // Clear all Indeesh-related localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
            key.includes('indeesh') || 
            key.includes('store_products_indeesh') ||
            key.includes('eshro_store_files_indeesh') ||
            key.includes('store_sliders_indeesh')
        )) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log('🗑️ Removed:', key);
    });
    
    console.log('✅ Cache cleared! Please refresh the page to reload correct data.');
    
    // Force page reload after a short delay
    setTimeout(() => {
        console.log('🔄 Reloading page...');
        window.location.reload();
    }, 1000);
})();
`;

const scriptPath = path.join(__dirname, 'clear-indeesh-cache.js');
fs.writeFileSync(scriptPath, clearCacheScript);
console.log(`✅ Cache clearing script created: ${scriptPath}`);

console.log('\n📋 Instructions to fix the issue:');
console.log('1. Open the browser developer console (F12)');
console.log('2. Copy and paste the contents of clear-indeesh-cache.js');
console.log('3. Press Enter to execute the script');
console.log('4. The page will automatically reload with correct product images');
console.log('\nOR alternatively:');
console.log('1. Open browser developer console (F12)');
console.log('2. Run these commands manually:');
console.log('   localStorage.removeItem("store_products_indeesh");');
console.log('   localStorage.removeItem("eshro_store_files_indeesh");');
console.log('   localStorage.removeItem("store_sliders_indeesh");');
console.log('3. Refresh the page');

console.log('\n🎯 Expected Result:');
console.log('- Product 3 (الأسرة مسحوق غسيل الملابس) will show correct washing powder images');
console.log('- Product 4 (الأسرة سائل مركز غسيل ملابس) will show correct liquid detergent images'); 
console.log('- Product 5 (بلو مسحوق غسيل السجاد) will show correct blue carpet powder images');

console.log('\n✨ Fix script completed successfully!');