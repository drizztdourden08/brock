/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { GaugeSize } from '@drizztdourden08/tessera/primitives';
import { GAUGE_DIALS } from '../PerformanceWidget.constants';

const sizeFor = (panel: HTMLElement, width: number, count: number): GaugeSize => {
  const gap = Number.parseFloat(getComputedStyle(panel).columnGap) || 0;
  const fits = (dial: number): boolean => width >= count * dial + (count - 1) * gap;
  if (fits(GAUGE_DIALS.lg)) return 'lg';
  if (fits(GAUGE_DIALS.md)) return 'md';
  return 'sm';
};

const useGaugeSize = (panel: HTMLElement | null, count: number): GaugeSize => {
  const [size, setSize] = useState<GaugeSize>('md');

  useEffect(() => {
    if (!panel || count === 0 || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize(sizeFor(panel, entry.contentRect.width, count));
    });
    observer.observe(panel);
    return () => observer.disconnect();
  }, [panel, count]);

  return size;
};

export { useGaugeSize };
