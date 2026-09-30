/* @layer electron-main @kind logic */
import type { MainBootTask } from '../boot-state.type';

const windowStateTask = (openWindow: () => Promise<void>): MainBootTask => ({
  id: 'window-state',
  label: 'Restoring the window',
  after: ['modules'],
  run: () => openWindow(),
});

export { windowStateTask };
