import type { ImageLoaderProps } from 'next/image'

/**
 * Global Next.js image loader for Storyblok's image service.
 *
 * Wired up in `next.config.ts` via `images.loaderFile`, so EVERY `next/image`
 * in the app uses it. Next.js calls this for each width in the generated
 * `srcset`, so each viewport downloads an image sized exactly for it. We append
 * Storyblok's `/m/<width>x0` transform (0 height = keep aspect ratio)
 * and an automatic modern format (webp).
 *
 * Docs: https://www.storyblok.com/docs/image-service
 */
export default function storyblokLoader({ src, width, quality }: ImageLoaderProps) {
  // Only Storyblok-hosted assets support the image service; pass others through.
  if (!src.includes("a.storyblok.com") || src.endsWith(".svg")) return src;

  return `${src}/m/${width}x0/filters:quality(${quality || 80}):format(webp)`
}
