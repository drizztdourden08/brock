/* @layer renderer-shell @kind logic */
import type { WidgetWindowPoint } from '@drizztdourden08/brock-core';
import type { ExternalDrag } from '@drizztdourden08/tessera/composites';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { RELEASE_TIMEOUT_MS } from './widget.constants';

let releaseTimer: ReturnType<typeof setTimeout> | null = null;

const store = () => useWidgetLayoutStore.getState();

const over = (id: string, point: WidgetWindowPoint | null): void => {
  if (store().externalDrag?.released === true) return;
  store().setExternalDrag(point ? { id, point, released: false } : null);
};

const release = (id: string, point: WidgetWindowPoint): void => {
  const drag: ExternalDrag = { id, point, released: true };
  store().setExternalDrag(drag);
  if (releaseTimer) clearTimeout(releaseTimer);
  releaseTimer = setTimeout(() => {
    releaseTimer = null;
    if (store().externalDrag === drag) store().setExternalDrag(null);
  }, RELEASE_TIMEOUT_MS);
};

const externalDrags = { over, release };

export { externalDrags };
