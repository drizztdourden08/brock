/* @layer electron-main @kind logic */
import type { OpenRequest } from '@drizztdourden08/brock-core/types';
import type { OpenHandler, OpenRouter } from './open.type';

const createOpenRouter = (onError: (err: unknown) => void = () => undefined): OpenRouter => {
  const handlers = new Set<OpenHandler>();
  const waiting: OpenRequest[] = [];
  const forRenderer: OpenRequest[] = [];
  let toRenderer: OpenHandler | null = null;
  let taken = false;

  const deliver = (request: OpenRequest): void => {
    for (const handler of handlers) {
      try {
        handler(request);
      } catch (err) {
        onError(err);
      }
    }
    if (taken && toRenderer) toRenderer(request);
    else forRenderer.push(request);
  };

  return {
    push: (requests) => {
      if (toRenderer) for (const request of requests) deliver(request);
      else waiting.push(...requests);
    },
    onOpen: (handler) => {
      handlers.add(handler);
      return () => { handlers.delete(handler); };
    },
    ready: (send) => {
      if (toRenderer) return;
      toRenderer = send;
      for (const request of waiting.splice(0)) deliver(request);
    },
    take: () => {
      taken = true;
      return forRenderer.splice(0);
    },
  };
};

export { createOpenRouter };
