import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getCertificateById, getCertificates } from '../data/portfolio';
import { isPdfUrl } from '../utils/media';
import { FiArrowLeft, FiArrowRight, FiExternalLink, FiAward, FiFileText } from 'react-icons/fi';
import PdfThumbnail from '../components/PdfThumbnail';

function CertificateDetail() {
  const { id } = useParams();
  const location = useLocation();
  const fromCerts = location.search.includes('from=certificates');
  const fromWork = location.search.includes('from=work');
  const backHref = fromWork ? '/?scroll=work' : fromCerts ? '/?scroll=certificates' : '/';
  const itemHref = (nid) =>
    `/certificate/${nid}${fromWork ? '?from=work' : fromCerts ? '?from=certificates' : ''}`;
  const [cert, setCert] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    getCertificates().then(setList);
    getCertificateById(id).then((c) => {
      if (c) {
        setCert({
          ...c,
          description: c.description || 'No description yet.',
          stack: c.stack || [],
        });
      } else {
        setCert(null);
      }
    });
  }, [id]);

  if (!cert) {
    return (
      <div className="min-h-screen bg-ground flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display font-bold text-4xl tracking-tightest mb-4">Certificate not found</h1>
        <Link to={backHref} className="text-[10.5px] uppercase tracking-labels text-teal hover:opacity-80">
          ← Back to certificates
        </Link>
      </div>
    );
  }

  const idx = list.findIndex((c) => String(c.id) === String(id));
  const prev = idx > 0 ? list[idx - 1] : list[list.length - 1];
  const next = idx < list.length - 1 ? list[idx + 1] : list[0];

  return (
    <section className="min-h-screen bg-ground pt-[58px] overflow-hidden">
      <div className="mx-auto max-w-[1100px] w-full px-4 sm:px-6 py-8 sm:py-10">
        <Link
          to={backHref}
          className="inline-flex items-center gap-2 min-h-[48px] text-[10.5px] uppercase tracking-labels text-muted hover:text-teal transition-colors mb-8 sm:mb-12"
        >
          <FiArrowLeft /> Back to certificates
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <div className="lg:sticky lg:top-28 min-w-0">
            <div className="relative overflow-hidden border border-hairline">
              {isPdfUrl(cert.image) ? (
                <>
                  <PdfThumbnail src={cert.image} label={`${cert.title} preview`} fallback={<FiFileText size={48} className="text-teal" />} />
                  <a
                    href={cert.file || cert.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-[10.5px] uppercase tracking-labels bg-ground/85 backdrop-blur-sm border border-hairline text-ink rounded-full hover:border-teal hover:text-teal transition-colors"
                  >
                    <FiFileText /> Open PDF
                  </a>
                </>
              ) : cert.image ? (
                <img src={cert.image} alt={cert.title} className="w-full aspect-[4/3] object-cover" />
              ) : (
                <div className="w-full aspect-[4/3] bg-ground-secondary flex items-center justify-center">
                  <FiAward size={48} className="text-teal" />
                </div>
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(10,12,14,0.1) 0%, rgba(10,12,14,0.5) 100%)',
                }}
              />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-[10.5px] uppercase tracking-labels text-ink/90">
                <FiAward /> Certification
              </span>
              <span className="absolute top-4 right-4 text-[10.5px] uppercase tracking-labels text-ink/80">
                {cert.year}
              </span>
            </div>
          </div>

          <div className="border border-hairline bg-ground-secondary p-6 sm:p-8 flex flex-col justify-between min-w-0">
            <p className="text-[10.5px] uppercase tracking-labels-wide text-muted mb-4">
              {cert.issuer}
            </p>
            <h1
              className="font-display font-bold tracking-tightest leading-[0.95] mb-8"
              style={{ fontSize: 'clamp(34px, 5vw, 64px)' }}
            >
              {cert.title}
            </h1>

            <p className="text-ink-secondary leading-relaxed mb-10">
              {cert.description || 'No description yet.'}
            </p>

            {cert.credentialLink && cert.credentialLink !== '#' && (
              <a
                href={cert.credentialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] inline-flex items-center gap-2 self-start px-6 py-3 text-[10.5px] uppercase tracking-labels bg-teal text-ground rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Verify credential <FiExternalLink />
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 border-t border-hairline mt-10 pt-6">
          <Link
            to={itemHref(prev.id)}
            className="inline-flex items-center gap-2 min-h-[48px] text-[10.5px] uppercase tracking-labels text-muted hover:text-teal transition-colors"
          >
            <FiArrowLeft /> Prev
          </Link>
          <Link
            to={itemHref(next.id)}
            className="inline-flex items-center gap-2 min-h-[48px] text-[10.5px] uppercase tracking-labels text-muted hover:text-teal transition-colors"
          >
            Next <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CertificateDetail;
