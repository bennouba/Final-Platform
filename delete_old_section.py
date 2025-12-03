# -*- coding: utf-8 -*-
import codecs

# قراءة الملف
with codecs.open('src/pages/EnhancedMerchantDashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"عدد الأسطر الأصلي: {len(lines)}")

# حذف الأسطر من 10417 إلى 11088 (0-indexed: 10416 إلى 11087)
new_lines = lines[:10416] + lines[11088:]

print(f"عدد الأسطر بعد الحذف: {len(new_lines)}")
print(f"تم حذف {len(lines) - len(new_lines)} سطر")

# كتابة الملف
with codecs.open('src/pages/EnhancedMerchantDashboard.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("تم الحذف بنجاح!")
