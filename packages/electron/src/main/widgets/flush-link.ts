/* @layer electron-main @kind logic */
import type { WidgetSnapLink, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { anchorBounds } from './anchor-bounds';
import { isFlush } from './is-flush';
import { liveEntries } from './live-entries';
import { MAIN_ANCHOR, RESIZE_SIDES } from './widget-windows.constants';

const flushLink = (bounds: WidgetWindowBounds, skip: ReadonlySet<string>): WidgetSnapLink | null => {
  const ids = [MAIN_ANCHOR, ...liveEntries().filter(([, entry]) => !entry.closing).map(([id]) => id)].filter((id) => !skip.has(id));
  for (const to of ids) {
    const target = anchorBounds(to);
    const edge = target ? RESIZE_SIDES.find((side) => isFlush(bounds, side, target)) : undefined;
    if (edge) return { to, edge };
  }
  return null;
};

export { flushLink };
