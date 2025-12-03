import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { promises as fsPromises } from 'fs';
import { Request, Response, NextFunction } from 'express';

const getTempUploadDir = () => {
  let basePath = process.cwd();
  if (basePath.endsWith('backend')) {
    basePath = path.join(basePath, '..');
  }
  return path.join(basePath, '.tmp-uploads');
};

const tempUploadDir = getTempUploadDir();

const getBackendStorePath = (storeSlug: string, imageType: 'products' | 'sliders' | 'logo') => {
  let basePath = process.cwd();
  if (basePath.endsWith('backend')) {
    basePath = path.join(basePath, '..');
  }
  return path.join(basePath, 'backend', 'public', 'assets', storeSlug, imageType);
};

const getFrontendStorePath = (storeSlug: string, imageType: 'products' | 'sliders' | 'logo') => {
  let basePath = process.cwd();
  if (basePath.endsWith('backend')) {
    basePath = path.join(basePath, '..');
  }
  return path.join(basePath, 'public', 'assets', storeSlug, imageType);
};

const getBrandsPath = () => {
  let basePath = process.cwd();
  if (basePath.endsWith('backend')) {
    basePath = path.join(basePath, '..');
  }
  return path.join(basePath, 'public', 'assets', 'brands');
};

const getTempUploadPath = () => {
  return tempUploadDir;
};

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadPath = getTempUploadPath();
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error as any, uploadPath);
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext);
    const safe = base.replace(/\s+/g, '-').replace(/[^A-Za-z0-9._-]/g, '');
    const finalName = `${safe}${ext}`;
    cb(null, finalName);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'image/gif', 
    'image/avif', 
    'image/tiff', 
    'image/bmp',
    'image/svg+xml'
  ];
  
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.tiff', '.tif', '.bmp', '.svg'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  const isValidMime = allowedMimes.includes(file.mimetype);
  const isValidExt = allowedExtensions.includes(fileExt);
  
  if (isValidMime || isValidExt) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Only ${allowedExtensions.join(', ')} are allowed`));
  }
};

export const storeImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 600,
    fieldSize: 50 * 1024 * 1024
  }
});

export const uploadProductImages = storeImageUpload.array('productImages', 500);
export const uploadSliderImages = storeImageUpload.array('sliderImages', 50);

const calculateFileHash = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
};

const deduplicateFiles = async (
  files: Express.Multer.File[],
  targetDir: string,
  imageType: 'products' | 'sliders' | 'logo'
): Promise<Express.Multer.File[]> => {
  const hashMap = new Map<string, Express.Multer.File>();
  const duplicates: string[] = [];

  for (const file of files) {
    try {
      const hash = await calculateFileHash(file.path);
      if (hashMap.has(hash)) {
        duplicates.push(file.filename);

      } else {
        hashMap.set(hash, file);
      }
    } catch (error) {

      hashMap.set(Date.now().toString(), file);
    }
  }

  return Array.from(hashMap.values());
};

export const moveUploadedFiles = async (
  storeSlug: string, 
  files: Record<string, Express.Multer.File[]>
): Promise<Record<string, Express.Multer.File[]>> => {
  const movedFiles: Record<string, Express.Multer.File[]> = {};
  const failedMoves: Array<{ file: string; error: string }> = [];
  const stats = {
    totalFiles: 0,
    movedFiles: 0,
    movedToFrontend: 0,
    productImages: 0,
    sliderImages: 0,
    logoFiles: 0,
    duplicatesSkipped: 0,
    brandLogoCopied: false
  };





  
  if (!files || Object.keys(files).length === 0) {

    return movedFiles;
  }
  
  for (const [fieldName, fileArray] of Object.entries(files)) {
    if (!fileArray || fileArray.length === 0) continue;

    let imageType: 'products' | 'sliders' | 'logo' = 'products';
    if (fieldName === 'storeLogo' || fieldName === 'logo' || fieldName === 'store_logo') {
      imageType = 'logo';
    } else if (fieldName === 'sliderImages' || fieldName.startsWith('sliderImage')) {
      imageType = 'sliders';
    }

    stats.totalFiles += fileArray.length;

    const backendTargetDir = getBackendStorePath(storeSlug, imageType);
    const frontendTargetDir = getFrontendStorePath(storeSlug, imageType);
    
    try {
      await fsPromises.mkdir(backendTargetDir, { recursive: true });

      
      await fsPromises.mkdir(frontendTargetDir, { recursive: true });

    } catch (mkdirError) {

      throw new Error(`Failed to create upload directory for ${imageType}: ${(mkdirError as Error).message}`);
    }


    const dedupedFiles = await deduplicateFiles(fileArray, backendTargetDir, imageType);
    const skippedCount = fileArray.length - dedupedFiles.length;
    if (skippedCount > 0) {
      stats.duplicatesSkipped += skippedCount;

    }

    const movedArray: Express.Multer.File[] = [];

    for (const file of dedupedFiles) {
      const oldPath = file.path;
      const backendPath = path.join(backendTargetDir, file.filename);
      const frontendPath = path.join(frontendTargetDir, file.filename);

      try {
        // Collision detection: if same name exists with different content, reject
        if (fs.existsSync(backendPath)) {
          const existingHash = await calculateFileHash(backendPath);
          const newHash = await calculateFileHash(oldPath);
          if (existingHash !== newHash) {
            const msg = `Name collision with different content for ${file.filename}`;

            failedMoves.push({ file: file.filename, error: msg });
            continue;
          }
        }
        // If frontend exists with different content, also reject
        if (fs.existsSync(frontendPath)) {
          const existingFrontHash = await calculateFileHash(frontendPath);
          const newHash = await calculateFileHash(oldPath);
          if (existingFrontHash !== newHash) {
            const msg = `Frontend name collision with different content for ${file.filename}`;

            failedMoves.push({ file: file.filename, error: msg });
            continue;
          }
        }

        // Copy if not already identical
        if (!fs.existsSync(backendPath)) {
          await fsPromises.copyFile(oldPath, backendPath);
        } else {
          void 0;
        }
        
        if (!fs.existsSync(frontendPath)) {
          await fsPromises.copyFile(oldPath, frontendPath);

          stats.movedToFrontend++;
        } else {
          void 0;
        }
        
        if (imageType === 'logo') {
          const brandsDir = getBrandsPath();
          await fsPromises.mkdir(brandsDir, { recursive: true });
          const brandLogoPath = path.join(brandsDir, file.filename);
          if (!fs.existsSync(brandLogoPath)) {
            await fsPromises.copyFile(oldPath, brandLogoPath);

          }
          stats.brandLogoCopied = true;
        }
        
        await fsPromises.unlink(oldPath);
        
        movedArray.push({
          ...file,
          path: backendPath,
          destination: backendTargetDir
        });
        
        stats.movedFiles++;
        if (imageType === 'products') stats.productImages++;
        else if (imageType === 'sliders') stats.sliderImages++;
        else if (imageType === 'logo') stats.logoFiles++;
        
      } catch (error) {
        const errorMsg = (error as Error).message;

        failedMoves.push({ 
          file: file.filename, 
          error: errorMsg 
        });
      }
    }

    if (movedArray.length > 0) {
      movedFiles[fieldName] = movedArray;
    }
  }











  if (failedMoves.length > 0 && stats.movedFiles === 0) {
    const failedList = failedMoves.map(f => `${f.file}: ${f.error}`).join('\n    ');
    const errorMsg = `Failed to move ${failedMoves.length} file(s):\n    ${failedList}`;

    throw new Error(errorMsg);
  } else if (failedMoves.length > 0) {
    void 0;
  }

  return movedFiles;
};

export const cleanupTempUploads = async (): Promise<void> => {
  try {
    if (fs.existsSync(tempUploadDir)) {
      const files = await fsPromises.readdir(tempUploadDir);
      if (files.length > 0) {

        await fsPromises.rm(tempUploadDir, { recursive: true, force: true });

      }
    }
  } catch (error) {

  }
};

export const uploadBothImages = (req: Request, res: Response, next: NextFunction) => {
  const fields: Array<{ name: string; maxCount: number }> = [
    { name: 'productImages', maxCount: 500 },
    { name: 'sliderImages', maxCount: 50 },
    { name: 'storeLogo', maxCount: 1 }
  ];

  for (let i = 0; i < 100; i++) {
    fields.push({ name: `productImage_${i}`, maxCount: 5 });
  }

  for (let i = 0; i < 20; i++) {
    fields.push({ name: `sliderImage_${i}`, maxCount: 1 });
  }

  let timeoutHandle: NodeJS.Timeout | null = null;
  
  const uploadHandler = storeImageUpload.fields(fields);
  
  timeoutHandle = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({ 
        success: false, 
        error: 'Upload processing timeout - request took too long' 
      });
    }
  }, 600000);
  
  uploadHandler(req, res, (err: any) => {
    if (timeoutHandle) clearTimeout(timeoutHandle);
    
    if (err) {
      if (!res.headersSent) {
        return res.status(400).json({ 
          success: false, 
          error: `Upload error: ${err.message}` 
        });
      }
      return;
    }
    next();
  });
};
