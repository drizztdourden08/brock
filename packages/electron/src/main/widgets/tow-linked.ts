/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { liveEntries } from './live-entries';
import { moveEntry } from './move-entry';
import { sameBounds } from './same-bounds';
import { towedBounds } from './towed-bounds';

const towLinked = (anchor: string, before: WidgetWindowBounds, after: WidgetWindowBounds, seen = new Set<string>([anchor])): void => {
  if (sameBounds(before, after)) return;
  for (const [id, entry] of liveEntries()) {
    if (entry.link?.to !== anchor || seen.has(id)) continue;
    seen.add(id);
    const prev = entry.last;
    const next = towedBounds(prev, entry.link.edge, before, after);
    if (sameBounds(prev, next)) continue;
    moveEntry(entry, next);
    towLinked(id, prev, next, seen);
  }
};

export { towLinked };
