/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { mainGroupControl } from '../widgets/main-group-control';
import { widgetWindowControl } from '../widgets/widget-window-control';

const windowHandlers: HandlerGroup = {
  id: 'window',
  register: ({ handle, on, window }) => {
    on('window:minimize', () => {
      if (!mainGroupControl.minimize()) window()?.minimize();
    });
    on('window:maximize', () => {
      const win = window();
      if (!win?.isMaximizable() || mainGroupControl.maximize()) return;
      if (win.isMaximized()) win.unmaximize();
      else win.maximize();
    });
    on('window:close', () => window()?.close());
    on('window:openDevTools', () => window()?.webContents.openDevTools());
    on('window:toggleFullscreen', () => {
      const win = window();
      if (!win?.isFullScreenable() || mainGroupControl.fullscreen()) return;
      win.setFullScreen(!win.isFullScreen());
    });
    on('window:setFullscreen', (_e, value) => {
      const win = window();
      if (!win?.isFullScreenable() || mainGroupControl.fullscreen(value)) return;
      win.setFullScreen(value);
    });

    handle('window:isMaximized', () => mainGroupControl.isMaximized() ?? window()?.isMaximized() ?? false);
    handle('window:isFullscreen', () => mainGroupControl.isFullscreen() ?? window()?.isFullScreen() ?? false);
    handle('window:setAlwaysOnTop', (_event, value) => {
      const win = window();
      win?.setAlwaysOnTop(value);
      const onTop = win?.isAlwaysOnTop() ?? false;
      widgetWindowControl.mirrorMainPin(onTop);
      return onTop;
    });
  },
};

export { windowHandlers };
