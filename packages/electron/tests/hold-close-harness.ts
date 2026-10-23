/* @layer electron-main @kind test */
import { EventEmitter } from 'node:events';
import { vi } from 'vitest';

const settle = (): Promise<void> => new Promise((resolve) => { setTimeout(resolve, 0); });

const createCloseWindow = () => {
  const emitter = new EventEmitter();
  let destroyed = false;
  const contents = Object.assign(new EventEmitter(), { id: 3, isDestroyed: () => destroyed, send: vi.fn() });
  const win = Object.assign(emitter, {
    webContents: contents,
    isDestroyed: () => destroyed,
    close: vi.fn(() => { emitter.emit('close', { preventDefault: () => undefined }); }),
  });
  const attempt = (): boolean => {
    let prevented = false;
    emitter.emit('close', { preventDefault: () => { prevented = true; } });
    return prevented;
  };
  return { win: win as never, raw: win, contents, attempt, destroy: () => { destroyed = true; } };
};

export { createCloseWindow, settle };
