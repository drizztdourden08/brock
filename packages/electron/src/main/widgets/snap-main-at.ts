/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { linkedTo } from './linked-to';
import { liveEntries } from './live-entries';
import { snapTo } from './snap-to';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { Snapped } from './widget-windows.type';

const snapMainAt = (wanted: WidgetWindowBounds): Snapped | null => {
  const towed = new Set(linkedTo(MAIN_ANCHOR));
  const targets = liveEntries()
    .filter(([id, entry]) => !towed.has(id) && !entry.parked && entry.win.isVisible())
    .map(([id, entry]) => ({ to: id, bounds: entry.last }));
  return snapTo(wanted, targets);
};

export { snapMainAt };
