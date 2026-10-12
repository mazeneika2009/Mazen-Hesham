import React, { useRef, useState, useCallback, useEffect } from 'react';
import { FiGithub, FiExternalLink, FiAward, FiPlay } from 'react-icons/fi';
import { resolveMediaUrl } from '../utils/media';

const THROW_THRESHOLD_FACTOR = 0.1;
const ROTATE_MS = 3000;

function CardFace({ card, isTop }) {
  const images =
    card.images && card.images.length
      ? card.images
      : card.image
      ? [card.image]
      : [];
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    setImgIndex(0);
    if (!isTop || images.length < 2) return;
    const t = setInterval(() => setImgIndex((i) => (i + 1) % images.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [isTop, card.id, images.length]);

  const currentImage = images.length ? images[imgIndex % images.length] : null;
  const hasLinks = !!(card.githubUrl || card.liveUrl);
  const hasVideo = !!(card.videoUrl || card.video);

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col justify-between p-6"
      style={{
        background: `radial-gradient(120% 90% at 20% 10%, ${card.accent} 0%, ${card.coverColor} 70%)`,
        boxShadow: isTop
          ? '0 20px 50px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.3)'
          : '0 10px 30px rgba(0,0,0,0.45)',
        border: '1px solid rgba(237,231,220,0.25)',
        borderRadius: '6px 14px 10px 18px',
        transform: 'rotate(-0.5deg)',
      }}
    >
      {hasVideo && !currentImage ? (
        <>
          {/* Video-first card: muted looping backdrop with play affordance. */}
          <video
            src={resolveMediaUrl(card.videoUrl || card.video)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
            autoPlay={isTop}
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div
            className="absolute inset-0"
            style={{
              zIndex: 1,
              background: `linear-gradient(160deg, ${card.coverColor}00 30%, ${card.coverColor}d9 75%, ${card.coverColor} 100%)`,
            }}
          />
        </>
      ) : (
        currentImage && (
          <>
            <img
              src={currentImage}
              alt={card.title}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
              key={imgIndex}
            />
            <div
              className="absolute inset-0"
              style={{
                zIndex: 1,
                background: `linear-gradient(160deg, ${card.coverColor}00 30%, ${card.coverColor}d9 75%, ${card.coverColor} 100%)`,
              }}
            />
          </>
        )
      )}
      {hasVideo && (
        <span
          className="absolute inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] uppercase tracking-labels text-ground font-semibold"
          style={{ top: '52px', right: '14px', zIndex: 3, background: card.accent, border: '1px solid rgba(255,255,255,0.3)' }}
        >
          <FiPlay size={10} /> Video Tour
        </span>
      )}

      <div
        className="absolute rounded-full"
        style={{
          width: '46%',
          aspectRatio: '1 / 1',
          top: '18%',
          left: '-8%',
          background: `radial-gradient(circle, ${card.accent}55, transparent 70%)`,
          filter: 'blur(2px)',
          zIndex: 2,
        }}
      />
      <div
        className="absolute"
        style={{
          width: '140%',
          height: '2px',
          top: '58%',
          left: '-20%',
          background: `repeating-linear-gradient(90deg, ${card.accent}bb 0 26px, transparent 26px 40px)`,
          transform: 'rotate(-2deg)',
          opacity: 0.6,
          zIndex: 2,
        }}
      />

      {hasLinks && (
        <div
          className="absolute flex gap-2"
          style={{ top: '14px', right: '14px', zIndex: 3 }}
          onPointerDown={stop}
          onPointerUp={stop}
          onClick={stop}
        >
          {card.githubUrl && (
            <a
              href={card.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source code"
              title="Source"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-white/85 bg-black/30 hover:bg-black/55 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <FiGithub size={14} />
            </a>
          )}
          {card.liveUrl && (
            <a
              href={card.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View live project"
              title="Live"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-ground font-bold hover:opacity-90 transition-opacity"
              style={{ background: card.accent, border: '2px solid rgba(255,255,255,0.3)' }}
            >
              <FiExternalLink size={13} />
            </a>
          )}
        </div>
      )}

      <div
        className="relative text-[10.5px] uppercase tracking-labels text-white/60 pl-1"
        style={{ fontFamily: 'Syne', letterSpacing: '0.08em', zIndex: 3 }}
      >
        {card.artist}
      </div>

      <div className="relative pl-1" style={{ zIndex: 3 }}>
        <h3
          className="font-display font-extrabold text-white leading-[0.95]"
          style={{ fontSize: 'clamp(20px, 3vw, 34px)', letterSpacing: '-0.02em' }}
        >
          {card.title}
        </h3>
        <div
          className="mt-3 w-16 h-3"
          style={{
            background: card.accent,
            borderRadius: '3px 6px 4px 8px',
            transform: 'rotate(-2deg)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      <div className="relative flex justify-between items-end pl-1" style={{ zIndex: 3 }}>
        <span style={{ fontFamily: '"Caveat", "Segoe Script", cursive', fontSize: '20px', color: 'rgba(255,255,255,0.75)', transform: 'rotate(-3deg)' }}>
          {card.date} {String(card.count).padStart(4, '0')}
        </span>
        <span
          className="rounded-full flex items-center justify-center text-ground font-bold"
          style={{
            fontFamily: 'Syne',
            width: '30px',
            height: '30px',
            fontSize: '12px',
            background: card.accent,
            border: '2px solid rgba(255,255,255,0.3)',
            transform: 'rotate(8deg)',
          }}
        >
          {String(card.code).replace(/^PRJ-/, '') || card.code}
        </span>
      </div>

      <div className="relative flex items-center justify-between mt-2 pl-1" style={{ zIndex: 3 }}>
        {card.completed && (
          <span className="text-[9.5px] uppercase tracking-labels text-white/70">
            {card.completed}
          </span>
        )}
        {card.certificateId && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] uppercase tracking-labels text-ground font-semibold"
            style={{ background: card.accent, border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <FiAward size={11} /> Certified
          </span>
        )}
      </div>
    </div>
  );
}

function ThrowableCardDeck({ cards, onOpen }) {
  const deckRef = useRef(null);
  const [topIndex, setTopIndex] = useState(0);
  const dragging = useRef(false);
  const dragData = useRef({ startX: 0, startY: 0, dx: 0, dy: 0 });
  const topCardRef = useRef(cards[0]);
  const [cardTransform, setCardTransform] = useState({ x: 0, y: 0, rot: 0, scale: 1, opacity: 1 });

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragData.current.startX;
    const dy = e.clientY - dragData.current.startY;
    dragData.current.dx = dx;
    dragData.current.dy = dy;
    const rot = Math.max(-30, Math.min(30, dx * 0.06));
    setCardTransform({ x: dx, y: dy, rot, scale: 1.03, opacity: 1 });
  }, []);

  const onRelease = useCallback(() => {
    window.removeEventListener('pointermove', handleMoveRef.current);
    window.removeEventListener('pointerup', handleUpRef.current);
    if (!dragging.current) return;
    dragging.current = false;

    const deckWidth = deckRef.current ? deckRef.current.offsetWidth : 400;
    const threshold = deckWidth * THROW_THRESHOLD_FACTOR;
    const { dx, dy } = dragData.current;

    if (Math.abs(dx) > threshold) {
      const dir = dx > 0 ? 1 : -1;
      const throwDist = deckWidth * 1.2;
      const roll = 24 * dir;
      setCardTransform({
        x: dx + throwDist * dir,
        y: dy - 60,
        rot: roll,
        scale: 0.8,
        opacity: 0,
      });
      setTimeout(() => {
        setTopIndex((i) => (i + 1) % cards.length);
        setCardTransform({ x: 0, y: 0, rot: 0, scale: 1, opacity: 1 });
      }, 400);
    } else {
      setCardTransform({ x: 0, y: 0, rot: 0, scale: 1, opacity: 1 });
      // A tap / drag under the threshold opens the top card as a click
      if (onOpen && topCardRef.current) {
        onOpen(topCardRef.current);
      }
    }
  }, [cards, onOpen]);

  const handleMoveRef = useRef(onPointerMove);
  const handleUpRef = useRef(onRelease);

  const onPointerDown = useCallback((e) => {
    dragging.current = true;
    topCardRef.current = cards[topIndex];
    dragData.current = { startX: e.clientX, startY: e.clientY, dx: 0, dy: 0 };
    handleMoveRef.current = onPointerMove;
    handleUpRef.current = onRelease;
    window.addEventListener('pointermove', handleMoveRef.current);
    window.addEventListener('pointerup', handleUpRef.current);
  }, [onPointerMove, onRelease, cards, topIndex]);

  const flipNext = useCallback(() => {
    setCardTransform({ x: 0, y: 0, rot: 0, scale: 1, opacity: 1 });
    setTopIndex((i) => {
      const ni = (i + 1) % cards.length;
      topCardRef.current = cards[ni];
      return ni;
    });
  }, [cards]);

  const openTop = useCallback(() => {
    if (topCardRef.current && onOpen) {
      onOpen(topCardRef.current);
    }
  }, [onOpen]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        flipNext();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openTop();
      }
    },
    [flipNext, openTop]
  );

  const visibleCards = 5;
  const shown = Array.from({ length: Math.min(visibleCards, cards.length) }, (_, i) => {
    const idx = (topIndex + i) % cards.length;
    return { ...cards[idx], depth: i };
  });

  return (
    <div
      ref={deckRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="listbox"
      aria-label="Web projects deck"
      className="relative outline-none select-none w-full max-w-full"
      style={{
        aspectRatio: '1 / 1',
        touchAction: 'pan-y',
      }}
    >
      {shown.map((card, i) => {
        const isTop = i === 0;
        const offset = i * 14;
        const scale = 1 - i * 0.04;
        const rotate = (i % 2 === 0 ? -1 : 1) * i * 1.5;
        return (
          <div
            key={`${card.id}-${i}`}
            className="absolute inset-0"
            style={{
              zIndex: visibleCards - i,
              transform: isTop
                ? `translate(${cardTransform.x}px, ${cardTransform.y}px) rotate(${cardTransform.rot}deg) scale(${cardTransform.scale})`
                : `translate(${offset}px, ${-offset * 0.4}px) rotate(${rotate}deg) scale(${scale})`,
              opacity: isTop ? cardTransform.opacity : 1,
              transition: isTop ? 'transform 0.15s ease-out, opacity 0.3s ease-out' : 'none',
              cursor: 'grab',
              willChange: 'transform',
            }}
            onPointerDown={isTop ? onPointerDown : undefined}
          >
            <CardFace card={card} isTop={isTop} />
          </div>
        );
      })}
    </div>
  );
}

export default ThrowableCardDeck;
