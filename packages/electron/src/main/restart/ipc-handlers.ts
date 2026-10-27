/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { takeRestartHandoff } from './take-restart-handoff';

const restartHandlers: HandlerGroup = {
  id: 'restart',
  register: ({ handle }) => {
    handle('app:takeHandoff', () => takeRestartHandoff());
  },
};

export { restartHandlers };
