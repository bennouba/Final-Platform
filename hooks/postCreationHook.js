const path = require('path');

function normalizeImagePath(slug, p, type) {
  if (!p) return p;
  if (p.startsWith('/')) return p;
  if (p.startsWith('assets/')) return '/' + p;
  if (!p.startsWith(`/assets/${slug}/`)) {
    // If it's just a filename, attach to store folder by type
    const sub = type || (p.toLowerCase().includes('slider') ? 'sliders' : 'products');
    return `/assets/${slug}/${sub}/${p}`;
  }
  return p;
}

module.exports.runStoreGeneration = async function runStoreGeneration(payload) {
  const service = require(path.join(process.cwd(), 'storeGeneratorService.js')).default
    || require(path.join(process.cwd(), 'storeGeneratorService.js'));

  const data = { ...payload };

  if (Array.isArray(data.products)) {
    data.products = data.products.map((prod, idx) => ({
      ...prod,
      images: Array.isArray(prod.images)
        ? prod.images.map((p) => normalizeImagePath(data.storeSlug, p, 'products'))
        : []
    }));
  }

  if (Array.isArray(data.sliderImages)) {
    data.sliderImages = data.sliderImages.map((s, idx) => ({
      ...s,
      image: normalizeImagePath(data.storeSlug, s.image, 'sliders')
    }));
  }

  await service.generateStoreFiles(data);
};
