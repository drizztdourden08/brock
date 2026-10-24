/* @layer electron-main @kind logic */
import { backgroundMode } from '../background/background-mode';
import { showMainWindow } from '../background/show-main-window';
import { bootState } from '../boot/boot-state';
import { getMainWindow } from '../window/get-main-window';

const focusForOpen = (): void => {
  if (bootState.headless) return;
  const win = getMainWindow();
  if (!win || win.isDestroyed()) {
    if (backgroundMode.active) void showMainWindow().catch(() => undefined);
    return;
  }
  if (!bootState.revealed) return;
  if (win.isMinimized()) win.restore();
  win.focus();
};

export { focusForOpen };
