#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def calculate_badge(product):
    """حساب الشارة بناءً على بيانات المنتج"""
    quantity = product.get('quantity', 0)
    views = product.get('views', 0)
    likes = product.get('likes', 0)
    orders = product.get('orders', 0)
    original_price = product.get('originalPrice', 0)
    price = product.get('price', 0)
    
    if quantity <= 0:
        return 'غير متوفر'
    
    if quantity > 0 and quantity < 5:
        return 'متوفر'
    
    discount_percent = ((original_price - price) / original_price * 100) if original_price > 0 else 0
    if original_price > price and discount_percent > 10:
        return 'تخفيضات'
    
    if orders > 100 and likes > 200:
        return 'مميزة'
    
    if orders > 100:
        return 'أكثر مبيعاً'
    
    if likes > 200:
        return 'أكثر إعجاباً'
    
    if orders > 50:
        return 'أكثر طلباً'
    
    if views > 400:
        return 'أكثر مشاهدة'
    
    return 'جديد'

def get_badge_color(badge):
    """الحصول على لون الشارة"""
    colors = {
        'جديد': 'bg-teal-600 text-white',
        'أكثر مبيعاً': 'bg-red-500 text-white',
        'أكثر إعجاباً': 'bg-yellow-500 text-black',
        'مميزة': 'bg-yellow-800 text-white',
        'أكثر مشاهدة': 'bg-blue-900 text-white',
        'أكثر طلباً': 'bg-orange-500 text-white',
        'تخفيضات': 'bg-pink-600 text-white',
        'غير متوفر': 'bg-orange-700 text-white',
        'متوفر': 'bg-green-500 text-white'
    }
    return colors.get(badge, 'bg-gray-500 text-white')

def load_json_file(path):
    """تحميل ملف JSON"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ خطأ في تحميل {path}: {e}")
        return None

def save_json_file(path, data):
    """حفظ ملف JSON"""
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ تم حفظ: {path}")
        return True
    except Exception as e:
        print(f"❌ خطأ في الحفظ {path}: {e}")
        return False

def apply_badges_to_store(store_data):
    """تطبيق الشارات على منتجات المتجر"""
    if 'products' not in store_data or not store_data['products']:
        return store_data
    
    updated_products = []
    for product in store_data['products']:
        if product.get('quantity', 0) > 0 or product.get('quantity', 0) <= 0:
            badge = calculate_badge(product)
            product['badge'] = badge
            product['badgeColor'] = get_badge_color(badge)
        updated_products.append(product)
    
    store_data['products'] = updated_products
    return store_data

def main():
    """البرنامج الرئيسي"""
    stores = [
        {
            'path': 'public/assets/nawaem/store.json',
            'dist_path': 'dist/assets/nawaem/store.json',
            'name': 'نواعم'
        },
        {
            'path': 'public/assets/delta-store/store.json',
            'dist_path': 'dist/assets/delta-store/store.json',
            'name': 'دلتا ستور'
        },
        {
            'path': 'public/assets/sheirine/store.json',
            'dist_path': 'dist/assets/sheirine/store.json',
            'name': 'شيرين'
        },
        {
            'path': 'public/assets/pretty/store.json',
            'dist_path': 'dist/assets/pretty/store.json',
            'name': 'بريتي'
        },
        {
            'path': 'public/assets/magna-beauty/store.json',
            'dist_path': 'dist/assets/magna-beauty/store.json',
            'name': 'ماغنا بيوتي'
        }
    ]
    
    print("🚀 بدء تطبيق نظام الشارات على جميع المتاجر...\n")
    
    for store in stores:
        print(f"📦 معالجة متجر: {store['name']}")
        
        store_data = load_json_file(store['path'])
        if store_data is None:
            print(f"⚠️  تخطي {store['name']}\n")
            continue
        
        product_count = len(store_data.get('products', []))
        print(f"   عدد المنتجات: {product_count}")
        
        store_data = apply_badges_to_store(store_data)
        
        if save_json_file(store['path'], store_data):
            try:
                with open(store['dist_path'], 'w', encoding='utf-8') as f:
                    json.dump(store_data, f, ensure_ascii=False, indent=2)
                print(f"✅ تم تحديث: {store['dist_path']}")
            except Exception as e:
                print(f"⚠️  لم يتمكن من تحديث dist: {e}")
        
        if product_count > 0:
            badges_summary = {}
            for product in store_data.get('products', []):
                badge = product.get('badge', 'جديد')
                badges_summary[badge] = badges_summary.get(badge, 0) + 1
            
            print("   ملخص الشارات:")
            for badge, count in badges_summary.items():
                print(f"      • {badge}: {count}")
        
        print()
    
    print("✨ انتهت المعالجة بنجاح!")

if __name__ == '__main__':
    main()
