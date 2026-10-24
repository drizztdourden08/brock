/* @layer electron-main @kind logic */
import { bootState } from '../boot/boot-state';
import { getMainWindow } from '../window/get-main-window';
import { windowOpener } from './window-opener';

const showMainWindow = async (): Promise<void> => {
  const win = getMainWindow();
  if (!win || win.isDestroyed()) {
    await windowOpener.current?.();
    return;
  }
  if (!bootState.revealed) return;
  if (win.isMinimized()) win.restore();
  if (!win.isVisible()) win.show();
  win.focus();
};

export { showMainWindow };
