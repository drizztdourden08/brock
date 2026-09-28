/* @layer electron-main @kind logic */
import { app, BrowserWindow } from 'electron';
import type { LifecycleInput } from './app-lifecycle.type';

const installAppLifecycle = ({ ctx, modules, onWillQuit, recreateWindow }: LifecycleInput): void => {
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) recreateWindow();
  });

  app.on('will-quit', () => {
    for (const module of modules) module.onWillQuit?.(ctx);
    onWillQuit?.(ctx);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
};

export { installAppLifecycle };
