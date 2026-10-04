/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { liveEntries } from './live-entries';
import { snapTo } from './snap-to';
import type { Snapped } from './widget-windows.type';

const snapMainAt = (wanted: WidgetWindowBounds, moving: ReadonlySet<string>): Snapped | null => {
  const targets = liveEntries()
    .filter(([id, entry]) => !moving.has(id) && !entry.parked && entry.win.isVisible())
    .map(([id, entry]) => ({ to: id, bounds: entry.last }));
  return snapTo(wanted, targets);
};

export { snapMainAt };
