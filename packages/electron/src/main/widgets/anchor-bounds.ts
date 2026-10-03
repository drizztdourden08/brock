/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { isMainNormal } from './is-main-normal';
import { widgetWindowEntries } from './widget-window-entries';
import { MAIN_ANCHOR } from './widget-windows.constants';

const anchorBounds = (to: string): WidgetWindowBounds | null => {
  if (to === MAIN_ANCHOR) {
    const main = getMainWindow();
    return main && isMainNormal(main) ? boundsOf(main) : null;
  }
  const entry = widgetWindowEntries.get(to);
  return entry && !entry.win.isDestroyed() && !entry.parked ? entry.last : null;
};

export { anchorBounds };
