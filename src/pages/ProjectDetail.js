import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getReleaseById, getReleases, getCertificateByIdSync, getProjectById, getProjects, projectToCard } from '../data/portfolio';
import { FiArrowLeft, FiArrowRight, FiGithub, FiExternalLink, FiAward, FiPlay } from 'react-icons/fi';
import VideoPreviewModal from '../components/VideoPreviewModal';
import { resolveMediaUrl } from '../utils/media';

function ProjectDetail() {
  const { id } = useParams();
  const location = useLocation();
  const from = location.search.includes('from=work') ? 'work' : null;
  const backHref = from ? '/?scroll=work' : '/';
  const itemHref = (nid) => `/work/${nid}${from ? '?from=work' : ''}`;
  const [release, setRelease] = useState(null);
  const [list, setList] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    setImgIndex(0);
    setVideoOpen(false);
    const isProject = String(id).startsWith('p-');
    if (isProject) {
      const pid = String(id).slice(2);
      getProjects().then((ps) => setList(ps.map(projectToCard)));
      getProjectById(pid).then((p) => {
        if (p) {
          setRelease({
            ...projectToCard(p),
            description: p.description || 'No description yet.',
            stack: p.category ? [p.category] : ['React', 'Tailwind', 'Node.js'],
          });
        }
      });
      return;
    }
    getReleases().then(setList);
    getReleaseById(id).then((r) => {
      if (r) {
        setRelease({
          ...r,
          description: r.description || 'No description yet.',
          stack: r.stack || ['React', 'Tailwind', 'Node.js'],
        });
      }
    });
  }, [id]);

  if (!release) {
    return (
      <div className="min-h-screen bg-ground flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display font-bold text-4xl tracking-tightest mb-4">Project not found</h1>
        <Link to={backHref} className="text-[10.5px] uppercase tracking-labels text-amber hover:opacity-80">
          ← Back to projects
        </Link>
      </div>
    );
  }

  const idx = list.findIndex((r) => String(r.id) === String(id));
  const prev = idx > 0 ? list[idx - 1] : list[list.length - 1];
  const next = idx < list.length - 1 ? list[idx + 1] : list[0];

  const accent = release.accent || release.accentColor || '#E8913C';
  const cover = release.coverColor || '#101317';

  const images =
    release.images && release.images.length
      ? release.images
      : release.image
      ? [release.image]
      : [];
  // Video showcase lives alongside screenshots: video first, then images.
  const videoUrl = release.videoUrl || release.video || '';
  const media = [
    ...(videoUrl ? [{ type: 'video', src: videoUrl }] : []),
    ...images.map((src) => ({ type: 'image', src })),
  ];
  const imgCount = media.length;
  const imgIndexClamped = imgCount ? imgIndex % imgCount : 0;
  const current = imgCount ? media[imgIndexClamped] : null;
  const currentImage = current && current.type === 'image' ? current.src : null;
  const currentIsVideo = !!current && current.type === 'video';

  return (
    <section className="min-h-screen bg-ground pt-[58px] overflow-hidden">
      <div className="mx-auto max-w-[1100px] w-full px-4 sm:px-6 py-8 sm:py-10">
        <Link
          to={backHref}
          className="inline-flex items-center gap-2 min-h-[48px] text-[10.5px] uppercase tracking-labels text-muted hover:text-amber transition-colors mb-8 sm:mb-12"
        >
          <FiArrowLeft /> Back to projects
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Cover */}
          <div className="lg:sticky lg:top-28 min-w-0">
            <div
              className="relative overflow-hidden flex flex-col justify-between p-6 sm:p-8"
              style={{
                aspectRatio: '1 / 1',
                background: `linear-gradient(145deg, ${accent}, ${cover})`,
                boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
                border: '1px solid var(--hairline)',
                borderRadius: '6px 14px 10px 18px',
              }}
            >
              {currentIsVideo ? (
                <>
                  {/* Inline autoplay showcase: muted + looping so it never blocks the page. */}
                  <video
                    key={`video-${imgIndexClamped}`}
                    src={resolveMediaUrl(current.src)}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ zIndex: 0 }}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      zIndex: 1,
                      background: `linear-gradient(160deg, ${cover}00 35%, ${cover}e6 100%)`,
                      pointerEvents: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setVideoOpen(true)}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ zIndex: 3 }}
                    aria-label="Play video tour with sound"
                  >
                    <span className="w-14 h-14 rounded-full flex items-center justify-center bg-black/45 text-white hover:bg-amber hover:text-ground transition-colors"
                      style={{ border: '1px solid rgba(255,255,255,0.35)' }}
                    >
                      <FiPlay size={20} />
                    </span>
                  </button>
                </>
              ) : (
                currentImage && (
                  <>
                    <img
                      src={currentImage}
                      alt={release.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ zIndex: 0, transition: 'opacity 0.4s ease' }}
                      key={imgIndexClamped}
                      draggable={false}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        zIndex: 1,
                        background: `linear-gradient(160deg, ${cover}00 35%, ${cover}e6 100%)`,
                      }}
                    />
                  </>
                )
              )}
              {videoUrl && !currentIsVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setImgIndex(0);
                    setVideoOpen(true);
                  }}
                  className="absolute top-3 left-1/2 -translate-x-1/2 min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/55 text-white text-[10px] uppercase tracking-labels hover:bg-amber hover:text-ground transition-colors"
                  style={{ zIndex: 4, border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  <FiPlay size={11} /> Video Tour
                </button>
              )}
              {currentIsVideo && (
                <span
                  className="absolute top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber text-ground text-[10px] uppercase tracking-labels font-semibold"
                  style={{ zIndex: 4 }}
                >
                  <FiPlay size={11} /> Video Tour
                </span>
              )}
              {imgCount > 1 && (
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
                  <button
                    type="button"
                    onClick={() => setImgIndex((i) => (i - 1 + imgCount) % imgCount)}
                    aria-label="Previous media"
                    className="pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-white/85 bg-black/35 hover:bg-black/60 hover:text-white transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                  >
                    <FiArrowLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgIndex((i) => (i + 1) % imgCount)}
                    aria-label="Next media"
                    className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-white/85 bg-black/35 hover:bg-black/60 hover:text-white transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                  >
                    <FiArrowRight />
                  </button>
                  <span
                    className="absolute bottom-3 right-3 text-[10.5px] uppercase tracking-labels text-white/75 bg-black/30 px-2 py-1 rounded"
                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    {imgIndexClamped + 1} / {imgCount}
                  </span>
                </div>
              )}
              <div className="relative flex justify-between items-start" style={{ zIndex: 2 }}>
                <span className="text-[10.5px] uppercase tracking-labels text-white/90">{release.code}</span>
                <span className="text-[10.5px] uppercase tracking-labels text-white/90">{release.format}</span>
              </div>
              <div className="relative" style={{ zIndex: 2 }}>
                <h1
                  className="font-display font-bold text-white leading-tight"
                  style={{ fontSize: 'clamp(30px, 5vw, 56px)' }}
                >
                  {release.title}
                </h1>
                <p className="text-[10.5px] uppercase tracking-labels text-white/80 mt-3">{release.artist}</p>
              </div>
              <div className="relative text-[10.5px] uppercase tracking-labels text-white/70 text-right" style={{ zIndex: 2 }}>
                {release.date}
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-[10.5px] uppercase tracking-labels-wide text-muted mb-4">Project</p>
            <h2
              className="font-display font-bold tracking-tightest leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(30px, 4.5vw, 52px)' }}
            >
              {release.title}
            </h2>
            <p className="text-ink-secondary leading-relaxed mb-8">
              {release.description || 'No description yet.'}
            </p>

            <div className="grid grid-cols-3 gap-4 border-t border-hairline pt-6 mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-labels text-muted mb-1">Reference</p>
                <p className="font-display font-semibold">{release.code}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-labels text-muted mb-1">Year</p>
                <p className="font-display font-semibold">{release.year || release.date}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-labels text-muted mb-1">Type</p>
                <p className="font-display font-semibold">{release.format}</p>
              </div>
            </div>

            {release.completed && (
              <p className="text-[10px] uppercase tracking-labels text-muted mb-1">Completed</p>
            )}
            {release.completed && (
              <p className="font-display font-semibold mb-6">{release.completed}</p>
            )}

            {release.certificateId && getCertificateByIdSync(release.certificateId) && (
              <Link
                to={`/certificate/${release.certificateId}?from=work`}
                className="min-h-[48px] inline-flex items-center gap-2 px-5 py-3 text-[10.5px] uppercase tracking-labels border border-amber/50 text-amber rounded-full hover:bg-amber hover:text-ground transition-colors mb-6"
              >
                <FiAward /> View Certificate · {getCertificateByIdSync(release.certificateId).title}
              </Link>
            )}

            <p className="text-[10px] uppercase tracking-labels text-muted mb-3">Stack</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {(release.stack && release.stack.length ? release.stack : ['React', 'Tailwind', 'Node.js']).map(
                (tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-[10.5px] uppercase tracking-labels border border-hairline rounded-full"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>

            {/* Video Tour — fixed 16:9 box prevents layout shift on mobile. */}
            {videoUrl && (
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-labels text-muted mb-3">Video Tour</p>
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="group relative block w-full overflow-hidden rounded border border-hairline bg-black aspect-video text-left"
                  aria-label="Open video tour"
                >
                  <video
                    src={resolveMediaUrl(videoUrl)}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                    <span className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ground rounded-full font-semibold text-[10.5px] uppercase tracking-labels">
                      <FiPlay size={13} /> Watch tour
                    </span>
                  </span>
                </button>
              </div>
            )}

            {(release.githubUrl || release.liveUrl) && (
              <div className="flex flex-wrap gap-3 mb-8">
                {release.githubUrl && (
                  <a
                    href={release.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] inline-flex items-center gap-2 px-5 py-3 text-[10.5px] uppercase tracking-labels border border-hairline text-ink rounded-full hover:border-amber hover:text-amber transition-colors"
                  >
                    <FiGithub /> Source
                  </a>
                )}
                {release.liveUrl && (
                  <a
                    href={release.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] inline-flex items-center gap-2 px-5 py-3 text-[10.5px] uppercase tracking-labels bg-amber text-ground rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    <FiExternalLink /> Live
                  </a>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center gap-3 border-t border-hairline pt-6">
              <Link
                to={itemHref(prev.id)}
                className="inline-flex items-center gap-2 min-h-[48px] text-[10.5px] uppercase tracking-labels text-muted hover:text-amber transition-colors"
              >
                <FiArrowLeft /> {prev.code}
              </Link>
              <Link
                to={itemHref(next.id)}
                className="inline-flex items-center gap-2 min-h-[48px] text-[10.5px] uppercase tracking-labels text-muted hover:text-amber transition-colors"
              >
                {next.code} <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {videoOpen && videoUrl && (
        <VideoPreviewModal src={videoUrl} title={release.title} onClose={() => setVideoOpen(false)} />
      )}
    </section>
  );
}

export default ProjectDetail;
