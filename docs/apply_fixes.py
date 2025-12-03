#!/usr/bin/env python3
import os

# Change to the working directory
os.chdir(r'c:\Users\dataf\Downloads\Eishro-Platform_V7')

# Read the file
with open('src/pages/ModernStorePage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Make changes
output_lines = []
i = 0
added_imports = False
added_products = False
added_slider = False

while i < len(lines):
    line = lines[i]
    
    # 1. Add Shikha imports after indeeshSliderData
    if not added_imports and "import { indeeshSliderData } from '@/data/stores/indeesh/sliderData';" in line:
        output_lines.append(line)
        output_lines.append("import ShikhaSlider from '@/data/stores/shikha/Slider';\n")
        output_lines.append("import { shikhaProducts } from '@/data/stores/shikha/products';\n")
        output_lines.append("import { shikhaSliderData } from '@/data/stores/shikha/sliderData';\n")
        added_imports = True
        i += 1
        continue
    
    # 2. Add shikha case in products switch statement
    if not added_products and "case 'indeesh':" in line and i > 300 and i < 320:
        output_lines.append(line)
        output_lines.append(lines[i+1])  # storeProducts = indeeshProducts;
        output_lines.append(lines[i+2])  # break;
        output_lines.append("          case 'shikha':\n")
        output_lines.append("            storeProducts = shikhaProducts;\n")
        output_lines.append("            break;\n")
        added_products = True
        i += 3
        continue
    
    # 3. Replace shikha slider comment
    if not added_slider and "case 'shikha':" in line and i > 330 and i < 345:
        output_lines.append(line)
        output_lines.append("        storeSlider = ShikhaSlider;\n")
        # Skip the comment and break
        i += 1
        while i < len(lines) and "break;" not in lines[i]:
            i += 1
        if i < len(lines) and "break;" in lines[i]:
            output_lines.append(lines[i])
            i += 1
        added_slider = True
        continue
    
    output_lines.append(line)
    i += 1

# Write back
with open('src/pages/ModernStorePage.tsx', 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print('Step 1-3 complete!')

# Now add the slider data loading in getSliderImages
with open('src/pages/ModernStorePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and add shikha slider data loading after indeesh
old_text = """      if (storeSlug === 'indeesh') {
        console.log(`ℹ️ Loading indeesh slider data: ${indeeshSliderData.length} slides`);
        return indeeshSliderData;
      }"""

new_text = """      if (storeSlug === 'indeesh') {
        console.log(`ℹ️ Loading indeesh slider data: ${indeeshSliderData.length} slides`);
        return indeeshSliderData;
      }
      
      if (storeSlug === 'shikha') {
        console.log(`ℹ️ Loading shikha slider data: ${shikhaSliderData.length} slides`);
        return shikhaSliderData;
      }"""

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('src/pages/ModernStorePage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Step 4 complete!')
else:
    print('Warning: Could not find indeesh slider data section')

print('All Shikha configurations applied successfully!')
