import React, { useRef, useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const HERO_BG = '/MazenHesham.jpg';

function PortalHero() {
  const sectionRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const measure = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress 0..1 across the first 1.5 viewport heights of the sticky stage
      const top = rect.top;
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 1.5)));
      setProgress(p);
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [reduced]);

  const eased = reduced ? 1 : progress;
  // measured travel: panels move well over 100px
  const panelTravel = 130 + eased * 220; // px each direction
  const titleScale = 1 + eased * 0.16;
  const tracking = (1 - eased) * 0.12; // em tightening, scales down
  const spanShift = eased * 0.5; // half of each span's width
  const imageScale = 1.28 - eased * 0.28;
  const duotoneOpacity = eased * 0.35;
  const veilOpacity = 0.5 + eased * 0.3;

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative"
      style={{ height: '250vh' }}
    >
      <div
        className="sticky top-0"
        style={{ height: '100vh', overflow: 'hidden', isolation: 'isolate' }}
      >
        {/* Image layer */}
        <div
          className="absolute inset-0"
          style={{ transform: `scale(${reduced ? 1 : imageScale})`, zIndex: 1 }}
        >
          <img
            src={HERO_BG}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Duotone wash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            mixBlendMode: 'overlay',
            opacity: reduced ? 0.35 : duotoneOpacity,
            background: `linear-gradient(135deg, rgba(232,145,60,0.7) 0%, rgba(46,107,114,0.7) 100%)`,
          }}
        />

        {/* Radial veil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            opacity: reduced ? 0.5 : veilOpacity,
            background:
              'radial-gradient(120% 120% at 50% 50%, transparent 40%, rgba(10,12,14,0.9) 100%)',
          }}
        />

        {/* Accent dots */}
        <div
          className="absolute pointer-events-none"
          style={{
            zIndex: 5,
            top: '50%',
            left: '50%',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: 'rgba(232,145,60,0.9)',
            boxShadow: '0 0 18px 6px rgba(232,145,60,0.5)',
            transform: reduced
              ? 'translate(-50%,-50%)'
              : `translate(calc(-50% + ${-eased * 40}vw), calc(-50% + ${-eased * 30}vh))`,
            transition: 'transform 0.1s linear',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            zIndex: 5,
            top: '50%',
            left: '50%',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'rgba(46,107,114,0.9)',
            boxShadow: '0 0 18px 6px rgba(46,107,114,0.5)',
            transform: reduced
              ? 'translate(-50%,-50%)'
              : `translate(calc(-50% + ${eased * 40}vw), calc(-50% + ${eased * 30}vh))`,
            transition: 'transform 0.1s linear',
          }}
        />

        {/* Left panel */}
        <div
          className="absolute top-0 bottom-0 left-0"
          style={{
            zIndex: 6,
            width: '53%',
            background: 'var(--ground)',
            transform: reduced
              ? 'none'
              : `translateX(-${panelTravel}px)`,
            transition: 'transform 0.12s linear',
          }}
        />
        {/* Right panel */}
        <div
          className="absolute top-0 bottom-0 right-0"
          style={{
            zIndex: 6,
            width: '53%',
            background: 'var(--ground)',
            transform: reduced
              ? 'none'
              : `translateX(${panelTravel}px)`,
            transition: 'transform 0.12s linear',
          }}
        />

        {/* Wordmark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            zIndex: 7,
            transform: `scale(${reduced ? 1 : titleScale})`,
            letterSpacing: reduced ? '-0.03em' : `${-0.03 + tracking}em`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s linear, letter-spacing 0.1s linear',
          }}
        >
          <h1 className="font-display font-extrabold text-ink text-center leading-[0.95] select-none whitespace-normal min-[480px]:whitespace-nowrap text-[clamp(44px,13vw,150px)] px-4">
            <span
              style={{
                display: 'inline-block',
                transform: reduced ? 'none' : `translateX(-${eased * spanShift * 100}px)`,
                transition: 'transform 0.1s linear',
              }}
            >
              MAZEN
            </span>{' '}
            <span
              className="text-amber"
              style={{
                display: 'inline-block',
                transform: reduced ? 'none' : `translateX(${eased * spanShift * 100}px)`,
                transition: 'transform 0.1s linear',
              }}
            >
              HESHAM
            </span>
          </h1>
        </div>

        {/* Corner metadata — trimmed on tiny screens to avoid overlap */}
        <div
          className="absolute top-0 left-0 z-10 p-4 sm:p-6 text-[10.5px] uppercase tracking-labels-wide text-ink/60"
        >
          FULL STACK
          <br />
          WEB DEVELOPER
        </div>
        <div className="absolute top-0 right-0 z-10 p-4 sm:p-6 text-[10.5px] uppercase tracking-labels-wide text-ink/60 hidden min-[420px]:block">
          NMH — 2026
        </div>
        <div className="absolute bottom-6 left-4 sm:left-6 z-10 text-[10.5px] uppercase tracking-labels-wide text-ink/60 hidden min-[420px]:block">
          Scroll to open
        </div>
        <div className="absolute bottom-6 right-4 sm:right-6 z-10 text-[10.5px] uppercase tracking-labels-wide text-amber">
          React · Node · MySQL
        </div>
      </div>
    </section>
  );
}

export default PortalHero;
