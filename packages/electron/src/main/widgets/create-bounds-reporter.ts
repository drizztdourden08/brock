/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { BOUNDS_DEBOUNCE_MS } from './widget-windows.constants';

const createBoundsReporter = (id: string, win: BrowserWindow) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const cancel = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  const schedule = (): void => {
    cancel();
    timer = setTimeout(() => {
      timer = null;
      const main = getMainWindow();
      if (main && !win.isDestroyed()) emit(main, 'widget:bounds', id, boundsOf(win));
    }, BOUNDS_DEBOUNCE_MS);
  };
  return { schedule, cancel };
};

export { createBoundsReporter };
