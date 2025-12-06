#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

stores = [
    ('nawaem', 'public/assets/nawaem/store.json'),
    ('delta-store', 'public/assets/delta-store/store.json'),
    ('pretty', 'public/assets/pretty/store.json'),
    ('sheirine', 'public/assets/sheirine/store.json'),
    ('magna-beauty', 'public/assets/magna-beauty/store.json'),
]

print("=" * 60)
print("📊 التحقق من نظام الشارات على جميع المتاجر")
print("=" * 60)

for store_name, store_path in stores:
    try:
        with open(store_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        products = data.get('products', [])
        product_count = len(products)
        
        print(f"\n✅ متجر {store_name}: {product_count} منتج")
        
        if product_count > 0:
            badges = {}
            for product in products:
                badge = product.get('badge', 'غير محدد')
                badges[badge] = badges.get(badge, 0) + 1
            
            print("   ملخص الشارات:")
            for badge in sorted(badges.keys()):
                count = badges[badge]
                print(f"      • {badge}: {count}")
                
            print("\n   عينة من المنتجات (أول 3):")
            for i, product in enumerate(products[:3]):
                print(f"      {i+1}. {product.get('name')} - الشارة: {product.get('badge')} - الكمية: {product.get('quantity', 0)}")
        else:
            print("   ⚠️  لا يوجد منتجات في المتجر")
    
    except FileNotFoundError:
        print(f"\n❌ متجر {store_name}: الملف غير موجود")
    except Exception as e:
        print(f"\n❌ متجر {store_name}: {e}")

print("\n" + "=" * 60)
print("✨ انتهت عملية التحقق")
print("=" * 60)
