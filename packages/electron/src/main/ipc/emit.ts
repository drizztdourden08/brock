/* @layer electron-main @kind logic */
import type { EmitFn } from './handle.type';
import { appendMainLog } from '../logs/append-main-log';

const emit: EmitFn = (win, channel, ...args) => {
  if (win.isDestroyed()) return;
  const wc = win.webContents;
  if (wc.isDestroyed()) return;
  try {
    wc.send(channel, ...args);
  } catch (err) {
    appendMainLog('warn', `[ipc] send "${channel}" failed: ${String(err)}`);
  }
};

export { emit };
