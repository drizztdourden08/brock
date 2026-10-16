/* @layer renderer-shell @kind logic */
import { IDLE_POLL_MS, LOADING_ATTRIBUTE } from './lazy.constants';

const pending = new Set<Promise<unknown>>();

const isIdle = (): boolean => pending.size === 0 && document.querySelector(`[${LOADING_ATTRIBUTE}]`) === null;

const track = <T>(load: Promise<T>): Promise<T> => {
  pending.add(load);
  const done = (): void => { pending.delete(load); };
  load.then(done, done);
  return load;
};

const idle = (timeoutMs: number): Promise<boolean> => {
  if (isIdle()) return Promise.resolve(true);
  const deadline = performance.now() + timeoutMs;
  return new Promise((resolve) => {
    const poll = setInterval(() => {
      if (!isIdle() && performance.now() < deadline) return;
      clearInterval(poll);
      resolve(isIdle());
    }, IDLE_POLL_MS);
  });
};

const lazyLoads = {
  track,
  idle,
  isIdle,
  pending: (): number => pending.size,
};

export { lazyLoads };
