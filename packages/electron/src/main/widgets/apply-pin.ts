/* @layer electron-main @kind logic */
import { setPinned } from '../window/set-pinned';
import { tellWindow } from './tell-window';
import type { WidgetWindowEntry } from './widget-windows.type';

const applyPin = (entry: WidgetWindowEntry, mainOnTop: boolean): void => {
  const onTop = entry.pin === 'top' || (entry.sync && mainOnTop);
  setPinned(entry.win, onTop);
  tellWindow(entry);
};

export { applyPin };
