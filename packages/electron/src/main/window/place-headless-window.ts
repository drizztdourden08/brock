/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WindowPlan } from './create-window.type';
import { headlessFullscreen } from './headless-fullscreen';

const noop = (): void => undefined;

const placeHeadlessWindow = (win: BrowserWindow, { startup, saved }: WindowPlan): (() => void) => {
  const restore = !startup.windowSize;
  if (restore) win.setContentSize(saved.width, saved.height);
  const fullscreen = restore && saved.isFullscreen;
  return () => {
    if (fullscreen) headlessFullscreen.set(win, true, noop);
    win.showInactive();
  };
};

export { placeHeadlessWindow };
