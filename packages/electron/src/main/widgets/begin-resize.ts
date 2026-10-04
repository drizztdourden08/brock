/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { aspectLock } from '../window/aspect-lock';
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { captureResize } from './capture-resize';
import { isMainNormal } from './is-main-normal';
import { liveEntries } from './live-entries';
import { minSizeOf } from './min-size-of';
import { resizeEdges } from './resize-edges';
import { resizeSides } from './resize-sides';
import { AXIS_EDGE_PLATFORMS, MAIN_ANCHOR } from './widget-windows.constants';
import type { ResizeNeighbour, ResizeSession } from './widget-windows.type';

const neighbours = (id: string, lockOn: boolean): ResizeNeighbour[] => {
  const main = getMainWindow();
  const app = main && id !== MAIN_ANCHOR && isMainNormal(main) && main.isVisible() ? [{ id: MAIN_ANCHOR, bounds: boundsOf(main), min: minSizeOf(main), canFollow: !lockOn }] : [];
  const widgets = liveEntries()
    .filter(([other, entry]) => other !== id && !entry.parked && entry.win.isVisible())
    .map(([other, entry]) => ({ id: other, bounds: boundsOf(entry.win), min: minSizeOf(entry.win), canFollow: true }));
  return [...app, ...widgets];
};

const beginResize = (id: string, win: BrowserWindow, proposed: WidgetWindowBounds, edge?: string): ResizeSession => {
  const lockOn = aspectLock.get().ratio > 0;
  const start = boundsOf(win);
  const named = AXIS_EDGE_PLATFORMS.includes(process.platform) ? undefined : edge;
  const sides = resizeEdges(start, proposed, named);
  return captureResize({
    id, edge: named ?? resizeSides.nameOf(sides), sides, known: named !== undefined, start, first: proposed, min: minSizeOf(win), locked: id === MAIN_ANCHOR && lockOn, others: neighbours(id, lockOn),
  });
};

export { beginResize };
