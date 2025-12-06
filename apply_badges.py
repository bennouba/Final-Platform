#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def calculate_badge(product):
    """حساب التمييز بناءً على الإحصائيات"""
    quantity = product.get('quantity', 0)
    orders = product.get('orders', 0)
    likes = product.get('likes', 0)
    views = product.get('views', 0)
    rating = product.get('rating', 0)
    price = product.get('price', 0)
    original_price = product.get('originalPrice', 0)
    
    # حساب نسبة التخفيف
    discount = 0
    if original_price > 0:
        discount = ((original_price - price) / original_price) * 100
    
    # أولويات التمييز
    if quantity <= 0:
        return "غير متوفر"
    elif discount > 10:
        return "تخفيضات"
    elif orders > 100 and likes > 200:
        return "مميزة"
    elif orders > 100:
        return "أكثر مبيعاً"
    elif likes > 200:
        return "أكثر إعجاباً"
    elif orders > 50:
        return "أكثر طلباً"
    elif views > 400:
        return "أكثر مشاهدة"
    else:
        return "جديد"

def process_store(store_folder, store_name):
    """معالجة ملف store.json لمتجر معين"""
    store_path = f"public/assets/{store_folder}/store.json"
    
    if not os.path.exists(store_path):
        print(f"WARNING: {store_path} لم يتم العثور عليه")
        return False
    
    try:
        with open(store_path, 'r', encoding='utf-8') as f:
            store_data = json.load(f)
        
        products = store_data.get('products', [])
        updated_count = 0
        
        for product in products:
            if 'rating' in product and 'orders' in product:
                old_badge = product.get('badge', '')
                new_badge = calculate_badge(product)
                product['badge'] = new_badge
                
                if old_badge != new_badge:
                    updated_count += 1
        
        # حفظ البيانات المحدثة
        with open(store_path, 'w', encoding='utf-8') as f:
            json.dump(store_data, f, ensure_ascii=False, indent=2)
        
        # حفظ نسخة في dist
        dist_path = f"dist/assets/{store_folder}/store.json"
        os.makedirs(os.path.dirname(dist_path), exist_ok=True)
        with open(dist_path, 'w', encoding='utf-8') as f:
            json.dump(store_data, f, ensure_ascii=False, indent=2)
        
        print(f"OK - {store_name}: تم تحديث {updated_count} منتج من {len(products)}")
        return True
        
    except Exception as e:
        print(f"ERROR - {store_name}: {str(e)}")
        return False

def main():
    """الدالة الرئيسية"""
    stores = [
        ('nawaem', 'نواعم'),
        ('sheirine', 'شيرين'),
        ('delta-store', 'دالتا ستور'),
        ('pretty', 'بريتي'),
        ('magna-beauty', 'ماغنا بيوتي')
    ]
    
    print("=" * 60)
    print("تطبيق نظام التمييز على المتاجر")
    print("=" * 60)
    
    success_count = 0
    for folder, name in stores:
        if process_store(folder, name):
            success_count += 1
    
    print("=" * 60)
    print(f"تم معالجة {success_count} متجر بنجاح")
    print("=" * 60)

if __name__ == "__main__":
    main()
