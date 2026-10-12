import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTimeline } from '../data/portfolio';
import { FiArrowRight } from 'react-icons/fi';

function formatDateLabel(item) {
  if (item.type === 'certificate') return item.date;
  return item.date;
}

function DatesTable() {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    getTimeline().then(setTimeline);
  }, []);

  return (
    <section id="dates" className="py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8" data-reveal>
          <div>
            <p className="text-[10.5px] uppercase tracking-labels-wide text-muted mb-2">
              04 — Dates & Milestones
            </p>
            <h2 className="font-display font-bold text-[clamp(30px,4vw,56px)] tracking-tightest">
              In <span className="text-amber">order</span>, earliest first.
            </h2>
          </div>
          <span className="text-[10.5px] uppercase tracking-labels-wide text-muted">
            Projects & certificates · chronological
          </span>
        </div>

        <div className="border-t border-hairline">
          <div className="hidden md:grid grid-cols-[7rem_1fr_9rem_9rem_2rem] gap-4 py-3 text-[10.5px] uppercase tracking-labels-wide text-muted">
            <span>Date</span>
            <span>Title</span>
            <span>Type</span>
            <span className="text-right">Ref / Issuer</span>
            <span />
          </div>
          {timeline.map((item, i) => (
            item.link ? (
            <Link
              key={`${item.type}-${item.id}`}
              to={item.link}
              className="group grid grid-cols-2 md:grid-cols-[7rem_1fr_9rem_9rem_2rem] gap-4 py-5 border-t border-hairline items-center hover:bg-ground-secondary transition-colors"
              data-reveal
              style={{ '--reveal-delay': `${i * 50}ms` }}
            >
              <span
                className={`text-[10.5px] uppercase tracking-labels ${
                  item.type === 'certificate' ? 'text-teal' : 'text-amber'
                }`}
              >
                {formatDateLabel(item)}
              </span>
              <h3 className="font-display font-semibold text-[clamp(16px,2.2vw,28px)] tracking-tight col-span-2 md:col-span-1 group-hover:text-amber transition-colors">
                {item.title}
              </h3>
              <span className="text-[10.5px] uppercase tracking-labels text-muted">
                {item.type === 'certificate' ? 'Certificate' : 'Project'}
              </span>
              <span className="text-ink-secondary text-sm md:text-right truncate">
                {item.meta}
              </span>
              <span className="hidden md:flex justify-end text-ink-secondary group-hover:text-amber transition-colors">
                <FiArrowRight />
              </span>
            </Link>
            ) : (
            <div
              key={`${item.type}-${item.id}`}
              className="grid grid-cols-2 md:grid-cols-[7rem_1fr_9rem_9rem_2rem] gap-4 py-5 border-t border-hairline items-center"
              data-reveal
              style={{ '--reveal-delay': `${i * 50}ms` }}
            >
              <span className="text-[10.5px] uppercase tracking-labels text-teal">
                {formatDateLabel(item)}
              </span>
              <h3 className="font-display font-semibold text-[clamp(16px,2.2vw,28px)] tracking-tight col-span-2 md:col-span-1">
                {item.title}
              </h3>
              <span className="text-[10.5px] uppercase tracking-labels text-muted">
                Experience
              </span>
              <span className="text-ink-secondary text-sm md:text-right truncate">
                {item.meta}
              </span>
              <span />
            </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

export default DatesTable;
