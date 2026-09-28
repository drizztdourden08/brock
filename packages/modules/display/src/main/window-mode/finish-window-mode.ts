/* @layer electron-main @kind logic */
import type { BrowserWindow, Display } from 'electron';
import type { WindowMode } from '@drizztdourden08/brock-core/settings';
import { placeOnDisplay } from './place-on-display';
import type { WindowModeRuntime } from './window-mode.type';

const leaveBorderless = (win: BrowserWindow, runtime: WindowModeRuntime): void => {
  if (!runtime.windowedBounds) return;
  win.setBounds(runtime.windowedBounds);
  runtime.windowedBounds = null;
};

const enterBorderless = (win: BrowserWindow, runtime: WindowModeRuntime, display: Display): void => {
  if (win.isMaximized()) win.unmaximize();
  runtime.windowedBounds ??= win.getBounds();
  win.setBounds(display.bounds);
};

const finishWindowMode = (win: BrowserWindow, runtime: WindowModeRuntime, mode: WindowMode, display: Display): void => {
  switch (mode) {
    case 'borderless':
      enterBorderless(win, runtime, display);
      break;
    case 'fullscreen':
      leaveBorderless(win, runtime);
      placeOnDisplay(win, display);
      win.setFullScreen(true);
      break;
    case 'windowed':
      leaveBorderless(win, runtime);
      placeOnDisplay(win, display);
      break;
  }
};

export { finishWindowMode };
