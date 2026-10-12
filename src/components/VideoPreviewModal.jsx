import React, { useEffect, useRef, useState } from 'react';
import { FiX, FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { resolveMediaUrl } from '../utils/media';

// Fullscreen video modal with minimal custom controls (Play/Pause, Mute).
// Keeps 16:9 aspect ratio so mobile layout never shifts.
function VideoPreviewModal({ src, title, onClose }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);

  const resolved = resolveMediaUrl(src);

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Autoplay when the modal mounts (unmuted is allowed since this is user-initiated).
  useEffect(() => {
    const el = videoRef.current;
    if (el) {
      el.play().catch(() => setPlaying(false));
    }
  }, [resolved]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  if (!resolved) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `Video tour of ${title}` : 'Project video tour'}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-lg border border-hairline bg-ground-secondary shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
          <p className="text-[10.5px] uppercase tracking-labels text-muted truncate">
            Video tour{title ? ` · ${title}` : ''}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-ink-secondary border border-hairline hover:border-amber hover:text-amber transition-colors"
          >
            <FiX size={15} />
          </button>
        </div>

        <div className="aspect-video bg-black">
          <video
            ref={videoRef}
            src={resolved}
            className="w-full h-full"
            playsInline
            loop
            controls={false}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={togglePlay}
            className="min-h-[48px] inline-flex items-center gap-2 px-5 py-2 bg-amber text-ground font-semibold text-[10.5px] uppercase tracking-labels rounded-full hover:opacity-90"
          >
            {playing ? <FiPause size={13} /> : <FiPlay size={13} />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="min-h-[48px] inline-flex items-center gap-2 px-5 py-2 border border-hairline text-ink-secondary text-[10.5px] uppercase tracking-labels rounded-full hover:border-amber hover:text-amber transition-colors"
          >
            {muted ? <FiVolumeX size={13} /> : <FiVolume2 size={13} />}
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoPreviewModal;
