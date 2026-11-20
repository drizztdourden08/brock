/* @layer electron-main @kind logic */
import type { ClipboardWatch, ClipboardWatchDeps } from './clipboard-watch.type';
import { serialSteps } from './serial-steps';
import { watchOwners } from './watch-owners';

const startTimer = (tick: () => void, ms: number): unknown => {
  const timer = setInterval(tick, ms);
  timer.unref();
  return timer;
};

const readSafely = async (read: () => Promise<string>): Promise<string | null> => {
  try {
    return await read();
  } catch {
    return null;
  }
};

const createClipboardWatch = ({ fingerprint, channel, pollMs, max, setTimer = startTimer, clearTimer = (timer) => clearInterval(timer as NodeJS.Timeout) }: ClipboardWatchDeps): ClipboardWatch => {
  const owners = watchOwners(max);
  const steps = serialSteps();
  let timer: unknown = null;
  let last = '';

  const stopWhenIdle = (): void => {
    if (!owners.empty() || timer === null) return;
    clearTimer(timer);
    timer = null;
  };

  const check = async (): Promise<void> => {
    const now = await readSafely(fingerprint);
    if (timer === null || now === null || now === last) return;
    last = now;
    owners.prune();
    owners.tell(channel);
  };

  const baseline = async (): Promise<void> => {
    last = (await readSafely(fingerprint)) ?? '';
  };

  const tick = (): void => {
    owners.prune();
    stopWhenIdle();
    if (timer === null || steps.busy()) return;
    steps.run(check);
  };

  const start = (): void => {
    if (timer !== null) return;
    timer = setTimer(tick, pollMs);
    steps.run(baseline);
  };

  return {
    add: (owner, id) => {
      owners.add(owner, id);
      start();
    },
    remove: (owner, id) => {
      owners.remove(owner, id);
      stopWhenIdle();
    },
    drop: (owner) => {
      owners.drop(owner);
      stopWhenIdle();
    },
    size: owners.size,
  };
};

export { createClipboardWatch };
