const supportedImageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg'];

export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getDefaultProductImage(storeSlug?: string): Promise<string> {
  if (storeSlug) {
    for (const ext of supportedImageExtensions) {
      const storePath = `/assets/${storeSlug}/default-product.${ext}`;
      if (await checkImageExists(storePath)) {
        return storePath;
      }
    }
  }
  
  for (const ext of supportedImageExtensions) {
    const globalPath = `/assets/default-product.${ext}`;
    if (await checkImageExists(globalPath)) {
      return globalPath;
    }
  }
  
  return '/assets/default-product.png';
}

export function getDefaultProductImageSync(storeSlug?: string): string {
  if (storeSlug) {
    return `/assets/${storeSlug}/default-product.jpg`;
  }
  return '/assets/default-product.png';
}

export function getImageWithFallback(
  imageUrl: string | undefined,
  fallbackStoreSlug?: string
): string {
  if (imageUrl && imageUrl.trim()) {
    return imageUrl;
  }
  return getDefaultProductImageSync(fallbackStoreSlug);
}

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement>,
  storeSlug?: string
) => {
  const img = e.currentTarget;
  const currentSrc = img.src;
  
  const allPaths: string[] = [];
  
  if (storeSlug) {
    for (const ext of supportedImageExtensions) {
      allPaths.push(`/assets/${storeSlug}/default-product.${ext}`);
    }
  }
  
  for (const ext of supportedImageExtensions) {
    allPaths.push(`/assets/default-product.${ext}`);
  }
  
  allPaths.push('/assets/default-product.png');
  
  for (const path of allPaths) {
    const fullPath = new URL(path, window.location.origin).href;
    if (currentSrc !== fullPath) {
      img.src = path;
      return;
    }
  }
};
