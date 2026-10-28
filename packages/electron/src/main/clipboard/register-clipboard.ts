/* @layer electron-main @kind logic */
import { CLIPBOARD_TEXT } from '@drizztdourden08/brock-core/platform';
import type { MainContext } from '../types/main-context.type';
import type { ClipboardBackend } from './clipboard-backend.type';
import { CLIPBOARD_LIMITS } from './clipboard-limits.constants';
import { createClipboardWatch } from './clipboard-watch';
import { readClipboard } from './read-clipboard';
import { watchIdOf } from './watch-id-of';
import { writeClipboard } from './write-clipboard';

const registerClipboard = ({ handle, product, emit }: Pick<MainContext, 'handle' | 'product' | 'emit'>, backend: ClipboardBackend): void => {
  const watch = createClipboardWatch({ fingerprint: backend.fingerprint, changed: () => emit('clipboard:changed'), pollMs: CLIPBOARD_LIMITS.pollMs, max: CLIPBOARD_LIMITS.watchers });
  const reloading = new WeakSet<object>();

  handle('clipboard:readText', () => {
    const text = readClipboard(backend, product.id, [CLIPBOARD_TEXT])[CLIPBOARD_TEXT];
    return typeof text === 'string' ? text : '';
  });
  handle('clipboard:write', (_event, entries) => writeClipboard(backend, product.id, entries));
  handle('clipboard:read', (_event, types) => readClipboard(backend, product.id, types));
  handle('clipboard:watch', (event, id) => {
    watch.add(watchIdOf(id));
    if (reloading.has(event.sender)) return;
    reloading.add(event.sender);
    event.sender.on('did-start-navigation', (details) => {
      if (details.isMainFrame && !details.isSameDocument) watch.clear();
    });
  });
  handle('clipboard:unwatch', (_event, id) => watch.remove(watchIdOf(id)));
};

export { registerClipboard };
