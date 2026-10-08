/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { openRouter } from './open-router';

const openHandlers: HandlerGroup = {
  id: 'open',
  register: ({ handle }) => {
    handle('app:takeOpens', () => openRouter.take());
  },
};

export { openHandlers };
