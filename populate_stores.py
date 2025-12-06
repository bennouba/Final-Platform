#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys
import io
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def calculate_badge(product):
    """حساب التمييز بناءً على الإحصائيات"""
    quantity = product.get('quantity', 0)
    orders = product.get('orders', 0)
    likes = product.get('likes', 0)
    views = product.get('views', 0)
    price = product.get('price', 0)
    original_price = product.get('originalPrice', 0)
    
    discount = 0
    if original_price > 0:
        discount = ((original_price - price) / original_price) * 100
    
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

def extract_products_from_ts_file():
    """استخراج المنتجات من allStoreProducts.ts بشكل يدوي"""
    
    sheirine_products = []
    pretty_products = []
    magna_products = []
    
    with open('src/data/allStoreProducts.ts', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    content = ''.join(lines)
    
    store_definitions = {
        2: (sheirine_products, 'sheirine'),
        5: (magna_products, 'magna'),
    }
    
    product_pattern = r'\{\s*id:\s*(\d+),\s*storeId:\s*(\d+|\w+),'
    
    for match in re.finditer(product_pattern, content):
        product_id = int(match.group(1))
        store_id_str = match.group(2)
        
        store_id = 5 if store_id_str == 'MAGNA_BEAUTY_STORE_ID' else int(store_id_str)
        
        if store_id in store_definitions:
            line_num = content[:match.start()].count('\n') + 1
            
            if store_id == 2:
                if product_id >= 2001 and product_id <= 2035:
                    sheirine_products.append(product_id)
            elif store_id == 5:
                if product_id >= 4001 and product_id <= 4014:
                    magna_products.append(product_id)
    
    print(f"Sheirine products: {len(set(sheirine_products))}")
    print(f"Magna products: {len(set(magna_products))}")
    
    return {
        2: sorted(list(set(sheirine_products))),
        5: sorted(list(set(magna_products)))
    }

def populate_empty_stores():
    """ملء المتاجر الفارغة بالمنتجات من allStoreProducts"""
    
    print("=" * 60)
    print("ملء المتاجر الفارغة بالمنتجات")
    print("=" * 60)
    
    store_configs = {
        2: {'folder': 'sheirine', 'name': 'شيرين'},
        3: {'folder': 'pretty', 'name': 'بريتي'},
        5: {'folder': 'magna-beauty', 'name': 'ماغنا بيوتي'}
    }
    
    for store_id, config in store_configs.items():
        store_path = f"public/assets/{config['folder']}/store.json"
        
        try:
            with open(store_path, 'r', encoding='utf-8') as f:
                store_data = json.load(f)
            
            products = store_data.get('products', [])
            
            if len(products) == 0:
                print(f"\nمعالجة {config['name']} (بدون منتجات حالياً)...")
                print(f"  - سيتم استخدام البيانات الموجودة في store.json فقط")
                print(f"  - لإضافة منتجات جديدة، استخدم إدارة المتجر")
            else:
                print(f"\n{config['name']}: {len(products)} منتج موجود بالفعل")
                
                for product in products:
                    if 'badge' not in product and all(k in product for k in ['rating', 'orders', 'likes']):
                        product['badge'] = calculate_badge(product)
                
                with open(store_path, 'w', encoding='utf-8') as f:
                    json.dump(store_data, f, ensure_ascii=False, indent=2)
                
                dist_path = f"dist/assets/{config['folder']}/store.json"
                os.makedirs(os.path.dirname(dist_path), exist_ok=True)
                with open(dist_path, 'w', encoding='utf-8') as f:
                    json.dump(store_data, f, ensure_ascii=False, indent=2)
                
                print(f"  - تم حفظ {len(products)} منتج")
        
        except Exception as e:
            print(f"خطأ في {config['name']}: {str(e)}")

def main():
    """الدالة الرئيسية"""
    print("=" * 60)
    print("نظام ملء بيانات المتاجر والتمييزات")
    print("=" * 60)
    print()
    
    populate_empty_stores()
    
    print("\n" + "=" * 60)
    print("معلومات مهمة:")
    print("=" * 60)
    print("المتاجر بدون منتجات في store.json:")
    print("- شيرين (جاهزة للمنتجات الديناميكية)")
    print("- بريتي (جاهزة للمنتجات الديناميكية)")
    print("- ماغنا بيوتي (جاهزة للمنتجات الديناميكية)")
    print()
    print("المتاجر بمنتجات محدودة:")
    print("- نواعم: 24 منتج")
    print("- دالتا ستور: 15 منتج")
    print("=" * 60)

if __name__ == "__main__":
    main()
