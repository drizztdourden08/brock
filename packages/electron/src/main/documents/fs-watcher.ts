/* @layer electron-main @kind logic */
import { watch } from 'fs';
import type { WatchFn } from './watch-folder.type';

const fsWatcher: WatchFn = (dir, recursive, onSignal, onError) => {
  const handle = watch(dir, { recursive, persistent: false }, (signal, name) => onSignal(signal, name === null ? null : String(name)));
  handle.on('error', onError);
  return handle;
};

export { fsWatcher };
