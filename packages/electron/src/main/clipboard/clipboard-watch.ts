/* @layer electron-main @kind logic */
import type { ClipboardWatch, ClipboardWatchDeps } from './clipboard-watch.type';

const startTimer = (tick: () => void, ms: number): unknown => {
  const timer = setInterval(tick, ms);
  timer.unref();
  return timer;
};

const createClipboardWatch = ({ fingerprint, changed, pollMs, max, setTimer = startTimer, clearTimer = (timer) => clearInterval(timer as NodeJS.Timeout) }: ClipboardWatchDeps): ClipboardWatch => {
  const ids = new Set<string>();
  let timer: unknown = null;
  let last = '';

  const tick = (): void => {
    let now: string;
    try {
      now = fingerprint();
    } catch {
      return;
    }
    if (now === last) return;
    last = now;
    changed();
  };

  const stop = (): void => {
    if (timer === null) return;
    clearTimer(timer);
    timer = null;
  };

  return {
    add: (id) => {
      if (ids.has(id)) return;
      if (ids.size >= max) throw new Error(`At most ${max} clipboard watchers can be open`);
      ids.add(id);
      if (timer !== null) return;
      try {
        last = fingerprint();
      } catch {
        last = '';
      }
      timer = setTimer(tick, pollMs);
    },
    remove: (id) => {
      ids.delete(id);
      if (ids.size === 0) stop();
    },
    clear: () => {
      ids.clear();
      stop();
    },
    size: () => ids.size,
  };
};

export { createClipboardWatch };
