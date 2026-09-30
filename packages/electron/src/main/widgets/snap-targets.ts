/* @layer electron-main @kind logic */
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { liveEntries } from './live-entries';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { SnapTarget } from './widget-windows.type';

const snapTargets = (id: string): SnapTarget[] => {
  const main = getMainWindow();
  const app = main && !main.isDestroyed() && !main.isMinimized() ? [{ to: MAIN_ANCHOR, bounds: boundsOf(main) }] : [];
  const others = liveEntries().filter(([other]) => other !== id).map(([other, entry]) => ({ to: other, bounds: entry.last }));
  return [...app, ...others];
};

export { snapTargets };
