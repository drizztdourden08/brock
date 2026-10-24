/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import { MAX_WATCH_ID } from './watch-limits.constants';

const registerWatchHandlers = ({ handle, window, emit, documents }: Pick<MainContext, 'handle' | 'window' | 'emit' | 'documents'>): void => {
  const stops = new Map<string, () => void>();
  const closing = new WeakSet();

  const stopAll = (): void => {
    const all = [...stops.values()];
    stops.clear();
    for (const stop of all) stop();
  };

  handle('document:watch', async (_event, id, folder, options) => {
    if (typeof id !== 'string' || id === '' || id.length > MAX_WATCH_ID) throw new Error('A folder watch needs an id of 1 to 64 characters');
    if (stops.has(id)) throw new Error(`The folder watch "${id}" already exists`);
    const win = window();
    if (!win) throw new Error('There is no window to send folder changes to');
    stops.set(id, () => undefined);
    try {
      const stop = await documents.watch(folder, options, (event) => emit('document:watchEvent', id, event));
      if (!stops.has(id)) {
        stop();
        return;
      }
      stops.set(id, stop);
    } catch (error) {
      stops.delete(id);
      throw error;
    }
    if (closing.has(win)) return;
    closing.add(win);
    win.once('closed', stopAll);
  });

  handle('document:unwatch', (_event, id) => {
    const stop = typeof id === 'string' ? stops.get(id) : undefined;
    if (typeof id === 'string') stops.delete(id);
    stop?.();
    return Promise.resolve();
  });
};

export { registerWatchHandlers };
