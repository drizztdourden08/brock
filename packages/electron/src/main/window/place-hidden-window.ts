/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow } from 'electron';
import type { WindowPlan } from './create-window.type';
import { applyWindowState } from './apply-window-state';
import { normalBounds } from './normal-bounds';
import { placeHeadlessWindow } from './place-headless-window';
import { saveWindowState } from './save-window-state';
import { trackWindowState } from './track-window-state';

const placeHiddenWindow = (win: BrowserWindow, plan: WindowPlan, persist: boolean): (() => void) => {
  if (plan.headless) return placeHeadlessWindow(win, plan);
  const { startup, saved } = plan;
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
