import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Version-matched ESM worker copied from
// node_modules/pdfjs-dist/build/pdf.worker.min.mjs (see scripts/verify-media.js).
// pdf.js loads `.mjs` workers as `{ type: 'module' }` automatically.
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Cache loaded PDF documents per URL so grids of certificates don't
// re-fetch / re-parse the same file on every card mount.
const docCache = new Map();

function getPdfDocument(src) {
  if (!docCache.has(src)) {
    // pdfjs-dist v4+ requires a params object — a bare string URL throws
    // "getDocument - expected either `data`, `range`, or `url` parameter."
    docCache.set(
      src,
      pdfjsLib.getDocument({ url: src }).promise.catch((err) => {
        // Don't poison the cache — allow a retry on next mount.
        docCache.delete(src);
        throw err;
      })
    );
  }
  return docCache.get(src);
}

// Renders the first page of a PDF onto a <canvas> so PDF certificates
// display visually like normal images. Client-side rendering is the
// lightest robust choice for a static portfolio:
// - no build-time conversion step, no duplicated .png/.webp assets
// - no native deps (poppler/Ghostscript) that break on Windows/Vercel
// - the browser caches the PDF; we only ever render page 1.
function PdfThumbnail({ src, className = '', fallback = null, label = 'Certificate preview', scale = 1.5 }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);
    let cancelled = false;

    const renderPdf = async () => {
      let pdfDoc = null;
      try {
        pdfDoc = await getPdfDocument(src);
        if (cancelled) return;
        const page = await pdfDoc.getPage(1);
        if (cancelled) return;

        // DPR-aware scale keeps thumbnails crisp on retina without
        // paying for full-resolution rendering on every card.
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        const renderScale = Math.min(scale * dpr, 3);
        const viewport = page.getViewport({ scale: renderScale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvasContext: context, viewport }).promise;
        page.cleanup();

        if (!cancelled) setLoading(false);
      } catch (e) {
        console.error('PDF render error:', e);
        if (!cancelled) {
          setLoading(false);
          setError(true);
        }
      }
      // NOTE: pdfDoc is shared via docCache — do not destroy it here,
      // or sibling thumbnails using the same URL would break.
    };

    renderPdf();
    return () => {
      cancelled = true;
    };
  }, [src, scale]);

  if (error || !src) {
    return (
      <div className={`w-full aspect-[16/10] bg-ground-secondary flex items-center justify-center ${className}`}>
        {fallback || (
          <svg className="w-16 h-16 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-[16/10] overflow-hidden bg-ground-secondary ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-ground-secondary flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        className={`absolute inset-0 w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
}

export default PdfThumbnail;
