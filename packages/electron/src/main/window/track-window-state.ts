/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { normalBounds } from './normal-bounds';

const trackWindowState = (win: BrowserWindow): void => {
  const updateNormalBounds = (): void => {
    if (!win.isMaximized() && !win.isFullScreen() && !win.isMinimized()) {
      normalBounds.cached = win.getContentBounds();
    }
  };
  win.on('move', updateNormalBounds);
  win.on('resize', updateNormalBounds);
  updateNormalBounds();
};

export { trackWindowState };
