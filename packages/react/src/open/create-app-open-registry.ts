/* @layer renderer-shell @kind logic */
import type { OpenRequest } from '@drizztdourden08/brock-core';
import type { AppOpenHandler, AppOpenRegistry, HoldRelease } from './app-open.type';

const nextTask: HoldRelease = (flush) => { setTimeout(flush, 0); };

const createAppOpenRegistry = (release: HoldRelease = nextTask): AppOpenRegistry => {
  const handlers = new Set<AppOpenHandler>();
  let held: OpenRequest[] = [];
  let releasing = false;

  const endHold = (): void => {
    held = [];
    releasing = false;
  };

  return {
    on: (handler) => {
      handlers.add(handler);
      for (const request of [...held]) handler(request);
      if (held.length > 0 && !releasing) {
        releasing = true;
        release(endHold);
      }
      return () => { handlers.delete(handler); };
    },
    dispatch: (request) => {
      if (handlers.size === 0) {
        held.push(request);
        return;
      }
      for (const handler of handlers) handler(request);
    },
  };
};

export { createAppOpenRegistry };
