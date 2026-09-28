/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { emit } from '../ipc/emit';
import { saveWindowState } from './save-window-state';

const forwardWindowEvents = (win: BrowserWindow, persistOnClose: boolean): void => {
  win.on('maximize', () => emit(win, 'window:maximized', true));
  win.on('unmaximize', () => emit(win, 'window:maximized', false));
  win.on('enter-full-screen', () => emit(win, 'window:fullscreen', true));
  win.on('leave-full-screen', () => emit(win, 'window:fullscreen', false));
  if (persistOnClose) win.on('close', () => saveWindowState(win));
};

export { forwardWindowEvents };
