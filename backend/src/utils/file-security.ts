import path from 'path';
import crypto from 'crypto';

export function sanitizeFilename(originalFilename: string): {
  sanitizedName: string;
  uuid: string;
  originalName: string;
} {
  try {
    const basename = path.basename(originalFilename);

    const cleaned = basename
      .replace(/\.\./g, '')
      .replace(/\x00/g, '')
      .replace(/[<>:"|?*\x00-\x1f]/g, '-')
      .replace(/\s+/g, '-')
      .toLowerCase();

    const uuid = crypto.randomBytes(8).toString('hex');

    const ext = path.extname(cleaned);
    const nameWithoutExt = cleaned.replace(ext, '').slice(0, 100);

    const sanitizedName = `${uuid}_${nameWithoutExt}${ext}`;

    return {
      sanitizedName,
      uuid,
      originalName: cleaned
    };
  } catch (error) {
    const uuid = crypto.randomBytes(16).toString('hex');
    return {
      sanitizedName: `${uuid}.bin`,
      uuid,
      originalName: 'unknown'
    };
  }
}

export function isPathSafe(filepath: string, baseDir: string): boolean {
  try {
    const resolvedPath = path.resolve(filepath);
    const resolvedBaseDir = path.resolve(baseDir);

    return resolvedPath.startsWith(resolvedBaseDir);
  } catch {
    return false;
  }
}

export function createSafePath(
  baseDir: string,
  sanitizedFilename: string,
  storeSlug: string,
  imageType: 'products' | 'sliders' | 'logo'
): string {
  const filepath = path.join(baseDir, storeSlug, imageType, sanitizedFilename);

  if (!isPathSafe(filepath, baseDir)) {
    throw new Error('Unsafe path detected');
  }

  return filepath;
}