/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { MenuEntry } from '../menu/menu.type';
import type { ScreenRegistry } from '../screens/screen-registry.type';
import { PRELOAD_LABELS, PRELOAD_TARGETS } from './lazy.constants';
import { preloadRoute } from './preload-route';
import { routesForLabel } from './routes-for-label';

const labelOf = (target: EventTarget | null): string | null => {
  const item = target instanceof Element ? target.closest(PRELOAD_TARGETS) : null;
  if (!item) return null;
  const text = (item.querySelector(PRELOAD_LABELS) ?? item).textContent.trim();
  return text === '' ? null : text;
};

const usePreloadOnHover = (menu: readonly MenuEntry[], registry: ScreenRegistry): void => {
  useEffect(() => {
    let last: string | null = null;
    const onPoint = (event: Event): void => {
      const label = labelOf(event.target);
      if (label === null || label === last) return;
      last = label;
      for (const route of routesForLabel(label, menu, registry)) preloadRoute(registry, route);
    };
    document.addEventListener('pointerover', onPoint, { passive: true });
    document.addEventListener('focusin', onPoint);
    return () => {
      document.removeEventListener('pointerover', onPoint);
      document.removeEventListener('focusin', onPoint);
    };
  }, [menu, registry]);
};

export { usePreloadOnHover };
