/* @layer electron-main @kind logic */
import { bootState } from '../boot/boot-state';
import { getMainWindow } from '../window/get-main-window';

const focusForOpen = (): void => {
  const win = getMainWindow();
  if (!win || win.isDestroyed() || !bootState.revealed || bootState.headless) return;
  if (win.isMinimized()) win.restore();
  win.focus();
};

export { focusForOpen };
