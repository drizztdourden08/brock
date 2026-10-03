/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { boundsOf } from './bounds-of';
import { coversPoint } from './covers-point';
import { liveEntries } from './live-entries';
import { zStamps } from './z-stamps';

const coveredAt = (main: BrowserWindow, point: WidgetWindowPoint, exceptId: string): boolean => {
  const windows = liveEntries()
    .filter(([id, entry]) => id !== exceptId && !entry.parked && entry.win.isVisible())
    .map(([, entry]) => ({ bounds: boundsOf(entry.win), onTop: entry.win.isAlwaysOnTop(), stamp: entry.zStamp }));
  return coversPoint(point, windows, { onTop: main.isAlwaysOnTop(), stamp: zStamps.main });
};

export { coveredAt };
