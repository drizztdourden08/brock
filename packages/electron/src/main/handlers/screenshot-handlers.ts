/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { captureWindow } from './capture-window';
import { captureHolds } from './capture-holds';

const screenshotHandlers: HandlerGroup = {
  id: 'screenshot',
  register: ({ handle, on, window }) => {
    on('capture:holds', (_event, count) => captureHolds.set(count));
    handle('test:screenshot', (_event, name) => {
      const win = window();
      if (!win) throw new Error('No window available for screenshot');
      return captureWindow(win, name);
    });
  },
};

export { screenshotHandlers };
