/* @layer electron-main @kind logic */
import { boundsOf } from './bounds-of';
import { dropStaleLink } from './drop-stale-link';
import { liveEntries } from './live-entries';
import { moveEntry } from './move-entry';
import { rescueBounds } from './rescue-bounds';
import { widgetAreas } from './widget-areas';

const rescueWidgetWindows = (): void => {
  const areas = widgetAreas();
  for (const [id, entry] of liveEntries()) {
    const next = rescueBounds(boundsOf(entry.win), areas);
    if (!next) continue;
    moveEntry(entry, next);
    dropStaleLink(id, entry, next);
  }
};

export { rescueWidgetWindows };
