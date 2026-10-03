/* @layer electron-main @kind logic */
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { isMainNormal } from './is-main-normal';
import { liveEntries } from './live-entries';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { SnapTarget } from './widget-windows.type';

const snapTargets = (id: string): SnapTarget[] => {
  const main = getMainWindow();
  const app = main && isMainNormal(main) && main.isVisible() ? [{ to: MAIN_ANCHOR, bounds: boundsOf(main) }] : [];
  const others = liveEntries()
    .filter(([other, entry]) => other !== id && !entry.parked && entry.win.isVisible())
    .map(([other, entry]) => ({ to: other, bounds: entry.last }));
  return [...app, ...others];
};

export { snapTargets };
