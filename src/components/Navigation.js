import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../data/portfolio';

function Navigation() {
  const [open, setOpen] = useState(false);

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open ]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        background: 'rgba(10, 12, 14, 0.72)',
        minHeight: '58px',
        borderBottom: '1px solid var(--hairline)',
      }}
    >
      <div className="mx-auto max-w-[1400px] w-full min-h-[58px] px-4 sm:px-6 flex items-center justify-between gap-3">
        <a
          href="#top"
          className="font-display font-700 text-[15px] tracking-tightest text-ink min-h-[48px] inline-flex items-center"
          onClick={() => setOpen(false)}
        >
          MH<span className="text-amber">.</span>
        </a>
        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[10.5px] uppercase tracking-labels-wide text-ink-secondary hover:text-amber transition-colors duration-300 min-h-[48px] inline-flex items-center"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#contact"
            className="px-5 min-h-[48px] inline-flex items-center text-[10.5px] uppercase tracking-labels border border-hairline text-ink hover:border-amber hover:text-amber transition-colors duration-300 rounded-full"
          >
            Hire Me
          </a>
          {/* Hamburger — mobile only, 48×48 touch target */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden w-12 h-12 min-w-[48px] min-h-[48px] inline-flex flex-col items-center justify-center gap-1.5 rounded-full border border-hairline text-ink hover:border-amber hover:text-amber transition-colors"
          >
            <span
              aria-hidden="true"
              className={`block w-5 h-0.5 bg-current transition-transform duration-300 ${open ? 'translate-y-[4px] rotate-45' : ''}`}
            />
            <span
              aria-hidden="true"
              className={`block w-5 h-0.5 bg-current transition-transform duration-300 ${open ? '-translate-y-[4px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`md:hidden overflow-hidden border-hairline transition-[max-height,opacity] duration-300 ease-out ${
          open ? 'max-h-[420px] opacity-100 border-t' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 sm:px-6 py-2 flex flex-col" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="min-h-[48px] inline-flex items-center text-sm uppercase tracking-labels-wide text-ink-secondary hover:text-amber active:text-amber transition-colors border-b border-hairline last:border-b-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
