/* @layer electron-main @kind logic */
import type { WebContents } from 'electron';
import { CLIPBOARD_TEXT } from '@drizztdourden08/brock-core/platform';
import type { MainContext } from '../types/main-context.type';
import { assertAppFrame } from '../ipc/assert-app-frame';
import { dropWhenGone } from '../ipc/drop-when-gone';
import type { ClipboardBackend } from './clipboard-backend.type';
import { CLIPBOARD_CHANGED, CLIPBOARD_LIMITS } from './clipboard-limits.constants';
import { createClipboardWatch } from './clipboard-watch';
import { readClipboard } from './read-clipboard';
import { watchIdOf } from './watch-id-of';
import { writeClipboard } from './write-clipboard';

const registerClipboard = ({ handle, product }: Pick<MainContext, 'handle' | 'product'>, backend: ClipboardBackend): void => {
  const watch = createClipboardWatch({ fingerprint: () => backend.fingerprint(), channel: CLIPBOARD_CHANGED, pollMs: CLIPBOARD_LIMITS.pollMs, max: CLIPBOARD_LIMITS.watchers });
  const hooked = new WeakSet<WebContents>();

  const hook = (sender: WebContents): void => {
    if (hooked.has(sender)) return;
    hooked.add(sender);
    dropWhenGone(sender, () => watch.drop(sender));
  };

  handle('clipboard:readText', (event) => {
    assertAppFrame(event);
    const text = readClipboard(backend, product.id, [CLIPBOARD_TEXT])[CLIPBOARD_TEXT];
    return typeof text === 'string' ? text : '';
  });
  handle('clipboard:write', (event, entries) => {
    assertAppFrame(event);
    writeClipboard(backend, product.id, entries);
  });
  handle('clipboard:read', (event, types) => {
    assertAppFrame(event);
    return readClipboard(backend, product.id, types);
  });
  handle('clipboard:watch', (event, id) => {
    assertAppFrame(event);
    watch.add(event.sender, watchIdOf(id));
    hook(event.sender);
  });
  handle('clipboard:unwatch', (event, id) => {
    assertAppFrame(event);
    watch.remove(event.sender, watchIdOf(id));
  });
};

export { registerClipboard };
