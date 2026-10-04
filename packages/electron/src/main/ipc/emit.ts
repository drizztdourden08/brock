/* @layer electron-main @kind logic */
import type { EmitFn } from './handle.type';
import { appendMainLog } from '../logs/append-main-log';
import { channelName } from './channel-name';

const emit: EmitFn = (win, channel, ...args) => {
  const name = channelName(channel);
  if (win.isDestroyed()) return;
  const wc = win.webContents;
  if (wc.isDestroyed()) return;
  try {
    wc.send(name, ...args);
  } catch (err) {
    appendMainLog('warn', `[ipc] send "${name}" failed: ${String(err)}`);
  }
};

export { emit };
