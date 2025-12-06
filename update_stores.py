#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import random
from pathlib import Path
import sys

# Set UTF-8 encoding for output
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def update_store(store_dir):
    base_path = Path(__file__).parent / 'public' / 'assets' / store_dir / 'store.json'
    
    print(f'Processing: {base_path}')
    
    if not base_path.exists():
        print(f'  [!] File not found')
        return False
    
    try:
        with open(base_path, 'r', encoding='utf-8') as f:
            store = json.load(f)
        
        updated_count = 0
        for product in store.get('products', []):
            if 'rating' not in product or product['rating'] is None:
                product['rating'] = round(4 + random.random(), 1)
                updated_count += 1
            if 'reviews' not in product or product['reviews'] is None:
                product['reviews'] = random.randint(10, 100)
            if 'views' not in product or product['views'] is None:
                product['views'] = random.randint(50, 450)
            if 'likes' not in product or product['likes'] is None:
                product['likes'] = random.randint(10, 300)
            if 'orders' not in product or product['orders'] is None:
                product['orders'] = random.randint(5, 150)
            if 'quantity' not in product or product['quantity'] is None:
                product['quantity'] = random.randint(5, 50) if product.get('inStock') else 0
            if 'badge' not in product or product['badge'] is None:
                product['badge'] = 'جديد'
        
        with open(base_path, 'w', encoding='utf-8') as f:
            json.dump(store, f, ensure_ascii=False, indent=2)
        
        print(f'  [OK] Updated {store_dir} ({len(store.get("products", []))} products)')
        return True
    except Exception as e:
        print(f'  [ERROR] {str(e)}')
        return False

if __name__ == '__main__':
    print('Starting store updates...\n')
    results = [
        update_store('nawaem'),
        update_store('delta-store'),
        update_store('indeesh')
    ]
    print(f'\n[DONE] {sum(results)}/{len(results)} stores updated successfully')
