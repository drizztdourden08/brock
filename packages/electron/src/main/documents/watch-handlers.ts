/* @layer electron-main @kind logic */
import type { WebContents } from 'electron';
import type { MainContext } from '../types/main-context.type';
import { dropWhenGone } from '../ipc/drop-when-gone';
import { MAX_WATCH_ID } from './watch-limits.constants';

const registerWatchHandlers = ({ handle, documents }: Pick<MainContext, 'handle' | 'documents'>): void => {
  const sessions = new WeakMap<WebContents, Map<string, () => void>>();
  const hooked = new WeakSet();

  const stopAll = (sender: WebContents): void => {
    const owned = sessions.get(sender);
    sessions.delete(sender);
    for (const stop of owned?.values() ?? []) stop();
  };

  const hook = (sender: WebContents): void => {
    if (hooked.has(sender)) return;
    hooked.add(sender);
    dropWhenGone(sender, () => stopAll(sender));
  };

  const ownedBy = (sender: WebContents): Map<string, () => void> => {
    const owned = sessions.get(sender) ?? new Map<string, () => void>();
    sessions.set(sender, owned);
    return owned;
  };

  handle('document:watch', async (event, id, folder, options) => {
    if (typeof id !== 'string' || id === '' || id.length > MAX_WATCH_ID) throw new Error('A folder watch needs an id of 1 to 64 characters');
    const { sender } = event;
    const owned = ownedBy(sender);
    if (owned.has(id)) throw new Error(`The folder watch "${id}" already exists`);
    owned.set(id, () => undefined);
    hook(sender);
    try {
      const stop = await documents.watch(folder, options, (change) => {
        if (!sender.isDestroyed()) sender.send('document:watchEvent', id, change);
      });
      if (sessions.get(sender) !== owned || !owned.has(id)) {
        stop();
        return;
      }
      owned.set(id, stop);
    } catch (error) {
      owned.delete(id);
      throw error;
    }
  });

  handle('document:unwatch', (event, id) => {
    const owned = sessions.get(event.sender);
    const stop = typeof id === 'string' ? owned?.get(id) : undefined;
    if (typeof id === 'string') owned?.delete(id);
    stop?.();
    return Promise.resolve();
  });
};

export { registerWatchHandlers };
