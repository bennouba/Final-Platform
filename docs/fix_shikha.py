import re

with open('src/pages/ModernStorePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Shikha imports
import_pattern = r"(import \{ indeeshSliderData \} from '@/data/stores/indeesh/sliderData';)"
import_replacement = r"\1\nimport ShikhaSlider from '@/data/stores/shikha/Slider';\nimport { shikhaProducts } from '@/data/stores/shikha/products';\nimport { shikhaSliderData } from '@/data/stores/shikha/sliderData';"
content = re.sub(import_pattern, import_replacement, content)

# 2. Add shikha products case
products_pattern = r"(case 'indeesh':\s+storeProducts = indeeshProducts;\s+break;)"
products_replacement = r"\1\n          case 'shikha':\n            storeProducts = shikhaProducts;\n            break;"
content = re.sub(products_pattern, products_replacement, content)

# 3. Replace shikha slider comment
slider_pattern = r"case 'shikha':\s+// Shikha will use the dynamic slider component\s+break;"
slider_replacement = r"case 'shikha':\n        storeSlider = ShikhaSlider;\n        break;"
content = re.sub(slider_pattern, slider_replacement, content)

# 4. Add shikha slider data loading
slider_data_pattern = r"(if \(storeSlug === 'indeesh'\) \{\s+console\.log\(\`ℹ️ Loading indeesh slider data: \$\{indeeshSliderData\.length\} slides\`\);\s+return indeeshSliderData;\s+\})"
slider_data_replacement = r"\1\n      \n      if (storeSlug === 'shikha') {\n        console.log(\`ℹ️ Loading shikha slider data: ${shikhaSliderData.length} slides\`);\n        return shikhaSliderData;\n      }"
content = re.sub(slider_data_pattern, slider_data_replacement, content)

with open('src/pages/ModernStorePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Shikha configurations added successfully!')
