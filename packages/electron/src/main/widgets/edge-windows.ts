/* @layer electron-main @kind logic */
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { isMainNormal } from './is-main-normal';
import { liveEntries } from './live-entries';
import { minSizeOf } from './min-size-of';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { EdgeWindow } from './widget-windows.type';

const edgeWindows = (exceptId: string): EdgeWindow[] => {
  const main = getMainWindow();
  const app = main && exceptId !== MAIN_ANCHOR && isMainNormal(main) && main.isVisible() ? [{ id: MAIN_ANCHOR, bounds: boundsOf(main), min: minSizeOf(main) }] : [];
  const others = liveEntries()
    .filter(([id, entry]) => id !== exceptId && !entry.parked && entry.win.isVisible())
    .map(([id, entry]) => ({ id, bounds: entry.last, min: minSizeOf(entry.win) }));
  return [...app, ...others];
};

export { edgeWindows };
