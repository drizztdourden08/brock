/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { BOUNDS_DEBOUNCE_MS } from './widget-windows.constants';
import type { BoundsReporter } from './widget-windows.type';

const createBoundsReporter = (id: string, win: BrowserWindow): BoundsReporter => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const send = (): void => {
    const main = getMainWindow();
    if (main && !win.isDestroyed()) emit(main, 'widget:bounds', id, boundsOf(win));
  };
  const cancel = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  const schedule = (): void => {
    cancel();
    timer = setTimeout(() => {
      timer = null;
      send();
    }, BOUNDS_DEBOUNCE_MS);
  };
  const flush = (): boolean => {
    if (!timer) return false;
    cancel();
    send();
    return true;
  };
  return { schedule, cancel, flush };
};

export { createBoundsReporter };
