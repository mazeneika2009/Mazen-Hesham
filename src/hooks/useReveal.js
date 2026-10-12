import { useEffect, useState } from 'react';

export function useReveal() {
  const [reveals, setReveals] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    setReveals(true);
  }, []);
  return reveals;
}
