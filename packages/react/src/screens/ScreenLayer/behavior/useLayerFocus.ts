/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { layerHeading } from './layer-heading';

const isFree = (layer: Element | null): boolean => {
  const focused = document.activeElement;
  return focused === null || focused === document.body || (layer?.contains(focused) ?? false);
};

const useLayerFocus = (marker: RefObject<HTMLElement | null>, hidden: boolean): void => {
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (hidden) return;
    const layer = marker.current?.closest<HTMLElement>('[role="dialog"]') ?? null;
    const focused = document.activeElement;
    opener.current = focused instanceof HTMLElement && focused !== document.body && !layer?.contains(focused) ? focused : null;
    const frame = requestAnimationFrame(() => {
      if (layer === null || layer.contains(document.activeElement)) return;
      const heading = layerHeading(layer);
      if (heading === null) return;
      if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      const back = opener.current;
      opener.current = null;
      if (back?.isConnected && isFree(layer)) back.focus({ preventScroll: true });
    };
  }, [marker, hidden]);
};

export { useLayerFocus };
