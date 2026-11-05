/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

const useNarrow = (target: RefObject<HTMLElement | null>, threshold: number): boolean => {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const element = target.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => setNarrow((entry?.contentRect.width ?? threshold) < threshold));
    observer.observe(element);
    return () => observer.disconnect();
  }, [target, threshold]);
  return narrow;
};

export { useNarrow };
