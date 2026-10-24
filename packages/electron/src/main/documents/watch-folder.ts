/* @layer electron-main @kind logic */
import { join } from 'path';
import { watchEventOf } from './watch-event-of';
import type { WatchSettings } from './watch-folder.type';

const watchFolder = ({ dir, recursive, ms, max, watcher, check, live, listener }: WatchSettings): (() => void) => {
  const pending = new Map<string, boolean>();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let chain: Promise<void> = Promise.resolve();
  let stopped = false;

  const flush = async (): Promise<void> => {
    timer = null;
    const batch = [...pending];
    pending.clear();
    for (const [path, renamed] of batch) {
      const event = await watchEventOf(path, renamed, check);
      if (stopped || !live()) return;
      if (event !== null) listener(event);
    }
  };

  const stop = (): void => {
    if (stopped) return;
    stopped = true;
    if (timer !== null) clearTimeout(timer);
    timer = null;
    pending.clear();
    handle.close();
  };

  const handle = watcher(dir, recursive, (signal, name) => {
    if (stopped || name === null || name === '') return;
    const path = join(dir, name);
    if (!pending.has(path) && pending.size >= max) return;
    pending.set(path, pending.get(path) === true || signal === 'rename');
    timer ??= setTimeout(() => {
      chain = chain.then(flush).catch(() => undefined);
    }, ms);
  }, stop);

  return stop;
};

export { watchFolder };
