/**
 * verify-media.js — lightweight static-asset audit (no native deps).
 *
 * Why this instead of PDF-to-image conversion (pdf-poppler / pdf2image)?
 * - Conversion duplicates every certificate (PDF + PNG/WebP), doubles repo
 *   size, and needs Poppler/Ghostscript binaries that break on Windows and
 *   on Vercel static hosting.
 * - The portfolio already renders PDFs client-side via <PdfThumbnail>
 *   (pdfjs-dist canvas, first page only), which is lighter and always in sync.
 *
 * So this script just guarantees `src/data/portfolio.js` never drifts from
 * what's actually in `public/certificates` and `public/projects`:
 *
 *   node scripts/verify-media.js
 *
 * Exit code 0 = all referenced files exist. Exit code 1 = missing files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const DATA_FILE = path.join(ROOT, 'src', 'data', 'portfolio.js');

let failures = 0;

function collectRefs(src, prefix) {
  const re = new RegExp(prefix.replace('/', '\\/') + '[^\\s\'"\\]]+', 'g');
  return [...src.matchAll(re)].map((m) => m[0].replace(/["',\]]+$/, '').split('?')[0]);
}

function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`Missing data file: ${DATA_FILE}`);
    process.exit(1);
  }
  const src = fs.readFileSync(DATA_FILE, 'utf8');

  // 1. Every referenced certificate / project file must exist on disk.
  for (const prefix of ['/certificates/', '/projects/']) {
    const refs = [...new Set(collectRefs(src, prefix))];
    console.log(`${prefix} referenced: ${refs.length}`);
    for (const ref of refs) {
      const disk = path.join(PUB, ref);
      if (!fs.existsSync(disk)) {
        console.error(`  MISSING: ${ref}`);
        failures++;
      }
    }
  }

  // 2. Report files on disk that portfolio.js doesn't reference (informational).
  const certDir = path.join(PUB, 'certificates');
  if (fs.existsSync(certDir)) {
    const onDisk = fs.readdirSync(certDir);
    const unref = onDisk.filter((f) => !src.includes(f));
    console.log(`certificates on disk: ${onDisk.length} (${onDisk.filter((f) => f.toLowerCase().endsWith('.pdf')).length} PDF, ${onDisk.filter((f) => !f.toLowerCase().endsWith('.pdf')).length} image)`);
    if (unref.length) console.log(`  unreferenced (not in portfolio.js): ${unref.join(', ')}`);
  }

  const projDir = path.join(PUB, 'projects');
  if (fs.existsSync(projDir)) {
    let total = 0;
    for (const d of fs.readdirSync(projDir, { withFileTypes: true }).filter((e) => e.isDirectory())) {
      const files = fs.readdirSync(path.join(projDir, d.name));
      total += files.length;
      console.log(`  ${d.name}: ${files.length} files`);
    }
    console.log(`projects on disk: ${total} images`);
  }

  // 3. Sanity: pdfjs-dist + worker + PdfThumbnail wiring must exist.
  const checks = [
    'node_modules/pdfjs-dist/package.json',
    'public/pdf.worker.min.mjs',
    'src/components/PdfThumbnail.js',
    'src/utils/media.js',
  ];
  // Fail loudly on the old v4+ footgun: getDocument(string) throws
  // "expected either `data`, `range`, or `url` parameter" — must be { url }.
  const thumb = fs.readFileSync(path.join(ROOT, 'src', 'components', 'PdfThumbnail.js'), 'utf8');
  if (/getDocument\(\s*(src|url|["'`/])/.test(thumb) && !thumb.includes('getDocument({')) {
    console.error('  BAD PdfThumbnail: getDocument must be called as getDocument({ url: src }) on pdfjs-dist v4+');
    failures++;
  }
  for (const rel of checks) {
    if (!fs.existsSync(path.join(ROOT, rel))) {
      console.error(`  MISSING wiring: ${rel}`);
      failures++;
    }
  }
  if (!src.includes('fileType')) console.warn('  warning: no `fileType` field found in portfolio.js certificates');

  if (failures) {
    console.error(`\nFAIL: ${failures} missing file(s). Fix paths in src/data/portfolio.js.`);
    process.exit(1);
  }
  console.log('\nOK: all portfolio.js media paths resolve to files on disk.');
}

main();
