/* @layer electron-main @kind logic */
import type { ClipboardOwner, ClipboardWatch, ClipboardWatchDeps } from './clipboard-watch.type';

const startTimer = (tick: () => void, ms: number): unknown => {
  const timer = setInterval(tick, ms);
  timer.unref();
  return timer;
};

const readSafely = (read: () => string): string | null => {
  try {
    return read();
  } catch {
    return null;
  }
};

const createClipboardWatch = ({ fingerprint, channel, pollMs, max, setTimer = startTimer, clearTimer = (timer) => clearInterval(timer as NodeJS.Timeout) }: ClipboardWatchDeps): ClipboardWatch => {
  const owners = new Map<ClipboardOwner, Set<string>>();
  let timer: unknown = null;
  let last = '';

  const size = (): number => [...owners.values()].reduce((sum, ids) => sum + ids.size, 0);

  const stopWhenIdle = (): void => {
    if (owners.size > 0 || timer === null) return;
    clearTimer(timer);
    timer = null;
  };

  const prune = (): void => {
    for (const owner of [...owners.keys()]) if (owner.isDestroyed()) owners.delete(owner);
    stopWhenIdle();
  };

  const tell = (): void => {
    for (const owner of owners.keys()) owner.send(channel);
  };

  const tick = (): void => {
    prune();
    if (timer === null) return;
    const now = readSafely(fingerprint);
    if (now === null || now === last) return;
    last = now;
    tell();
  };

  const start = (): void => {
    if (timer !== null) return;
    last = readSafely(fingerprint) ?? '';
    timer = setTimer(tick, pollMs);
  };

  return {
    add: (owner, id) => {
      const ids = owners.get(owner) ?? new Set<string>();
      if (ids.has(id)) return;
      if (size() >= max) throw new Error(`At most ${max} clipboard watchers can be open`);
      ids.add(id);
      owners.set(owner, ids);
      start();
    },
    remove: (owner, id) => {
      const ids = owners.get(owner);
      ids?.delete(id);
      if (ids?.size === 0) owners.delete(owner);
      stopWhenIdle();
    },
    drop: (owner) => {
      owners.delete(owner);
      stopWhenIdle();
    },
    size,
  };
};

export { createClipboardWatch };
