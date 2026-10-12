import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCertificates } from '../data/portfolio';
import { isPdfUrl } from '../utils/media';
import { FiExternalLink, FiArrowRight, FiChevronLeft, FiChevronRight, FiAward, FiFileText } from 'react-icons/fi';
import PdfThumbnail from './PdfThumbnail';

function CertificateCard({ cert, index }) {
  const isPdf = isPdfUrl(cert.image);

  return (
    <Link
      to={`/certificate/${cert.id}?from=certificates`}
      className="group relative border border-hairline bg-ground-secondary overflow-hidden flex flex-col hover:border-teal/60 transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]"
      data-reveal
      style={{ '--reveal-delay': `${(index % 4) * 80}ms` }}
    >
      <div className="relative overflow-hidden aspect-[16/10]">
        {isPdf ? (
          <PdfThumbnail src={cert.image} label={`${cert.title} preview`} fallback={<FiFileText size={32} className="text-teal" />} />
        ) : (
          <img
            src={cert.image}
            alt={cert.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ground/90 via-ground/20 to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-teal/10" />

        <span className="absolute top-4 right-4 px-3 py-1.5 text-[10px] uppercase tracking-labels font-medium bg-ground/80 backdrop-blur-sm border border-hairline text-ink/80 rounded-full">
          {cert.year}
        </span>

        {isPdf && (
          <span className="absolute top-4 left-4 px-3 py-1.5 text-[10px] uppercase tracking-labels font-medium bg-teal/20 backdrop-blur-sm border border-teal/30 text-teal rounded-full flex items-center gap-1">
            <FiFileText size={10} /> PDF
          </span>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-labels text-ink group-hover:text-teal transition-colors font-medium">
            View Details <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
          </span>
          {cert.credentialLink && cert.credentialLink !== '#' && (
            <a
              href={cert.credentialLink}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-ground/80 backdrop-blur-sm border border-hairline text-muted hover:text-teal hover:border-teal/50 transition-all"
              aria-label="Verify credential"
            >
              <FiExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-labels-wide text-amber font-medium mb-3">
            <FiAward size={10} /> {cert.issuer}
          </span>
          <h3 className="font-display font-semibold text-[clamp(18px,2.2vw,26px)] tracking-tight leading-tight group-hover:text-teal transition-colors line-clamp-2">
            {cert.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function CertificateSection() {
  const [certs, setCerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    getCertificates().then(setCerts);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = useMemo(() => Math.ceil(certs.length / itemsPerPage), [certs.length, itemsPerPage]);
  const currentPageClamped = Math.min(currentPage, totalPages - 1);
  const visibleCerts = useMemo(
    () => certs.slice(currentPageClamped * itemsPerPage, (currentPageClamped + 1) * itemsPerPage),
    [certs, currentPageClamped, itemsPerPage]
  );

  const goPrev = useCallback(() => setCurrentPage(p => Math.max(0, p - 1)), []);
  const goNext = useCallback(() => setCurrentPage(p => Math.min(totalPages - 1, p + 1)), [totalPages]);
  const goToPage = useCallback((page) => setCurrentPage(Math.max(0, Math.min(totalPages - 1, page))), [totalPages]);

  if (certs.length === 0) {
    return (
      <section id="certificates" className="py-24">
        <div className="mx-auto max-w-[1400px] px-6 text-center">
          <p className="text-muted">No certificates found.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6" data-reveal>
          <div>
            <p className="text-[10.5px] uppercase tracking-labels-wide text-muted mb-2">04 — Certificates</p>
            <h2 className="font-display font-bold text-[clamp(30px,4vw,56px)] tracking-tightest">
              Certification <span className="text-teal">Record</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted">
            <span className="font-mono text-teal">{String(currentPageClamped + 1).padStart(2, '0')}</span>
            <span className="text-hairline">/</span>
            <span className="font-mono">{String(totalPages).padStart(2, '0')}</span>
            <span className="text-hairline hidden sm:inline">certificates</span>
          </div>
        </div>

        <div className="relative">
          <div
            className="grid gap-6 transition-opacity duration-300"
            style={{
              gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`,
              opacity: 1
            }}
            role="list"
            aria-label="Certificates"
          >
            {visibleCerts.map((cert, i) => (
              <CertificateCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>

          {totalPages > 1 && (
            <>
              <button
                onClick={goPrev}
                disabled={currentPageClamped === 0}
                className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-6 z-10 w-12 h-12 min-w-[48px] min-h-[48px] inline-flex items-center justify-center rounded-full bg-ground/90 backdrop-blur-sm border border-hairline text-ink hover:bg-teal hover:text-ground hover:border-teal disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg"
                aria-label="Previous page"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={goNext}
                disabled={currentPageClamped >= totalPages - 1}
                className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-6 z-10 w-12 h-12 min-w-[48px] min-h-[48px] inline-flex items-center justify-center rounded-full bg-ground/90 backdrop-blur-sm border border-hairline text-ink hover:bg-teal hover:text-ground hover:border-teal disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg"
                aria-label="Next page"
              >
                <FiChevronRight size={20} />
              </button>

              <div className="flex justify-center gap-1 mt-10" role="tablist" aria-label="Page navigation">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className="w-11 h-11 min-w-[48px] min-h-[48px] inline-flex items-center justify-center"
                    role="tab"
                    aria-selected={i === currentPageClamped}
                    aria-label={`Go to page ${i + 1}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`block h-2.5 rounded-full transition-all ${
                        i === currentPageClamped
                          ? 'bg-teal w-8'
                          : 'bg-hairline hover:bg-muted w-2.5'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CertificateSection;