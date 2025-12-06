#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('public/assets/nawaem/store.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('🔍 فحص منتجات نواعم (عينة):')
print('=' * 80)

unavailable = []
for product in data['products']:
    quantity = product.get('quantity', 0)
    badge = product.get('badge', 'جديد')
    if badge == 'غير متوفر':
        status = '⚠️'
        unavailable.append(product)
    else:
        status = '✅'
    print(f'{status} {product["name"][:35]:35} | الكمية: {quantity:2} | الشارة: {badge}')

print('=' * 80)
if unavailable:
    print(f'\n⚠️  المنتجات غير المتوفرة ({len(unavailable)}):')
    for product in unavailable:
        print(f'   • {product["name"]} - الكمية: {product.get("quantity", 0)}')
