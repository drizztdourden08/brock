/* @layer electron-main @kind logic */
import type { AskWithinFn } from './ask.type';
import { pendingAsks } from './ask-pending';
import { channelName } from './channel-name';
import { nextAskId } from './next-ask-id';
import { settleAsk } from './settle-ask';

const askWithin: AskWithinFn = (timeoutMs, win, channel, ...args) => {
  const name = channelName(channel);
  const request = new Promise<unknown>((resolve, reject) => {
    const contents = win.webContents;
    if (win.isDestroyed() || contents.isDestroyed()) {
      reject(new Error(`ask "${name}": the window is closed`));
      return;
    }
    const id = nextAskId();
    const fail = (message: string): void => settleAsk(id, { ok: false, message });
    const onGone = (): void => fail(`ask "${name}": the window closed before it answered`);
    const timer = setTimeout(() => fail(`ask "${name}" timed out after ${timeoutMs} ms`), timeoutMs);
    const release = (): void => {
      clearTimeout(timer);
      contents.removeListener('destroyed', onGone);
      contents.removeListener('render-process-gone', onGone);
      pendingAsks.delete(id);
    };
    contents.once('destroyed', onGone);
    contents.once('render-process-gone', onGone);
    pendingAsks.set(id, { senderId: contents.id, resolve, reject, release });
    try {
      contents.send('ask:request', id, name, args);
    } catch (err) {
      fail(`ask "${name}" could not be sent: ${String(err)}`);
    }
  });
  return request as never;
};

export { askWithin };
