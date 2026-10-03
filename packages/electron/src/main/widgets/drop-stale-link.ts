/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { anchorBounds } from './anchor-bounds';
import { isFlush } from './is-flush';
import { relink } from './relink';
import type { WidgetWindowEntry } from './widget-windows.type';

const dropStaleLink = (id: string, entry: WidgetWindowEntry, now: WidgetWindowBounds): void => {
  const target = entry.link ? anchorBounds(entry.link.to) : null;
  if (entry.link && target && !isFlush(now, entry.link.edge, target)) relink(id, entry, null);
};

export { dropStaleLink };
