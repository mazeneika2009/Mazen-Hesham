// Static-only media helper: no backend origin rewriting.
// Absolute http(s)/blob/data URLs pass through; everything else is returned as-is
// (public/ assets or full URLs you put in the mock data).
export function resolveMediaUrl(url) {
  if (!url) return '';
  return url;
}

export function isVideoUrl(url) {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov');
}

// True when a media path points at a PDF (certificate preview).
// Centralizes the check so cards, detail pages, and thumbnails agree.
export function isPdfUrl(url) {
  if (!url) return false;
  return url.split('?')[0].toLowerCase().endsWith('.pdf');
}
