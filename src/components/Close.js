import React from 'react';

function Close() {
  return (
    <section className="relative mt-16 sm:mt-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end pt-12 sm:pt-16 border-t border-hairline">
          <div>
            <h2 className="font-display font-bold text-[clamp(32px,5vw,72px)] tracking-tightest leading-[0.95]" data-reveal>
              Full stack.
              <br />
              End to <span className="text-teal">end</span>.
            </h2>
            <p className="mt-6 text-sm text-muted max-w-sm" data-reveal>
              React &amp; Tailwind on the front, Node.js and MySQL on the back, encrypted end to end.
            </p>
          </div>
          <div className="flex flex-col min-[420px]:flex-row flex-wrap gap-3 sm:gap-4 justify-start lg:justify-end" data-reveal>
            <a href="#top" className="min-h-[48px] inline-flex items-center justify-center px-6 py-3 text-[10.5px] uppercase tracking-labels bg-amber text-ground rounded-full font-semibold hover:opacity-90 transition-opacity">
              Back to top
            </a>
            <a href="#contact" className="min-h-[48px] inline-flex items-center justify-center px-6 py-3 text-[10.5px] uppercase tracking-labels border border-hairline text-ink rounded-full hover:border-teal hover:text-teal transition-colors">
              Get in touch
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-hairline mt-20 py-6">
        <p className="text-center text-[10.5px] uppercase tracking-labels-wide text-muted">
          © 2026 Mazen Hesham — Full Stack Web Developer
        </p>
      </div>

      <h2
        className="font-display font-extrabold whitespace-nowrap overflow-hidden w-full"
        style={{
          fontSize: 'clamp(120px, 24vw, 400px)',
          transform: 'translateY(0.14em)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(237,231,220,0.16)',
          userSelect: 'none',
        }}
        data-reveal
      >
        HESHAM.
      </h2>
    </section>
  );
}

export default Close;
