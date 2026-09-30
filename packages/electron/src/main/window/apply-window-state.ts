/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WindowState } from './window-state.type';

const applyWindowState = (win: BrowserWindow, state: WindowState): void => {
  if (state.x !== undefined && state.y !== undefined) {
    win.setContentBounds({ x: state.x, y: state.y, width: state.width, height: state.height });
    return;
  }
  win.setContentSize(state.width, state.height);
  win.center();
};

export { applyWindowState };
