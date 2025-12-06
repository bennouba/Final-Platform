#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('public/assets/pretty/store.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('🔍 فحص جميع منتجات بريتي:')
print('=' * 80)

for product in data['products']:
    quantity = product.get('quantity', 0)
    badge = product.get('badge', 'جديد')
    status = '✅' if quantity > 0 else '❌'
    print(f'{status} {product["name"][:35]:35} | الكمية: {quantity:2} | الشارة: {badge}')

print('=' * 80)
print('\nملخص:')
quantities = [p.get('quantity', 0) for p in data['products']]
print(f'إجمالي المنتجات: {len(quantities)}')
print(f'المنتجات المتوفرة: {len([q for q in quantities if q > 0])}')
print(f'المنتجات غير المتوفرة: {len([q for q in quantities if q <= 0])}')
