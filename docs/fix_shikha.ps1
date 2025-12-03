$path = 'src\pages\ModernStorePage.tsx'
$content = Get-Content -Path $path -Raw

# 1. Add Shikha imports after indeeshSliderData
$content = $content -replace '(import \{ indeeshSliderData \} from .*?sliderData.*;)', '$1
import ShikhaSlider from ''@/data/stores/shikha/Slider'';
import { shikhaProducts } from ''@/data/stores/shikha/products'';
import { shikhaSliderData } from ''@/data/stores/shikha/sliderData'';'

# 2. Add shikha products case after indeesh
$content = $content -replace "(case 'indeesh':\s+storeProducts = indeeshProducts;\s+break;)", '$1
          case ''shikha'':
            storeProducts = shikhaProducts;
            break;'

# 3. Replace shikha slider comment with actual case
$content = $content -replace "case 'shikha':\s+// Shikha will use the dynamic slider component\s+break;", "case 'shikha':
        storeSlider = ShikhaSlider;
        break;"

# 4. Add shikha slider data loading in getSliderImages
$content = $content -replace "(if \(storeSlug === 'indeesh'\) \{\s+console\.log\(\`ℹ️ Loading indeesh slider data:.*?return indeeshSliderData;\s+\})", '$1

      if (storeSlug === ''shikha'') {
        console.log(`ℹ️ Loading shikha slider data: ${shikhaSliderData.length} slides`);
        return shikhaSliderData;
      }'

Set-Content -Path $path -Value $content
Write-Host "✅ All Shikha configurations added successfully!"
