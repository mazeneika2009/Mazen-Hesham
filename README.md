# Mazen Hesham — Portfolio 2026

> A fast, static, single-page portfolio for a Full-Stack Web Developer. No backend, no database — all content lives in typed mock data and static assets, deployed as a static site on Vercel.

Live demo pattern: hero → work deck → roster → timeline → certificates (PDF rendered in-browser) → contact.

## Tech Stack

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-6.21-CA4245?logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss&logoColor=white)
![CRA](https://img.shields.io/badge/CRA-5.0.1-09D3AC?logo=createreactapp&logoColor=white)
![pdf.js](https://img.shields.io/badge/pdfjs_dist-6.3-FF6C37?logo=adobeacrobatreader&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)

| Layer | Choice | Notes |
|---|---|---|
| UI | React 18 + CRA 5 (`react-scripts`) | `src/index.js`, `src/App.js` |
| Routing | `react-router-dom` 6 | `/`, `/work/:id`, `/certificate/:id` |
| Styling | Tailwind 3 + PostCSS + custom theme | `tailwind.config.js`, Syne/Sora fonts |
| Icons / UX | `react-icons`, `react-toastify` | Toasts, dark theme |
| PDFs | `pdfjs-dist` + `public/pdf.worker.min.mjs` Web Worker | First-page canvas thumbnails |
| Data | Static `src/data/portfolio.js` (no API/DB) | `getReleases()`, `getCertificates()`, etc. |
| Hosting | Vercel static, SPA rewrite | `vercel.json`, `build/` output |

No database. No backend API. No auth. Contact is `mailto:` + external links.

## Core Features

- **Landing composition** (`src/pages/LandingPage.js`): Navigation, PortalHero, StatementFold, Releases, Roster, DatesTable, CertificateSection, ContactSection, Close + scroll reveal.
- **Project deck + detail**: 8 projects with multi-image galleries from `public/projects/project-*/`, detail route `/work/:id` (`ProjectDetail.js`, `ThrowableCardDeck.js`, `VideoPreviewModal.jsx`).
- **Certificates with in-browser PDF preview**: 12 certs (PNG + PDF). PDFs render page-1 to `<canvas>` via `PdfThumbnail.js` + pdf.js worker — no Poppler, no duplicated PNGs.
- **Timeline / roster**: `DatesTable.js`, `Roster.js`, `getTimeline()` merge of projects + certs + experience.
- **Motion + a11y**: `useReveal` / `RevealObserver` (IntersectionObserver), `useScrollProgress`, `usePrefersReducedMotion`, DPR-aware canvas scaling, `docCache` to avoid re-fetching PDFs.
- **Asset audit**: `npm run verify-media` (`scripts/verify-media.js`) fails CI if `portfolio.js` references a missing file or `getDocument` is misused on pdfjs v4+.

## Project Architecture & Directory Structure

```
client/
├── public/
│   ├── index.html
│   ├── MazenHesham.jpg
│   ├── pdf.worker.min.mjs      # pdf.js ESM worker (used)
│   ├── pdf.worker.min.js       # legacy duplicate (safe to delete)
│   ├── certificates/           # 12 files (.png + .pdf)
│   └── projects/
│       └── project-1/ … project-8/
├── src/
│   ├── App.js                  # Routes: / /work/:id /certificate/:id
│   ├── index.js / index.css
│   ├── pages/
│   │   ├── LandingPage.js
│   │   ├── ProjectDetail.js
│   │   └── CertificateDetail.js
│   ├── components/
│   │   ├── Navigation.js / PortalHero.js / StatementFold.js
│   │   ├── Releases.js / ThrowableCardDeck.js / VideoPreviewModal.jsx
│   │   ├── CertificateSection.js / PdfThumbnail.js
│   │   ├── Roster.js / DatesTable.js / ContactSection.js / Close.js
│   ├── data/
│   │   └── portfolio.js        # single source of truth (edit here)
│   ├── hooks/
│   │   ├── useReveal.js / useScrollProgress.js / usePrefersReducedMotion.js
│   └── utils/
│       ├── media.js            # resolveMediaUrl / isPdfUrl / isVideoUrl
│       └── RevealObserver.js
├── scripts/
│   └── verify-media.js
├── tailwind.config.js / postcss.config.js / vercel.json
└── package.json
```

Data flow: `portfolio.js` → page → component → `public/` asset. No fetch to a server.

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+ (`node -v`, `npm -v`)
- Git
- Optional: Vercel CLI for preview deploys

### Local setup

```powershell
# 1. Clone (repo root is the CRA project itself)
git clone https://github.com/mazeneika2009/Mazen-Hesham.git
Set-Location Mazen-Hesham

# 2. Install
npm install

# 3. Audit static references (should print OK)
npm run verify-media

# 4. Start dev server
npm start
# → http://localhost:3000
```

Production build / tests:

```powershell
npm run build   # outputs build/
npm test        # CRA watch mode
```

### Edit content

All content is in `src/data/portfolio.js` — `MOCK_RELEASES`, `MOCK_PROJECT_ROWS`, `MOCK_CERTIFICATES`, `MOCK_SKILLS`, `MOCK_SETTINGS` (email, location, GitHub/LinkedIn/WhatsApp). Add images/PDFs under `public/`, reference as `/projects/...` or `/certificates/...`, then run `npm run verify-media`.

## Environment Variables

None required. This is a fully static site — there is no `PORT`, `DATABASE_URL`, or `API_KEY`.

| Key | Required? | Purpose |
|---|---|---|
| — | No | No backend; contact uses `mailto:mazeneika2009@gmail.com` + external profile links |

If you later add a contact API, create `.env.local` (already git-ignored):

```ini
# example only — not used today
# CONTACT_API_URL=https://...
```

## Roadmap

- [ ] Replace `TODO:` descriptions in `portfolio.js` with real project copy + live/GitHub links.
- [ ] Image optimization: convert `public/projects/**/*.png` screenshots to WebP/AVIF + `loading="lazy"` galleries (repo is ~53MB today).
- [ ] Remove legacy `public/pdf.worker.min.js` (keep `.mjs`), add route-level code-splitting for `ProjectDetail` / `CertificateDetail`.

## License & Author

License: MIT (add a `LICENSE` file if you want this to be explicit — none exists yet).

Author: **Mazen Hesham** — Cairo, Egypt
- GitHub: https://github.com/mazeneika2009
- Email: mazeneika2009@gmail.com
- LinkedIn: https://linkedin.com/in/mazen-hesham-
- WhatsApp: https://wa.me/201094332602
