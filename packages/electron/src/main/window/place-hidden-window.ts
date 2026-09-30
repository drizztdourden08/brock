/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow } from 'electron';
import type { WindowPlan } from './create-window.type';
import { applyWindowState } from './apply-window-state';
import { keepWindowInBackground } from './keep-in-background';
import { normalBounds } from './normal-bounds';
import { saveWindowState } from './save-window-state';
import { trackWindowState } from './track-window-state';

const placeHiddenWindow = (win: BrowserWindow, { headless, startup, saved }: WindowPlan, persist: boolean): (() => void) => {
  if (headless) {
    if (!startup.windowSize) win.setContentSize(saved.width, saved.height);
    keepWindowInBackground(win);
    return () => win.showInactive();
  }
  const restore = !startup.windowSize;
  if (restore) applyWindowState(win, saved);
  else win.center();
  normalBounds.cached = win.getContentBounds();
  const display = screen.getDisplayMatching(win.getBounds());
  if (restore && saved.isFullscreen) win.setBounds(display.bounds);
  else if (restore && saved.isMaximized) win.setBounds(display.workArea);

  return () => {
    if (restore && saved.isMaximized) win.maximize();
    else win.show();
    if (restore && saved.isFullscreen) win.setFullScreen(true);
    trackWindowState(win);
    if (persist) win.on('close', () => saveWindowState(win));
  };
};

export { placeHiddenWindow };
