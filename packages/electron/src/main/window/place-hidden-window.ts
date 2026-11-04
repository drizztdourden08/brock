/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow } from 'electron';
import type { WindowPlan } from './create-window.type';
import { applyWindowState } from './apply-window-state';
import { headlessFullscreen } from './headless-fullscreen';
import { normalBounds } from './normal-bounds';
import { saveWindowState } from './save-window-state';
import { trackWindowState } from './track-window-state';

const noop = (): void => undefined;

const placeHiddenWindow = (win: BrowserWindow, { headless, startup, saved }: WindowPlan, persist: boolean): (() => void) => {
  if (headless) {
    if (!startup.windowSize) win.setContentSize(saved.width, saved.height);
    const fullscreen = !startup.windowSize && saved.isFullscreen;
    return () => {
      if (fullscreen) headlessFullscreen.set(win, true, noop);
      win.showInactive();
    };
  }
  const restore = !startup.windowSize;
  const maximized = restore && saved.isMaximized && win.isMaximizable();
  const fullscreen = restore && saved.isFullscreen && win.isFullScreenable();
  if (restore) applyWindowState(win, saved);
  else win.center();
  normalBounds.cached = win.getContentBounds();
  const display = screen.getDisplayMatching(win.getBounds());
  if (fullscreen) win.setBounds(display.bounds);
  else if (maximized) win.setBounds(display.workArea);

  return () => {
    if (maximized) win.maximize();
    else win.show();
    if (fullscreen) win.setFullScreen(true);
    trackWindowState(win);
    if (persist) win.on('close', () => saveWindowState(win));
  };
};

export { placeHiddenWindow };
