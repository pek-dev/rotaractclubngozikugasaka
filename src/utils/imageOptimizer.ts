/**
 * Utility for converting and optimizing images to WebP format dynamically
 * and adding responsive quality parameters.
 */

export function getOptimizedImageUrl(url: string, width = 1200, quality = 80): string {
  if (!url) return 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80&fm=webp';

  // If it's an Unsplash URL, ensure it uses WebP format & specified width/quality
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('fm', 'webp');
      parsedUrl.searchParams.set('q', quality.toString());
      if (!parsedUrl.searchParams.has('w')) {
        parsedUrl.searchParams.set('w', width.toString());
      }
      return parsedUrl.toString();
    } catch {
      // Fallback string replacement if URL constructor fails
      if (!url.includes('fm=webp')) {
        return url + (url.includes('?') ? '&' : '?') + `fm=webp&q=${quality}&w=${width}`;
      }
      return url;
    }
  }

  return url;
}
