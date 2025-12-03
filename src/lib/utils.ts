// Utility functions for the EISHRO platform
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const PRODUCT_FALLBACK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#f3f4f6"/><path d="M20 56l12-12 8 8 20-20 8 8" stroke="#9ca3af" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="30" cy="30" r="10" fill="#e5e7eb"/></svg>'
export const PRODUCT_IMAGE_FALLBACK_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(PRODUCT_FALLBACK_SVG)}`

const IMAGE_MIME_TYPES: Record<string, string> = {
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp"
}

function extractExtension(src: string): string | undefined {
  const sanitized = src.split("?")[0]?.split("#")[0] ?? ""
  const parts = sanitized.split(".")
  const ext = parts.length > 1 ? parts.pop() : undefined
  return ext?.toLowerCase()
}

export function getImageMimeType(src: string): string | undefined {
  const ext = extractExtension(src)
  return ext ? IMAGE_MIME_TYPES[ext] : undefined
}

export interface ProductMediaConfig {
  primary: string
  pictureSources: string[]
  datasetSources: string[]
}

function dedupeSources(sources: string[]): string[] {
  const seen = new Set<string>()
  return sources.filter((src) => {
    if (!src || seen.has(src)) {
      return false
    }
    seen.add(src)
    return true
  })
}

function isModernFormat(src: string): boolean {
  const ext = extractExtension(src)
  return ext === "webp" || ext === "avif"
}

export function buildProductMediaConfig(
  product: { images?: string[]; image?: string; thumbnail?: string } | undefined,
  fallback: string
): ProductMediaConfig {
  const rawSources = dedupeSources([
    ...(product?.images ?? []),
    product?.image ?? "",
    product?.thumbnail ?? ""
  ])

  const baseSources = rawSources.length > 0 ? rawSources : []
  const preferred = baseSources.find((src) => !isModernFormat(src)) ?? baseSources[0]
  const primary = preferred ?? fallback

  const datasetSources = dedupeSources([
    primary,
    ...baseSources.filter((src) => src !== primary)
  ])

  if (!datasetSources.includes(fallback)) {
    datasetSources.push(fallback)
  }

  const mimeSeen = new Set<string>()
  const pictureSources: string[] = []

  for (const src of baseSources) {
    const mime = getImageMimeType(src)
    if (mime && !mimeSeen.has(mime)) {
      pictureSources.push(src)
      mimeSeen.add(mime)
    }
  }

  if (pictureSources.length === 0 && primary) {
    pictureSources.push(primary)
  }

  return {
    primary,
    pictureSources,
    datasetSources
  }
}

export function advanceImageOnError(
  event: React.SyntheticEvent<HTMLImageElement, Event>
) {
  const target = event.currentTarget
  const sourcesValue = target.dataset.imageSources
  const fallback = target.dataset.fallbackSrc

  let sources: string[] = []

  if (sourcesValue) {
    try {
      const parsed = JSON.parse(sourcesValue)
      if (Array.isArray(parsed)) {
        sources = parsed.filter((src) => typeof src === "string" && src.length > 0)
      }
    } catch {
      sources = []
    }
  }

  if (sources.length === 0 && fallback) {
    sources = [fallback]
  }

  if (sources.length === 0) {
    return
  }

  const currentIndex = Number.parseInt(target.dataset.imageIndex ?? "0", 10)
  const nextIndex = currentIndex + 1

  if (nextIndex < sources.length) {
    const nextSrc = sources[nextIndex]
    if (nextSrc) {
      target.dataset.imageIndex = String(nextIndex)
      target.src = nextSrc
      return
    }
  }

  if (fallback && fallback.length > 0 && target.src !== fallback) {
    target.onerror = null
    target.src = fallback
  }
}
