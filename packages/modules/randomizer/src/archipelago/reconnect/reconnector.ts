/* @layer core @kind logic */
import { backoffDelay } from './backoff-delay';
import type { Reconnector, ScheduledListener } from './reconnector.type';

const createReconnector = (attempt: () => void, onScheduled?: ScheduledListener): Reconnector => {
  let tries = 0;
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const cancel = (): void => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };

  return {
    get pending() {
      return timer !== null;
    },
    schedule() {
      cancel();
      if (stopped) return;
      const delay = backoffDelay(tries);
      tries += 1;
      onScheduled?.(delay, tries);
      timer = setTimeout(() => {
        timer = null;
        attempt();
      }, delay);
    },
    cancel,
    stop() {
      stopped = true;
      cancel();
    },
    reset() {
      cancel();
      tries = 0;
      stopped = false;
    },
  };
};

export { createReconnector };
