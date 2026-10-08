/* @layer renderer-shell @kind logic */
import type { OpenRequest } from '@drizztdourden08/brock-core';
import type { AppOpenHandler, AppOpenRegistry } from './app-open.type';

const createAppOpenRegistry = (): AppOpenRegistry => {
  const handlers = new Set<AppOpenHandler>();
  const held: OpenRequest[] = [];
  return {
    on: (handler) => {
      handlers.add(handler);
      for (const request of held.splice(0)) handler(request);
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
