/* @layer electron-main @kind logic */
import { getMainWindow } from '../window/get-main-window';
import { anchorBounds } from './anchor-bounds';
import { isMainNormal } from './is-main-normal';
import { moveEntry } from './move-entry';
import { sameBounds } from './same-bounds';
import { towedBounds } from './towed-bounds';
import { widgetWindowEntries } from './widget-window-entries';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { WidgetWindowEntry } from './widget-windows.type';

const anchorParked = (to: string): boolean => {
  if (to !== MAIN_ANCHOR) return widgetWindowEntries.get(to)?.parked === true;
  const main = getMainWindow();
  return main !== null && !main.isDestroyed() && !main.isMinimized() && !isMainNormal(main);
};

const alignToLink = (entry: WidgetWindowEntry): void => {
  if (!entry.link) return;
  if (anchorParked(entry.link.to)) {
    entry.parked = true;
    return;
  }
  const target = anchorBounds(entry.link.to);
  if (!target) return;
  const next = towedBounds(entry.last, entry.link.edge, target, target);
  if (!sameBounds(next, entry.last)) moveEntry(entry, next);
};

export { alignToLink };
