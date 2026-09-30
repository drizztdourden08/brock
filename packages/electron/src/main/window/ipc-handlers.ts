/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';

const windowHandlers: HandlerGroup = {
  id: 'window',
  register: ({ handle, on, window }) => {
    on('window:minimize', () => window()?.minimize());
    on('window:maximize', () => {
      const win = window();
      if (!win) return;
      if (win.isMaximized()) win.unmaximize();
      else win.maximize();
    });
    on('window:close', () => window()?.close());
    on('window:openDevTools', () => window()?.webContents.openDevTools());
    on('window:toggleFullscreen', () => {
      const win = window();
      if (win) win.setFullScreen(!win.isFullScreen());
    });
    on('window:setFullscreen', (_e, value) => {
      window()?.setFullScreen(value);
    });

    handle('window:isMaximized', () => window()?.isMaximized() ?? false);
    handle('window:isFullscreen', () => window()?.isFullScreen() ?? false);
    handle('window:setAlwaysOnTop', (_event, value) => {
      const win = window();
      win?.setAlwaysOnTop(value);
      return win?.isAlwaysOnTop() ?? false;
    });
  },
};

export { windowHandlers };
