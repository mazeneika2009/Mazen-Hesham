import { useEffect } from 'react';

export function useScrollProgress(ref, callback, dependency = null) {
  useEffect(() => {
    const measurement = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / vh));
      callback(progress);
    };
    measurement();
    window.addEventListener('scroll', measurement, { passive: true });
    window.addEventListener('resize', measurement);
    return () => {
      window.removeEventListener('scroll', measurement);
      window.removeEventListener('resize', measurement);
    };
  }, [ref, dependency]);
}
