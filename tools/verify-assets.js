#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function loadJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch (e) {
    return null;
  }
}

function resolveAssetPath(root, assetPath) {
  if (!assetPath) return null;
  const normalized = assetPath.startsWith('/')
    ? assetPath
    : `/${assetPath.replace(/^\/+/, '')}`;

  const candidates = [
    path.join(root, normalized),
    path.join(root, 'public', normalized),
    path.join(root, 'backend', 'public', normalized)
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function fileExists(root, p) {
  return Boolean(resolveAssetPath(root, p));
}

function verifyStore(root, slug) {
  const base = path.join(root, 'public', 'assets', slug);
  const storeJsonPath = path.join(base, 'store.json');
  const report = { slug, ok: true, errors: [], warnings: [], counts: { products: 0, sliders: 0 } };

  if (!fs.existsSync(storeJsonPath)) {
    report.ok = false;
    report.errors.push('Missing store.json');
    return report;
  }

  const store = loadJSON(storeJsonPath);
  if (!store) {
    report.ok = false;
    report.errors.push('Invalid store.json');
    return report;
  }

  // logo
  if (store.logo) {
    if (!fileExists(path.join(root), store.logo)) {
      report.warnings.push(`Logo not found: ${store.logo}`);
    }
  } else {
    report.warnings.push('Logo path missing in store.json');
  }

  // products
  if (Array.isArray(store.products)) {
    report.counts.products = store.products.length;
    store.products.forEach((p, idx) => {
      const imgs = Array.isArray(p.images) ? p.images : [];
      if (imgs.length === 0) {
        report.warnings.push(`Product ${p.id || idx}: no images`);
      }
      imgs.forEach((img) => {
        if (!fileExists(path.join(root), img)) {
          report.ok = false;
          report.errors.push(`Missing product image: ${img}`);
        }
      });
    });
  } else {
    report.warnings.push('products array missing');
  }

  // sliders
  if (Array.isArray(store.sliderImages)) {
    report.counts.sliders = store.sliderImages.length;
    store.sliderImages.forEach((s) => {
      if (!s || !s.image) {
        report.errors.push('Slider entry missing image');
        report.ok = false;
        return;
      }
      if (!fileExists(path.join(root), s.image)) {
        report.ok = false;
        report.errors.push(`Missing slider image: ${s.image}`);
      }
    });
  } else {
    report.warnings.push('sliderImages array missing');
  }

  // brand logo
  if (store.logo) {
    const brandName = path.basename(store.logo);
    const brandPath = path.join(root, 'public', 'assets', 'brands', brandName);
    if (!fs.existsSync(brandPath)) {
      report.warnings.push(`Brand logo not found: brands/${brandName}`);
    }
  }

  return report;
}

function main() {
  const root = process.cwd();
  const argSlug = process.argv[2];
  let slugs = [];

  if (argSlug) {
    slugs = [argSlug];
  } else {
    const storesIndex = path.join(root, 'public', 'assets', 'stores', 'index.json');
    if (fs.existsSync(storesIndex)) {
      try {
        const data = JSON.parse(fs.readFileSync(storesIndex, 'utf-8'));
        if (Array.isArray(data)) slugs = data.map((s) => s.slug).filter(Boolean);
        else if (data && Array.isArray(data.stores)) slugs = data.stores.map((s) => s.slug).filter(Boolean);
      } catch {}
    }
    if (slugs.length === 0) {
      // fallback: scan directories under public/assets
      const assetsDir = path.join(root, 'public', 'assets');
      if (fs.existsSync(assetsDir)) {
        slugs = fs.readdirSync(assetsDir).filter((d) => {
          const p = path.join(assetsDir, d);
          return fs.statSync(p).isDirectory() && ['brands', 'stores'].indexOf(d) === -1;
        });
      }
    }
  }

  if (slugs.length === 0) {
    console.error('No stores found to verify');
    process.exit(2);
  }

  const reports = slugs.map((slug) => verifyStore(root, slug));
  const ok = reports.every((r) => r.ok);

  console.log(JSON.stringify({ ok, reports }, null, 2));
  process.exit(ok ? 0 : 1);
}

main();
