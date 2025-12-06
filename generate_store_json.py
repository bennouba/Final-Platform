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

def extract_products_from_ts():
    """استخراج المنتجات من allStoreProducts.ts"""
    stores = {
        1: {'name': 'نواعم', 'folder': 'nawaem', 'products': []},
        2: {'name': 'شيرين', 'folder': 'sheirine', 'products': []},
        3: {'name': 'بريتي', 'folder': 'pretty', 'products': []},
        4: {'name': 'دالتا ستور', 'folder': 'delta-store', 'products': []},
        5: {'name': 'ماغنا بيوتي', 'folder': 'magna-beauty', 'products': []}
    }
    
    try:
        with open('src/data/allStoreProducts.ts', 'r', encoding='utf-8') as f:
            content = f.read()
        
        products_in_file = []
        
        pattern = r'\{\s*id:\s*(\d+),\s*storeId:\s*(?:MAGNA_BEAUTY_STORE_ID|(\d+)),'
        for match in re.finditer(pattern, content):
            product_id = int(match.group(1))
            store_id = int(match.group(2)) if match.group(2) else 5
            
            start = match.start()
            brace_count = 1
            pos = match.start() + 1
            
            while brace_count > 0 and pos < len(content):
                if content[pos] == '{':
                    brace_count += 1
                elif content[pos] == '}':
                    brace_count -= 1
                pos += 1
            
            product_str = content[start:pos]
            
            try:
                product_json = '{' + product_str.split('{', 1)[1].rsplit('}', 1)[0] + '}'
                product_json = product_json.replace("MAGNA_BEAUTY_STORE_ID", "5")
                product_json = product_json.replace("\n", " ")
                product_json = re.sub(r',\s*\}', '}', product_json)
                
                product_dict = {}
                if 'storeId' in product_json:
                    if store_id in stores:
                        products_in_file.append((store_id, product_id, product_str))
            except:
                pass
        
        print(f"عدد المنتجات المستخرجة: {len(products_in_file)}")
        return products_in_file, stores
        
    except Exception as e:
        print(f"خطأ: {str(e)}")
        return [], {}

def load_and_process_stores():
    """تحميل ملفات store.json وتحديث المنتجات"""
    store_config = {
        1: {'folder': 'nawaem', 'name': 'نواعم'},
        2: {'folder': 'sheirine', 'name': 'شيرين'},
        3: {'folder': 'pretty', 'name': 'بريتي'},
        4: {'folder': 'delta-store', 'name': 'دالتا ستور'},
        5: {'folder': 'magna-beauty', 'name': 'ماغنا بيوتي'}
    }
    
    print("\nمعالجة ملفات store.json:")
    print("=" * 60)
    
    for store_id, config in store_config.items():
        store_path = f"public/assets/{config['folder']}/store.json"
        
        if not os.path.exists(store_path):
            print(f"تحذير: لم يتم العثور على {store_path}")
            continue
        
        try:
            with open(store_path, 'r', encoding='utf-8') as f:
                store_data = json.load(f)
            
            products = store_data.get('products', [])
            updated_count = 0
            
            for product in products:
                if all(k in product for k in ['rating', 'orders', 'likes']):
                    old_badge = product.get('badge', '')
                    new_badge = calculate_badge(product)
                    
                    if new_badge and (old_badge != new_badge):
                        product['badge'] = new_badge
                        updated_count += 1
                    elif new_badge and 'badge' not in product:
                        product['badge'] = new_badge
                        updated_count += 1
            
            with open(store_path, 'w', encoding='utf-8') as f:
                json.dump(store_data, f, ensure_ascii=False, indent=2)
            
            dist_path = f"dist/assets/{config['folder']}/store.json"
            os.makedirs(os.path.dirname(dist_path), exist_ok=True)
            with open(dist_path, 'w', encoding='utf-8') as f:
                json.dump(store_data, f, ensure_ascii=False, indent=2)
            
            print(f"OK - {config['name']}: {len(products)} منتج، تم تحديث {updated_count}")
            
        except Exception as e:
            print(f"خطأ - {config['name']}: {str(e)}")

def main():
    """الدالة الرئيسية"""
    print("=" * 60)
    print("نظام معالجة التمييز والإحصائيات للمتاجر الخمسة")
    print("=" * 60)
    
    load_and_process_stores()
    
    print("=" * 60)
    print("اكتمل المعالجة بنجاح")
    print("=" * 60)

if __name__ == "__main__":
    main()
