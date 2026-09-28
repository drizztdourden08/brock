/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import type { WindowState } from './window-state.type';
import { appendMainLog } from '../logs/append-main-log';
import { windowStatePath } from './window-state-path';
import { normalBounds } from './normal-bounds';

const saveWindowState = (win: BrowserWindow): void => {
  const bounds = normalBounds.cached ?? win.getContentBounds();
  const state: WindowState = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    isMaximized: win.isMaximized(),
    isFullscreen: win.isFullScreen(),
  };
  try {
    const file = windowStatePath();
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    appendMainLog('error', `[window-state] Failed to save: ${String(err)}`);
  }
};

export { saveWindowState };
