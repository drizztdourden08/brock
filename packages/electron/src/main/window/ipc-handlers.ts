/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { mainClusterControl } from '../widgets/main-cluster-control';
import { widgetWindowControl } from '../widgets/widget-window-control';
import { setPinned } from './set-pinned';

const windowHandlers: HandlerGroup = {
  id: 'window',
  register: ({ handle, on, window }) => {
    on('window:minimize', () => {
      if (!mainClusterControl.minimize()) window()?.minimize();
    });
    on('window:maximize', () => {
      const win = window();
      if (!win?.isMaximizable() || mainClusterControl.maximize()) return;
      if (win.isMaximized()) win.unmaximize();
      else win.maximize();
    });
    on('window:close', () => window()?.close());
    on('window:openDevTools', () => window()?.webContents.openDevTools());
    on('window:toggleFullscreen', () => {
      const win = window();
      if (!win?.isFullScreenable() || mainClusterControl.fullscreen()) return;
      win.setFullScreen(!win.isFullScreen());
    });
    on('window:setFullscreen', (_e, value) => {
      const win = window();
      if (!win?.isFullScreenable() || mainClusterControl.fullscreen(value)) return;
      win.setFullScreen(value);
    });

    handle('window:isMaximized', () => mainClusterControl.isMaximized() ?? window()?.isMaximized() ?? false);
    handle('window:isFullscreen', () => mainClusterControl.isFullscreen() ?? window()?.isFullScreen() ?? false);
    handle('window:setAlwaysOnTop', (_event, value) => {
      const win = window();
      if (win) setPinned(win, value);
      const onTop = win?.isAlwaysOnTop() ?? false;
      widgetWindowControl.mirrorMainPin(onTop);
      return onTop;
    });
  },
};

export { windowHandlers };
