/* @layer electron-main @kind logic */
import { app, BrowserWindow } from 'electron';
import type { LifecycleInput } from './app-lifecycle.type';
import { disposeServices } from '../services/dispose-services';
import { backgroundMode } from '../background/background-mode';
import { showMainWindow } from '../background/show-main-window';

const installAppLifecycle = ({ ctx, modules, onWillQuit, recreateWindow }: LifecycleInput): void => {
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length > 0) return;
    if (backgroundMode.active) void showMainWindow().catch((err: unknown) => ctx.log(`the window did not open: ${String(err)}`, 'error'));
    else recreateWindow();
  });

  app.on('will-quit', () => {
    for (const module of modules) module.onWillQuit?.(ctx);
    onWillQuit?.(ctx);
    ctx.processes.cancelAll();
    ctx.tray.clear();
    disposeServices(ctx);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin' && !backgroundMode.active) app.quit();
  });
};

export { installAppLifecycle };
