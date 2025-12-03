import re

file_path = r'c:\Users\dataf\Downloads\Eishro-Platform_V7\src\pages\ModernStorePage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Remove indeeshSliderData references (lines 208-211)
pattern1 = r'      if \(storeSlug === [\'"]indeesh["\']\) \{\s+console\.log\(`ℹ️ Loading indeesh slider data: \$\{indeeshSliderData\.length\} slides`\);\s+return indeeshSliderData;\s+\}'
content = re.sub(pattern1, '', content)

# Fix 2: Fix the ternary operator ending - change ) :                         )}  to ) : null\n      }
# This pattern finds the incorrect ternary closing
pattern2 = r'        \)\s+\)}'
content = re.sub(pattern2, '        ) : null\n      }', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed both errors:")
print("  1. Removed indeeshSliderData references")
print("  2. Fixed ternary operator syntax")
