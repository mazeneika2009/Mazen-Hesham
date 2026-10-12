import React, { useRef, useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function StatementFold() {
  const sectionRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [drift, setDrift] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, 1 - rect.top / vh));
      setDrift(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  return (
    <section id="about" ref={sectionRef} className="relative min-h-screen py-24 flex items-center overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 relative z-10 w-full">
        <p className="text-[10.5px] uppercase tracking-labels-wide text-muted mb-8" data-reveal>
          01 — Statement
        </p>
        <div className="flex flex-col min-[480px]:flex-row gap-4 sm:gap-8 min-[480px]:items-start">
          <span className="outlined-numeral font-display font-bold text-[clamp(70px,12vw,160px)] leading-none shrink-0" data-reveal
            style={{ WebkitTextStroke: '1px var(--ink)' }}>
            01
          </span>
          <p className="font-display max-w-[22ch]" data-reveal
            style={{ fontSize: 'clamp(24px, 3.6vw, 52px)', lineHeight: 1.12, letterSpacing: '-0.02em' }}>
            I build <span className="text-amber">fast, secure</span> interfaces and the systems behind them — from pixel to database.
          </p>
        </div>
      </div>

      <div
        className="absolute -right-24 top-1/2 hidden lg:block pointer-events-none"
        style={{
          opacity: 0.3,
          transform: reduced
            ? 'none'
            : `translateY(-50%) translateY(${drift * -120}px) rotate(${drift * 14}deg)`,
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, #E8913C 0%, #2E6B72 60%, transparent 100%)',
        }}
      />
    </section>
  );
}

export default StatementFold;
