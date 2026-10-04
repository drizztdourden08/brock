/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { isMainNormal } from './is-main-normal';
import { liveEntries } from './live-entries';
import { MAIN_ANCHOR } from './widget-windows.constants';

const placedWindows = (): Map<string, WidgetWindowBounds> => {
  const main = getMainWindow();
  const app: [string, WidgetWindowBounds][] = main && isMainNormal(main) && main.isVisible() ? [[MAIN_ANCHOR, boundsOf(main)]] : [];
  const widgets = liveEntries()
    .filter(([, entry]) => !entry.closing && !entry.parked && entry.win.isVisible())
    .map(([id, entry]): [string, WidgetWindowBounds] => [id, boundsOf(entry.win)]);
  return new Map([...app, ...widgets]);
};

export { placedWindows };
