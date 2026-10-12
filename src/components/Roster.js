import React, { useEffect, useState } from 'react';
import { ROSTER, getSkills } from '../data/portfolio';

function Roster() {
  const [rows, setRows] = useState(ROSTER);

  useEffect(() => {
    // Admin-managed Skills take precedence; fall back to the static roster.
    getSkills().then((skills) => {
      if (skills && skills.length > 0) {
        setRows(
          skills.map((s) => ({
            name: s.name,
            role: s.category || 'Skill',
            count: String(s.proficiency_level).padStart(2, '0'),
          }))
        );
      }
    });
  }, []);

  return (
    <section id="roster" className="py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <p className="text-[10.5px] uppercase tracking-labels-wide text-muted mb-8" data-reveal>
          03 — Specialities
        </p>
        <div className="border-t border-hairline">
          {rows.map((row, i) => (
            <div
              key={row.name}
              className="grid grid-cols-2 md:grid-cols-[1fr_1fr_auto] gap-4 items-center py-8 border-b border-hairline group"
              data-reveal
              style={{ '--reveal-delay': `${i * 80}ms` }}
            >
              <span className="text-[10.5px] uppercase tracking-labels text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display font-semibold text-[clamp(20px,2.6vw,36px)] tracking-tight group-hover:text-amber transition-colors truncate">
                {row.name}
              </h3>
              <p className="text-sm text-ink-secondary col-span-2 md:col-span-1 md:text-right">
                {row.role}
              </p>
              <span className="hidden md:block text-right font-display text-[clamp(20px,2.6vw,36px)] tracking-tight text-ink-secondary">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Roster;
