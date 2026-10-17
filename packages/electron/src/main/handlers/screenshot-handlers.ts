/* @layer electron-main @kind logic */
import type { WebContents } from 'electron';
import type { HandlerGroup } from '../types/main-context.type';
import { captureWindow } from './capture-window';
import { captureHolds } from './capture-holds';

const watched = new Set<number>();

const holdsFrom = (sender: WebContents, count: number): void => {
  const { id } = sender;
  if (!watched.has(id)) {
    watched.add(id);
    sender.once('destroyed', () => {
      watched.delete(id);
      captureHolds.drop(id);
    });
  }
  captureHolds.set(count, id);
};

const screenshotHandlers: HandlerGroup = {
  id: 'screenshot',
  register: ({ handle, on, window }) => {
    on('capture:holds', (event, count) => holdsFrom(event.sender, count));
    handle('test:screenshot', (_event, name) => {
      const win = window();
      if (!win) throw new Error('No window available for screenshot');
      return captureWindow(win, name);
    });
  },
};

export { screenshotHandlers };
