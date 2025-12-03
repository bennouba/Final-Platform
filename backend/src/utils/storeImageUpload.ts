import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Configure multer for memory storage
const storage = multer.memoryStorage();

export const uploadBothImages = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
}).fields([
  { name: 'productImages', maxCount: 50 },
  { name: 'sliderImages', maxCount: 20 },
  { name: 'storeLogo', maxCount: 1 }
]);

// Save uploaded files to public/assets directory
export const saveUploadedImages = async (
  files: { [fieldname: string]: Express.Multer.File[] },
  storeSlug: string
): Promise<{
  productImageUrls: string[];
  sliderImageUrls: string[];
  logoUrl?: string;
}> => {
  const baseDir = path.join(process.cwd(), 'public', 'assets', storeSlug);

  // Ensure directories exist
  const productsDir = path.join(baseDir, 'products');
  const slidersDir = path.join(baseDir, 'sliders');
  const logoDir = path.join(baseDir, 'logo');

  [productsDir, slidersDir, logoDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const productImageUrls: string[] = [];
  const sliderImageUrls: string[] = [];
  let logoUrl: string | undefined;

  // Save product images
  if (files.productImages) {
    files.productImages.forEach((file, index) => {
      const filename = `product_${index + 1}_${Date.now()}${path.extname(file.originalname)}`;
      const filepath = path.join(productsDir, filename);
      fs.writeFileSync(filepath, file.buffer);
      productImageUrls.push(`/assets/${storeSlug}/products/${filename}`);
    });
  }

  // Save slider images
  if (files.sliderImages) {
    files.sliderImages.forEach((file, index) => {
      const filename = `slider_${index + 1}_${Date.now()}${path.extname(file.originalname)}`;
      const filepath = path.join(slidersDir, filename);
      fs.writeFileSync(filepath, file.buffer);
      sliderImageUrls.push(`/assets/${storeSlug}/sliders/${filename}`);
    });
  }

  // Save store logo
  if (files.storeLogo && files.storeLogo[0]) {
    const file = files.storeLogo[0];
    const filename = `logo_${Date.now()}${path.extname(file.originalname)}`;
    const filepath = path.join(logoDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    logoUrl = `/assets/${storeSlug}/logo/${filename}`;
  }

  return {
    productImageUrls,
    sliderImageUrls,
    logoUrl
  };
};
