/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { captureWindow } from './capture-window';

const screenshotHandlers: HandlerGroup = {
  id: 'screenshot',
  register: ({ handle, window }) => {
    handle('test:screenshot', (_event, name) => {
      const win = window();
      if (!win) throw new Error('No window available for screenshot');
      return captureWindow(win, name);
    });
  },
};

export { screenshotHandlers };
