import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThrowableCardDeck from './ThrowableCardDeck';
import { getReleases, getProjects, projectToCard } from '../data/portfolio';

function Releases() {
  const [releases, setReleases] = useState([]);
  const [progressIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Admin-managed Projects take precedence; fall back to legacy releases.
    getProjects().then((projects) => {
      if (projects && projects.length > 0) {
        setReleases(projects.map(projectToCard));
      } else {
        getReleases().then(setReleases);
      }
    });
  }, []);

  const openProject = (card) => {
    navigate(`/work/${card.id}?from=work`);
  };

  return (
    <section id="work" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left column */}
        <div className="lg:sticky lg:top-28">
          <p className="text-[10.5px] uppercase tracking-labels-wide text-muted mb-6" data-reveal>
            02 — Selected Work
          </p>
          <h2 className="font-display font-bold text-[clamp(34px,4.5vw,64px)] leading-[0.95] tracking-tightest mb-6" data-reveal>
            Full-stack
            <br />
            web projects
            <br />
            <span className="text-amber">shipped</span>.
          </h2>
          <p className="text-ink-secondary max-w-md mb-8" data-reveal>
            Web developer builds from front end to database. Each card shows its completion
            date and the certificate that backs it — drag the top card hard enough and it flies
            off the edge, the deck re-stacks underneath. Use a mouse or the arrow keys.
          </p>
          <div className="flex flex-col min-[420px]:flex-row flex-wrap gap-3 sm:gap-4" data-reveal>
            <a
              href="#contact"
              className="min-h-[48px] inline-flex items-center justify-center px-6 py-3 text-[10.5px] uppercase tracking-labels bg-amber text-ground rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Start a project
            </a>
            <a
              href="#dates"
              className="min-h-[48px] inline-flex items-center justify-center px-6 py-3 text-[10.5px] uppercase tracking-labels border border-hairline text-ink rounded-full hover:border-amber hover:text-amber transition-colors"
            >
              View the timeline
            </a>
          </div>
        </div>

        {/* Right column — deck */}
        <div>
          <div className="max-w-[520px] mx-auto">
            <ThrowableCardDeck cards={releases} onOpen={openProject} />
            <p className="mt-4 text-[10.5px] uppercase tracking-labels-wide text-muted text-center">
              Click to open · drag to throw · or press ← →
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: releases.length }).map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: i === progressIndex % (releases.length || 1) ? 'var(--amber)' : 'rgba(237,231,220,0.2)',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Releases;
