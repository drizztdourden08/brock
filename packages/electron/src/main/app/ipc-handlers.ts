/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { HandlerGroup } from '../types/main-context.type';

const appHandlers: HandlerGroup = {
  id: 'app',
  register: ({ handle }) => {
    handle('app:getUserDataPath', () => app.getPath('userData'));
    handle('app:getVersion', () => app.getVersion());
  },
};

export { appHandlers };
